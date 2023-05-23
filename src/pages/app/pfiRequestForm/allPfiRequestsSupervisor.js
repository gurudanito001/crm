

import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';


const PfiRequestListItem = ({id, companyName, contactPerson, quantity, vehicles, approved}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/pfiRequest/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-receipt text-white fs-5"></i></span>
        <article className='d-flex flex-column'>
          <span className='h6 fw-bold'>{companyName}</span>
          <span>{contactPerson}</span>
          <span>{vehicles}</span>
        </article>
      </div>
      <div className='w-25 d-flex flex-column align-items-center'>
        <span className='small fw-bold ms-auto mt-auto'>{quantity} vehicle brand(s)</span>
        <span className={`small fw-bold ms-auto mb-auto ${approved ? "text-success" : "text-danger"}`}>{approved ? "Approved" : "Not Approved"}</span>
      </div>
    </li>
  )
}


const AllPfiRequestsSupervisor = () => {
  const dispatch = useDispatch();
  const {staffCadre, id} = getUserData();
  const [employeeId, setEmployeeId] = useState(id);
  
  const pfiRequestQuery = useQuery({
    queryKey: ["allPfiRequests"],
    queryFn: () => apiGet({url: `/pfiRequestForm/employee/${employeeId}`})
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

  const subordinatesQuery = useQuery({
    queryKey: ["allSubordinates"],
    queryFn: () => apiGet({url: `/employee/subordinates/${id}`})
    .then( (res) => {
      console.log("subordinates", res.payload)
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

  const listSubordinates = () =>{
    if(subordinatesQuery.data.length > 0){
      return subordinatesQuery.data.map(subordinate =>
        <option key={subordinate.id} value={subordinate.id}>{`${subordinate.firstName} ${subordinate.lastName}`}</option>
      )
    }
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

  const listPfiVehicles = (list) =>{
    let vehicles = '';
    list.forEach( item =>{
      if(vehicles === ''){
        vehicles += `${item.productBrand}`
      }else{
        vehicles += ` | ${item.productBrand}`
      }
    })
    return vehicles
  }

  const listPfiRequests = () =>{
    if(pfiRequestQuery.data?.length > 0){
      return pfiRequestQuery.data.map( item => <PfiRequestListItem 
        key={item.id}
        id={item.id}
        companyName={item.companyName}
        contactPerson={item.contactPerson}
        vehicles={listPfiVehicles(item.pfiVehiclesData)}
        quantity={item.pfiVehiclesData.length}
        approved={item.approved}
      />)
    }
  }

  const handleChangeSubordinate = (e) =>{
    e.preventDefault();
    setEmployeeId(e.target.value);
    
  }

  useEffect(()=>{
    if(employeeId){
      pfiRequestQuery.refetch()
    }
    
  }, [employeeId])

  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All PFI Requests</h3>
          <div className="btn-group me-2">
            <button className="btn btn-sm border-secondary rounded" type="button" disabled={pfiRequestQuery.isLoading} data-bs-toggle="dropdown" aria-expanded="false">
              { pfiRequestQuery.isFetching ? <Spinner /> : <i className="bi bi-filter fs-5"></i>} 
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
          <a href='/app/pfiRequest/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All PFI Requests for <strong>{getEmployeeData(employeeId).fullName}</strong> are listed below</p>

        {pfiRequestQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching PFI Requests <Spinner />
        </div>}

        <ul className='mt-5'>
          {!pfiRequestQuery.isLoading && listPfiRequests()}

          {!pfiRequestQuery.isLoading && !pfiRequestQuery.isError && pfiRequestQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No PFI Request was found !!</p>
              <span className='text-info'>Click the [+Add] button to add a new PFI Request</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllPfiRequestsSupervisor;