
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditCompanyDetails from './editCompanyDetails';

const CompanyDetailListItem = () =>{
  return(
    <li className='py-3'>
      <header className='small'>Title</header>
      <p>Description</p>
    </li>
  )
}


const CompanyDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Company Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2'>delete</button>
        </header>
        <p>Details of company listed below</p>

        <ul className='mt-5'>
          <CompanyDetailListItem />
          <CompanyDetailListItem />
          <CompanyDetailListItem />
          <CompanyDetailListItem />
          <CompanyDetailListItem />
          <CompanyDetailListItem />
          <CompanyDetailListItem />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditCompanyDetails handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default CompanyDetails;