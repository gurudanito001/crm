import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate, useLocation } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { getUserData } from '../../../services/localStorageService';


const AddContactPerson = () => {
  const navigate = useNavigate()
  const {state} = useLocation();
  const userData = getUserData();

  useEffect(() =>{
    if(state){
      setFormData( prevState => ({
        ...prevState,
        ...state,
        employeeId: userData.id
      }))
    }
  }, [])
  const queryClient = useQueryClient();
  const contactPersonMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/contactPerson/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allContactPersons"])
      navigate(`/app/customer/${state.customerId}`)
    }
  })


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

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: "/customer"}).then( (res) => res.payload),
    onSuccess: () => console.log(customerQuery.data)
  })

  const listCustomerOptions = () =>{
    if(customerQuery?.data?.length){
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.id}>{customer.companyName}</option>
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
    contactPersonMutation.mutate()
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Contact Person</header>
        <p>Fill in Contact Person Information.</p>

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
            <button className="btn btnPurple m-0 px-5" disabled={contactPersonMutation.isLoading} onClick={handleSubmit}>{contactPersonMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={contactPersonMutation.isLoading} onClick={() => navigate(`/app/customer/${state.customerId}`)}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddContactPerson;