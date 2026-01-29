import { Webchat } from '@botpress/webchat'
import { useState } from 'react'
import './App.css'

function App() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }

  const handleResetConversation = () => {
    // Clear Botpress data from localStorage
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('botpress') || key.includes('bp-') || key.includes('webchat'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // Reload the page to restart conversation
    window.location.reload()
  }

  const webchatConfig = {
    botName: ' ',
    botAvatar: '/logo.png',
    botDescription: 'Your AI assistant for all things Kentucky Derby',
  }

  return (
    <div className="app">
      <div className="content">
        <h1>Kentucky Derby AI Assistant Prototype</h1>
        <p>Click the icon in the bottom right corner to start testing</p>
        <button className="reset-button" onClick={handleResetConversation}>
          Start New Conversation
        </button>
      </div>

      {!isWebchatOpen && (
        <button className="chat-open-button" onClick={toggleWebchat} aria-label="Open chat">
          <img src="/logo.png" alt="Chat" />
        </button>
      )}

      <div className={`webchat-sidebar ${isWebchatOpen ? 'open' : ''}`}>
        {isWebchatOpen && (
          <button className="chat-close-button" onClick={toggleWebchat} aria-label="Close chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <Webchat
          clientId="2c39ac3c-2e52-4d11-aca6-71e0139a658c"
          configuration={webchatConfig}
        />
      </div>
    </div>
  )
}

export default App
