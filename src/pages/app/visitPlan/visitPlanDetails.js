
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditVisitPlanDetails from './editVisitPlanDetails';

const VisitPlanDetailListItem = () =>{
  return(
    <li className='py-3'>
      <header className='small'>Title</header>
      <p>Description</p>
    </li>
  )
}


const VisitPlanDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Visit Plan Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2'>delete</button>
        </header>
        <p>Details of visit plan listed below</p>

        <ul className='mt-5'>
          <VisitPlanDetailListItem />
          <VisitPlanDetailListItem />
          <VisitPlanDetailListItem />
          <VisitPlanDetailListItem />
          <VisitPlanDetailListItem />
          <VisitPlanDetailListItem />
          <VisitPlanDetailListItem />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditVisitPlanDetails handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default VisitPlanDetails;