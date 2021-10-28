import CircleLoader from 'react-spinners/CircleLoader'

export const Loader = ({ isLoading }) => (
  isLoading && (
    <CircleLoader
      color='white'
      size={80}
      css={{
        display: 'block',
        margin: 'auto',
        marginTop: '100px',
      }}
    />
  )
)
