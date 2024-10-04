import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import styles from '../styles/SREChatbot.module.css';

const models = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-4-1106-preview', name: 'GPT-4 Turbo' },
];

export default function SREChatbot({ analysisContext }) {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [contextMessage, setContextMessage] = useState(null);

  useEffect(() => {
    setContextMessage({
      id: 'context',
      role: 'system',
      content: `You are an SRE assistant. Use the following context to answer questions about the system's errors and performance: ${analysisContext}`
    });
  }, [analysisContext]);

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: contextMessage ? [contextMessage] : [],
    body: {
      model: selectedModel,
      analysisContext: analysisContext,
    },
  });

  useEffect(() => {
    if (contextMessage && messages.length === 0) {
      setMessages([contextMessage]);
    }
  }, [contextMessage, messages, setMessages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.modelSelection}>
        <label htmlFor="model-select">Select Model: </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className={styles.modelSelect}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

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