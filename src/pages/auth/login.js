
import '../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/passwordInput";
import { apiPost } from '../../services/apiService' ;
import { useDispatch, useSelector } from "react-redux";
//import { setUserData } from "../../store/slices/userSlice";
import { setToken, getUserData, setUserData } from "../../services/localStorageService";
import { setMessage } from '../../store/slices/notificationMessagesSlice';
import { Spinner } from '../../components/spinner';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  //const [showNotification, setShowNotification] = useState(false);
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
                <button className="btn btnPurple w-100 mt-5" disabled={postingData} onClick={handleSubmit}>{postingData ? <Spinner /> : "Submit"}</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;