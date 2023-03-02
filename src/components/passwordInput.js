import { useState } from "react";


type proptypes = {
  value: string | null
}

const PasswordInput = () =>{
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mb-3">
      <label htmlFor="password" className="form-label">Password</label>
      <div className="input-group">
        <input type={showPassword ? "text" : "password"} value="password1234" className="form-control shadow-none border-end-0" id="password" placeholder="Set an 8-character password" />
        <span className="input-group-text bg-white border-start-0" id="basic-addon1"><i  onClick={()=>setShowPassword(prevState => !prevState)} className={`bi fs-4 ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i></span>
      </div>
    </div>
  )
}

export default PasswordInput;