
import '../../../styles/auth.styles.css';
import { Fragment, useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const CustomerVisitListItem = ({ id, companyName, personToVisitName, meetingDate, meetingTime, meetingVenue, completedVisit = false }) =>{
  const navigate = useNavigate();

  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/visit/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-calendar-check text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{personToVisitName} - <span className='fw-normal fst-italic'>{companyName}</span></span> <br />
          <span>{meetingVenue}</span>
        </article>
      </div>
      <div className='w-25 d-flex flex-column justify-content-center'>
        <span className='small fw-bold ms-auto'>{meetingDate}; {meetingTime} </span>
        <span className={`small fw-bold ms-auto ${completedVisit ? "text-success" : "text-danger"}`}>{completedVisit ? "Completed" : "Not Completed"} </span>
      </div>
    </li>
  )
}


const AllCustomerVisitsAdmin = () => {
  const dispatch = useDispatch();
  const {id} = getUserData();
  const [employeeId, setEmployeeId] = useState("");
  const navigate = useNavigate();

  const deriveUrl = () =>{
    if(employeeId){
      return `/customerVisit/employee/${employeeId}`
    }else{
      return "/customerVisit"
    }
  }
  
  const customerVisitQuery = useQuery({
    queryKey: ["allCustomerVisits"],
    queryFn: () => apiGet({url: deriveUrl()})
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

  const listEmployees = () =>{
    if(employeeQuery.data.length > 0){
      return employeeQuery.data.map(employee =>
        <option key={employee.id} value={employee.id}>{`${employee.firstName} ${employee.lastName}`}</option>
      )
    }
  }

  const sortCustomerVisits = () =>{
    let sortedData = {};
    if(customerVisitQuery.data?.length){
      customerVisitQuery.data.forEach( item => {
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

  const listSortedCustomerVisits = () =>{
    let sortedCustomerVisits = sortCustomerVisits();

    let keys = Object.keys(sortedCustomerVisits);
    return keys.map( key => {
      let data = getEmployeeData(key)
      return (<Fragment key={key}>
        <li className='h6 fw-bold mt-4 fs-6'>
          <a className='small' href={`/app/employee/${data.id}`}>{data.fullName} ({data.email})</a>
        </li>
        {sortedCustomerVisits[key].map( customerVisit => {
          return (
            <CustomerVisitListItem
              id={customerVisit.id}
              key={customerVisit.id}
              companyName={customerVisit.companyName}
              personToVisitName={customerVisit.personToVisitName}
              meetingDate={new Date(customerVisit.meetingDate).toDateString()}
              meetingTime={customerVisit.meetingTime}
              meetingVenue={customerVisit.meetingVenue}
              completedVisit={Boolean(customerVisit.visitReportId)}
            />
          )
        })}
      </Fragment>
      )
    })
  }

  const handleChangeEmployees = (e) =>{
    e.preventDefault();
    setEmployeeId(e.target.value);
  }

  useEffect(()=>{
    customerVisitQuery.refetch()
  }, [employeeId])

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Customer Visits</h3>
          <div className="btn-group me-2">
            <button className="btn btn-sm border-secondary rounded" type="button" disabled={customerVisitQuery.isLoading} data-bs-toggle="dropdown" aria-expanded="false">
              { customerVisitQuery.isFetching ? <Spinner /> : <i className="bi bi-filter fs-5"></i>} 
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <div className=""> 
                <label htmlFor="subordinates" className="form-label small fw-bold">Filter by Employees</label>
                <select className="form-select shadow-none" style={{minWidth: "300px"}} id="subordinates" value={employeeId} onChange={handleChangeEmployees} aria-label="Default select example">
                  <option value="">View All</option>
                  {!employeeQuery.isLoading && listEmployees()}
                </select>
              </div>
            </ul>
          </div>
        </header>
        <p>All customer visits are listed below</p>
        

        {customerVisitQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Customer Visits <Spinner />
        </div>}
        <ul className='mt-5'>
          {!customerVisitQuery.isLoading && !employeeQuery.isLoading && listSortedCustomerVisits()}

          {!customerVisitQuery.isLoading && !customerVisitQuery.isError && customerVisitQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Customer Visit was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomerVisitsAdmin;