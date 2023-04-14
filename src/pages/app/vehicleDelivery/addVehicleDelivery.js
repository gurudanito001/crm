import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { getUserData } from '../../../services/localStorageService';


const AddVehicleDelivery = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    invoiceRequestFormId: "",
    employeeId: "",
    customerId: "",
    customerName: "",
    customerAddress: "",
    invoiceNumber: "",
    deliveryNoteNumber: "",
    chasisNumbers: "",
    bodyBuilding: "",
    totalOrderQuantity: "",
    quantityDelivered: "",
    quantityPending: "",
    nameOfDriver: "",
    vehicleRecipientName: "",
    vehicleRecipientPhone: "",
    receiverRelationshipWithBuyer: "",
    additionalInformation: ""
  })
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    if(formData.invoiceRequestFormId){
      let data =  getCustomerId(formData.invoiceRequestFormId)
      setFormData( prevState =>({
        ...prevState,
        ...data
      }))
    }
  }, [formData.invoiceRequestFormId])

  const queryClient = useQueryClient();
  const vehicleDeliveryMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/vehicleDelivery/create`, data: formData })
    .then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allPfiRequests"])
      navigate(`/app/delivery`)
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

  const invoiceRequestQuery = useQuery({
    queryKey: ["allInvoiceRequests"],
    queryFn: () => apiGet({url: `/invoiceRequestForm`})
    .then( res => res.payload)
    .catch( error => {
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const listInvoiceRequestOptions = () =>{
    if(invoiceRequestQuery?.data?.length){
      return invoiceRequestQuery.data.map(invoiceRequest =>
        <option key={invoiceRequest.id} value={invoiceRequest.id }>{invoiceRequest.invoiceName} buying {invoiceRequest.quantity}  {invoiceRequest.vehicleBrand} for {formatAsCurrency(invoiceRequest.totalInvoiceValuePerVehicle)} Each</option>
      )
    }
  }

  const getCustomerId = (invoiceRequestId) => {
    let customerId, employeeId;
    invoiceRequestQuery?.data?.forEach( invoiceRequest =>{
      if(invoiceRequest.id === invoiceRequestId){
        customerId = invoiceRequest.customerId;
        employeeId = invoiceRequest.employeeId
      }
    })
    return {customerId, employeeId};
  }

  const handleChange = (prop) => (event) =>{
    setFormData( prevState =>({
      ...prevState,
      [prop]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [prop]: ""
    }))
  } 

  const handleSubmit = (event) =>{
    event.preventDefault();
    //return console.log(formData)
    let errors = formValidator(["customerName", "customerAddress", "invoiceNumber", "deliveryNoteNumber", "chasisNumbers", "totalOrderQuantity", "quantityDelivered", "quantityPending", "nameOfDriver", "vehicleRecipientName", "vehicleRecipientPhone", "receiverRelationshipWithBuyer", "invoiceRequestFormId"], formData);
    console.log(errors)
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
    vehicleDeliveryMutation.mutate()
  } 

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Vehicle Delivery</header>
        <p>Fill in Vehicle Delivery Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="invoiceRequestFormId" className="form-label">Invoice Request (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="invoiceRequestFormId" value={formData.invoiceRequestFormId} onChange={handleChange("invoiceRequestFormId")} aria-label="Default select example">
              <option value="">Select Invoice Request</option>
              {!invoiceRequestQuery.isLoading && listInvoiceRequestOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.invoiceRequestFormId}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="customerName" className="form-label">Customer Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.customerName} onChange={handleChange("customerName")}  id="customerName" placeholder="Customer Name" />
            <span className='text-danger font-monospace small'>{errors.customerName}</span>  
          </div>
          
          <div className="mb-3">
            <label htmlFor="customerAddress" className="form-label">Customer Location / Address (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.customerAddress} onChange={handleChange("customerAddress")} id="customerAddress" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.customerAddress}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="invoiceNumber" className="form-label">Invoice Number (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceNumber} onChange={handleChange("invoiceNumber")} id="invoiceNumber" placeholder="Invoice Number" />
            <span className='text-danger font-monospace small'>{errors.invoiceNumber}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryNoteNumber" className="form-label">Delivery Note Number (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.deliveryNoteNumber} onChange={handleChange("deliveryNoteNumber")}  id="deliveryNoteNumber" placeholder="Delivery Note Number" />
            <span className='text-danger font-monospace small'>{errors.deliveryNoteNumber}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="chasisNumbers" className="form-label">Chasis Number (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.chasisNumbers} onChange={handleChange("chasisNumbers")}  id="chasisNumbers" placeholder="Chasis Number" />
            <span className='text-danger font-monospace small'>{errors.chasisNumbers}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="bodyBuilding" className="form-label">Body Building (Body Type) </label>
            <input type="text" className="form-control shadow-none" value={formData.bodyBuilding} onChange={handleChange("bodyBuilding")}  id="bodyBuilding" placeholder="Body Building" />
          </div>
          <div className="mb-3">
            <label htmlFor="totalOrderQuantity" className="form-label">Total Order Quantity ( Number of quantity delivered) (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.totalOrderQuantity} onChange={handleChange("totalOrderQuantity")}  id="totalOrderQuantity" placeholder="Total Order Quantity" />
            <span className='text-danger font-monospace small'>{errors.totalOrderQuantity}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="quantityDelivered" className="form-label">Quantity Delivered (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.quantityDelivered} onChange={handleChange("quantityDelivered")}  id="quantityDelivered" placeholder="Quantity Delivered" />
            <span className='text-danger font-monospace small'>{errors.quantityDelivered}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="quantityPending" className="form-label">Quantity Pending (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.quantityPending} onChange={handleChange("quantityPending")}  id="quantityPending" placeholder="Quantity Pending" />
            <span className='text-danger font-monospace small'>{errors.quantityPending}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="nameOfDriver" className="form-label">Name of driver /Location  (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.nameOfDriver} onChange={handleChange("nameOfDriver")}  id="nameOfDriver" placeholder="Name of Driver" />
            <span className='text-danger font-monospace small'>{errors.nameOfDriver}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleRecipientName" className="form-label">Vehicle received By Perosn - Name  (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleRecipientName} onChange={handleChange("vehicleRecipientName")}  id="vehicleRecipientName" placeholder="Vehicle Recipient Name" />
            <span className='text-danger font-monospace small'>{errors.vehicleRecipientName}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleRecipientPhone" className="form-label">Vehicle received By Perosn - Telephone no. (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleRecipientPhone} onChange={handleChange("vehicleRecipientPhone")}  id="vehicleRecipientPhone" placeholder="Vehicle Recipient Phone" />
            <span className='text-danger font-monospace small'>{errors.vehicleRecipientPhone}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="receiverRelationshipWithBuyer" className="form-label">Reciever's Relationship with Buyer (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.receiverRelationshipWithBuyer} onChange={handleChange("receiverRelationshipWithBuyer")}  id="receiverRelationshipWithBuyer" placeholder="Reciever's Relationship with Buyer" />
            <span className='text-danger font-monospace small'>{errors.receiverRelationshipWithBuyer}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="additionalInformation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")}  id="additionalInformation" rows={3}></textarea>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={vehicleDeliveryMutation.isLoading} onClick={handleSubmit}>{vehicleDeliveryMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/delivery")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddVehicleDelivery;