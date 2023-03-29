import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiPost, apiGet, apiPut } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import NaijaStates from 'naija-state-local-government';
import { Spinner } from '../../../components/spinner';


const EditBranchDetails = ({data, handleCancel}) => {
  const navigate = useNavigate()
  const {state} = useLocation();


  useEffect(() =>{
      setFormData( prevState => ({
        ...prevState,
        ...data
      }))
  }, [])
  const queryClient = useQueryClient();
  const branchDetailsMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/branch/${data.id}`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allBranches"])
      handleCancel()
    }
  })

  const companyQuery = useQuery({
    queryKey: ["allCompanies"],
    queryFn: () => apiGet({url: "/company"}).then( (res) => res.payload),
    onSuccess: () => console.log(companyQuery.data)
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
  }

  const handleCheck = () =>{
    setFormData( prevState => ({
      ...prevState,
      isHeadOffice:!prevState.isHeadOffice
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    //return console.log(formData)
    branchDetailsMutation.mutate()
  }

  return (
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Edit Branch Details</header>
        <p>Make Changes to Branch Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="company" className="form-label">Company</label>
            <select className="form-select shadow-none" id="company" onChange={handleChange("companyId")} value={formData.companyId} aria-label="Default select example">
              <option value="">Select Company</option>
              {!companyQuery.isLoading && listCompanyOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <select className="form-select shadow-none" value={formData.state} onChange={handleChange("state")} id="state" aria-label="Default select example">
              <option value="">Select State</option>
              {listStateOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="lgaId" className="form-label">Local Govt Area</label>
            <select className="form-select shadow-none" value={formData.lga} onChange={handleChange("lga")} id="lga" aria-label="Default select example">
              <option value="">Select LGA</option>
              {listLgaOptions(formData.state)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Branch Name</label>
            <input type="text" onChange={handleChange("name")} value={formData.name} className="form-control shadow-none" id="name" placeholder="Branch Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">Branch Code</label>
            <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="code" placeholder="Branch Code" />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea className="form-control shadow-none" id="address" value={formData.address} onChange={handleChange("address")} rows={3}></textarea>
          </div>

          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={formData.isHeadOffice} onChange={handleCheck}  id="isHeadOffice" />
            <label className="form-check-label fw-bold" htmlFor="isHeadOffice" >
              Head Office <br /> 
              <span className='small'>check this box if this is the Head Office Branch</span>
            </label>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={branchDetailsMutation.isLoading} onClick={handleSubmit}>{branchDetailsMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={branchDetailsMutation.isLoading} onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </section>

  )
}

export default EditBranchDetails;