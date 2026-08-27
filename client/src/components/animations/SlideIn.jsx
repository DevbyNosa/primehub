// client/src/components/animations/SlideIn.jsx
import { useInView } from 'react-intersection-observer'

export default function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0,
  className = '',
  once = true
}) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const directions = {
    left: '-translate-x-10',
    right: 'translate-x-10',
    up: 'translate-y-10',
    down: '-translate-y-10'
  }

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directions[direction]}`}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}