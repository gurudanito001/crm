import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import NaijaStates from 'naija-state-local-government';


const AddLga = () => {
  const navigate = useNavigate()

  const queryClient = useQueryClient();
  const lgaMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/lga/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allLgas"])
      navigate("/app/lga")
    }
  })

  const stateQuery = useQuery({
    queryKey: ["allStates"],
    queryFn: () => apiGet({url: "/state"}).then( (res) => res.payload)
  })


  const [formData, setFormData] = useState({
    state: "",
    name: "",
    code: "",
  });


  const listStateOptions = () =>{
    if(stateQuery?.data){
      return stateQuery.data.map(state =>
        <option key={state.id} value={state.name}>{state.name}</option>
      )
    }
  }

  const listLgaOptions = (state) =>{
    if(state){
      return NaijaStates.lgas(state).lgas.map(lga =>
        <option key={lga} value={lga}>{lga}</option>
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
    lgaMutation.mutate()
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Local Govt Area</header>
        <p>Fill in Local Govt Area Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <select className="form-select shadow-none" value={formData.state} onChange={handleChange("state")} id="state" aria-label="Default select example">
              <option value="">Select State</option>
              {listStateOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">LGA Name</label>
            <select className="form-select shadow-none" value={formData.name} onChange={handleChange("name")} id="name" aria-label="Default select example">
              <option value="">Select LGA Name</option>
              {listLgaOptions(formData.state)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">LGA Code</label>
            <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="code" placeholder="State Code" />
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={lgaMutation.isLoading} onClick={handleSubmit}>Submit</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={lgaMutation.isLoading} onClick={() => navigate("/app/lga")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddLga;