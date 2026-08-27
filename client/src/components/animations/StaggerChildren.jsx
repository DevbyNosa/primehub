// client/src/components/animations/StaggerChildren.jsx
import { useInView } from 'react-intersection-observer'
import { Children, cloneElement } from 'react'

export default function StaggerChildren({ 
  children, 
  className = '',
  staggerDelay = 100,
  once = true
}) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        cloneElement(child, {
          className: `
            transition-all duration-500 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            ${child.props.className || ''}
          `,
          style: { 
            transitionDelay: `${index * staggerDelay}ms`,
            ...child.props.style 
          }
        })
      ))}
    </div>
  )
}