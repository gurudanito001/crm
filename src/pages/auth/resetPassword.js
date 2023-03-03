import VisibilityOff from "../../images/visibility-off.svg";
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";


const ResetPassword = () =>{
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      
      <div className="container-fluid" style={{height: "100vh"}}>
        <div className="row h-100">
          <div className="col-12 col-lg px-3 px-md-3 d-flex flex-column">
            <section className="formContainer m-auto bg-white border rounded p-5">
              <header className="h3 fw-bold">Reset Password</header>
              <p>Enter new password below</p>

              <form className="mt-5">
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="input-group">
                    <input type="password" className="form-control shadow-none border-end-0" id="newPassword" placeholder="Set an 8-character password" />
                    <span className="input-group-text bg-white border-start-0" id="basic-addon1"><img width="20px" src={VisibilityOff} alt="Visibility Toggle Icon" /></span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input type="password" className="form-control shadow-none border-end-0" id="confirmPassword" placeholder="Set an 8-character password" />
                    <span className="input-group-text bg-white border-start-0" id="basic-addon1"><img width="20px" src={VisibilityOff} alt="Visibility Toggle Icon"/></span>
                  </div>
                </div>

                <button className="btn btnPurple w-100 mt-5">Reset Password</button>
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