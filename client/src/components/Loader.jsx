
const Loader = ({ 
  size = 'medium', 
  fullScreen = false, 
  text = '',
  className = '',
}) => {
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      <div
        className={`
          ${sizes[size]} 
          border-black 
          rounded-full 
          border-t-transparent 
          animate-spin
        `}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )
}

export default Loader