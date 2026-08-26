
import { Link } from 'react-router-dom'

const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false,
  size = 'medium',
  fullWidth = false,
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  // Size styles
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }
  
  // Variant styles
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    secondary: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black',
    outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
  
  // Combine classes
  const buttonClasses = `
    ${baseStyles}
    ${sizes[size]}
    ${variants[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `

  // If 'to' prop exists, render as Link
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  )
}

export default Button