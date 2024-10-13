export const SizedBox = props => {
  const { height, width } = props

  return (
    <div
      style={{
        height: height > 0 ? height * 2 : 0,
        width: width > 0 ? width * 2 : 0,
        display: width > 0 ? 'inline-block' : 'block',
      }}
    ></div>
  )
}
