
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';


const PfiRequestListItem = ({id,companyName, contactPerson, productBrand, vehicleModel, quantity}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/pfiRequest/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-car-front text-white fs-5"></i></span>
        <article className='d-flex flex-column'>
          <span className='h6 fw-bold'>{companyName}</span>
          <span>{contactPerson}</span>
          <span>{productBrand} - {vehicleModel}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{quantity} units</span>
      </div>
    </li>
  )
}


const AllPfiRequests = () => {
  const pfiRequestQuery = useQuery({
    queryKey: ["allPfiRequests"],
    queryFn: () => apiGet({url: "/pfiRequestForm"}).then( (res) =>{
      console.log(res.payload)
      return res.payload
    } )
  })

  const listPfiRequests= () =>{
    if(pfiRequestQuery.data?.length > 0){
      return pfiRequestQuery.data.map( item => <PfiRequestListItem 
        key={item.id}
        id={item.id}
        companyName={item.companyName}
        contactPerson={item.contactPerson}
        productBrand={item.productBrand}
        vehicleModel={item.vehicleModel}
        quantity={item.quantity}
      />)
    }
  }

  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All PFI Requests</h3>
          <a href='/app/pfiRequest/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All PFI Requests are listed below</p>

        {pfiRequestQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching PFI Requests <Spinner />
        </div>}

        <ul className='mt-5'>
          {!pfiRequestQuery.isLoading && listPfiRequests()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllPfiRequests;