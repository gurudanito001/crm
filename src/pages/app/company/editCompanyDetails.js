import { useState, useEffect } from "react";
import { apiPut, apiDelete } from '../../../services/apiService';
import { useMutation, useQueryClient } from "@tanstack/react-query" 
import { useNavigate } from "react-router";


const EditCompanyDetails = ({ data, handleCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    group: "",
    code: "",
    name: "",
    logo: "",
    email: "",
    address: ""
  })

  const queryClient = useQueryClient();
  const companyDetailsMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/company/${data.id}`, data: formData }).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCompanies", data.id])
      handleCancel()
    }
  })

  useEffect(()=>{
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
  }, [])

  const handleChange = (props) => (event) =>{

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    // return console.log(formData)
    e.preventDefault()
    companyDetailsMutation.mutate();
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Company Details</header>
      <p>Make changes to Company Information.</p>

      <form className="mt-5">

        <div className="mb-3">
          <label htmlFor="groupName" className="form-label">Group Name</label>
          <input type="text" onChange={handleChange("group")} value={formData.group} className="form-control shadow-none" id="groupName" placeholder="Group Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="companyCode" className="form-label">Company Code</label>
          <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="companyCode" placeholder="Company Code" />
        </div>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name</label>
          <input type="text" onChange={handleChange("name")} value={formData.name} className="form-control shadow-none" id="companyName" placeholder="Company Name" />
        </div>

        <div className="mb-3">
          <label htmlFor="companyLogo" className="form-label">Company Logo</label>
          <input className="form-control form-control-lg" id="companyLogo" type="file" />
        </div>

        <div className="mb-3">
          <label htmlFor="companyEmail" className="form-label">Company Email</label>
          <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="companyEmail" placeholder="Enter company email" />
        </div>

        <div className="mb-3">
          <label htmlFor="brandsAssigned" className="form-label">Brands Assigned</label>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
            <label className="form-check-label" htmlFor="defaultCheck1">
              Brand 1
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" />
            <label className="form-check-label" htmlFor="defaultCheck2">
              Brand 2
            </label>
          </div>
        </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={companyDetailsMutation.isLoading} onClick={handleSubmit}>Save Changes</button>
          <button className="btn btn-secondary ms-3 px-5" disabled={companyDetailsMutation.isLoading} onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default EditCompanyDetails;