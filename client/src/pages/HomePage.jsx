// client/src/pages/HomePage.jsx
import HeaderComponent from "../components/Header"
import Hero from "../components/home/HeroSection"
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeatureProducts";
import NewsletterSection from "../components/home/NewsLetterSection";
import Footer from "../components/Footer.jsx";
import FadeIn from "../components/animations/FadeIn";
import SlideIn from "../components/animations/SlideIn";
import StaggerChildren from "../components/animations/StaggerChildren";

export default function HomePage() {
  return (
    <>
      <HeaderComponent />
      <main>
        
        <FadeIn>
          <Hero />
        </FadeIn>

        
        <SlideIn direction="left">
          <CategoriesSection />
        </SlideIn>

        
         <FadeIn delay={200}>
          <FeaturedProducts />
        </FadeIn>

       
        <FadeIn delay={300}>
          <NewsletterSection />
        </FadeIn>
      </main>
     
        <Footer />
     
    </>
  )
}