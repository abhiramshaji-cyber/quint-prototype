# Derby Experience Concierge — JWT Auth Prototype

## How It Works

1. `index.html` loads the Botpress webchat widget
2. On `webchat:initialized`, the page sends `jwtToken` and `websiteUrl` to the bot via `window.botpress.updateUser()`
3. The bot's Execute Code Card reads the JWT from `event.payload.userData.jwt`, verifies the HMAC-SHA256 signature against `BOTPRESS_JWT_SECRET`, and checks expiration
4. On success, sets `workflow.verified = true` and `workflow.userEmail` from the JWT payload
5. Stores the originating site URL in `conversation.originatingSite`

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page — sends JWT & website URL to the bot on webchat init |
| `bot-code-example.js` | Botpress Execute Code Card logic — JWT signature verification, workflow & conversation variable storage |

## Botpress Studio Setup

### Workflow Variables
- `verified` (boolean)
- `userEmail` (string)

### Conversation Variables
- `originatingSite` (string)

### Execute Code Card
The code in `bot-code-example.js` goes into an Execute Code Card at the start of your bot flow. It uses the Web Crypto API (`crypto.subtle`) to verify the JWT signature server-side.

### Environment Variable
- `BOTPRESS_JWT_SECRET` — the shared secret used to sign and verify JWTs
