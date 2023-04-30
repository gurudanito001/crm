import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../../services/apiService';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { getUserData } from '../../../services/localStorageService';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';


const AddWeeklyVisitPlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const weeklyVisitPlanMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/weeklyVisitPlan/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allweeklyVisitPlans"])
      navigate("/app/plan")
    }).catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const [formData, setFormData] = useState({
    employeeId: "",
    week: "",
    month: "",
    description: "",
    extraData: {}
  });

  const [errors, setErrors] = useState({})

  useEffect(()=>{
    let userData = getUserData();
    console.log(userData)
    setFormData(prevState => ({
      ...prevState,
      employeeId: userData.id
    }))
  }, [])

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    //return console.log(formData)
    weeklyVisitPlanMutation.mutate();
  }

  

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Weekly Visit Plan</header>
        <p>Fill in Weekly Visit Plan Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="week" className="form-label">Week (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="week" className="form-control shadow-none" value={formData.week} onChange={handleChange("week")} id="week" />
            <span className='text-danger font-monospace small'>{errors.week}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="month" className="form-label">Month (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="month" className="form-control shadow-none" value={formData.month} onChange={handleChange("month")} id="month"/>
            <span className='text-danger font-monospace small'>{errors.month}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description </label>
            <textarea className="form-control shadow-none" value={formData.description} onChange={handleChange("description")} id="description" rows={4}></textarea>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={weeklyVisitPlanMutation.isLoading} onClick={handleSubmit}>{weeklyVisitPlanMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/plan")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddWeeklyVisitPlan;