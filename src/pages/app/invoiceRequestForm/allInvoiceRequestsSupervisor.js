
import '../../../styles/auth.styles.css';
import { useState, Fragment, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const InvoiceRequestListItem = ({id, invoiceName, contactPerson, vehicleBrand, vehicleModel, quantity  }) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/invoiceRequest/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-receipt-cutoff text-white fs-5"></i></span>
        <article className='d-flex flex-column'>
          <span className='h6 fw-bold'>{invoiceName}</span>
          <span>{contactPerson}</span>
          <span>{vehicleBrand} - {vehicleModel}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{quantity} units</span>
      </div>
    </li>
  )
}


const AllInvoiceRequestsSupervisor = () => {
  const dispatch = useDispatch();
  const {staffCadre, id} = getUserData();
  const [employeeId, setEmployeeId] = useState("");
  const navigate = useNavigate();


  const invoiceRequestQuery = useQuery({
    queryKey: ["allInvoiceRequests"],
    queryFn: () => apiGet({url: `/invoiceRequestForm/employee/${employeeId}`})
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

  const subordinatesQuery = useQuery({
    queryKey: ["allSubordinates"],
    queryFn: () => apiGet({url: `/employee/subordinates/${id}`})
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

  const listSubordinates = () =>{
    if(subordinatesQuery.data.length > 0){
      return subordinatesQuery.data.map(subordinate =>
        <option key={subordinate.id} value={subordinate.id}>{`${subordinate.firstName} ${subordinate.lastName}`}</option>
      )
    }
  }

  const sortInvoiceRequests = () =>{
    let sortedData = {};
    if(invoiceRequestQuery.data?.length){
      invoiceRequestQuery.data.forEach( item => {
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
    if(subordinatesQuery.data?.length){
      subordinatesQuery.data.forEach( item => {
        if(item.id === id){
          data = {id: item.id, fullName: `${item.firstName} ${item.lastName}`, email: item.email}
        }
      })
    }
    return data;
  }

  const listSortedInvoiceRequests = () =>{
    let sortedInvoiceRequests = sortInvoiceRequests();

    let keys = Object.keys(sortedInvoiceRequests);
    return keys.map( key => {
      let data = getEmployeeData(key)
      return (
      <Fragment key={key}>
        <li className='h6 fw-bold mt-4 fs-6'>
          <a className='small' href={`/app/employee/${data.id}`}>{data.fullName} ({data.email})</a>
        </li>
        {sortedInvoiceRequests[key].map( item => {
          return (
            <InvoiceRequestListItem
              key={item.id}
              id={item.id}
              invoiceName={item.invoiceName}
              contactPerson={item.contactPerson}
              vehicleBrand={item.vehicleBrand}
              vehicleModel={item.vehicleModel}
              quantity={item.quantity}
            />
          )
        })}
      </Fragment>
      )
    })
  }

  const handleChangeSubordinate = (e) =>{
    e.preventDefault();
    setEmployeeId(e.target.value);
    
  }

  useEffect(()=>{
      invoiceRequestQuery.refetch()
  }, [employeeId])


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Invoice Requests</h3>
          <div className="btn-group me-2">
            <button className="btn btn-sm border-secondary rounded" type="button" disabled={invoiceRequestQuery.isLoading} data-bs-toggle="dropdown" aria-expanded="false">
              { invoiceRequestQuery.isFetching ? <Spinner /> : <i className="bi bi-filter fs-5"></i>} 
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <div className=""> 
                <label htmlFor="subordinates" className="form-label small fw-bold">Filter by Employees</label>
                <select className="form-select shadow-none" style={{minWidth: "300px"}} id="subordinates" value={employeeId} onChange={handleChangeSubordinate} aria-label="Default select example">
                  <option value={id}>{`${getUserData().firstName} ${getUserData().lastName}`}</option>
                  {!subordinatesQuery.isLoading && listSubordinates()}
                </select>
              </div>
            </ul>
          </div>
        </header>
        <p>All Invoice Requests are listed below</p>

        {invoiceRequestQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Invoice Requests <Spinner />
        </div>}

        <ul className='mt-5'>
          {!invoiceRequestQuery.isLoading && listSortedInvoiceRequests()}

          {!invoiceRequestQuery.isLoading && !invoiceRequestQuery.isError && invoiceRequestQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
            <p className='h6 fw-bold'>No Invoice Request was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllInvoiceRequestsSupervisor;