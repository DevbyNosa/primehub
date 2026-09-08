import { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

const getProductImage = (product) => (
  product.image ||
  product.image_url ||
  product.images?.[0] ||
  '/placeholder.jpg'
)

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

 
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const refreshCartStock = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()

        if (!response.ok || !data.success || !Array.isArray(data.products)) return

        const availableProducts = new Map(data.products.map((product) => [product.id, product]))

        setCart((currentCart) => currentCart.filter((item) => {
          const product = availableProducts.get(item.id)
          return product && Number(product.stock_quantity) > 0
        }))
      } catch (error) {
        console.error('Error refreshing cart stock:', error)
      }
    }

    refreshCartStock()
    window.addEventListener('focus', refreshCartStock)

    return () => window.removeEventListener('focus', refreshCartStock)
  }, [])

  const addToCart = (product) => {
    const hasStockLimit = product.stock_quantity !== undefined && product.stock_quantity !== null
    const requestedQuantity = Math.max(1, Number(product.quantity) || 1)

    if (hasStockLimit && Number(product.stock_quantity) <= 0) {
      return false
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        const nextQuantity = existing.quantity + requestedQuantity
        if (hasStockLimit && existing.quantity >= Number(product.stock_quantity)) {
          return prev
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: hasStockLimit
              ? Math.min(nextQuantity, Number(product.stock_quantity))
              : nextQuantity }
            : item
        )
      }
      return [...prev, {
        ...product,
        image: getProductImage(product),
        quantity: hasStockLimit
          ? Math.min(requestedQuantity, Number(product.stock_quantity))
          : requestedQuantity
      }]
    })
    return true
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}