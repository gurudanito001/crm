import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


const AddVisitPlan = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Visit Plan</header>
        <p>Fill in Visit Plan Information.</p>

        <form className="mt-5">

          {/* <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input type="text" className="form-control shadow-none" id="companyName" placeholder="Company Name" />
          </div> */}

          <div className="mb-3">
            <label htmlFor="weeklyVisitPlan" className="form-label">Weekly Visit Plan </label>
            <textarea className="form-control shadow-none" id="weeklyVisitPlan" rows={4}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="monthlyVisitPlan" className="form-label">Monthly Visit Plan </label>
            <textarea className="form-control shadow-none" id="monthlyVisitPlan" rows={4}></textarea>
          </div>
          

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/plan")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddVisitPlan;