import { useState, useEffect } from "react";
import { apiPut, apiDelete, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import NaijaStates from 'naija-state-local-government';
import industries from 'industries';
import { Spinner } from '../../../components/spinner';
import formValidator from "../../../services/validation";
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';

const EditContactPersonDetails = ({ data, handleCancel }) => {
  const dispatch = useDispatch();

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

  const [errors, setErrors] = useState({})

  const queryClient = useQueryClient();
  const contactPersonDetailsMutation = useMutation({
    mutationFn: () => apiPut({ url: `/contactPerson/${data.id}`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allContactPersons"])
      handleCancel()
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
  useEffect(() => {
    console.log(data)
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
  }, [])


  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({ url: "/customer" })
    .then((res) => res.payload)
    .catch(error => {
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
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
    setErrors(prevState => ({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errors = formValidator(["customerId", "firstName", "lastName", "phoneNumber1"], formData);
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
          <span className='text-danger font-monospace small'>{errors.customerId}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" onChange={handleChange("firstName")} value={formData.firstName} className="form-control shadow-none" id="firstName" placeholder="Contact Person First Name" />
          <span className='text-danger font-monospace small'>{errors.firstName}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" onChange={handleChange("lastName")} value={formData.lastName} className="form-control shadow-none" id="lastName" placeholder="Contact Person Last Name" />
          <span className='text-danger font-monospace small'>{errors.lastName}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="email" placeholder="Contact Person Email" />
          <span className='text-danger font-monospace small'>{errors.email}</span>
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
          <span className='text-danger font-monospace small'>{errors.phoneNumber1}</span>
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