
import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const CustomerVisitListItem = ({ id, companyName, personToVisitName, meetingDate, meetingTime, meetingVenue }) =>{
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
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{meetingDate}; {meetingTime} </span>
      </div>
    </li>
  )
}


const AllCustomerVisitsEmployee = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("scheduled")
  const navigate = useNavigate();
  let {id} = getUserData();


  const customerVisitQuery = useQuery({
    queryKey: ["allCustomerVisits"],
    queryFn: () => apiGet({url: `/customerVisit/employee/${id}`})
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


  const listCustomerVisits = (type) =>{
    if(customerVisitQuery?.data?.length){
      let list;
      if(type === "scheduled"){
        list = customerVisitQuery.data.filter( data =>  data.visitReportId === null)
      }else if(type === "reported"){
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
        />
      )
    }
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Customer Visits</h3>
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
        
        <ul className="nav nav-tabs mt-4">
          <li className="nav-item me-3">
            <button className={`nav-link py-3 px-4 text-dark ${currentTab === "scheduled" && " border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("scheduled")}>Scheduled Visits</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link py-3 px-4 text-dark ${currentTab === "reported" && "border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("reported")}>Completed Visits</button>
          </li>
        </ul>
        {customerVisitQuery.isLoading && <div className='mt-5 text-center h6 fw-bold text-secondary'>
            Fetching Customer Visits <Spinner />
        </div>}
        <ul className='mt-5'>
          {currentTab === "scheduled" && <>{listCustomerVisits("scheduled")}</>}
          {currentTab === "reported" && <>{listCustomerVisits("reported")}</>}

          {!customerVisitQuery.isLoading && !customerVisitQuery.isError && customerVisitQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Customer Visit was found !!</p>
              <span className='text-info'>Click on the dropdown to schedule a new Customer Visit</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomerVisitsEmployee;