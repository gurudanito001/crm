import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import NaijaStates from 'naija-state-local-government';


const AddState = () => {
  const navigate = useNavigate()

  const queryClient = useQueryClient();
  const stateMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/state/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allStates"])
      navigate("/app/state")
    }
  })

  const companyQuery = useQuery({
    queryKey: ["allCompanies"],
    queryFn: () => apiGet({url: "/company"}).then( (res) => res.payload),
    onSuccess: () => console.log(companyQuery.data)
  })

  const [formData, setFormData] = useState({
    companyId: "",
    name: "",
    code: "",
  });

  const listCompanyOptions = () =>{
    if(companyQuery.data.length > 0){
      return companyQuery.data.map(company =>
        <option key={company.id} value={company.id}>{company.name}</option>
      )
    }
  }

  const listStateOptions = () =>{
    return NaijaStates.states().map(state =>
      <option key={state} value={state}>{state}</option>
    )
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
    stateMutation.mutate()
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add State</header>
        <p>Fill in State Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="company" className="form-label">Company</label>
            <select className="form-select shadow-none" id="company" onChange={handleChange("companyId")} value={formData.companyId} aria-label="Default select example">
              <option value="">Select Company</option>
              {!companyQuery.isLoading && listCompanyOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State Name</label>
            <select className="form-select shadow-none" value={formData.name} onChange={handleChange("name")} id="state" aria-label="Default select example">
              <option value="">Select State</option>
              {listStateOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">State Code</label>
            <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="code" placeholder="State Code" />
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={stateMutation.isLoading} onClick={handleSubmit}>Submit</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={stateMutation.isLoading} onClick={() => navigate("/app/state")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddState;