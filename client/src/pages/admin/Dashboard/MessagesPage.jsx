import { useEffect, useState } from 'react'
import { FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages', { credentials: 'include' })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message)
        setMessages(data.messages)
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const openMessage = async (message) => {
    setSelectedMessage(message)
    if (message.is_read) return

    try {
      const response = await fetch(`/api/admin/messages/${message.id}/read`, {
        method: 'PATCH',
        credentials: 'include'
      })
      if (response.ok) {
        setMessages((current) => current.map((item) => (
          item.id === message.id ? { ...item, is_read: true } : item
        )))
        setSelectedMessage((current) => current ? { ...current, is_read: true } : current)
      }
    } catch (readError) {
      console.error('Unable to mark message as read:', readError)
    }
  }

  const formatDate = (date) => new Date(date).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaEnvelope className="text-gray-700" size={20} /> Messages
          </h1>
          <p className="text-gray-500 text-sm mt-1">Read and manage messages sent through the contact form.</p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-5">{error}</div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaEnvelope className="mx-auto text-gray-300" size={28} />
            <p className="font-medium text-gray-900 mt-3">No messages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,360px)_1fr] gap-5">
            <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {messages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => openMessage(message)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${selectedMessage?.id === message.id ? 'bg-gray-50 border-l-2 border-black' : ''}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className={`font-medium truncate ${message.is_read ? 'text-gray-700' : 'text-gray-950'}`}>{message.name}</span>
                    {!message.is_read && <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600" aria-label="Unread" />}
                  </span>
                  <span className="block text-sm text-gray-900 truncate mt-1">{message.subject}</span>
                  <span className="block text-xs text-gray-500 truncate mt-1">{message.message}</span>
                  <span className="block text-xs text-gray-400 mt-2">{formatDate(message.created_at)}</span>
                </button>
              ))}
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6 min-h-80">
              {selectedMessage ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-5"
                  >
                    <FaArrowLeft size={12} /> Back to messages
                  </button>
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                      <p className="text-sm text-gray-500 mt-2">From {selectedMessage.name} · {selectedMessage.email}</p>
                    </div>
                    {selectedMessage.is_read && <FaCheck className="text-green-600 mt-1" title="Read" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-4">{formatDate(selectedMessage.created_at)}</p>
                  <p className="text-gray-700 leading-7 whitespace-pre-wrap mt-6">{selectedMessage.message}</p>
                </>
              ) : (
                <div className="h-full min-h-64 flex items-center justify-center text-center text-gray-500">
                  <p>Select a message to read it.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}