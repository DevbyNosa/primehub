// client/src/components/home/FeaturedProducts.jsx
import SectionHeader from "./SectionHeader"
import ProductCard from "../ProductCard"
import { useState, useEffect } from "react"



export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

 useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="w-[90%] mt-[100px] mx-auto">
      <SectionHeader title="Featured Products" link="/shop" linkText="View All" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {featuredProducts.length === 0 && (
        <div className="text-center mt-8 text-gray-500">No featured products available.</div>
      )}
    </section>
  )
}