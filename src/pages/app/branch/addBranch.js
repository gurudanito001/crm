import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";


const AddBranch = () => {
  const navigate = useNavigate()

  const queryClient = useQueryClient();
  const branchMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/branch/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allBranches"])
      navigate("/app/branch")
    }
  })

  const companyQuery = useQuery({
    queryKey: ["allCompanies"],
    queryFn: () => apiGet({url: "/company"}).then( (res) => res.payload),
    onSuccess: () => console.log(companyQuery.data)
  })

  const stateQuery = useQuery({
    queryKey: ["allStates"],
    queryFn: () => apiGet({url: "/state"}).then( (res) => res.payload),
    onSuccess: () => console.log(stateQuery.data)
  })

  const lgaQuery = useQuery({
    queryKey: ["allLgas"],
    queryFn: () => apiGet({url: "/lga"}).then( (res) => res.payload),
    onSuccess: () => console.log(lgaQuery.data)
  })

  const [formData, setFormData] = useState({
    companyId: "",
    stateId: "",
    lgaId: "",
    name: "",
    code: "",
    address: ""
  });

  const listCompanyOptions = () =>{
    if(companyQuery?.data?.length){
      return companyQuery.data.map(company =>
        <option key={company.id} value={company.id}>{company.name}</option>
      )
    }
  }
  const listStateOptions = () =>{
    if(stateQuery?.data){
    return stateQuery.data.map(state =>
      <option key={state.id} value={state.id}>{state.name}</option>
    )}
  }
  const getState = (stateId) =>{
    let state;
    stateQuery.data.forEach(item =>{
      if(item.id === stateId){
        state = item.name;
      }
    })
    return state;
  }
  const listLgaOptions = () => {
    if (lgaQuery?.data) {
      if (formData.stateId) {
        let state = getState(formData.stateId);
        let filteredLgas = lgaQuery.data.filter(function (lga) {
          return lga.state === state
        })
        return filteredLgas.map(lga =>
          <option key={lga.id} value={lga.id}>{lga.name}</option>
        )
      }
      return lgaQuery?.data?.map(lga =>
        <option key={lga.id} value={lga.id}>{lga.name}</option>
      )
    }
  }



  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
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
            <label htmlFor="company" className="form-label">Company</label>
            <select className="form-select shadow-none" id="company" onChange={handleChange("companyId")} value={formData.companyId} aria-label="Default select example">
              <option value="">Select Company</option>
              {!companyQuery.isLoading && listCompanyOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="stateId" className="form-label">State</label>
            <select className="form-select shadow-none" value={formData.stateId} onChange={handleChange("stateId")} id="stateId" aria-label="Default select example">
              <option value="">Select State</option>
              {listStateOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="lgaId" className="form-label">Local Govt Area</label>
            <select className="form-select shadow-none" value={formData.lgaId} onChange={handleChange("lgaId")} id="lgaId" aria-label="Default select example">
              <option value="">Select LGA</option>
              {listLgaOptions()}
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

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={branchMutation.isLoading} onClick={handleSubmit}>Submit</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={branchMutation.isLoading} onClick={() => navigate("/app/branch")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddBranch;