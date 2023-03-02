import Nav from "../../components/nav";
import VisibilityOff from "../../images/visibility-off.svg";
import FacebookIcon from "../../images/facebookIcon.svg";
import GoogleIcon from "../../images/googleIcon.svg";
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";
import PlaceHolderBg from "../../images/placeHolderAuthBg.png";
import ReactCodeInput from "react-code-input";


const VerifyEmail = () =>{
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      
      <div className="container-fluid" style={{height: "100vh"}}>
        <div className="row h-100">
          <div className="col-12 col-lg px-4 px-md-3">
            <Nav />
            <section className="formContainer ms-sm-5 my-5">
              <header className="h3 fw-bold">Verify Your Email</header>
              <p>We sent a 6-digit code to <span className="textGreen">nebo***@gmail.com</span>. Code expires in 10 minutes</p>
              
              <form className="mt-5">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label d-block">Verification Code</label>
                  <ReactCodeInput type="number" fields={6} name="emailVerificationCode" inputMode="numeric" autoFocus={true} />
                </div>

                <p className="mt-5">Didn't get a code? <a href="/register" className="textGreen ms-2">Resend code</a></p>

                <button className="btn btnGreen w-100 mt-4">Confirm Code</button>
              </form>

              <section>
                <p className="text-center mt-5">Already have an account? <a href="/login" className="textGreen ms-2">Log In</a></p>
              </section>
            </section>
          </div>
          <div className="col d-none d-lg-block border pt-5 sideBarBg">
          </div>
        </div>
      </div>

      {showNotification && <NotificationModal img={EmojiLady2} open={showNotification} onClose={() => setShowNotification(false)} />}
    </>
  )
}

export default VerifyEmail;