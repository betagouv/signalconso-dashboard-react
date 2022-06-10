import {useEffect, useState} from 'react'

export const useScroll = () => {
  const [scrollY, setScrollY] = useState(window.scrollY)

  const listener = () => {
    setScrollY(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [])

  return {scrollY}
}
