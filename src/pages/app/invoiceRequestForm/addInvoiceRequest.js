import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


const AddInvoiceRequest = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Invoice Request </header>
        <p>Fill in Invoice Request Information.</p>
        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="invoiceName" className="form-label">Invoice Name</label>
            <input type="text" className="form-control shadow-none" id="invoiceName" placeholder="Invoice Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress1" className="form-label">Address 1</label>
            <textarea className="form-control shadow-none" id="companyAddress1" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress2" className="form-label">Address 2</label>
            <textarea className="form-control shadow-none" id="companyAddress2" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person</label>
            <input type="text" className="form-control shadow-none" id="contactPerson" placeholder="Contact Person" />
          </div>
          <div className="mb-3">
            <label htmlFor="officePhoneNumber" className="form-label">Contact Office Telephone</label>
            <input type="text" className="form-control shadow-none" id="officePhoneNumber" placeholder="Office Phone Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="emailAddress" className="form-label">Email Address</label>
            <input type="text" className="form-control shadow-none" id="emailAddress" placeholder="Email Address" />
          </div>
          <div className="mb-3">
            <label htmlFor="salesThrough" className="form-label">Sales Through</label>
            <input type="text" className="form-control shadow-none" id="salesThrough" placeholder="Sales Through" />
          </div>
          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <input type="text" className="form-control shadow-none" id="industry" placeholder="Industry" />
          </div>
          <div className="mb-3">
            <label htmlFor="businessType" className="form-label">Business Type</label>
            <input type="text" className="form-control shadow-none" id="businessType" placeholder="Business Type" />
          </div>
          <div className="mb-3">
            <label htmlFor="kycId" className="form-label">KYC Id</label>
            <input type="text" className="form-control shadow-none" id="kycId" placeholder="KYC Id" />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleDetails" className="form-label">Vehicle Details</label>
            <input type="text" className="form-control shadow-none" id="vehicleDetails" placeholder="Vehicle Details" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control shadow-none" id="quantity" placeholder="Quantity of Products" />
          </div>
          <div className="mb-3">
            <label htmlFor="colour" className="form-label">Colour</label>
            <input type="text" className="form-control shadow-none" id="colour" placeholder="Colour" />
          </div>
          <div className="mb-3">
            <label htmlFor="totalInvoiceValuePerVehicle" className="form-label">Total Invoice Value Per Vehicle</label>
            <input type="text" className="form-control shadow-none" id="totalInvoiceValuePerVehicle" placeholder="Value for each vehicle" />
          </div>
          <div className="mb-3">
            <label htmlFor="typeOfBodyBuilding" className="form-label">Type of Body Building</label>
            <input type="text" className="form-control shadow-none" id="typeOfBodyBuilding" placeholder="Type of Body Building" />
          </div>
          <div className="mb-3">
            <label htmlFor="bodyFabricatorName" className="form-label">Body Fabricator Name</label>
            <input type="text" className="form-control shadow-none" id="bodyFabricatorName" placeholder="Body Fabricator Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryDate" className="form-label">Expected Delivery Date</label>
            <input type="date" className="form-control shadow-none" id="deliveryDate" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location</label>
            <textarea className="form-control shadow-none" id="deliveryLocation" rows={3}></textarea>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" value="" id="registration" />
            <label className="form-check-label" htmlFor="registration">
              Registration
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="delivery" className="form-label">Delivery</label>
            <input type="text" className="form-control shadow-none" id="delivery" placeholder="Delivery" />
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" value="" id="vatDeduction" />
            <label className="form-check-label" htmlFor="vatDeduction">
              VAT Deduction
            </label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" value="" id="whtDeduction" />
            <label className="form-check-label" htmlFor="whtDeduction">
              WHT Deduction
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
            <input type="text" className="form-control shadow-none" id="paymentStatus" placeholder="Payment Status" />
          </div>
          <div className="mb-3">
            <label htmlFor="lpoNumber" className="form-label">LPO Number</label>
            <input type="text" className="form-control shadow-none" id="lpoNumber" placeholder="LPO Number" />
          </div>


















          <div className="mb-3">
            <label htmlFor="productBrand" className="form-label">Product Brand</label>
            <select className="form-select shadow-none" id="productBrand" aria-label="Default select example">
              <option value="1">Product Brand 1</option>
              <option value="2">Product Brand 2</option>
              <option value="3">Product Brand 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
            <input type="email" className="form-control shadow-none" id="vehicleModel" placeholder="Email Address" />
          </div>
          <div className="mb-3">
            <label htmlFor="bodyTypeDescription" className="form-label">Body Type Description</label>
            <textarea className="form-control shadow-none" id="bodyTypeDescription" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleServiceDetails" className="form-label">Vehicle Service Details</label>
            <textarea className="form-control shadow-none" id="vehicleServiceDetails" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="bodySpecialFitmentDetails" className="form-label">Body Special Fitment Details</label>
            <textarea className="form-control shadow-none" id="bodySpecialFitmentDetails" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="costOfBodySpecialFitment" className="form-label">Cost Of Body Special Fitment</label>
            <input type="text" className="form-control shadow-none" id="costOfBodySpecialFitment" placeholder="Cost Of Body Special Fitment" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control shadow-none" id="quantity" placeholder="Quantity of Products" />
          </div>
          <div className="mb-3">
            <label htmlFor="priceOfVehicle" className="form-label">Price of Vehicle</label>
            <input type="text" className="form-control shadow-none" id="priceOfVehicle" placeholder="Price of Vehicle" />
          </div>
          <div className="mb-3">
            <label htmlFor="discount" className="form-label">Discount</label>
            <input type="text" className="form-control shadow-none" id="discount" placeholder="Discount" />
          </div>
          <div className="mb-3">
            <label htmlFor="vatDeduction" className="form-label">VAT Deduction</label>
            <input type="text" className="form-control shadow-none" id="vatDeduction" placeholder="VAT Deduction" />
          </div>
          <div className="mb-3">
            <label htmlFor="whtDeduction" className="form-label">WHT Deduction</label>
            <input type="text" className="form-control shadow-none" id="whtDeduction" placeholder="WHT Deduction" />
          </div>
          <div className="mb-3">
            <label htmlFor="refundRebaseAmount" className="form-label">Refund / Rebase Amount</label>
            <input type="text" className="form-control shadow-none" id="refundRebaseAmount" placeholder="Amount to be Refunded" />
          </div>
          <div className="mb-3">
            <label htmlFor="refundRebaseRecipient" className="form-label">Refund / Rebase Recipient</label>
            <input type="text" className="form-control shadow-none" id="refundRebaseRecipient" placeholder="Person to be Refunded" />
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" value="" id="registration" />
            <label className="form-check-label" htmlFor="registration">
              Registration
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Designation</label>
            <input type="text" className="form-control shadow-none" id="designation" placeholder="Designation" />
          </div>
          <div className="mb-3">
            <label htmlFor="relationshipWithTransaction" className="form-label">Relationship with Transaction</label>
            <input type="text" className="form-control shadow-none" id="relationshipWithTransaction" placeholder="Relationship with Transaction" />
          </div>
          <div className="mb-3">
            <label htmlFor="estimatedOrderClosingTime" className="form-label">Estimated Order Closing Time</label>
            <input type="text" className="form-control shadow-none" id="estimatedOrderClosingTime" placeholder="Estimated Order Closing Time" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryPeriod" className="form-label">Delivery Period</label>
            <input type="text" className="form-control shadow-none" id="deliveryPeriod" placeholder="Delivery Period" />
          </div>
          <div className="mb-3">
            <label htmlFor="paymentType" className="form-label">Payment Type</label>
            <input type="text" className="form-control shadow-none" id="paymentType" placeholder="Payment Type" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location</label>
            <textarea className="form-control shadow-none" id="deliveryLocation" rows={3}></textarea>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/invoiceRequest")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddInvoiceRequest;