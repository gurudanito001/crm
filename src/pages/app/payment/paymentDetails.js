
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditPaymentDetails from './editPaymentDetails';

const PaymentDetailListItem = () =>{
  return(
    <li className='py-3'>
      <header className='small'>Title</header>
      <p>Description</p>
    </li>
  )
}


const PaymentDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Invoice Request Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2'>delete</button>
        </header>
        <p>Details of invoice request listed below</p>

        <ul className='mt-5'>
          <PaymentDetailListItem />
          <PaymentDetailListItem />
          <PaymentDetailListItem />
          <PaymentDetailListItem />
          <PaymentDetailListItem />
          <PaymentDetailListItem />
          <PaymentDetailListItem />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditPaymentDetails handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default PaymentDetails;