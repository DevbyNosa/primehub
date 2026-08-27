import RegisterAuthForm from "../auth/RegisterForm";
import { useEffect } from "react";
import Footer from "../components/Footer";
import FadeIn from "../components/animations/FadeIn";

export default function RegisterPage() {
 useEffect(() => {
   document.title = "Register - PrimeHub"
 }, [])
  return (
    <>
    <FadeIn>
    <RegisterAuthForm />
    </FadeIn>
    <Footer />
   </>
  )

}