import VisibilityOff from "../../images/visibility-off.svg";
import EmojiLady2 from "../../images/emojiLady2.png"
import '../../styles/auth.styles.css';
import NotificationModal from "../../components/notificationModal";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/passwordInput";
import { apiPost } from '../../services/apiService' ;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
//import { setUserData } from "../../store/slices/userSlice";
import { setToken, getUserData, setUserData } from "../../services/localStorageService";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [showNotification, setShowNotification] = useState(false);
  const [postingData, setPostingData] = useState()



  useEffect(()=>{
    let data = getUserData()
    if(data){
      navigate("/app/dashboard")
    }
  },)


  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (props) => (event) =>{

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const loginRequest = () =>{
    setPostingData(true);
    apiPost({ url: "/auth/login", data: formData })
      .then((res) => {
        setPostingData(false);
        const {token, user} = res.payload
        const {firstName, lastName, middleName, staffCadre, id, companyId, companyName} = user;
        setUserData(JSON.stringify({token, id, firstName, lastName, middleName, staffCadre, companyId, companyName}))
        //dispatch(setUserData(res.payload))
        //setToken(res.payload.token)
        console.log(res);
      })
      .catch((error) => {
        setPostingData(false);
        console.log(error);
      });
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    loginRequest()
    //return console.log(formData);
    //userMutation.mutate();
  }

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
                  <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="email" placeholder="Enter your email address" />
                </div>

                <PasswordInput onChange={handleChange("password")} value={formData.password} />

                <div className="form-check mt-4 d-flex align-items-center">
                  <div>
                    <input className="form-check-input" type="checkbox" value="" id="checkbox" />
                    <label className="form-check-label textPurple" htmlFor="checkbox">
                      Remember Me
                    </label>
                  </div>
                  <a href="/forgotPassword" className="textPurple ms-auto">Forgot Password?</a>
                </div>
                <button className="btn btnPurple w-100 mt-5" disabled={postingData} onClick={handleSubmit}>Log In</button>
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