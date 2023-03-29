
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const CustomerListItem = ({id, companyName, address1, address2, industry}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/customer/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-buildings text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{companyName}</span> <br />
          <span> {address1 || address2} </span>
        </article>      
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{industry}</span>
      </div>
    </li>
  )
}


const AllCustomers = () => {
  const [showNotification, setShowNotification] = useState(false);

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: "/customer"}).then( (res) => res.payload)
  })

  const listAllCustomers = () =>{
    return customerQuery.data.map( customer => <CustomerListItem 
      id={customer.id}
      key={customer.id}
      companyName={customer.companyName}
      address1={customer.address1}
      address2={customer.address2}
      industry={customer.industry}
    />)
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Customers</h3>
          <a href='/app/customer/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All your customers are listed below</p>

        {customerQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Customers <Spinner />
        </div>}
        <ul className='mt-5'>
          {!customerQuery.isLoading && !customerQuery.isError && listAllCustomers()}
          {!customerQuery.isLoading && !customerQuery.isError && customerQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Customer was found !!</p>
              <span className='text-info'>Click the [+Add] button to add a new customer</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomers;