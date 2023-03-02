
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';



const CustomerListItem = ({handleClick}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate("/app/customer/r355645")}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-buildings text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>Name of The company</span> <br />
          <span> full detailed address of the company with state, lga and city</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>Number of contact persons</span>
      </div>
    </li>
  )
}


const AllCustomers = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Customers</h3>
          <a href='/app/customer/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All your customers are listed below</p>

        <ul className='mt-5'>
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
          <CustomerListItem />
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomers;