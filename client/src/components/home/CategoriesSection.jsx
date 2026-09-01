
import { Link } from "react-router-dom"
import SectionHeader from "./SectionHeader";
import { useState, useEffect } from "react";

export default function CategoriesSection() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategoryData(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="w-[95%] mt-[100px] mx-auto">
      <SectionHeader title="Categories" link="/categories" linkText="View All" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryData.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}  
            className="group relative overflow-hidden rounded-xl"
          >
            <img 
              src={category.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop'} 
              alt={category.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-end justify-start p-6">
              <div className="text-gray-100">
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}