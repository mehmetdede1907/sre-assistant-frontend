import { useChat } from 'ai/react'

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
  })

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.slice(1).map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'Human: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask about the system errors and performance..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}