import CircleLoader from 'react-spinners/CircleLoader'

export const Loader = ({ isLoading, size = 80, css }) => {
  if (isLoading) {
    return (
      <CircleLoader
        color='white'
        size={size}
        css={{
          display: 'block',
          margin: 'auto',
          marginTop: '100px',
          ...css,
        }}
      />
    )
  }

  return null
}
