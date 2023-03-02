import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


const AddCustomerVisit = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Customer Visit</header>
        <p>Schedule a Customer Visit.</p>
          <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <select className="form-select shadow-none" id="companyName" aria-label="Default select example">
              <option value="1">Company 1</option>
              <option value="2">Company 2</option>
              <option value="3">Company 3</option>
            </select>          
          </div>

          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person</label>
            <select className="form-select shadow-none" id="contactPerson" aria-label="Default select example">
              <option value="1">Contact Person 1</option>
              <option value="2">Contact Person 2</option>
              <option value="3">Contact Person 3</option>
            </select>          
          </div>

          <div className="mb-3">
            <label htmlFor="meetingDate" className="form-label">Meeting Date</label>
            <input type="date" className="form-control shadow-none" id="meetingDate" placeholder="Enter Meeting Date" />
          </div>

          <div className="mb-3">
            <label htmlFor="meetingPurpose" className="form-label">Meeting Purpose</label>
            <input type="text" className="form-control shadow-none" id="meetingPurpose" placeholder="Enter Meeting Purpose" />
          </div>

          <div className="mb-3">
            <label htmlFor="meetingVenue" className="form-label">Meeting Venue</label>
            <select className="form-select shadow-none" id="meetingVenue" aria-label="Default select example">
              <option value="1">Meeting Venue 1</option>
              <option value="2">Meeting Venue 2</option>
              <option value="3">Meeting Venue 3</option>
            </select>          
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/visit")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddCustomerVisit;