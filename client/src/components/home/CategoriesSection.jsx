import { Link } from "react-router-dom"
import SectionHeader from "./SectionHeader";

export default function CategoriesSection() {
const categoryData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
    title: "Electronics",
    path: "/categories/electronics",
    count: 42
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    title: "Fashion",
    path: "/categories/fashion",
    count: 35
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop",
    title: "Home & Living",
    path: "/categories/home",
    count: 28
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
    title: "Beauty",
    path: "/categories/beauty",
    count: 20
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=400&fit=crop",
    title: "Sports",
    path: "/categories/sports",
    count: 15
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop",
    title: "Books",
    path: "/categories/books",
    count: 30
  }
];


 
  return (
    <section className="w-[95%] mt-[100px] mx-auto">
      <SectionHeader title="Categories" link="/categories" linkText="View All" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols gap-4">
        {categoryData.map((category) => (
          <Link
            key={category.title}
            to={category.path}
            className="group relative overflow-hidden rounded-xl"
          >
            <img 
              src={category.imageUrl} 
              alt={category.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
        <div className="absolute inset-0 flex items-end justify-start p-6">
          <div className="text-gray-100">
            <h3 className="text-xl font-bold">{category.title}</h3>
            <p className="text-sm opacity-80">{category.count} products</p>
          </div>
         </div>
          </Link>
        ))}
      </div>
    </section>
  )
}