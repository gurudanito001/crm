export const Spinner = ({spinnerSize = "md", spinnerColor = "secondary", size=1})=>{
  return <div className={`spinner-border text-${spinnerColor}`} style={{width: `${size}em`, height: `${size}em` }} role="status">
  <span className="visually-hidden">Loading...</span>
  </div>
}