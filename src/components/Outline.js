import { OUTLINE_DIM, OUTLINE_BORDER } from 'common/constants'

export const Outline = ({ isShown, position }) => {
  if (isShown && position) {
    const x = position[0]
    const y = position[1]

    return (
      <div className='outline'>
        <div
          style={{
            width: OUTLINE_DIM,
            height: OUTLINE_BORDER,
            top: y - OUTLINE_DIM / 2,
            left: x - OUTLINE_DIM / 2,
          }}
        />
        <div
          style={{
            width: OUTLINE_BORDER,
            height: OUTLINE_DIM,
            top: y - OUTLINE_DIM / 2,
            left: x + (OUTLINE_DIM / 2 - OUTLINE_BORDER),
          }}
        />
        <div
          style={{
            width: OUTLINE_DIM,
            height: OUTLINE_BORDER,
            top: y + (OUTLINE_DIM / 2 - OUTLINE_BORDER),
            left: x - OUTLINE_DIM / 2,
          }}
        />
        <div
          style={{
            width: OUTLINE_BORDER,
            height: OUTLINE_DIM,
            top: y - OUTLINE_DIM / 2,
            left: x - OUTLINE_DIM / 2,
          }}
        />
      </div>
    )
  }

  return null
}
