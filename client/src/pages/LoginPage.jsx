import LoginAuthForm from "../auth/LoginForm";
import { useEffect } from "react";
import Footer from "../components/Footer";
import FadeIn from "../components/animations/FadeIn";

export default function LoginPage() {
 useEffect(() => {
   document.title = "Login - PrimeHub"
 }, [])
  return (
    <>
    <FadeIn>
    <LoginAuthForm />
    </FadeIn>
    <Footer />
   </>
  )

}