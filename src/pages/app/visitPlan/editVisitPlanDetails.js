
import { useState } from "react";
import Layout from "../../../components/layout";
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';



const EditVisitPlanDetails = ({handleCancel}) => {
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Visit Plan Details</header>
      <p>Make changes to Visit Plan Information.</p>

      <form className="mt-5">

        <div className="mb-3">
          <label htmlFor="weeklyVisitPlan" className="form-label">Weekly Visit Plan </label>
          <textarea className="form-control shadow-none" id="weeklyVisitPlan" rows={4}></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="monthlyVisitPlan" className="form-label">Monthly Visit Plan </label>
          <textarea className="form-control shadow-none" id="monthlyVisitPlan" rows={4}></textarea>
        </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5">Save Changes</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={handleCancel}>Cancel</button>
        </div>

      </form>
    </section>

  )
}

export default EditVisitPlanDetails;