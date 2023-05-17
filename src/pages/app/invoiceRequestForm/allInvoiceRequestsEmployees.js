
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const InvoiceRequestListItem = ({id, invoiceName, contactPerson, vehicles, quantity, approved  }) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/invoiceRequest/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-receipt-cutoff text-white fs-5"></i></span>
        <article className='d-flex flex-column'>
          <span className='h6 fw-bold'>{invoiceName}</span>
          <span>{contactPerson}</span>
          <span>{vehicles}</span>
        </article>
      </div>
      <div className='w-25 d-flex flex-column align-items-center'>
        <span className='small fw-bold ms-auto'>{quantity} vehicle brand(s)</span>
        <span className={`small fw-bold ms-auto ${approved ? "text-success" : "text-danger"}`}>{approved ? "Approved" : "Not Approved"}</span>
      </div>
    </li>
  )
}


const AllInvoiceRequestsEmployees = () => {
  const dispatch = useDispatch();
  const {staffCadre, id} = getUserData();

  const invoiceRequestQuery = useQuery({
    queryKey: ["allInvoiceRequests"],
    queryFn: () => apiGet({url: `/invoiceRequestForm/employee/${id}`})
    .then( res => res.payload)
    .catch( error => {
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const listInvoiceRequests = () =>{
    if(invoiceRequestQuery.data?.length > 0){
      return invoiceRequestQuery.data.map( item => <InvoiceRequestListItem 
        key={item.id}
        id={item.id}
        invoiceName={item.invoiceName}
        contactPerson={item.contactPerson}
        vehicles={listInvoiceVehicles(item.vehiclesData)}
        quantity={item.vehiclesData.length}
      />)
    }
  }

  const listInvoiceVehicles = (list) =>{
    console.log(list)
    let vehicles = '';
    list.forEach( item =>{
      if(vehicles === ''){
        vehicles += `${item.vehicleBrand}`
      }else{
        vehicles += ` | ${item.vehicleBrand}`
      }
    })
    return vehicles
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Invoice Requests</h3>
          <a href='/app/invoiceRequest/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        
        <p>All your invoice requests are listed below</p>

        {invoiceRequestQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Invoice Requests <Spinner />
        </div>}

        <ul className='mt-5'>
          {!invoiceRequestQuery.isLoading && listInvoiceRequests()}

          {!invoiceRequestQuery.isLoading && !invoiceRequestQuery.isError && invoiceRequestQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
            <p className='h6 fw-bold'>No Invoice Request was found !!</p>
            <span className='text-info'>Click the [+Add] button to add a new invoice request</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllInvoiceRequestsEmployees;