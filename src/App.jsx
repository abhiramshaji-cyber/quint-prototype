import { Webchat } from '@botpress/webchat'
import { useState } from 'react'
import './App.css'

function App() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }

  const webchatConfig = {
    botName: ' ',
    botAvatar: '/logo.png',
    botDescription: 'Your AI assistant for all things Kentucky Derby',
  }

  return (
    <div className="app">
      <div className="content">
        <img src="/logo.png" alt="Kentucky Derby" className="header-logo" />
        <h1>Kentucky Derby AI Assistant</h1>
        <p>Your intelligent companion for all things Kentucky Derby. Click the chat button to start a conversation.</p>

        <div className="instructions">
          <h2>Chat with Our AI Assistant</h2>
          <p>Get instant answers about the Kentucky Derby, race history, betting information, and more.</p>
          <ul>
            <li>Ask questions about race history and statistics</li>
            <li>Get information about horses and jockeys</li>
            <li>Learn about betting and wagering</li>
            <li>Explore Kentucky Derby traditions</li>
          </ul>
        </div>
      </div>

      {!isWebchatOpen && (
        <button className="chat-open-button" onClick={toggleWebchat} aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
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
