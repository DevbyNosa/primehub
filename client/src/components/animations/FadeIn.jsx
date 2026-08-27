// client/src/components/animations/FadeIn.jsx
import { useInView } from 'react-intersection-observer'

export default function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '',
  once = true,
  threshold = 0.1
}) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: threshold,
  })

  const directions = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
    none: 'translate-y-0'
  }

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${inView ? 'opacity-100 translate-y-0' : `opacity-0 ${directions[direction]}`}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}