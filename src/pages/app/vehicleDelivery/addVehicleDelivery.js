import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';

import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';


const AddVehicleDelivery = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const queryClient = useQueryClient();
  const vehicleDeliveryMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/vehicleDelivery/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allPfiRequests"])
      navigate(`/app/delivery`)
    }
  })

  const handleChange = (prop) => (event) =>{
    setFormData( prevState =>({
      ...prevState,
      [prop]: event.target.value
    }))
  } 

  const handleSubmit = (event) =>{
    event.preventDefault();
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
            <label htmlFor="customerName" className="form-label">Customer Name</label>
            <input type="text" className="form-control shadow-none" value={formData.customerName} onChange={handleChange("customerName")}  id="customerName" placeholder="Customer Name" />
          </div>
          
          <div className="mb-3">
            <label htmlFor="customerAddress" className="form-label">Customer Address</label>
            <textarea className="form-control shadow-none" value={formData.customerAddress} onChange={handleChange("customerAddress")} id="customerAddress" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="invoiceNumber" className="form-label">Invoice Number</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceNumber} onChange={handleChange("invoiceNumber")} id="invoiceNumber" placeholder="Invoice Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryNoteNumber" className="form-label">Delivery Note Number</label>
            <input type="text" className="form-control shadow-none" value={formData.deliveryNoteNumber} onChange={handleChange("deliveryNoteNumber")}  id="deliveryNoteNumber" placeholder="Delivery Note Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="chasisNumbers" className="form-label">Chasis Number</label>
            <input type="text" className="form-control shadow-none" value={formData.chasisNumbers} onChange={handleChange("chasisNumbers")}  id="chasisNumbers" placeholder="Chasis Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="bodyBuilding" className="form-label">Body Building</label>
            <input type="text" className="form-control shadow-none" value={formData.bodyBuilding} onChange={handleChange("bodyBuilding")}  id="bodyBuilding" placeholder="Body Building" />
          </div>
          <div className="mb-3">
            <label htmlFor="totalOrderQuantity" className="form-label">Total Order Quantity</label>
            <input type="text" className="form-control shadow-none" value={formData.totalOrderQuantity} onChange={handleChange("totalOrderQuantity")}  id="totalOrderQuantity" placeholder="Total Order Quantity" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantityDelivered" className="form-label">Quantity Delivered</label>
            <input type="text" className="form-control shadow-none" value={formData.quantityDelivered} onChange={handleChange("quantityDelivered")}  id="quantityDelivered" placeholder="Quantity Delivered" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantityPending" className="form-label">Quantity Pending</label>
            <input type="text" className="form-control shadow-none" value={formData.quantityPending} onChange={handleChange("quantityPending")}  id="quantityPending" placeholder="Quantity Pending" />
          </div>
          <div className="mb-3">
            <label htmlFor="nameOfDriver" className="form-label">Name of Driver</label>
            <input type="text" className="form-control shadow-none" value={formData.nameOfDriver} onChange={handleChange("nameOfDriver")}  id="nameOfDriver" placeholder="Name of Driver" />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleRecipientName" className="form-label">Vehicle Recipient Name</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleRecipientName} onChange={handleChange("vehicleRecipientName")}  id="vehicleRecipientName" placeholder="Vehicle Recipient Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleRecipientPhone" className="form-label">Vehicle Recipient Phone</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleRecipientPhone} onChange={handleChange("vehicleRecipientPhone")}  id="vehicleRecipientPhone" placeholder="Vehicle Recipient Phone" />
          </div>
          <div className="mb-3">
            <label htmlFor="receiverRelationshipWithBuyer" className="form-label">Reciever's Relationship with Buyer</label>
            <input type="text" className="form-control shadow-none" value={formData.receiverRelationshipWithBuyer} onChange={handleChange("receiverRelationshipWithBuyer")}  id="receiverRelationshipWithBuyer" placeholder="Reciever's Relationship with Buyer" />
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