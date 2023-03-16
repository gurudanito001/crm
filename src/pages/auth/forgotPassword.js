
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";
import { apiPost } from "../../services/apiService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
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
        alert("Success. Email sent!!");
        console.log(res);
      })
      .catch((error) => {
        setPostingData(false);
        console.log(error);
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

                <button className="btn btnPurple w-100 mt-5" onClick={handleSubmit}>Submit</button>
              </form>
            </section>
          </div>
        </div>
      </div>

      {showNotification && <NotificationModal img={EmojiLady2} open={showNotification} onClose={() => setShowNotification(false)} />}
    </>
  )
}

export default ForgotPassword;