
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditMarkettingActivityDetails from './editMarkettingActivity';

const MarkettingActivityDetailListItem = () =>{
  return(
    <li className='py-3'>
      <header className='small'>Title</header>
      <p>Description</p>
    </li>
  )
}


const MarkettingActivityDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Marketting Activity Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2'>delete</button>
        </header>
        <p>Details of invoice request listed below</p>

        <ul className='mt-5'>
          <MarkettingActivityDetailListItem />
          <MarkettingActivityDetailListItem />
          <MarkettingActivityDetailListItem />
          <MarkettingActivityDetailListItem />
          <MarkettingActivityDetailListItem />
          <MarkettingActivityDetailListItem />
          <MarkettingActivityDetailListItem />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditMarkettingActivityDetails handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default MarkettingActivityDetails;