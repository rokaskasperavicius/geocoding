import { Link } from 'react-router-dom'

export const Footer = () => (
  <footer className='footer'>
    <div>
      &copy; 2021 Geocoding. All Rights Reserved.
    </div>
    <div className='credits'>
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
        </a>
      </div>
      <div className='credits__atributions'>
        <Link to='/attributions'>Attributions</Link>
      </div>
    </div>
  </footer>
)
