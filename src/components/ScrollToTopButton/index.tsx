import { useState } from 'react'
import { FaArrowCircleUp } from 'react-icons/fa'

export const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    if (scrolled > 1000) {
      setVisible(true)
    } else if (scrolled <= 600) {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  window.addEventListener('scroll', toggleVisible)

  return (
    <div className='relative'>
      <button className='fixed bottom-8 right-3 h-16 w-16 text-5xl cursor-pointer text-gray-900 hover:animate-bounce'>
        <FaArrowCircleUp
          onClick={scrollToTop}
          style={{ display: visible ? 'inline' : 'none' }}
        />
      </button>
    </div>
  )
}
