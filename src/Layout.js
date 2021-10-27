import React, { useState } from 'react'

import { Footer } from './Footer'

export const Layout = ({ children }) => {
  const [inverted, setInverted] = useState(true)

  return (
    <main className={`main${inverted ? ' main--inverted' : ''}`}>
      {React.cloneElement(children, { setInverted })}
      <Footer />
    </main>
  )
}
