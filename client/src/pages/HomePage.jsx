import HeaderComponent from "../components/Header"
import Hero from "../components/home/HeroSection"
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeatureProducts";
import NewsletterSection from "../components/home/NewsLetterSection";
import Footer from "../components/Footer.jsx";

 export default function HomePage() {
  return (
    <>
      <HeaderComponent />
    <main>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <NewsletterSection />
    </main>
    <footer>
      <Footer />
    </footer>
      
    </>
  )
 }