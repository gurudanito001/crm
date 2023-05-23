import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';


const AddMonthlyTarget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = getUserData();
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    monthlyTarget: [
      {product: "", number: ""}
    ],
    planForMonth: "",
  })

  const queryClient = useQueryClient();

  useEffect(()=>{
    setFormData( prevState => ({
      ...prevState,
      employeeId: id
    }))
  },[])

  const [errors, setErrors] = useState({});


  const monthlyTargetMutation = useMutation({
    mutationFn: ()=> {
      apiPost({ url: `/monthlyTarget/create`, data: formData })
    .then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      navigate("/app/targetAchievements")
    }).catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  }
  })

  const productMutation = useMutation({
    mutationFn: (data)=> apiPost({ url: `/product/create`, data }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allProducts"])
      navigate("/app/product")
    }).catch(error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const productQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => apiGet({url: "/product"})
    .then( (res) => res.payload)
    .catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const listOfSelectedProducts = () => {
    let list = [];
    formData.monthlyTarget.forEach( item => {
      list.push(item.product)
    })
    return list;
  }

  const listProductOptions = () =>{
    if(productQuery.data.length > 0){
      return productQuery.data.map(product =>
        <option key={product.id} value={product.name}>{product.name}</option>
      )
    }
  }

/*   const listMonthOptions = () =>{
    return getMonths().map(month =>
      <option key={month} value={month}>{month}</option>
    )
  }

  const listYearOptions = () =>{
    return getYears().map(year =>
      <option key={year} value={year}>{year}</option>
    )
  } */


  const handleChangeTargetProduct = (index) => (event) =>{
    let selectedProducts = listOfSelectedProducts();
    if(selectedProducts.includes(event.target.value)){
      console.log(selectedProducts)
      return;
    } 
    let monthlyTarget = formData.monthlyTarget;
    monthlyTarget[index].product = event.target.value;
    setFormData( prevState =>({
      ...prevState,
      monthlyTarget: monthlyTarget
    }))
  }

  const handleChangeTargetNumber = (index) => (event) =>{
    let monthlyTarget = formData.monthlyTarget;
    monthlyTarget[index].number = event.target.value;
    setFormData( prevState =>({
      ...prevState,
      monthlyTarget
    }))
  }

  const listMonthlyTargetFields = () =>{
    return formData.monthlyTarget.map( (target, index) =>{
      return (
        <div className="mb-3" key={index}>
          <div className='d-flex align-items-center'>
            <select className="form-select shadow-none me-2 w-50" value={target.product} onChange={handleChangeTargetProduct(index)} aria-label="Default select example">
              <option value="">Select Product</option>
              {!productQuery.isError && !productQuery.isLoading && listProductOptions()}
            </select>
            <input type="number" className="form-control shadow-none w-50" value={target.number} onChange={handleChangeTargetNumber(index)} placeholder="Target Number of Sales" />
          </div>
        </div>
      )
    })
  }

  const addNewTarget = (e) =>{
    e.preventDefault();
    let monthlyTarget = formData.monthlyTarget;
    monthlyTarget.push({product: "", number: ""})
    setFormData( prevState => ({
      ...prevState, 
      monthlyTarget
    }))
  }

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
    e.preventDefault();
    //return console.log(formData)
    let errors = formValidator(["planForMonth", "monthlyTarget", "month"], formData);
    if(Object.keys(errors).length > 0){
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      return setErrors(errors);
    }
    monthlyTargetMutation.mutate();
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Monthly Target </header>
        <p>Fill in Monthly Target Information.</p>
          <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="month" className="form-label">Month (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="month" className="form-control shadow-none" value={formData.month} onChange={handleChange("month")} id="month"/>
            <span className='text-danger font-monospace small'>{errors.month}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="planForMonth" className="form-label">Plan For Month </label>
            <textarea className="form-control shadow-none" value={formData.planForMonth} onChange={handleChange("planForMonth")} id="planForMonth" rows={5}></textarea>
            <span className='text-danger font-monospace small'>{errors.planForMonth}</span>
          </div>

          <div className="mb-3">
            <div className='d-flex align-items-center justify-content-center mb-3'>
              <h6 className="fw-bold m-0">Monthly Targets (<span className='fst-italic text-warning'>required</span>)</h6>
              <button style={{height: "35px"}} className="btn btn-sm border btn-secondary ms-auto py-0" onClick={addNewTarget}> +Add New</button>
            </div>
            {listMonthlyTargetFields()}
          </div>

          
          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={monthlyTargetMutation.isLoading} onClick={handleSubmit}>{monthlyTargetMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/targetAchievements")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddMonthlyTarget;