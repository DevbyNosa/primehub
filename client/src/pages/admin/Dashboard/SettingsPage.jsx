import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaArrowLeft, 
  FaSave, 
  FaStore, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  
  const [storeStatus, setStoreStatus] = useState({ type: '', message: '' })
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' })
  
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    storeCurrency: 'NGN',
    storeTimezone: 'Africa/Lagos',
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlert: 5,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSettings({ ...settings, ...data.settings })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  //  Store Settings Submit
  const handleStoreSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStoreStatus({ type: '', message: '' })

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: settings.name,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          storeCurrency: settings.storeCurrency,
          storeTimezone: settings.storeTimezone,
          emailNotifications: settings.emailNotifications,
          orderNotifications: settings.orderNotifications,
          lowStockAlert: settings.lowStockAlert
        }),
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setStoreStatus({ type: 'success', message: 'Store settings updated successfully! ' })
        setTimeout(() => setStoreStatus({ type: '', message: '' }), 3000)
      } else {
        setStoreStatus({ type: 'error', message: data.message || 'Failed to update store settings' })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setStoreStatus({ type: 'error', message: 'Failed to update store settings' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)
  setPasswordStatus({ type: '', message: '' })

  if (settings.newPassword !== settings.confirmPassword) {
    setPasswordStatus({ type: 'error', message: 'Passwords do not match' })
    setSaving(false)
    setTimeout(() => setPasswordStatus({ type: '', message: '' }), 3000)
    return
  }

  if (settings.newPassword.length < 6) {
    setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters' })
    setSaving(false)
    setTimeout(() => setPasswordStatus({ type: '', message: '' }), 3000)
    return
  }

  try {
    const res = await fetch('/api/admin/settings/password', {
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: settings.currentPassword,
        newPassword: settings.newPassword,
        confirmPassword: settings.confirmPassword
      }),
      credentials: 'include'
    })
    const data = await res.json()
    if (data.success) {
      setPasswordStatus({ type: 'success', message: data.message || 'Password changed successfully!' })
      setSettings({
        ...settings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setPasswordStatus({ type: '', message: '' }), 4000)
    } else {
      setPasswordStatus({ type: 'error', message: data.message || 'Failed to change password' })
    }
  } catch (error) {
    console.error('Error changing password:', error)
    setPasswordStatus({ type: 'error', message: 'Failed to change password' })
  } finally {
    setSaving(false)
  }
}

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="text-gray-500 hover:text-black transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your store settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Settings Form */}
          <form onSubmit={handleStoreSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaStore size={18} /> Store Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <div className="relative">
                  <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"

                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    name="storeCurrency"
                    value={settings.storeCurrency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  >
                    <option value="NGN">₦ NGN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    name="storeTimezone"
                    value={settings.storeTimezone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                  >
                    <option value="Africa/Lagos">Africa/Lagos</option>
                  </select>
                </div>
              </div>
            </div>

            {storeStatus.message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                storeStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {storeStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>

          {/* Password Change Form */}
          <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaLock size={18} /> Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={settings.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={settings.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={settings.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                    required
                  />
                </div>
              </div>

              {passwordStatus.message && (
                <div className={`p-3 rounded-lg text-sm ${
                  passwordStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {passwordStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
            <h2 className="font-bold text-gray-900 mb-4">Notification Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="orderNotifications"
                  checked={settings.orderNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 accent-black"
                />
                <span className="text-sm font-medium text-gray-700">Order Notifications</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Low Stock Alert:
                </label>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={settings.lowStockAlert}
                  onChange={handleChange}
                  className="w-20 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}