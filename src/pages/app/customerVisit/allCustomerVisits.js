
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';



const CustomerVisitListItem = ({handleClick}) =>{
  const navigate = useNavigate()
  return(
    
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate("/app/visit/r355645")}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-calendar-check text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>Name of The Customer</span> <br />
          <span> full details about the visit</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>Date of Visit</span>
      </div>
    </li>
  )
}


const AllCustomerVisits = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentTab, setCurrentTab] = useState("scheduled")

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Customer Visits</h3>
          {/* <a href='/app/visit/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a> */}
        </header>
        {/* <p>All your customer visits are listed below</p> */}
        <ul className="nav nav-tabs mt-4">
          <li className="nav-item me-3">
            <a className={`nav-link py-3 px-4 text-dark ${currentTab === "scheduled" && " border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("scheduled")}>Scheduled Visits</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link py-3 px-4 text-dark ${currentTab === "fulfilled" && "border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("fulfilled")}>Fulfilled Visits</a>
          </li>
        </ul>
        <ul className='mt-5'>
          {
            currentTab === "fulfilled" && 
            <>
              <CustomerVisitListItem />
              <CustomerVisitListItem />
              <CustomerVisitListItem />
              <CustomerVisitListItem />
              <CustomerVisitListItem />
              <CustomerVisitListItem />
            </>
          }
          
          <CustomerVisitListItem />
          <CustomerVisitListItem />
          <CustomerVisitListItem />
          <CustomerVisitListItem />
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomerVisits;