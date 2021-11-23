// Components
import { Attributions } from 'components'

export const Footer = () => (
  <footer className='footer'>
    <div className='footer__main'>
      <Attributions />
      <div>
        <div>
          Created by{' '}
          <a
            title='Rokas Kasperavicius'
            target='_blank'
            rel='noreferrer'
            href='https://www.linkedin.com/in/rokas-kasperavi%C4%8Dius-a70458158'
          >
            Rokas Kasperavicius
          </a>
          {' '}and{' '}
          <a
            title='Rasmus G. Jensen'
            target='_blank'
            rel='noreferrer'
            href='https://www.linkedin.com/in/rasgjen/'
          >
            Rasmus G. Jensen
          </a>.
        </div>
      </div>
    </div>
    <div className='footer__copyright'>
      &copy; {new Date().getFullYear()} Geocoding. All Rights Reserved.
    </div>
  </footer>
)
