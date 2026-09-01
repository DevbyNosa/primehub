
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaSave, FaArrowLeft } from 'react-icons/fa'
import SideBar from '../../components/Dashboard/SideBar'
export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/customer/profile', {
          credentials: 'include'
        })
        const data = await res.json()
        if (data.success) {
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone_number || ''
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setStatus('')

    try {
      const res = await fetch('http://localhost:3000/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone
        }),
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage('Profile updated successfully! ✅')
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to update profile')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => {
        setMessage('')
        setStatus('')
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-black mx-auto"></div>
            <p className="text-gray-500 mt-3 text-sm">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideBar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Settings</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your account settings</p>
          </div>
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <FaArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              <FaSave size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {message && (
              <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </form>

          {/* Danger Zone */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-red-600 mb-3">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-500">Permanently delete your account and all data</p>
              </div>
              <button className="sm:ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}