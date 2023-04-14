import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { getUserData } from '../../../services/localStorageService';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';


const ScheduleCustomerVisit = () => {
  const dispatch = useDispatch();
  const userData = getUserData();
  const navigate = useNavigate();
  const [contactPersons, setContactPersons] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    customerId: "",
    companyName: "",
    personToVisitId: "",
    personToVisitName: "",
    meetingDate: "",
    meetingTime: "",
    meetingVenue: "",
    meetingPurpose: ""
  })

  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const customerVisitMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/customerVisit/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allCustomerVisits"])
      navigate("/app/visit")
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

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: `/customer/employee/${userData.id}`}).then( (res) => {
      return res.payload
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

  useEffect(()=>{
    setFormData( prevState => ({
      ...prevState,
      employeeId: userData.id
    }))
  }, [])

  const fetchContactPersons = () =>{
    if(formData.customerId){
      apiGet({url: `/contactPerson/customer/${formData.customerId}`})
        .then(res =>{
          console.log(res.payload)
          setContactPersons(res.payload);
        })
        .catch(error =>{
          console.log(error)
          dispatch(
            setMessage({
              severity: "error",
              message: error.message,
              key: Date.now(),
            })
          );
        })
    }
  }

  useEffect(()=>{
    fetchContactPersons();
  }, [formData.customerId])

  useEffect(()=>{
    if(formData.customerId){
      customerQuery.data.forEach( customer =>{
        if(customer.id === formData.customerId){
          setFormData( prevState=>({
            ...prevState,
            companyName: customer.companyName
          }))
        }
      })
    }
    if(formData.personToVisitId){
      contactPersons.forEach( person =>{
        if(person.id === formData.personToVisitId){
          let name = `${person.firstName} ${person.lastName}`;
          setFormData( prevState =>({
            ...prevState,
            personToVisitName: name
          }))
        }
      })
    }
  },[formData.customerId, formData.personToVisitId])

  const listCustomerOptions = () =>{
    if(customerQuery?.data?.length){
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.id}>{customer.companyName}</option>
      )
    }
  }

  const listContactPersons = () =>{
    if(contactPersons.length){
      return contactPersons.map(person =>
        <option key={person.id} value={person.id}>{`${person.firstName} ${person.lastName}`}</option>
      )
    }
  }

  const getCustomerAddress = (customerId) =>{
    let address = ""
    customerQuery.data.forEach( customer => {
      if(customerId === customer.id){
        address = customer.address1
      }
    })
    return address;
  }

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [props]: ""
    }))

    if(props === "customerId"){
      let address = getCustomerAddress(event.target.value)
      setFormData( prevState => ({
        ...prevState,
        meetingVenue: address
      }))
    }
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let errors = formValidator(["customerId", "personToVisitId", "meetingTime", "meetingDate", "meetingPurpose", "meetingVenue"], formData);
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
    // return console.log(formData)
    customerVisitMutation.mutate();
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Schedule Customer Visit</header>
        <p>Schedule a Customer Visit.</p>
          <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Customer / Company (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="companyName" value={formData.customerId} onChange={handleChange("customerId")} aria-label="Default select example">
              <option value="">Select Customer</option>
              {listCustomerOptions()}
            </select>      
            <span className='text-danger font-monospace small'>{errors.customerId}</span>    
          </div>

          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="contactPerson" value={formData.personToVisitId} onChange={handleChange("personToVisitId")} aria-label="Default select example">
              <option value="">Select Contact Person</option>
              {listContactPersons()}
            </select>     
            <span className='text-danger font-monospace small'>{errors.personToVisitId}</span>     
          </div>

          
          <div className="mb-3">
            <label htmlFor="meetingDate" className="form-label">Meeting Date and Time (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <input type="date" className="form-control shadow-none" id="meetingDate" value={formData.meetingDate} onChange={handleChange("meetingDate")} placeholder="Enter Meeting Date" />
              <input type="time" className="form-control shadow-none ms-2" id="meetingTime" value={formData.meetingTime} onChange={handleChange("meetingTime")} placeholder="Enter Meeting Time" />
            </div>
            <span className='text-danger font-monospace small'>{errors.meetingDate}  {errors.meetingTime} </span>
          </div>

          <div className="mb-3">
            <label htmlFor="meetingPurpose" className="form-label">Meeting Purpose (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" id="meetingPurpose" value={formData.meetingPurpose} onChange={handleChange("meetingPurpose")}  placeholder="Enter Meeting Purpose" />
            <span className='text-danger font-monospace small'>{errors.meetingPurpose}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="meetingVenue" className="form-label">Meeting Venue (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.meetingVenue} onChange={handleChange("meetingVenue")} id="meetingVenue" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.meetingVenue}</span>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={customerVisitMutation.isLoading} onClick={handleSubmit}>{customerVisitMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/visit")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default ScheduleCustomerVisit;