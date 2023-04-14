
import '../../styles/auth.styles.css';
import { useState } from "react";
import { apiPost } from "../../services/apiService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMessage } from '../../store/slices/notificationMessagesSlice';
import { Spinner } from "../../components/spinner";

const ForgotPassword = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ""
  })
  const [postingData, setPostingData] = useState(false);



  const handleChange = (props) => (event) =>{

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const forgotPasswordRequest = () =>{
    setPostingData(true);
    apiPost({ url: "/auth/forgotPassword", data: formData })
      .then((res) => {
        setPostingData(false);
        dispatch(
          setMessage({
            severity: "success",
            message: res.message,
            key: Date.now(),
          })
        );
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
    //return console.log(formData);
    forgotPasswordRequest();
  }

  return (
    <>
      
      <div className="container-fluid" style={{ height: "100vh"}}>
        <div className="row h-100">
          <div className="col-12 col-lg px-3 px-md-3 d-flex flex-column">
            <section className="formContainer m-auto bg-white border rounded p-5">
              <header className="h3 fw-bold">Forgot Password </header>
              <p>Provide your registered email address  We will send an email to reset your Password</p>

              <form className="mt-5">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" value={formData.email} onChange={handleChange("email")} className="form-control shadow-none" id="email" placeholder="Enter your email address" />
                </div>

                <button className="btn btnPurple w-100 mt-5" onClick={handleSubmit}>{postingData ? <Spinner /> : "Submit"}</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword;