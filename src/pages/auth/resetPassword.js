import VisibilityOff from "../../images/visibility-off.svg";
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";
import { apiPost } from "../../services/apiService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import PasswordInput from "../../components/passwordInput";



const ResetPassword = () =>{
  const { search } = useLocation();
  const values = queryString.parse(search);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [postingData, setPostingData] = useState(false)


  const handleChange = (props) => (event) =>{

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const resetPasswordRequest = () =>{
    setPostingData(true);
    apiPost({ url: "/auth/resetPassword", data: {password: formData.password, token: values.token} })
      .then((res) => {
        setPostingData(false);
        alert(res.message);
        navigate("/login");
        console.log(res);
      })
      .catch((error) => {
        setPostingData(false);
        console.log(error);
      });
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    //return console.log(formData, values);
    resetPasswordRequest();
  }


  return (
    <>
      
      <div className="container-fluid" style={{height: "100vh"}}>
        <div className="row h-100">
          <div className="col-12 col-lg px-3 px-md-3 d-flex flex-column">
            <section className="formContainer m-auto bg-white border rounded p-5">
              <header className="h3 fw-bold">Reset Password</header>
              <p>Enter new password below</p>

              <form className="mt-5">
                <PasswordInput label="New Password" id="newPassword" onChange={handleChange("password")} value={formData.password} />
                <PasswordInput label="Confirm Password" id="confirmPassword" onChange={handleChange("confirmPassword")} value={formData.confirmPassword} />
                {/* <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="input-group">
                    <input type="password" value={formData.password} onChange={handleChange("password")} className="form-control shadow-none border-end-0" id="newPassword" placeholder="Set an 8-character password" />
                    <span className="input-group-text bg-white border-start-0" id="basic-addon1"><img width="20px" src={VisibilityOff} alt="Visibility Toggle Icon" /></span>
                  </div>
                </div> */}

                {/* <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input type="password" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} className="form-control shadow-none border-end-0" id="confirmPassword" placeholder="Set an 8-character password" />
                    <span className="input-group-text bg-white border-start-0" id="basic-addon1"><img width="20px" src={VisibilityOff} alt="Visibility Toggle Icon"/></span>
                  </div>
                </div> */}

                <button className="btn btnPurple w-100 mt-5" disabled={postingData} onClick={handleSubmit}>Reset Password</button>
              </form>
            </section>
          </div>
        </div>
      </div>

      {showNotification && <NotificationModal img={EmojiLady2} open={showNotification} onClose={() => setShowNotification(false)} />}
    </>
  )
}

export default ResetPassword;