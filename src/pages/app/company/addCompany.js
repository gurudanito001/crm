import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";


const AddCompany = () => {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate()

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Company</header>
        <p>Fill in Company Information.</p>

        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="groupName" className="form-label">Group Name</label>
            <input type="text" className="form-control shadow-none" id="groupName" placeholder="Group Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="companyCode" className="form-label">Company Code</label>
            <input type="text" className="form-control shadow-none" id="companyCode" placeholder="Company Code" />
          </div>
          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input type="text" className="form-control shadow-none" id="companyName" placeholder="Company Name" />
          </div>

          <div className="mb-3">
            <label htmlFor="companyLogo" className="form-label">Company Logo</label>
            <input className="form-control form-control-lg" id="companyLogo" type="file" />
          </div>

          <div className="mb-3">
            <label htmlFor="companyEmail" className="form-label">Company Email</label>
            <input type="email" className="form-control shadow-none" id="companyEmail" placeholder="Enter company email" />
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
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/company")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddCompany;