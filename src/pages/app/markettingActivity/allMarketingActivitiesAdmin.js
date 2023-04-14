
import '../../../styles/auth.styles.css';
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { useState, Fragment } from 'react';


const MarkettingActivityListItem = ({id, name, date, location }) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/markettingActivity/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-rocket-takeoff text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
          <span>{location}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{new Date(date).toDateString()}</span>
      </div>
    </li>
  )
}


const AllMarkettingActivitiesAdmin = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("approved");

  const markettingActivityQuery = useQuery({
    queryKey: ["allMarkettingActivities"],
    queryFn: () => apiGet({url: "/markettingActivity"}).then( (res) =>{
      console.log(res.payload)
      return res.payload
    }).catch( error =>{
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

  const sortMarketingActivities = (type) =>{
    let data = returnListOfMarketingActivities(type);
    let sortedData = {};
    if(data?.length){
      data.forEach( item => {
        if(sortedData[item.employeeId]){
          sortedData[item.employeeId].push(item) 
        }else{
          sortedData[item.employeeId] = [item]
        }
      })
    }
    return sortedData;
  }

  const returnListOfMarketingActivities = (type, length = false) =>{

    if(markettingActivityQuery?.data?.length){
      let list;
      if(type === "approved"){
        list = markettingActivityQuery.data.filter( data =>  data.approved === true)
      }else if(type === "pendingApproval"){
        list = markettingActivityQuery.data.filter( data =>  data.approved === false)
      }

      if(length){
        return list.length
      }
      return list
    }
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

  const listSortedMarketingActivities = (type) =>{
    let sortedMarketingActivities = sortMarketingActivities(type);

    let keys = Object.keys(sortedMarketingActivities);
    return keys.map( key => {
      let data = getEmployeeData(key)
      return (<Fragment key={key}>
        <li className='h6 fw-bold mt-4 fs-6'>
          <a className='small' href={`/app/employee/${data.id}`}>{data.fullName} ({data.email})</a>
        </li>
        
        {sortedMarketingActivities[key].map( activity => {
          return (
            <MarkettingActivityListItem
              id={activity.id}
              key={activity.id}
              name={activity.name}
              date={new Date(activity.date).toDateString()}
              location={activity.location}
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
          <h3 className='fw-bold me-auto'>All Marketing Activities</h3>
        </header>
        <p>All your Marketing Activities are listed below</p>

        <ul className="nav nav-tabs mt-4">
          <li className="nav-item me-3">
            <button className={`nav-link py-3 px-4 text-dark ${currentTab === "approved" && " border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("approved")}>Approved</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link py-3 px-4 text-dark d-flex align-items-center ${currentTab === "pendingApproval" && "border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("pendingApproval")}>Pending Approval { returnListOfMarketingActivities("pendingApproval", true) > 0 && <span className="badge text-bg-secondary ms-2">{returnListOfMarketingActivities("pendingApproval", true)}</span>}</button>
          </li>
        </ul>

        {markettingActivityQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Marketing Activities <Spinner />
        </div>}

        <ul className='mt-5'>
          {!markettingActivityQuery.isLoading && !markettingActivityQuery.isError  && listSortedMarketingActivities(currentTab)}

          {!markettingActivityQuery.isLoading && !markettingActivityQuery.isError && markettingActivityQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
            <p className='h6 fw-bold'>No Marketing Activity was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>
  )
}

export default AllMarkettingActivitiesAdmin;