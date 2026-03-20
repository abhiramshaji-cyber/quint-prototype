try {
  console.log('[JWT DEBUG] Incoming event:', JSON.stringify(event, null, 2))
  console.log('[JWT DEBUG] workflow.userData:', JSON.stringify(workflow.userData, null, 2))

  const jwt = workflow.userData?.userData?.jwt

  console.log('[JWT DEBUG] Extracted JWT:', jwt)

  if (!jwt) {
    console.log('[JWT DEBUG] No JWT found -> failing early')
    workflow.verified = false
    workflow.userEmail = ''
    return
  }

  const parts = jwt.split('.')
  console.log('[JWT DEBUG] JWT parts:', parts)

  if (parts.length !== 3) {
    console.log('[JWT DEBUG] Invalid JWT format (expected 3 parts)')
    workflow.verified = false
    workflow.userEmail = ''
    return
  }

  const [headerB64, payloadB64, signatureB64] = parts
  console.log('[JWT DEBUG] headerB64:', headerB64)
  console.log('[JWT DEBUG] payloadB64:', payloadB64)
  console.log('[JWT DEBUG] signatureB64:', signatureB64)

  const secret = env.BOTPRESS_JWT_SECRET
  console.log('[JWT DEBUG] Secret exists:', !!secret)
  console.log('[JWT DEBUG] Secret length:', secret?.length)

  if (!secret) {
    console.log('[JWT DEBUG] Missing BOTPRESS_JWT_SECRET')
    workflow.verified = false
    workflow.userEmail = ''
    return
  }

  const encoder = new TextEncoder()

  const base64UrlToUint8Array = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  const uint8ArrayToBase64Url = (bytes) => {
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  const signingInput = `${headerB64}.${payloadB64}`
  console.log('[JWT DEBUG] Signing input:', signingInput)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  console.log('[JWT DEBUG] Crypto key imported')

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(signingInput)
  )

  const expectedSig = uint8ArrayToBase64Url(
    new Uint8Array(signatureBuffer)
  )
  console.log('[JWT DEBUG] Expected signature:', expectedSig)

  const signaturesMatch = expectedSig === signatureB64
  console.log('[JWT DEBUG] Signatures match:', signaturesMatch)

  if (!signaturesMatch) {
    console.log('[JWT DEBUG] Signature verification failed')
    workflow.verified = false
    workflow.userEmail = ''
    return
  }

  const payloadJson = new TextDecoder().decode(
    base64UrlToUint8Array(payloadB64)
  )
  console.log('[JWT DEBUG] Decoded payload JSON:', payloadJson)

  const payload = JSON.parse(payloadJson)
  console.log('[JWT DEBUG] Parsed payload:', JSON.stringify(payload, null, 2))

  const now = Math.floor(Date.now() / 1000)
  console.log('[JWT DEBUG] Current timestamp:', now)
  console.log('[JWT DEBUG] Payload exp:', payload.exp)

  if (payload.exp && payload.exp < now) {
    console.log('[JWT DEBUG] Token expired')
    workflow.verified = false
    workflow.userEmail = ''
    return
  }

  workflow.verified = true
  workflow.userEmail = payload.email || ''

  const websiteUrl = workflow.userData?.userData?.websiteUrl
  if (websiteUrl) {
    conversation.originatingSite = websiteUrl
    console.log('[JWT DEBUG] originatingSite set to:', websiteUrl)
  }

  console.log('[JWT DEBUG] Token valid')
  console.log('[JWT DEBUG] userEmail set to:', workflow.userEmail)

} catch (err) {
  console.log('[JWT DEBUG] Caught error:', err?.message || err)
  console.log(
    '[JWT DEBUG] Full error object:',
    JSON.stringify(err, Object.getOwnPropertyNames(err || {}), 2)
  )
  workflow.verified = false
  workflow.userEmail = ''
}
