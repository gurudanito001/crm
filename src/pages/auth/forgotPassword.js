
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";


const ForgotPassword = () =>{
  const [showNotification, setShowNotification] = useState(false);

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
                  <input type="email" className="form-control shadow-none" id="email" placeholder="Enter your email address" />
                </div>

                <button className="btn btnPurple w-100 mt-5">Submit</button>
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