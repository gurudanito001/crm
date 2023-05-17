export const Spinner = ({spinnerSize = "sm", spinnerColor = "secondary", size=1})=>{
  return (
    <div className={`spinner-border text-${spinnerColor} spinner-border-${spinnerSize}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}