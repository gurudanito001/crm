import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate, useLocation } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import NaijaStates from 'naija-state-local-government';
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';


const AddBranch = () => {
  const navigate = useNavigate()
  const {state} = useLocation();
  const dispatch = useDispatch();

  useEffect(() =>{
    if(state){
      setFormData( prevState => ({
        ...prevState,
        ...state
      }))
    }
  }, [])

  const queryClient = useQueryClient();
  const branchMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/branch/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      ); 
      queryClient.invalidateQueries(["allBranches"])
      navigate(-1)
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

  const companyQuery = useQuery({
    queryKey: ["allCompanies"],
    queryFn: () => apiGet({url: "/company"})
    .then( (res) => res.payload)
    .catch(error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error?.response?.data?.message || error?.message,
          key: Date.now(),
        })
      );
    })
  })

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

  const [formData, setFormData] = useState({
    companyId: "",
    state: "",
    lga: "",
    name: "",
    code: "",
    address: "",
    isHeadOffice: false
  });

  const [errors, setErrors] = useState({})

  const listCompanyOptions = () =>{
    if(companyQuery?.data?.length){
      return companyQuery.data.map(company =>
        <option key={company.id} value={company.id}>{company.name}</option>
      )
    }
  }

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState =>({
      ...prevState,
      [props]: ""
    }))
  }

  const handleCheck = () =>{
    setFormData( prevState => ({
      ...prevState,
      isHeadOffice:!prevState.isHeadOffice
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let errors = formValidator(["companyId", "state", "lga", "name", "code", "address"], formData);
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
    branchMutation.mutate()
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Branch</header>
        <p>Fill in Branch Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="company" className="form-label">Company (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="company" onChange={handleChange("companyId")} value={formData.companyId} aria-label="Default select example">
              <option value="">Select Company</option>
              {!companyQuery.isLoading && listCompanyOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.companyId}</span>
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
            <label htmlFor="lgaId" className="form-label">Local Govt Area (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" value={formData.lga} onChange={handleChange("lga")} id="lga" aria-label="Default select example">
              <option value="">Select LGA</option>
              {listLgaOptions(formData.state)}
            </select>
            <span className='text-danger font-monospace small'>{errors.lga}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Branch Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" onChange={handleChange("name")} value={formData.name} className="form-control shadow-none" id="name" placeholder="Branch Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">Branch Code (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="code" placeholder="Branch Code" />
            <span className='text-danger font-monospace small'>{errors.code}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" id="address" value={formData.address} onChange={handleChange("address")} rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.address}</span>
          </div>

          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={formData.isHeadOffice} onChange={handleCheck}  id="isHeadOffice" />
            <label className="form-check-label fw-bold" htmlFor="isHeadOffice" >
              Head Office <br /> 
              <span className='small'>check this box if this is the Head Office Branch</span>
            </label>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={branchMutation.isLoading} onClick={handleSubmit}>{branchMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={branchMutation.isLoading} onClick={(e) => {
              e.preventDefault();
              navigate(-1)
              }}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddBranch;