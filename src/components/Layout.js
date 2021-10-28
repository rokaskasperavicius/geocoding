import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Components
import { Footer } from 'components/Footer'

export const Layout = ({ children }) => {
  const [inverted, setInverted] = useState(false)
  const location = useLocation()

  // Reset page inversion on route change
  useEffect(() => {
    setInverted(false)
  }, [location])

  return (
    <div className={`content${inverted ? ' content--inverted' : ''}`}>
      {React.cloneElement(children, { setInverted })}
      <Footer />
    </div>
  )
}
