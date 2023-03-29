import { useState, useEffect } from "react";
import { apiPut, apiDelete, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import NaijaStates from 'naija-state-local-government';
import industries from 'industries';
import { Spinner } from '../../../components/spinner';

const EditContactPersonDetails = ({ data, handleCancel }) => {


  const [formData, setFormData] = useState({
    employeeId: "",
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    designation: "",
    department: "",
    phoneNumber1: "",
    phoneNumber2: "",
    role: ""
  });

  const queryClient = useQueryClient();
  const contactPersonDetailsMutation = useMutation({
    mutationFn: () => apiPut({ url: `/contactPerson/${data.id}`, data: formData }).then(res => console.log(res)),
    onSuccess: () => {
      queryClient.invalidateQueries(["allContactPersons"])
      handleCancel()
    }
  })
  useEffect(() => {
    console.log(data)
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
  }, [])

  /*   const listStateOptions = () =>{
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
    } */

  /*   const listIndustryOptions = () =>{
        return Object.keys(industries).map(industry =>
          <option key={industry} value={industry}>{industry}</option>
        )
    } */

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({ url: "/customer" }).then((res) => res.payload),
    onSuccess: () => console.log(customerQuery.data)
  })

  const listCustomerOptions = () => {
    if (customerQuery?.data?.length) {
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.id}>{customer.companyName}</option>
      )
    }
  }

  const handleChange = (props) => (event) => {
    if (props === "state") {
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
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    //return console.log(formData)
    contactPersonDetailsMutation.mutate();
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Contact Person Details</header>
      <p>Make changes to Contact Person Information.</p>

      <form className="mt-5">

        <div className="mb-3">
          <label htmlFor="customer" className="form-label">Customer (<span className='fst-italic text-warning'>required</span>)</label>
          <select className="form-select shadow-none" id="customer" onChange={handleChange("customerId")} value={formData.customerId} aria-label="Default select example">
            <option value="">Select Customer</option>
            {!customerQuery.isLoading && listCustomerOptions()}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" onChange={handleChange("firstName")} value={formData.firstName} className="form-control shadow-none" id="firstName" placeholder="Contact Person First Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" onChange={handleChange("lastName")} value={formData.lastName} className="form-control shadow-none" id="lastName" placeholder="Contact Person Last Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="email" placeholder="Contact Person Email" />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <div className='d-flex align-items-center'>
            <select className="form-select shadow-none me-2 w-50" id="role" value={formData.role} onChange={handleChange("role")} aria-label="Default select example">
              <option value="">Select Contact Person Role</option>
              <option value="buyer">Buyer</option>
              <option value="user">User</option>
              <option value="influencer">Influencer</option>
              <option value="decisionMaker">Decision Maker</option>
            </select>
            <input type="text" className="form-control shadow-none w-50" id="role" value={formData.role} onChange={handleChange("role")} placeholder="Custom Contact Person Role" />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber1" className="form-label">Phone Number 1 (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="tel" onChange={handleChange("phoneNumber1")} value={formData.phoneNumber1} className="form-control shadow-none" id="phoneNumber1" placeholder="Phone Number 1" />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber2" className="form-label">Phone Number 2</label>
          <input type="tel" onChange={handleChange("phoneNumber2")} value={formData.phoneNumber2} className="form-control shadow-none" id="phoneNumber2" placeholder="Phone Number 2" />
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" onChange={handleChange("title")} value={formData.title} className="form-control shadow-none" id="title" placeholder="Contact Person Title" />
        </div>
        <div className="mb-3">
          <label htmlFor="designation" className="form-label">Designation</label>
          <input type="text" onChange={handleChange("designation")} value={formData.designation} className="form-control shadow-none" id="designation" placeholder="Contact Person Designation" />
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">Department</label>
          <input type="text" onChange={handleChange("department")} value={formData.department} className="form-control shadow-none" id="role" placeholder="Contact Person Department" />
        </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={contactPersonDetailsMutation.isLoading} onClick={handleSubmit}>{contactPersonDetailsMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={() => handleCancel()}>Cancel</button>
        </div>
      </form>
    </section>

  )
}

export default EditContactPersonDetails;