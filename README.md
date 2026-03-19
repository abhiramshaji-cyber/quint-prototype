# Derby Experience Concierge — JWT Auth Prototype

## How It Works

1. `index.html` loads the Botpress webchat widget
2. On `webchat:initialized`, the page sends `email` and `jwtToken` to the bot via `window.botpress.updateUser()`
3. The bot receives this data at `event.state.user.data`
4. Bot decodes the JWT, validates expiration + email match, and stores `isAuthenticated` and `userEmail` in workflow variables
5. Bot branches conversation based on auth status

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page — sends email & JWT to the bot on webchat init |
| `bot-code-example.js` | Full bot-side logic — JWT decode, validation, workflow storage |

## Botpress Side

Abhiram will set up the Botpress Studio flow (Execute Code Card, workflow variables, branching). The `bot-code-example.js` file has the full reference logic and production notes.

The data arrives at:

```js
const userData = event.state.user.data
// { email: '...', jwtToken: '...' }
```
