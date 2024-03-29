import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import NaijaStates from 'naija-state-local-government';
import industries from 'industries';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiPost } from '../../../services/apiService';
import { Spinner } from '../../../components/spinner';
import { getUserData } from '../../../services/localStorageService';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';


const AddCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();
  const customerMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/customer/create`, data: formData })
    .then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allCustomers"])
      navigate("/app/customer")
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
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    companyName: "",
    state: "",
    lga: "",
    city: "",
    address1: "",
    address2: "",
    companyWebsite: "",
    chairman: "",
    mdCeoName: "",
    industry: "",
    businessType: "",
    customerType: "",
    enquirySource: ""
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

  const listStateOptions = () =>{
    return NaijaStates.states().map(state =>
      <option key={state} value={state}>{state}</option>
    )
  }
  const listLgaOptions = (state) =>{
    if(state){
      return NaijaStates.lgas(state).lgas.map(lga =>
        <option key={lga} value={lga}>{lga}</option>
      )
    }
  }

  const listIndustryOptions = () =>{
    return Object.keys(industries).map(industry =>
      <option key={industry} value={industry}>{industry}</option>
    )
  }

  const handleChange = (props) => (event) =>{
    if(props === "state"){
      setFormData(prevState => ({
        ...prevState,
        lga: "",
        city: ""
      }))
    }
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState =>({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    let errors = formValidator(["companyName", "state", "lga", "address1", "industry", "businessType", "customerType", "enquirySource"], formData);
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
    //return console.log(formData)
    customerMutation.mutate();
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Customer</header>
        <p>Fill in Customer Information.</p>

        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" value={formData.companyName} onChange={handleChange("companyName")} className="form-control shadow-none" id="companyName" placeholder="Company Name" />
            <span className='text-danger font-monospace small'>{errors.companyName}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" value={formData.state} onChange={handleChange("state")} id="state" aria-label="Default select example">
              <option value="">Select State</option>
              {listStateOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.state}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="lga" className="form-label">LGA (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" value={formData.lga} onChange={handleChange("lga")} id="lga" aria-label="Default select example">
              <option value="">Select LGA</option>
              {listLgaOptions(formData.state)}
            </select>
            <span className='text-danger font-monospace small'>{errors.lga}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City </label>
            <input type="text" className="form-control shadow-none" id="companyWebsite" value={formData.city} onChange={handleChange("city")} placeholder="name of city" />
          </div>
          <div className="mb-3">
            <label htmlFor="address1" className="form-label">Address 1 (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" id="address1" value={formData.address1} onChange={handleChange("address1")} rows={3} placeholder="Building Name/Number/Street"></textarea>
            <span className='text-danger font-monospace small'>{errors.address1}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="address2" className="form-label">Address 2</label>
            <textarea className="form-control shadow-none" id="address2" value={formData.address2} onChange={handleChange("address2")} rows={3} placeholder="Landmark"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="companyWebsite" className="form-label">Company Website</label>
            <input type="text" className="form-control shadow-none" id="companyWebsite" value={formData.companyWebsite} onChange={handleChange("companyWebsite")} placeholder="www.companywebsite.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="chairman" className="form-label">Ownership / Chairman</label>
            <input type="text" className="form-control shadow-none" id="chairman" value={formData.chairman} onChange={handleChange("chairman")} placeholder="Chairman of Company" />
          </div>
          <div className="mb-3">
            <label htmlFor="mdceo" className="form-label">MD/CEO Name</label>
            <input type="text" className="form-control shadow-none" id="mdceo" value={formData.mdCeoName} onChange={handleChange("mdCeoName")} placeholder="MD/CEO of Company" />
          </div>

          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry  (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none w-50 me-2" id="industry" value={formData.industry} onChange={handleChange("industry")} aria-label="Default select example">
                <option value="">Select Industry</option>
                {listIndustryOptions()}
              </select>
              <input type="text" className="form-control shadow-none w-50" id="chairman" value={formData.industry} onChange={handleChange("industry")} placeholder="Custom Industry" />
            </div>
            <span className='text-danger font-monospace small'>{errors.industry}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="businesstype" className="form-label">Business Type  (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none me-2 w-50" id="businesstype" value={formData.businessType} onChange={handleChange("businessType")} aria-label="Default select example">
                <option value="">Select Business Type</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Distribution">Distribution</option>
                <option value="Importation">Importation</option>
              </select>
              <input type="text" className="form-control shadow-none w-50" id="chairman" value={formData.businessType} onChange={handleChange("businessType")} placeholder="Custom Business Type" />
            </div>
            <span className='text-danger font-monospace small'>{errors.businessType}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="customertype" className="form-label">Customer Type  (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none me-2 w-50" id="customertype" value={formData.customerType} onChange={handleChange("customerType")} aria-label="Default select example">
                <option value="">Select Customer Type</option>
                <option value="Individual">Individual</option>
                <option value="Agent">Agent</option>
                <option value="Corporate">Corporate</option>
                <option value="Government">Government</option>
                <option value="Parastatal">Parastatal</option>
              </select>
              <input type="text" className="form-control shadow-none w-50" id="customerType" value={formData.customerType} onChange={handleChange("customerType")} placeholder="Custom Customer Type" />
            </div>
            <span className='text-danger font-monospace small'>{errors.customerType}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="enquirySource" className="form-label">Enquiry Source (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none me-2 w-50" id="enquirySource" value={formData.enquirySource} onChange={handleChange("enquirySource")} aria-label="Default select example">
                <option value="">Select Enquiry Source</option>
                <option value="Walk-In">Walk-In</option>
                <option value="Repeat">Repeat</option>
                <option value="Telephone">Telephone</option>
                <option value="Field Enquiry">Field Enquiry</option>
                <option value="Advert">Advert</option>
                <option value="Referral">Referral</option>
                <option value="Dealer">Dealer</option>
              </select>
              <input type="text" className="form-control shadow-none w-50" id="enquirySource" value={formData.enquirySource} onChange={handleChange("enquirySource")} placeholder="Custom Enquiry Source" />
            </div>
            <span className='text-danger font-monospace small'>{errors.enquirySource}</span>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={customerMutation.isLoading} onClick={handleSubmit}>{customerMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/customer")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default AddCustomer;