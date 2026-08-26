// client/src/components/home/FeaturedProducts.jsx
import SectionHeader from "./SectionHeader"
import ProductCard from "../ProductCard"



export default function FeaturedProducts() {
  const featuredProducts = [
  {
    id: 1,
    name: "Premium Leather Backpack",
    price: 45000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.8,
    numReviews: 42
  },
  {
    id: 2,
    name: "Wireless Noise-Canceling Headphones",
    price: 85000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.9,
    numReviews: 38
  },
  {
    id: 3,
    name: "Minimalist Smart Watch",
    price: 120000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.7,
    numReviews: 29
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 15000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.5,
    numReviews: 56
  },
  {
    id: 5,
    name: "Handcrafted Leather Wallet",
    price: 25000,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
    rating: 4.6,
    numReviews: 34
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    price: 65000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.4,
    numReviews: 47
  },
  {
    id: 7,
    name: "Slim Laptop Sleeve",
    price: 18000,
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=400&fit=crop",
    rating: 4.3,
    numReviews: 22
  },
  {
    id: 8,
    name: "Premium Coffee Maker",
    price: 95000,
    image: "https://images.unsplash.com/photo-1517668808822-9f02a4c0b8a8?w=400&h=400&fit=crop",
    rating: 4.8,
    numReviews: 31
  }
]
  return (
    <section className="w-[90%] mt-[100px] mx-auto">
      <SectionHeader title="Featured Products" link="/shop" linkText="View All" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}