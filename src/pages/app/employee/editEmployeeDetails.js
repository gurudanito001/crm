
import { useState } from "react";
import Layout from "../../../components/layout";
import PasswordInput from "../../../components/passwordInput";



const EditEmployeeDetails = ({ handleCancel }) => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Employee Details</header>
      <p>Make changes to Employee Information.</p>

      <form className="mt-5">
        <div className="mb-3">
          <label htmlFor="company" className="form-label">Company Name</label>
          <input type="text" className="form-control shadow-none" id="company" placeholder="Company Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="state" className="form-label">State</label>
          <select className="form-select shadow-none" id="state" aria-label="Default select example">
            <option value="1">State Name 1</option>
            <option value="2">State Name 2</option>
            <option value="3">State Name 3</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="lga" className="form-label">LGA</label>
          <select className="form-select shadow-none" id="lga" aria-label="Default select example">
            <option value="1">LGA Name 1</option>
            <option value="2">LGA Name 2</option>
            <option value="3">LGA Name 3</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <select className="form-select shadow-none" id="city" aria-label="Default select example">
            <option value="1">City Name 1</option>
            <option value="2">City Name 2</option>
            <option value="3">City Name 3</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">First Name</label>
          <input type="text" className="form-control shadow-none" id="firstname" placeholder="Employee First Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="middlename" className="form-label">Middle Name</label>
          <input type="text" className="form-control shadow-none" id="middlename" placeholder="Employee Middle Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Last Name</label>
          <input type="text" className="form-control shadow-none" id="lastname" placeholder="Employee Last Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" className="form-control shadow-none" id="email" placeholder="Enter your email address" />
        </div>
        <PasswordInput />
        <div className="mb-3">
          <label htmlFor="supervisor" className="form-label">Supervisor</label>
          <select className="form-select shadow-none" id="supervisor" aria-label="Default select example">
            <option value="1">Supervisor Name</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="productHead" className="form-label">Product Head</label>
          <select className="form-select shadow-none" id="productHead" aria-label="Default select example">
            <option value="1">Product Head Name</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="locationManager" className="form-label">Location Manager</label>
          <select className="form-select shadow-none" id="locationManager" aria-label="Default select example">
            <option value="1">Location Manager Name</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="subordinate" className="form-label">Subordinate</label>
          <select className="form-select shadow-none" id="subordinate" aria-label="Default select example">
            <option value="1">Subordinate Name</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="employmentDate" className="form-label">Employment Date</label>
          <input type="date" className="form-control shadow-none" id="employmentDate" placeholder="Enter Employee Employment Date" />
        </div>
        <div className="mb-3">
          <label htmlFor="brandsAssigned" className="form-label">Brands Assigned</label>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
            <label className="form-check-label" htmlFor="defaultCheck1">
              Brand 1
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" />
            <label className="form-check-label" htmlFor="defaultCheck2">
              Brand 2
            </label>
          </div>
        </div>
        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5">Save Changes</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </section>

  )
}

export default EditEmployeeDetails;