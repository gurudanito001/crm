import { useState, useEffect } from "react";
import { apiPut, apiDelete } from '../../../services/apiService';
import { useMutation, useQueryClient } from "@tanstack/react-query" 
import NaijaStates from 'naija-state-local-government';
import industries from 'industries';
import { Spinner } from '../../../components/spinner';

const EditCustomerDetails = ({data, handleCancel}) => {


  const [formData, setFormData] = useState({
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
    enquirySource: "",
    brandsAssigned: []
  });

  const queryClient = useQueryClient();
  const customerDetailsMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/customer/${data.id}`, data: formData }).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCustomers", data.id])
      handleCancel()
    }
  })
  useEffect(()=>{
    setFormData(prevState => ({
      ...prevState,
      ...data
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

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    //return console.log(formData)
    customerDetailsMutation.mutate();
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Customer Details</header>
      <p>Make changes to Customer Information.</p>

      <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input type="text" value={formData.companyName} onChange={handleChange("companyName")} className="form-control shadow-none" id="companyName" placeholder="Company Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <select className="form-select shadow-none" value={formData.state} onChange={handleChange("state")} id="state" aria-label="Default select example">
              <option value="">Select State</option>
              {listStateOptions()}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="lga" className="form-label">LGA</label>
            <select className="form-select shadow-none" value={formData.lga} onChange={handleChange("lga")} id="lga" aria-label="Default select example">
              <option value="">Select LGA</option>
              {listLgaOptions(formData.state)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <select className="form-select shadow-none" value={formData.city} onChange={handleChange("city")} id="city" aria-label="Default select example">
              <option value="">Select City</option>
              {listLgaOptions(formData.state)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="address1" className="form-label">Address 1</label>
            <textarea className="form-control shadow-none" id="address1" value={formData.address1} onChange={handleChange("address1")} rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="address2" className="form-label">Address 2</label>
            <textarea className="form-control shadow-none" id="address2" value={formData.address2} onChange={handleChange("address2")} rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="companyWebsite" className="form-label">Company Website</label>
            <input type="text" className="form-control shadow-none" id="companyWebsite" value={formData.companyWebsite} onChange={handleChange("companyWebsite")} placeholder="wwww.companywebsite.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="chairman" className="form-label">Chairman</label>
            <input type="text" className="form-control shadow-none" id="chairman" value={formData.chairman} onChange={handleChange("chairman")} placeholder="Chairman of Company" />
          </div>
          <div className="mb-3">
            <label htmlFor="mdceo" className="form-label">MD/CEO</label>
            <input type="text" className="form-control shadow-none" id="mdceo" value={formData.mdCeoName} onChange={handleChange("mdCeoName")} placeholder="MD/CEO of Company" />
          </div>

          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none w-50 me-2" id="industry" value={formData.industry} onChange={handleChange("industry")} aria-label="Default select example">
                <option value="">Select Industry</option>
                {listIndustryOptions()}
              </select>
              <input type="text" className="form-control shadow-none w-50" id="chairman" value={formData.industry} onChange={handleChange("industry")} placeholder="Custom Industry" />
            </div>
           
          </div>
          <div className="mb-3">
            <label htmlFor="businesstype" className="form-label">Business Type</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none me-2 w-50" id="businesstype" value={formData.businessType} onChange={handleChange("businessType")} aria-label="Default select example">
                <option value="">Select Business Type</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Distribution">Distribution</option>
                <option value="Importation">Importation</option>
              </select>
              <input type="text" className="form-control shadow-none w-50" id="chairman" value={formData.businessType} onChange={handleChange("businessType")} placeholder="Custom Business Type" />
            </div>
            
          </div>
          <div className="mb-3">
            <label htmlFor="customertype" className="form-label">Customer Type</label>
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
            
          </div>
          <div className="mb-3">
            <label htmlFor="enquirySource" className="form-label">Enquiry Source</label>
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
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={customerDetailsMutation.isLoading} onClick={handleSubmit}>{customerDetailsMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => handleCancel()}>Cancel</button>
          </div>
        </form>
    </section>

  )
}

export default EditCustomerDetails;