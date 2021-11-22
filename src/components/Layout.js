// Components
import { Footer } from 'components/Footer'

export const Layout = ({ children }) => {
  return (
    <div className='content'>
      {children}
      <Footer />
    </div>
  )
}
