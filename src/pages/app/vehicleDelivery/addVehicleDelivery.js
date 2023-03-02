import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


const AddVehicleDelivery = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Vehicle Delivery</header>
        <p>Fill in Vehicle Delivery Information.</p>

        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input type="text" className="form-control shadow-none" id="companyName" placeholder="Company Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <select className="form-select shadow-none" id="state" aria-label="Default select example">
              <option value="1">State 1</option>
              <option value="2">State 2</option>
              <option value="3">State 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="lga" className="form-label">LGA</label>
            <select className="form-select shadow-none" id="lga" aria-label="Default select example">
              <option value="1">LGA 1</option>
              <option value="2">LGA 2</option>
              <option value="3">LGA 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <select className="form-select shadow-none" id="city" aria-label="Default select example">
              <option value="1">City 1</option>
              <option value="2">City 2</option>
              <option value="3">City 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="address1" className="form-label">Address 1</label>
            <textarea className="form-control shadow-none" id="address1" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="address2" className="form-label">Address 2</label>
            <textarea className="form-control shadow-none" id="address2" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="companyWebsite" className="form-label">Company Website</label>
            <input type="text" className="form-control shadow-none" id="companyWebsite" placeholder="Website of Company" />
          </div>
          <div className="mb-3">
            <label htmlFor="chairman" className="form-label">Chairman</label>
            <input type="text" className="form-control shadow-none" id="chairman" placeholder="Chairman of Company" />
          </div>
          <div className="mb-3">
            <label htmlFor="mdceo" className="form-label">MD/CEO</label>
            <input type="text" className="form-control shadow-none" id="mdceo" placeholder="MD/CEO of Company" />
          </div>

          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <select className="form-select shadow-none" id="industry" aria-label="Default select example">
              <option value="1">Industry 1</option>
              <option value="2">Industry 2</option>
              <option value="3">Industry 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="businesstype" className="form-label">Business Type</label>
            <select className="form-select shadow-none" id="businesstype" aria-label="Default select example">
              <option value="1">Business Type 1</option>
              <option value="2">Business Type 2</option>
              <option value="3">Business Type 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="producttype" className="form-label">VehicleDelivery Type</label>
            <select className="form-select shadow-none" id="producttype" aria-label="Default select example">
              <option value="1">VehicleDelivery Type 1</option>
              <option value="2">VehicleDelivery Type 2</option>
              <option value="3">VehicleDelivery Type 3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="enquirysource" className="form-label">Enquiry Source</label>
            <select className="form-select shadow-none" id="enquirysource" aria-label="Default select example">
              <option value="1">Enquiry Source 1</option>
              <option value="2">Enquiry Source 2</option>
              <option value="3">Enquiry Source 3</option>
            </select>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/delivery")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddVehicleDelivery;