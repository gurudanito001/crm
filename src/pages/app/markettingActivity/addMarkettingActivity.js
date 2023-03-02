import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


const AddMarkettingActivity = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Marketting Activity </header>
        <p>Fill in Marketting Activity Information.</p>
          <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="activityName" className="form-label">Activity Name</label>
            <input type="text" className="form-control shadow-none" id="activityName" placeholder="Activity Name" />
          </div>

          <div className="mb-3">
            <label htmlFor="activityDate" className="form-label">Activity Date</label>
            <input type="date" className="form-control shadow-none" id="activityDate" placeholder="Enter Activity Date" />
          </div>

          <div className="mb-3">
            <label htmlFor="participants" className="form-label">Participants</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="participants" aria-label="Default select example">
                <option value="1">Participant 1</option>
                <option value="2">Participant 2</option>
                <option value="3">Participant 3</option>
              </select>
              <button className='btn btnPurple px-4 me-0'>Add</button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" className="form-control shadow-none" id="location" placeholder="Address of Venue" />
          </div>

          <div className="mb-3">
            <label htmlFor="objective" className="form-label">Objective</label>
            <input type="text" className="form-control shadow-none" id="objective" placeholder="Objective of Marketting Activity" />
          </div>

          <div className="mb-3">
            <label htmlFor="targetResult" className="form-label">Target Result</label>
            <input type="text" className="form-control shadow-none" id="targetResult" placeholder="Target Result of Marketting Activity" />
          </div>

          <div className="mb-3">
            <label htmlFor="briefReport" className="form-label">Brief Report </label>
            <textarea className="form-control shadow-none" id="briefReport" rows={4}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="pictures" className="form-label">Pictures</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none"  id="pictures" type="file" placeholder='Pictures from event' />
              <button className='btn btnPurple px-4 me-0'>Add</button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="costIncurred" className="form-label">Cost Incurred</label>
            <input type="text" className="form-control shadow-none" id="costIncurred" placeholder="Expenses Made during Activity" />
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/markettingActivity")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddMarkettingActivity;