import { createContext, useState, useContext, useEffect } from 'react';


const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Fetch wishlist from backend
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      
      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //  Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  //  Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await fetchWishlist(); // Refresh list
        return { success: true, message: 'Added to wishlist ' };
      } else {
        return { success: false, message: data.message || 'Failed to add' };
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return { success: false, message: 'Something went wrong' };
    }
  };

  //  Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await fetchWishlist(); // Refresh list
        return { success: true, message: 'Removed from wishlist' };
      } else {
        return { success: false, message: data.message || 'Failed to remove' };
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return { success: false, message: 'Something went wrong' };
    }
  };

  //  Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(item => item.id === productId);
  };

  //  Get wishlist count
  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      error,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};


export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};