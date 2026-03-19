// ============================================================
// Botpress Bot Code — JWT Authentication Example
// ============================================================
// Place this code in a Botpress Execute Code Card at the
// START of your bot flow (e.g. right after the trigger node).
//
// It reads the JWT token + email sent from the webchat,
// verifies the token, and stores the authenticated user info
// in workflow variables for use throughout the conversation.
// ============================================================

// ------ Step 1: Read user data sent from webchat ------

const getUserData = async () => {
  const userData = event.state.user.data
  // userData contains: { email, jwtToken }

  if (!userData || !userData.jwtToken) {
    workflow.isAuthenticated = false
    workflow.authError = 'No JWT token provided'
    return
  }

  const jwtToken = userData.jwtToken
  const email = userData.email

  // ------ Step 2: Decode and verify the JWT ------
  // In Botpress Execute Code Cards, you can use the built-in
  // `axios` for HTTP calls. For a real prototype, we decode
  // the JWT payload (base64) and verify claims.

  try {
    // Decode JWT payload (middle segment)
    const parts = jwtToken.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Base64url decode the payload
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    )

    // ------ Step 3: Validate claims ------

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      throw new Error('JWT token has expired')
    }

    // Check that email in JWT matches email from webchat
    if (payload.email && payload.email !== email) {
      throw new Error('Email mismatch between JWT and user data')
    }

    // ------ Step 4: Store authenticated user info ------

    workflow.isAuthenticated = true
    workflow.userEmail = payload.email || email
    workflow.userId = payload.sub
    workflow.authError = ''

    console.log(`Authenticated user: ${workflow.userEmail}`)

  } catch (err) {
    workflow.isAuthenticated = false
    workflow.authError = err.message
    console.error('JWT verification failed:', err.message)
  }
}

await getUserData()


// ============================================================
// PRODUCTION NOTES:
// ============================================================
//
// 1. SERVER-SIDE VERIFICATION (Recommended for production)
//    Instead of decoding the JWT client-side in the bot, call
//    your backend API to verify the token signature:
//
//    const response = await axios.post('https://your-api.com/verify-token', {
//      token: jwtToken
//    })
//    const { valid, user } = response.data
//
// 2. WORKFLOW VARIABLES TO CREATE IN BOTPRESS STUDIO:
//    - isAuthenticated  (boolean)
//    - userEmail        (string)
//    - userId           (string)
//    - authError        (string)
//
// 3. USING IN CONVERSATION:
//    After this code runs, use Expression Cards to branch:
//
//    IF workflow.isAuthenticated === true
//      → "Welcome back, {{workflow.userEmail}}!"
//    ELSE
//      → "Please log in to continue."
//
// 4. JWT STRUCTURE (the simulated token decodes to):
//    {
//      "sub": "user_123",
//      "email": "guest@derby.com",
//      "name": "Jane Doe",
//      "iat": 1700000000,
//      "exp": 1800000000
//    }
// ============================================================
