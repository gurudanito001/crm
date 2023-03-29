import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';


const AddPayment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const queryClient = useQueryClient();
  const paymentMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/payment/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allPayments"])
      navigate("/app/payment")
    }
  })

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    // return console.log(formData)
    paymentMutation.mutate();
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Payment </header>
        <p>Fill in Payment Information.</p>
          <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="invoiceNumber" className="form-label">Invoice Number</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceNumber} onChange={handleChange("invoiceNumber")} id="invoiceNumber" placeholder="Invoice Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="invoiceDate" className="form-label">Invoice Date</label>
            <input type="date" className="form-control shadow-none" value={formData.invoiceDate} onChange={handleChange("invoiceDate")} id="invoiceDate" placeholder="Invoice Date" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryDate" className="form-label">Delivery Date</label>
            <input type="date" className="form-control shadow-none" value={formData.deliveryDate} onChange={handleChange("deliveryDate")} id="deliveryDate" placeholder="Delivery Date" />
          </div>
          <div className="mb-3">
            <label htmlFor="nameOfCustomer" className="form-label">Name Of Customer</label>
            <input type="text" className="form-control shadow-none" value={formData.nameOfCustomer} onChange={handleChange("nameOfCustomer")} id="nameOfCustomer" placeholder="Name Of Customer" />
          </div>
          <div className="mb-3">
            <label htmlFor="customerAddress" className="form-label">Customer Address</label>
            <textarea className="form-control shadow-none" value={formData.customerAddress} onChange={handleChange("customerAddress")} id="customerAddress" rows={3}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="modelOfVehiclePurchased" className="form-label">Model of Vehicle Purchased</label>
            <input type="text" className="form-control shadow-none" value={formData.modelOfVehiclePurchased} onChange={handleChange("modelOfVehiclePurchased")} id="modelOfVehiclePurchased" placeholder="Model of Vehicle Purchased" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantityPurchased" className="form-label">Quantity Purchased</label>
            <input type="number" className="form-control shadow-none" value={formData.quantityPurchased} onChange={handleChange("quantityPurchased")} id="quantityPurchased" placeholder="Quantity Purchased" />
          </div>
          <div className="mb-3">
            <label htmlFor="advancePaymentReceived" className="form-label">Advance Payment Received</label>
            <input type="number" className="form-control shadow-none" value={formData.advancePaymentReceived} onChange={handleChange("advancePaymentReceived")} id="advancePaymentReceived" placeholder="Advance Payment Received" />
          </div>
          <div className="mb-3">
            <label htmlFor="outstandingAmount" className="form-label">Outstanding Amount</label>
            <input type="number" className="form-control shadow-none" value={formData.outstandingAmount} onChange={handleChange("outstandingAmount")} id="outstandingAmount" placeholder="Outstanding Amount" />
          </div>
          <div className="mb-3">
            <label htmlFor="vatDeducted" className="form-label">VAT Deducted</label>
            <input type="number" className="form-control shadow-none" value={formData.vatDeducted} onChange={handleChange("vatDeducted")} id="vatDeducted" placeholder="VAT Amount Deducted" />
          </div>
          <div className="mb-3">
            <label htmlFor="whtDeducted" className="form-label">WHT Deducted</label>
            <input type="number" className="form-control shadow-none" value={formData.whtDeducted} onChange={handleChange("whtDeducted")} id="whtDeducted" placeholder="WHT Amount Deducted" />
          </div>
          <div className="mb-3">
            <label htmlFor="vatPaymentReceipt" className="form-label">VAT Payment Received</label>
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