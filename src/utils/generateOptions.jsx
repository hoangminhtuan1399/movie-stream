export const generateOptions = (options) => {
  return options.map(({label, value}) => {
    return (
      <option key={`${label}-${value}`} value={value}>{label}</option>
    )
  })
}
