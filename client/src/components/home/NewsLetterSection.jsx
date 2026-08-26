
import { useState } from 'react'

export default function NewsletterSection() {
const [email, setEmail] = useState('')
const [status, setStatus] = useState('idle') 
const [message, setMessage] = useState('')

const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
        const res = await fetch('/api/subscribe/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })

        const data = await res.json()

        if (data.success) {
            setStatus('success')
            setMessage(data.message)
            setEmail('')
        } else {
            setStatus('error')
            setMessage(data.message || 'Something went wrong')
        }
    } catch (error) {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
    }

    setTimeout(() => {
        setStatus('idle')
        setMessage('')
    }, 4000)
}

return (
    <section className="w-[90%] mx-auto my-20 bg-black text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Stay in the Loop</h2>
            <p className="text-gray-400 mt-2">
                Subscribe for exclusive offers and updates
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition disabled:opacity-50"
                >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>

            {message && (
                <p className={`mt-3 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}

            <p className="text-gray-500 text-sm mt-4">
                No spam. Unsubscribe anytime.
            </p>
        </div>
    </section>
)
}