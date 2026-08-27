// client/src/pages/ContactPage.jsx
import { useState, useEffect } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'
import FadeIn from '../components/animations/FadeIn'
import SlideIn from '../components/animations/SlideIn'


export default function ContactPage() {
  useEffect(() => {
     document.title = "Contact - PrimeHub"
   }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('idle');
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      
      const res = await fetch('/api/contact', {
         method: 'POST',
         body: JSON.stringify(formData)
       })
      setStatus('success');

      console.log(res)
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <>
     
      
    
        <HeaderComponent />
     

    <main>
      <FadeIn>
      <div className="w-[90%] mt-[5%] max-w-6xl mx-auto py-20">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-12">We'd love to hear from you. Drop us a message and we'll respond as soon as possible.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-black mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">123 Prime Street, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhone className="text-black mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">+234 800 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-black mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">hello@primehub.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaClock className="text-black mt-1" />
                  <div>
                    <p className="font-medium">Working Hours</p>
                    <p className="text-sm text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder='Enter Full name'
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder='Email Address'
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder='Subject title'
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                  placeholder='Leave a message here...'
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-sm mt-3"> Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-sm mt-3"> Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
      </FadeIn>
      </main>

   
        <Footer />
     
    </>
  )
}