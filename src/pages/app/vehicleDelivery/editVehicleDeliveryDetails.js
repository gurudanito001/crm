
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';

import { apiPost, apiPut } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';



const EditVehicleDeliveryDetails = ({ data, handleCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
  }, [])

  const queryClient = useQueryClient();
  const vehicleDeliveryDetailsMutation = useMutation({
    mutationFn: () => apiPut({ url: `/vehicleDelivery/${data.id}`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allVehicleDeliveries"])
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

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [prop]: ""
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    //return console.log(formData)
    vehicleDeliveryDetailsMutation.mutate()
  }


  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Vehicle Delivery Details</header>
      <p>Make changes to Vehicle Delivery Information.</p>

      <form className="mt-5">
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">Customer Name (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.customerName} onChange={handleChange("customerName")} id="customerName" placeholder="Customer Name" />
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
          <input type="text" className="form-control shadow-none" value={formData.deliveryNoteNumber} onChange={handleChange("deliveryNoteNumber")} id="deliveryNoteNumber" placeholder="Delivery Note Number" />
          <span className='text-danger font-monospace small'>{errors.deliveryNoteNumber}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="chasisNumbers" className="form-label">Chasis Number (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.chasisNumbers} onChange={handleChange("chasisNumbers")} id="chasisNumbers" placeholder="Chasis Number" />
          <span className='text-danger font-monospace small'>{errors.chasisNumbers}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="bodyBuilding" className="form-label">Body Building (Body Type) </label>
          <input type="text" className="form-control shadow-none" value={formData.bodyBuilding} onChange={handleChange("bodyBuilding")} id="bodyBuilding" placeholder="Body Building" />
        </div>
        <div className="mb-3">
          <label htmlFor="totalOrderQuantity" className="form-label">Total Order Quantity ( Number of quantity delivered) (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.totalOrderQuantity} onChange={handleChange("totalOrderQuantity")} id="totalOrderQuantity" placeholder="Total Order Quantity" />
          <span className='text-danger font-monospace small'>{errors.totalOrderQuantity}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="quantityDelivered" className="form-label">Quantity Delivered (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.quantityDelivered} onChange={handleChange("quantityDelivered")} id="quantityDelivered" placeholder="Quantity Delivered" />
          <span className='text-danger font-monospace small'>{errors.quantityDelivered}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="quantityPending" className="form-label">Quantity Pending (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.quantityPending} onChange={handleChange("quantityPending")} id="quantityPending" placeholder="Quantity Pending" />
          <span className='text-danger font-monospace small'>{errors.quantityPending}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="nameOfDriver" className="form-label">Name of driver /Location  (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.nameOfDriver} onChange={handleChange("nameOfDriver")} id="nameOfDriver" placeholder="Name of Driver" />
          <span className='text-danger font-monospace small'>{errors.nameOfDriver}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="vehicleRecipientName" className="form-label">Vehicle received By Perosn - Name  (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.vehicleRecipientName} onChange={handleChange("vehicleRecipientName")} id="vehicleRecipientName" placeholder="Vehicle Recipient Name" />
          <span className='text-danger font-monospace small'>{errors.vehicleRecipientName}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="vehicleRecipientPhone" className="form-label">Vehicle received By Perosn - Telephone no. (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.vehicleRecipientPhone} onChange={handleChange("vehicleRecipientPhone")} id="vehicleRecipientPhone" placeholder="Vehicle Recipient Phone" />
          <span className='text-danger font-monospace small'>{errors.vehicleRecipientPhone}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="receiverRelationshipWithBuyer" className="form-label">Reciever's Relationship with Buyer (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" className="form-control shadow-none" value={formData.receiverRelationshipWithBuyer} onChange={handleChange("receiverRelationshipWithBuyer")} id="receiverRelationshipWithBuyer" placeholder="Reciever's Relationship with Buyer" />
          <span className='text-danger font-monospace small'>{errors.receiverRelationshipWithBuyer}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="additionalInformation" className="form-label">Additional Information</label>
          <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="additionalInformation" rows={3}></textarea>
        </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={vehicleDeliveryDetailsMutation.isLoading} onClick={handleSubmit}>{vehicleDeliveryDetailsMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={handleCancel}>Cancel</button>
        </div>

      </form>
    </section>

  )
}

export default EditVehicleDeliveryDetails;