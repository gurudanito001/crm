
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { apiGet, apiPost, apiPut } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/spinner";


const EditCustomerVisitDetails = ({customerVisitScheduleData, customerVisitReportData, handleCancel}) => {
  const navigate = useNavigate();
  const [customerVisitSchedule, setCustomerVisitSchedule] = useState({
    employeeId: "",
    customerId: "",
    companyName: "",
    personToVisitId: "",
    personToVisitName: "",
    meetingDate: "",
    meetingTime: "",
    meetingVenue: "",
    meetingPurpose: ""
  });
  const [contactPersons, setContactPersons] = useState([]);
  const [apiUpdates, setApiUpdates] = useState({
    schedule: false,
    report: false
  })

  useEffect(()=>{
    setCustomerVisitSchedule( prevState =>({
      ...prevState,
      ...customerVisitScheduleData
    }))
  },[])

  const queryClient = useQueryClient();
  const customerVisitScheduleMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/customerVisit/${customerVisitScheduleData.id}`, data: customerVisitSchedule }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCustomerVisits"])
      setApiUpdates( prevState => ({
        ...prevState,
        schedule: true
      }))
    }
  })
  const customerVisitReportMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/customerVisitReport/${customerVisitReportData.id}`, data: customerVisitReport }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCustomerVisitReports"])
      setApiUpdates( prevState => ({
        ...prevState,
        report: true
      }))
    }
  })

  useEffect(()=>{
    if(apiUpdates.schedule && apiUpdates.report){
      handleCancel();
    }
  }, [apiUpdates])

  const [customerVisitReport, setCustomerVisitReport] = useState({
    customerVisitId: "",
    callType: "",
    status: "",
    productsDiscussed: [],
    price: "",
    quantity: "",
    durationOfMeeting: "",
    meetingOutcome: "",
    pfiRequest: false,
    nextVisitDate: "",
    nextVisitTime: ""
  })

  useEffect(()=>{
    setCustomerVisitReport( prevState =>({
      ...prevState,
      ...customerVisitReportData
    }))
  },[])

  useEffect(()=>{
    fetchContactPersons();
  }, [customerVisitSchedule.customerId])

  const fetchContactPersons = () =>{
    if(customerVisitSchedule.customerId){
      apiGet({url: `/contactPerson/customer/${customerVisitSchedule.customerId}`})
        .then(res =>{
          console.log(res.payload)
          setContactPersons(res.payload);
        })
        .catch(error =>{
          console.log(error)
        })
    }
  }

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: "/customer"}).then( (res) => {
      return res.payload
    }),
    onSuccess: () => console.log(customerQuery.data)
  })

  const productsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => apiGet({url: "/product"}).then( (res) => res.payload),
    onSuccess: () => console.log(productsQuery.data)
  })

  const listProducts = () =>{
    return productsQuery.data.map(product =>
      <option key={product.id} value={product.name}>{`${product.name}`}</option>
    )
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

  const handleCheck = () =>{
    setCustomerVisitReport( prevState => ({
      ...prevState,
      pfiRequest: !prevState.pfiRequest
    }))
  }

  const handleChangeCustomerVisit = (props) => (event) =>{
    setCustomerVisitSchedule(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))

    if(props === "customerId"){
      let address = getCustomerAddress(event.target.value)
      setCustomerVisitSchedule( prevState => ({
        ...prevState,
        meetingVenue: address
      }))
    }
  }

  const handleChangeCustomerVisitReport = (props) => (event) => {
    if (props === "productsDiscussed") {
      let productsDiscussed = customerVisitReport.productsDiscussed;
      if (!productsDiscussed.includes(event.target.value) && event.target.value !== "") {
        productsDiscussed.push(event.target.value)
        setCustomerVisitReport(prevState => ({
          ...prevState,
          productsDiscussed
        }));
      }
      return;
    }
    setCustomerVisitReport(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const listProductsDiscussed = () =>{
    if(customerVisitReport.productsDiscussed.length > 0){
      return customerVisitReport.productsDiscussed.map( (product) => <li key={product} className='m-2 d-flex align-items-start border p-3 rounded'>
        <span>{product}</span>
        <button onClick={()=>deleteParticipant(product)} style={{ width: "10px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-25px", left: "25px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>)
    }
  }

  const deleteParticipant = (prod) =>{
    let productsDiscussed = customerVisitReport.productsDiscussed;
    productsDiscussed = productsDiscussed.filter( item => item !== prod);
    setCustomerVisitReport( prevState => ({
      ...prevState,
      productsDiscussed
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    //return console.log({customerVisitSchedule, customerVisitReport})
    customerVisitScheduleMutation.mutate();
    customerVisitReportMutation.mutate();
    
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Customer Visit Details</header>
      <p>Make changes to Customer Visit Information.</p>

      <form className="mt-5">

      <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Customer / Company</label>
            <select className="form-select shadow-none" id="companyName" value={customerVisitSchedule.customerId} onChange={handleChangeCustomerVisit("customerId")} aria-label="Default select example">
              <option value="">Select Customer</option>
              {listCustomerOptions()}
            </select>          
          </div>

          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person</label>
            <select className="form-select shadow-none" id="contactPerson" value={customerVisitSchedule.personToVisitId} onChange={handleChangeCustomerVisit("personToVisitId")} aria-label="Default select example">
              <option value="">Select Contact Person</option>
              {listContactPersons()}
            </select>          
          </div>

          
          <div className="mb-3">
            <label htmlFor="meetingDate" className="form-label">Meeting Date and Time</label>
            <div className='d-flex align-items-center'>
              <input type="date" className="form-control shadow-none" id="meetingDate" value={customerVisitSchedule.meetingDate} onChange={handleChangeCustomerVisit("meetingDate")} placeholder="Enter Meeting Date" />
              <input type="time" className="form-control shadow-none ms-2" id="meetingTime" value={customerVisitSchedule.meetingTime} onChange={handleChangeCustomerVisit("meetingTime")} placeholder="Enter Meeting Time" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="meetingPurpose" className="form-label">Meeting Purpose</label>
            <input type="text" className="form-control shadow-none" id="meetingPurpose" value={customerVisitSchedule.meetingPurpose} onChange={handleChangeCustomerVisit("meetingPurpose")}  placeholder="Enter Meeting Purpose" />
          </div>

          <div className="mb-3">
            <label htmlFor="meetingVenue" className="form-label">Meeting Venue</label>
            <textarea className="form-control shadow-none" value={customerVisitSchedule.meetingVenue} onChange={handleChangeCustomerVisit("meetingVenue")} id="meetingVenue" rows={3}></textarea>
          </div>








         

          {customerVisitReport.id &&
          <>
          <div className="mb-3">
            <label htmlFor="callType" className="form-label">Call Type</label>
            <select className="form-select shadow-none" id="callType" value={customerVisitReport.callType} onChange={handleChangeCustomerVisitReport("callType")} aria-label="Default select example">
              <option value="">Select Call Type</option>
              <option value="telephone">Telephone</option>
              <option value="in-person">In-Person</option>
            </select>          
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="status" value={customerVisitReport.status} onChange={handleChangeCustomerVisitReport("status")} aria-label="Default select example">
                <option value="">Select Status Type</option>
                <option value="cold">Cold</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
                <option value="follow-up">Follow-Up</option>
                <option value="demo">Demo</option>
              </select> 
              <input type="text" className="form-control shadow-none ms-2" id="customStatus" value={customerVisitReport.status} onChange={handleChangeCustomerVisitReport("status")} placeholder="Enter Custom Status" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="productsDiscussed" className="form-label">Product Discussed</label>
            <select className="form-select shadow-none" id="productsDiscussed" multiple={true} value={customerVisitReport.productsDiscussed} onChange={handleChangeCustomerVisitReport("productsDiscussed")} aria-label="Default select example">
              <option value="">Select Product Discussed</option>
              {!productsQuery.isLoading && listProducts()}
            </select> 

            {customerVisitReport.productsDiscussed.length > 0 &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Products Discussed</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listProductsDiscussed()}</ul>
            </div>}
          </div>

          {/* <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="text" className="form-control shadow-none" id="meetingPurpose" value={`${formatAsCurrency(formData.price)}`} onChange={handleChange("price")}  placeholder="Enter Products Prices" />
          </div> */}

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control shadow-none" id="quantity" value={customerVisitReport.quantity} onChange={handleChangeCustomerVisitReport("quantity")}  placeholder="Enter Product Quantity" />
          </div>
          
          <div className="mb-3">
            <label htmlFor="durationOfMeeting" className="form-label">Duration Of Meeting</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="durationOfMeeting" value={customerVisitReport.durationOfMeeting} onChange={handleChangeCustomerVisitReport("durationOfMeeting")} aria-label="Default select example">
                <option value="">Select Meeting Duration</option>
                <option value="30">30mins</option>
                <option value="60">1hr</option>
                <option value="90">1hr 30mins</option>
                <option value="120">2hrs</option>
                <option value="150">2hrs 30mins</option>
                <option value="180">3hrs</option>
                <option value="210">3hrs 30mins</option>
                <option value="240">4hrs</option>
              </select> 
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="meetingOutcome" className="form-label">Meeting Outcome</label>
            <textarea className="form-control shadow-none" value={customerVisitReport.meetingOutcome} onChange={handleChangeCustomerVisitReport("meetingOutcome")} id="meetingOutcome" rows={3}></textarea>
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" checked={customerVisitReport.pfiRequest} onChange={handleCheck}  id="pfiRequest" />
            <label className="form-check-label fw-bold" htmlFor="pfiRequest" >
              Pfi Request
            </label>
          </div>

          <div className="mb-3">
            <label htmlFor="nextVisitDate" className="form-label">Next Visit Date and Time</label>
            <div className='d-flex align-items-center'>
              <input type="date" className="form-control shadow-none" id="nextVisitDate" value={customerVisitReport.nextVisitDate} onChange={handleChangeCustomerVisitReport("nextVisitDate")} />
              <input type="time" className="form-control shadow-none ms-2" id="nextVisitTime" value={customerVisitReport.nextVisitTime} onChange={handleChangeCustomerVisitReport("nextVisitTime")}  />
            </div>
          </div>

          </>}

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={customerVisitScheduleMutation.isLoading || customerVisitReportMutation.isLoading} onClick={handleSubmit}>{(customerVisitScheduleMutation.isLoading || customerVisitReportMutation.isLoading) ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </section>

  )
}

export default EditCustomerVisitDetails;