
import '../../../styles/auth.styles.css';
import { useState, Fragment } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';


const PfiRequestListItem = ({id,companyName, contactPerson, productBrand, vehicleModel, quantity}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/pfiRequest/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-receipt text-white fs-5"></i></span>
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


const AllPfiRequestsAdmin = () => {
  const dispatch = useDispatch();
  
  const pfiRequestQuery = useQuery({
    queryKey: ["allPfiRequests"],
    queryFn: () => apiGet({url: "/pfiRequestForm"})
    .then( (res) =>{
      return res.payload
    })
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

  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({url: "/employee"})
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

  const sortpfiRequests = () =>{
    let sortedData = {};
    if(pfiRequestQuery.data?.length){
      pfiRequestQuery.data.forEach( item => {
        if(sortedData[item.employeeId]){
          sortedData[item.employeeId].push(item) 
        }else{
          sortedData[item.employeeId] = [item]
        }
      })
    }
    return sortedData;
  }

  const getEmployeeData = (id) =>{
    let data = {};
    if(employeeQuery.data?.length){
      employeeQuery.data.forEach( item => {
        if(item.id === id){
          data = {id: item.id, fullName: `${item.firstName} ${item.lastName}`, email: item.email}
        }
      })
    }
    return data;
  }

  const listSortedPfiRequests = () =>{
    let sortedPfiRequests = sortpfiRequests();

    let keys = Object.keys(sortedPfiRequests);
    return keys.map( key => {
      let data = getEmployeeData(key)
      return (
      <Fragment key={key}>
        <li className='h6 fw-bold mt-4 fs-6'>
          <a className='small' href={`/app/employee/${data.id}`}>{data.fullName} ({data.email})</a>
        </li>
        {sortedPfiRequests[key].map( item => {
          return (
            <PfiRequestListItem
              key={item.id}
              id={item.id}
              companyName={item.companyName}
              contactPerson={item.contactPerson}
              productBrand={item.productBrand}
              vehicleModel={item.vehicleModel}
              quantity={item.quantity}
            />
          )
        })}
      </Fragment>
      )
    })
  }

  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All PFI Requests</h3>
        </header>
        <p>All PFI Requests are listed below</p>

        {pfiRequestQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching PFI Requests <Spinner />
        </div>}

        <ul className='mt-5'>
          {!pfiRequestQuery.isLoading && listSortedPfiRequests()}

          {!pfiRequestQuery.isLoading && !pfiRequestQuery.isError && pfiRequestQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No PFI Request was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllPfiRequestsAdmin;