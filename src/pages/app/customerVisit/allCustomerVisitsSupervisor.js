
import '../../../styles/auth.styles.css'
import { Fragment, useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery, useQueryClient } from "@tanstack/react-query";
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


const AllCustomerVisitsSupervisor = () => {
  const dispatch = useDispatch();
  const {id} = getUserData();
  const [employeeId, setEmployeeId] = useState(id);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("scheduled");
  
  const customerVisitQuery = useQuery({
    queryKey: ["allCustomerVisits"],
    queryFn: () => apiGet({url: `/customerVisit/employee/${employeeId}`})
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
    if(subordinatesQuery.data?.length){
      subordinatesQuery.data.forEach( item => {
        if(item.id === id){
          data = {id: item.id, fullName: `${item.firstName} ${item.lastName}`, email: item.email}
        }
      })
    }
    return data;
  }

  const listSortedCustomerVisits = () =>{
    if(employeeId === id){
      if(customerVisitQuery?.data?.length){
        let list;
        if(currentTab === "scheduled"){
          list = customerVisitQuery.data.filter( data =>  data.visitReportId === null)
        }else if(currentTab === "reported"){
          list = customerVisitQuery.data.filter( data =>  data.visitReportId !== null)
        }
        return list.map(customerVisit =>
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
      }
    }
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

  const handleChangeSubordinate = (e) =>{
    e.preventDefault();
    setEmployeeId(e.target.value);
  }

  useEffect(()=>{
    if(employeeId){
      customerVisitQuery.refetch()
    }
    
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
                <select className="form-select shadow-none" style={{minWidth: "300px"}} id="subordinates" value={employeeId} onChange={handleChangeSubordinate} aria-label="Default select example">
                  <option value={id}>{`${getUserData().firstName} ${getUserData().lastName}`}</option>
                  {!subordinatesQuery.isLoading && listSubordinates()}
                </select>
              </div>
            </ul>
          </div>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" type="button" disabled={customerVisitQuery.isLoading} data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={customerVisitQuery.isLoading} style={{ height: "40px" }} 
                onClick={() => navigate("/app/visit/schedule")}>Schedule A Visit</button></li>
                <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={customerVisitQuery.isLoading} style={{ height: "40px" }} 
                onClick={() => navigate("/app/visit/report")}>Create Visit Report</button></li>
            </ul>
          </div>
        </header>
        <p>All {employeeId === id ? "your customer visits" : `customer visits for ${getEmployeeData(employeeId).fullName}`}   are listed below</p>
        {employeeId === id && 
          <ul className="nav nav-tabs mt-4">
            <li className="nav-item me-3">
              <button className={`nav-link py-3 px-4 text-dark ${currentTab === "scheduled" && " border border-bottom-0 fw-bold"} `} onClick={() => setCurrentTab("scheduled")}>Scheduled Visits</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link py-3 px-4 text-dark ${currentTab === "reported" && "border border-bottom-0 fw-bold"} `} onClick={() => setCurrentTab("reported")}>Completed Visits</button>
            </li>
          </ul>
        }

        {customerVisitQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Customer Visits <Spinner />
        </div>}
        <ul className='mt-5'>
          {!customerVisitQuery.isLoading && !subordinatesQuery.isLoading && listSortedCustomerVisits()}

          {!customerVisitQuery.isLoading && !customerVisitQuery.isError && customerVisitQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Customer Visit was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomerVisitsSupervisor;