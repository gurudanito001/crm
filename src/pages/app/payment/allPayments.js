
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const PaymentListItem = ({id, nameOfCustomer, customerAddress, advancePaymentReceived}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/payment/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-cash text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{nameOfCustomer}</span> <br />
          <span>{customerAddress}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{formatAsCurrency(advancePaymentReceived)}</span>
      </div>
    </li>
  )
}


const AllPayments = () => {
  const dispatch = useDispatch();
  let {staffCadre} = getUserData();
  const paymentQuery = useQuery({
    queryKey: ["allPayments"],
    queryFn: () => apiGet({url: "/payment"})
    .then( (res) => res.payload)
    .catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const listAllPayments = () =>{
    return paymentQuery.data.map( payment => <PaymentListItem 
      id={payment.id}
      key={payment.id}
      nameOfCustomer={payment.nameOfCustomer}
      customerAddress={payment.customerAddress}
      advancePaymentReceived={payment.advancePaymentReceived}
    />)
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Payments</h3>
          {staffCadre === "Administrator" &&
          <a href='/app/payment/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
          }
        </header>
        <p>All your invoice requests are listed below</p>

        {paymentQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Payments <Spinner />
        </div>}

        <ul className='mt-5'>
          {!paymentQuery.isLoading && !paymentQuery.isError && listAllPayments()}
          
          {!paymentQuery.isLoading && !paymentQuery.isError && paymentQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Payment was found !!</p>
              { staffCadre === "Administrator" &&<span className='text-info'>Click the [+Add] button to add a new payment</span>}
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllPayments;