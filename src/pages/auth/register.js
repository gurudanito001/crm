import Nav from "../../components/nav";
import VisibilityOff from "../../images/visibility-off.svg";
import FacebookIcon from "../../images/facebookIcon.svg";
import GoogleIcon from "../../images/googleIcon.svg";
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState } from "react";
import PlaceHolderBg from "../../images/placeHolderAuthBg.png";


const Register = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      
      <div className="container-fluid" style={{ height: "100vh"}}>
        <div className="row h-100">
          <div className="col-12 col-lg px-4 px-md-3">
            <Nav />
            <section className="formContainer ms-sm-5 my-5">
              <header className="h3 fw-bold">Create Your Account</header>
              <p>Fill in your information to get started.</p>

              <form className="mt-5">
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input type="text" className="form-control shadow-none" id="fullName" placeholder="Enter your full name" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control shadow-none" id="email" placeholder="Enter your email address" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Phone Number</label>
                  <div className="d-flex">
                    <select className="form-select w-25 shadow-none" aria-label="Default select example">
                      <option value="1">+234</option>
                      <option value="2">+235</option>
                      <option value="3">+236</option>
                    </select>
                    <input type="tel" className="form-control w-75 shadow-none ms-3" id="email" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input type="password" className="form-control shadow-none border-end-0" id="password" placeholder="Set an 8-character password" />
                    <span className="input-group-text bg-white border-start-0" id="basic-addon1"><img width="20px" src={VisibilityOff} /></span>
                  </div>
                </div>

                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" value="" id="checkbox" />
                  <label className="form-check-label" htmlFor="checkbox">
                    I agree to the company’s <a className="textGreen">Terms of Service</a> and <a className="textGreen">Privacy Policy</a>
                  </label>
                </div>
                <button className="btn btnGreen w-100 mt-4"> Sign Up</button>
              </form>

              <section>
                <div className="d-flex flex-column">
                  <div className="text-center " style={{}}>
                    <span className="p-2 bg-white text-secondary" style={{ borderRadius: "17px", position: "relative", top: "26px", zIndex: 200 }}>OR</span>
                  </div>
                  <hr />
                </div>

                <div className="mt-3 d-flex flex-column flex-md-row">
                  <button className="btn borderGreen d-flex align-items-center">
                    <img width="20px" className="me-2 ms-auto" src={GoogleIcon} /> 
                    <span className="me-auto">Continue with Google</span>
                  </button>
                  <button className="btn borderGreen ms-md-auto d-flex align-items-center mt-4 mt-md-0">
                    <img width="20px" className="me-2 ms-auto" src={FacebookIcon} /> 
                    <span className="me-auto">Continue with Facebook</span>
                  </button>
                </div>

                <p className="text-center mt-5">Already have an account? <a href="/login" className="textGreen ms-2">Log In</a></p>
              </section>
            </section>
          </div>
          <div className="col d-none d-lg-block border pt-5 sideBarBg">
          </div>
        </div>
      </div>

      {showNotification && <NotificationModal img={EmojiLady2} open={showNotification} onClose={()=>setShowNotification(false)}  />}
    </>

  )
}

export default Register;