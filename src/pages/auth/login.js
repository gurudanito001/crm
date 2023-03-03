import VisibilityOff from "../../images/visibility-off.svg";
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <div className="container-fluid" style={{ height: "100vh"}}>
        <div className="row h-100">
          <div className="col-12 col-lg px-3 px-md-3 d-flex flex-column">
            <section className="formContainer mx-auto my-auto bg-white border rounded p-5">
              <header className="h3 fw-bold">Log In</header>
              <p>Log in with your credentials.</p>
              <form className="mt-5">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control shadow-none" id="email" placeholder="Enter your email address" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input type="password" className="form-control shadow-none border-end-0" id="password" placeholder="Set an 8-character password" />
                    <span className="input-group-text bg-white border-start-0" id="basic-addon1"><img width="20px" src={VisibilityOff} alt="Visibility Toggle Icon" /></span>
                  </div>
                </div>

                <div className="form-check mt-4 d-flex align-items-center">
                  <div>
                    <input className="form-check-input" type="checkbox" value="" id="checkbox" />
                    <label className="form-check-label textPurple" htmlFor="checkbox">
                      Remember Me
                    </label>
                  </div>
                  <a href="/forgotPassword" className="textPurple ms-auto">Forgot Password?</a>
                </div>
                <button className="btn btnPurple w-100 mt-5" onClick={()=>navigate("/app/dashboard")}>Log In</button>
              </form>
            </section>
          </div>
        </div>
      </div>

      {showNotification && <NotificationModal img={EmojiLady2} open={showNotification} onClose={() => setShowNotification(false)} />}
    </>
  )
}

export default Login;