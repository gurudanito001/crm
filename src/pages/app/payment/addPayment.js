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


const AddPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    invoiceRequestFormId: "",
    employeeId: "",
    customerId: "",
    invoiceNumber: "",
    invoiceDate: "",
    deliveryDate: "",
    nameOfCustomer: "",
    customerAddress: "",
    modelOfVehiclePurchased: "",
    quantityPurchased: "",
    advancePaymentReceived: "",
    outstandingAmount: "",
    vatDeducted: "",
    whtDeducted: "",
    vatPaymentReceipt: "",
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
  const paymentMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/payment/create`, data: formData })
    .then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allPayments"])
      navigate("/app/payment")
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
        customerId = invoiceRequest.customerId
        employeeId = invoiceRequest.employeeId
      }
    })
    return {customerId, employeeId};
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
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    //return console.log(formData)
    let errors = formValidator(["invoiceDate", "deliveryDate", "invoiceNumber", "nameOfCustomer", "customerAddress", "modelOfVehiclePurchased", "quantityPurchased", "invoiceRequestFormId"], formData);
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
    paymentMutation.mutate();
    // return console.log(formData)
    
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Payment </header>
        <p>Fill in Payment Information.</p>
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
            <label htmlFor="invoiceNumber" className="form-label">Invoice Number (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceNumber} onChange={handleChange("invoiceNumber")} id="invoiceNumber" placeholder="Invoice Number" />
            <span className='text-danger font-monospace small'>{errors.invoiceNumber}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="invoiceDate" className="form-label">Invoice Date (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="date" className="form-control shadow-none" value={formData.invoiceDate} onChange={handleChange("invoiceDate")} id="invoiceDate" placeholder="Invoice Date" />
            <span className='text-danger font-monospace small'>{errors.invoiceDate}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryDate" className="form-label">Delivery Date (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="date" className="form-control shadow-none" value={formData.deliveryDate} onChange={handleChange("deliveryDate")} id="deliveryDate" placeholder="Delivery Date" />
            <span className='text-danger font-monospace small'>{errors.deliveryDate}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="nameOfCustomer" className="form-label">Name Of Customer (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.nameOfCustomer} onChange={handleChange("nameOfCustomer")} id="nameOfCustomer" placeholder="Name Of Customer" />
            <span className='text-danger font-monospace small'>{errors.nameOfCustomer}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="customerAddress" className="form-label">Customer Location / Address (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.customerAddress} onChange={handleChange("customerAddress")} id="customerAddress" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.customerAddress}</span> 
          </div>

          <div className="mb-3">
            <label htmlFor="modelOfVehiclePurchased" className="form-label">Model of Vehicle Purchased (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.modelOfVehiclePurchased} onChange={handleChange("modelOfVehiclePurchased")} id="modelOfVehiclePurchased" placeholder="Model of Vehicle Purchased" />
            <span className='text-danger font-monospace small'>{errors.modelOfVehiclePurchased}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="quantityPurchased" className="form-label">Quantity ( Number of quantity purchased) (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="number" className="form-control shadow-none" value={formData.quantityPurchased} onChange={handleChange("quantityPurchased")} id="quantityPurchased" placeholder="Quantity Purchased" />
            <span className='text-danger font-monospace small'>{errors.quantityPurchased}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="advancePaymentReceived" className="form-label">Advance/ payment received <span className='fw-bold'>{formatAsCurrency(formData.advancePaymentReceived)}</span></label>
            <input type="number" className="form-control shadow-none" value={formData.advancePaymentReceived} onChange={handleChange("advancePaymentReceived")} id="advancePaymentReceived" placeholder="Advance Payment Received" />
          </div>
          <div className="mb-3">
            <label htmlFor="outstandingAmount" className="form-label">Outstanding Amount <span className='fw-bold'>{formatAsCurrency(formData.outstandingAmount)}</span></label>
            <input type="number" className="form-control shadow-none" value={formData.outstandingAmount} onChange={handleChange("outstandingAmount")} id="outstandingAmount" placeholder="Outstanding Amount" />
          </div>
          <div className="mb-3">
            <label htmlFor="vatDeducted" className="form-label">VAT Deduction ( Amount) <span className='fw-bold'>{formatAsCurrency(formData.vatDeducted)}</span></label>
            <input type="number" className="form-control shadow-none" value={formData.vatDeducted} onChange={handleChange("vatDeducted")} id="vatDeducted" placeholder="VAT Amount Deducted" />
          </div>
          <div className="mb-3">
            <label htmlFor="whtDeducted" className="form-label">WHT Deduction ( Amount)  <span className='fw-bold'>{formatAsCurrency(formData.whtDeducted)}</span></label>
            <input type="number" className="form-control shadow-none" value={formData.whtDeducted} onChange={handleChange("whtDeducted")} id="whtDeducted" placeholder="WHT Amount Deducted" />
          </div>
          <div className="mb-3">
            <label htmlFor="vatPaymentReceipt" className="form-label">VAT payment recepit /schedule status</label>
            <input type="text" className="form-control shadow-none" value={formData.vatPaymentReceipt} onChange={handleChange("vatPaymentReceipt")} id="vatPaymentReceipt" placeholder="PAID, NOT PAID, REQUESTED" />
          </div>
          <div className="mb-3">
            <label htmlFor="additionalInformation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="additionalInformation" rows={3}></textarea>
          </div>

          
          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={paymentMutation.isLoading} onClick={handleSubmit}>{paymentMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/payment")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddPayment;