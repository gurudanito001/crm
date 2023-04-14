import '../../styles/auth.styles.css';
import { useState } from "react";
import { apiPost } from "../../services/apiService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import PasswordInput from "../../components/passwordInput";
import { setMessage } from '../../store/slices/notificationMessagesSlice';
import { Spinner } from "../../components/spinner";



const ResetPassword = () =>{
  const { search } = useLocation();
  const dispatch = useDispatch();
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
        dispatch(
          setMessage({
            severity: "success",
            message: res.message,
            key: Date.now(),
          })
        );
        navigate("/login");
      })
      .catch((error) => {
        setPostingData(false);
        dispatch(
          setMessage({
            severity: "error",
            message: error.message,
            key: Date.now(),
          })
        );
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
                <button className="btn btnPurple w-100 mt-5" disabled={postingData} onClick={handleSubmit}>{postingData ? <Spinner /> : "Reset Password"}</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword;