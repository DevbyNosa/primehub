
import { useState } from 'react'
import { FaStar, FaTimes } from 'react-icons/fa'

export default function ReviewModal({ isOpen, onClose, orderId, productId, productName, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, productId, rating, comment })
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to submit review')
      setSubmitted(true)
      onSubmitted?.(productId)
      setTimeout(() => {
        setSubmitted(false)
        onClose()
        setRating(0)
        setComment('')
      }, 1200)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-2xl">
        {/* Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-medium mb-1">Write a Review</h2>
        <p className="text-sm text-gray-400 mb-4">{productName || 'Product'}</p>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-green-600 text-lg">✅ Review submitted!</p>
            <p className="text-sm text-gray-400 mt-1">Thank you for your feedback</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="text-3xl transition"
                >
                  <FaStar 
                    className={
                      star <= (hoverRating || rating) 
                        ? 'text-yellow-400' 
                        : 'text-gray-200'
                    }
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full h-28 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-black transition text-sm"
              required
            />

            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || !rating}
              className="w-full mt-4 bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}