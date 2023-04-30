import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet, apiPut } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import formatAsCurrency from '../../../services/formatAsCurrency';


const EditSalesInvoice = ({data, handleCancel}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    invoiceRequestId: "",
    employeeId: "",
    customerId: "",
    pdfUrl: "",
    description: ""
  })

  const [errors, setErrors] = useState({});

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      ...data,
      pdfUrl: ""
    }))
  }, [])

  const queryClient = useQueryClient();
  const salesInvoiceMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/salesInvoice/${data.id}`, data: formData })
    .then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allSalesInvoices"])
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

  const getCustomerAndEmployeeId = (invoiceRequestId) => {
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
    // return console.log(formData)
    let errors = formValidator(["employeeId", "customerId", "invoiceRequestId"], formData);
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
    salesInvoiceMutation.mutate();
    // return console.log(formData)
    
  }

  return (
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Edit Sales Invoice </header>
        <p>Edit Sales Invoice Information.</p>
          <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="invoiceRequestId" className="form-label">Invoice Request (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="invoiceRequestId" value={formData.invoiceRequestId} onChange={handleChange("invoiceRequestId")} aria-label="Default select example">
              <option value="">Select Invoice Request</option>
              {!invoiceRequestQuery.isLoading && listInvoiceRequestOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.invoiceRequestFormId}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="pdfUrl" className="form-label">Sales Invoice Pdf (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="file" className="form-control shadow-none" value={formData.pdfUrl} onChange={handleChange("pdfUrl")} id="pdfUrl" />
            <span className='text-danger font-monospace small'>{errors.pdfUrl}</span> 
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.description} onChange={handleChange("description")} id="description" rows={4}></textarea>
          </div>

          
          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={salesInvoiceMutation.isLoading} onClick={handleSubmit}>{salesInvoiceMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/salesInvoice")}>Cancel</button>
          </div>
        </form>
      </section>
  )
}

export default EditSalesInvoice;