
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditEmployeeDetails from './editEmployeeDetails';

const EmployeeDetailListItem = () =>{
  return(
    <li className='py-3'>
      <header className='small'>Title</header>
      <p>Description</p>
    </li>
  )
}


const EmployeeDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Employee Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2'>delete</button>
        </header>
        <p>Details of employee listed below</p>

        <ul className='mt-5'>
          <EmployeeDetailListItem />
          <EmployeeDetailListItem />
          <EmployeeDetailListItem />
          <EmployeeDetailListItem />
          <EmployeeDetailListItem />
          <EmployeeDetailListItem />
          <EmployeeDetailListItem />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditEmployeeDetails handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default EmployeeDetails;