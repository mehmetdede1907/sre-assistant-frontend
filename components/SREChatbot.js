import { useChat } from 'ai/react';  // Chat handling from 'ai/react'
import styles from '../styles/SREChatbot.module.css';  // Chatbot-specific styles

export default function SREChatbot({ analysisContext }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'context',
        role: 'system',
        content: `You are an SRE assistant. Use the following context to answer questions about the system's errors and performance: ${analysisContext}`
      }
    ]
  });

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {messages.slice(1).map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.role === 'user' ? styles.messageUser : styles.messageBot}`}
          >
            <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.chatInputContainer}>
        <input
          className={styles.chatInputBox}
          value={input}
          placeholder="Ask about system errors or performance..."
          onChange={handleInputChange}
        />
        <button className={styles.chatSendButton} type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
