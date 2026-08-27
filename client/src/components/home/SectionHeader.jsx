import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"
export default function SectionHeader({title, link, linkText}) {
  return(
     <div className="flex items-center justify-between  my-15">
        <h3 className="text-3xl font-semibold text-black ">{title}</h3>
        
        <Link 
        
         className="text-black hover:!text-gray-500 hover:!underline hover:underline-offset-4 transition-all duration-200 flex items-center gap-2 group"
          to={link}
        >
          {linkText}
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
  )
}