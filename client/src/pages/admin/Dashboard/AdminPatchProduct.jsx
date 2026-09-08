import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'

export default function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    stock_quantity: '',
    category_id: '',
    images: [],
    is_active: true,
    is_featured: false
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])

  // Fetch categories and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch('/api/admin/categories', { credentials: 'include' })
        const catData = await catRes.json()
        if (catData.success) {
          setCategories(catData.categories || [])
        }

        // Fetch product by ID
        const prodRes = await fetch(`/api/admin/products/${id}`, {
          credentials: 'include'
        })
        const prodData = await prodRes.json()
        

        if (prodData.success) {
          const product = prodData.product
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            compare_price: product.compare_price || '',
            stock_quantity: product.stock_quantity || '',
            category_id: product.category_id || '',
            images: product.images || [],
            is_active: product.is_active ?? true,
            is_featured: product.is_featured ?? false
          })
          setExistingImages(product.images || [])
        } else {
          console.error('Failed to fetch product:', prodData.message)
          alert('Failed to load product data')
          navigate('/admin/products')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error loading product data')
        navigate('/admin/products')
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
    setFormData({ ...formData, images: files })
  }

  const removeImage = (index) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    const newFiles = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newFiles })
  }

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('compare_price', formData.compare_price || '')
      formDataToSend.append('stock_quantity', formData.stock_quantity)
      formDataToSend.append('category_id', formData.category_id || '')
      formDataToSend.append('is_active', formData.is_active)
      formDataToSend.append('is_featured', formData.is_featured)

      // Send existing images as JSON
      formDataToSend.append('existing_images', JSON.stringify(existingImages))

      // Send new images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(file => {
          formDataToSend.append('images', file)
        })
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: formDataToSend,
        credentials: 'include'
      })

      const data = await res.json()
      if (data.success) {
        navigate('/admin/products')
      } else {
        alert(data.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/admin/products"
            className="text-gray-500 hover:text-black transition"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-500 text-sm mt-1">Update product details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-3xl">
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
              required
              placeholder="e.g. iPhone 15 Pro Max"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition resize-none"
              required
              placeholder="Enter product description..."
            />
          </div>

          {/* Price & Compare Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                required
                placeholder="e.g. 700000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare Price (₦)
              </label>
              <input
                type="number"
                name="compare_price"
                value={formData.compare_price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                placeholder="e.g. 800000"
              />
            </div>
          </div>

          {/* Stock & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                required
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add New Images
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-black transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FaUpload className="text-gray-400 text-2xl" />
                <span className="text-sm text-gray-500">
                  Click to upload new images (max 5)
                </span>
              </label>
            </div>
          </div>

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
            <Link
              to="/admin/products"
              className="px-8 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}