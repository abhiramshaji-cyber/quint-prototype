# Derby Experience Concierge — JWT Auth Prototype

## How It Works

**Browser → Bot data flow:**

1. `index.html` loads the Botpress webchat widget
2. On `webchat:initialized`, the page sends user `email` and a `jwtToken` to the bot via `window.botpress.updateUser()`
3. The bot receives this data in `event.state.user.data`
4. Bot decodes the JWT, validates expiration + email match, and stores `isAuthenticated` and `userEmail` in workflow variables
5. Bot branches conversation based on auth status

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page with webchat + sends email & JWT on init |
| `bot-code-example.js` | Botpress Execute Code Card — decodes & validates JWT |

## Botpress Studio Setup

1. Create workflow variables: `isAuthenticated` (boolean), `userEmail` (string), `userId` (string), `authError` (string)
2. Add an Execute Code Card at flow start with the code from `bot-code-example.js`
3. Branch on `workflow.isAuthenticated` to personalize the conversation
