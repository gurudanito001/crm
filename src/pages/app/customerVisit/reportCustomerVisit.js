import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate, useLocation } from 'react-router-dom';
import { apiGet, apiPost } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';


const ReportCustomerVisit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {state} = useLocation();

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const customerVisitReportMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/customerVisitReport/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allCustomerVisit"])
      navigate("/app/visit/")
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

  const customerVisitQuery = useQuery({
    queryKey: ["allCustomerVisits"],
    queryFn: () => apiGet({url: "/customerVisit"})
    .then( (res) => res.payload)
    .catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const productsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => apiGet({url: "/product"})
    .then( (res) => res.payload)
    .catch( error =>{
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
      ...state
    }))
  }, [])


  const deleteParticipant = (prod) =>{
    let productsDiscussed = formData.productsDiscussed;
    productsDiscussed = productsDiscussed.filter( item => item !== prod);
    setFormData( prevState => ({
      ...prevState,
      productsDiscussed
    }))
  }

  const listProductsDiscussed = () =>{
    if(formData.productsDiscussed.length > 0){
      return formData.productsDiscussed.map( (product) => <li key={product} className='m-2 d-flex align-items-start border p-3 rounded'>
        <span>{product}</span>
        <button onClick={()=>deleteParticipant(product)} style={{ width: "10px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-25px", left: "25px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>)
    }
  }


  const getProductPrice = (productName) =>{
    let price = "";
    productsQuery.data.forEach( product =>{
      if( product.name === productName){
        price = product.price
      }
    })
    return price;
  }



  const listCustomerVisitOptions = () =>{
    if(customerVisitQuery?.data?.length){
      let customerVisits = customerVisitQuery.data.filter( (visit) => visit.visitReportId === null);
      return customerVisits.map(customerVisit =>
        <option key={customerVisit.id} value={customerVisit.id}>{`${customerVisit.personToVisitName} - ${customerVisit.companyName} on ${new Date(customerVisit.meetingDate).toDateString()}`}</option>
      )
    }
  }

  const listProducts = () =>{
    return productsQuery.data.map(product =>
      <option key={product.id} value={product.name}>{`${product.name}`}</option>
    )
  }

  const handleCheck = () =>{
    setFormData( prevState => ({
      ...prevState,
      pfiRequest: !prevState.pfiRequest
    }))
  }

  const handleChange = (props) => (event) => {
    if (props === "productsDiscussed") {
      let productsDiscussed = formData.productsDiscussed;
      if (!productsDiscussed.includes(event.target.value) && event.target.value !== "") {
        productsDiscussed.push(event.target.value)
        setFormData(prevState => ({
          ...prevState,
          productsDiscussed
        }));
      }
      return;
    }
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let errors = formValidator(["customerVisitId", "callType", "status", "productsDiscussed", "quantity", "durationOfMeeting", "meetingOutcome"], formData);
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
    customerVisitReportMutation.mutate();
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Report Customer Visit</header>
        <p>Report a Customer Visit.</p>
          <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Scheduled Customer Visit (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="customerVisitId" value={formData.customerVisitId} onChange={handleChange("customerVisitId")} aria-label="Default select example">
              <option value="">Select Scheduled Customer Visit</option>
              {listCustomerVisitOptions()}
            </select>   
            <span className='text-danger font-monospace small'>{errors.customerVisitId}</span>         
          </div>

          <div className="mb-3">
            <label htmlFor="callType" className="form-label">Call Type (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="callType" value={formData.callType} onChange={handleChange("callType")} aria-label="Default select example">
              <option value="">Select Call Type</option>
              <option value="telephone">Telephone</option>
              <option value="in-person">In-Person</option>
            </select> 
            <span className='text-danger font-monospace small'>{errors.callType}</span>           
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="status" value={formData.status} onChange={handleChange("status")} aria-label="Default select example">
                <option value="">Select Status Type</option>
                <option value="cold">Cold</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
                <option value="follow-up">Follow-Up</option>
                <option value="demo">Demo</option>
              </select> 
              <input type="text" className="form-control shadow-none ms-2" id="customStatus" value={formData.status} onChange={handleChange("status")} placeholder="Enter Custom Status" />
            </div>
            <span className='text-danger font-monospace small'>{errors.status}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="productsDiscussed" className="form-label">Product Discussed (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="productsDiscussed" multiple={true} value={formData.productsDiscussed} onChange={handleChange("productsDiscussed")} aria-label="Default select example">
              <option value="">Select Product Discussed</option>
              {!productsQuery.isLoading && listProducts()}
            </select> 
            <span className='text-danger font-monospace small'>{errors.productsDiscussed}</span>  

            {formData.productsDiscussed.length > 0 &&
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
            <label htmlFor="quantity" className="form-label">Quantity (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="number" className="form-control shadow-none" id="quantity" value={formData.quantity} onChange={handleChange("quantity")}  placeholder="Enter Product Quantity" />
            <span className='text-danger font-monospace small'>{errors.quantity}</span>  
          </div>
          
          <div className="mb-3">
            <label htmlFor="durationOfMeeting" className="form-label">Duration Of Meeting (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="durationOfMeeting" value={formData.durationOfMeeting} onChange={handleChange("durationOfMeeting")} aria-label="Default select example">
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
            <span className='text-danger font-monospace small'>{errors.durationOfMeeting}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="meetingOutcome" className="form-label">Meeting Outcome (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.meetingOutcome} onChange={handleChange("meetingOutcome")} id="meetingOutcome" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.meetingOutcome}</span>  
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" checked={formData.pfiRequest} onChange={handleCheck}  id="pfiRequest" />
            <label className="form-check-label fw-bold" htmlFor="pfiRequest" >
              Pfi Request
            </label>
          </div>

          <div className="mb-3">
            <label htmlFor="nextVisitDate" className="form-label">Next Visit Date and Time</label>
            <div className='d-flex align-items-center'>
              <input type="date" className="form-control shadow-none" id="nextVisitDate" value={formData.nextVisitDate} onChange={handleChange("nextVisitDate")} />
              <input type="time" className="form-control shadow-none ms-2" id="nextVisitTime" value={formData.nextVisitTime} onChange={handleChange("nextVisitTime")}  />
            </div>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={customerVisitReportMutation.isLoading} onClick={handleSubmit}>{customerVisitReportMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/visit")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default ReportCustomerVisit;