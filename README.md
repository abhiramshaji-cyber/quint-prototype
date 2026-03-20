# Derby Experience Concierge — JWT Auth Prototype

## How It Works

1. `index.html` loads the Botpress webchat widget
2. On `webchat:initialized`, the page sends `email`, `jwtToken`, and `websiteUrl` to the bot via `window.botpress.updateUser()`
3. The bot receives this data at `event.state.user.data`
4. Bot decodes the JWT, validates expiration + email match, stores `isAuthenticated` and `userEmail` in workflow variables, and saves the originating site URL to `conversation.originatingSite`
5. Bot branches conversation based on auth status

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page — sends email, JWT & website URL to the bot on webchat init |
| `bot-code-example.js` | Full bot-side logic — JWT decode, validation, workflow & conversation variable storage |

## Botpress Side

Abhiram will set up the Botpress Studio flow (Execute Code Card, workflow variables, branching). The `bot-code-example.js` file has the full reference logic and production notes.

The data arrives at:

```js
const userData = event.state.user.data
// { email: '...', jwtToken: '...', websiteUrl: '...' }
```
