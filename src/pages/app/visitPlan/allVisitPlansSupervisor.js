
import '../../../styles/auth.styles.css';
import { useState, useEffect, Fragment } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const VisitPlanListItem = ({id, week, month, description = ""}) =>{
  const navigate = useNavigate();
  
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/plan/${week ? "weekly" : "monthly"}/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-car-front text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{week || "Monthly"} Visit Plan</span> <br />
          <span>{description.substring(0, 50)} {description.length > 50 && "..."}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{month}</span>
      </div>
    </li>
  )
}


const AllVisitPlansSupervisor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("weekly");
  const {id} = getUserData();
  const [employeeId, setEmployeeId] = useState(id);

  const weeklyVisitPlanQuery = useQuery({
    queryKey: ["allweeklyVisitPlans"],
    queryFn: () => apiGet({url: `/weeklyVisitPlan/employee/${employeeId}`})
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

  const monthlyVisitPlanQuery = useQuery({
    queryKey: ["allmonthlyVisitPlans"],
    queryFn: () => apiGet({url: `/monthlyVisitPlan/employee/${id}`})
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

  /* const listAllVisitPlans = () =>{
    if(weeklyVisitPlanQuery?.data?.length){
      return weeklyVisitPlanQuery.data.map( visitPlan => <VisitPlanListItem 
        id={visitPlan.id}
        key={visitPlan.id}
        week={visitPlan.week}
        month={visitPlan.month}
        description={visitPlan.description}
      />)
    }
  }

  const listAllMonthlyVisitPlans = () =>{
    if(monthlyVisitPlanQuery?.data?.length){
      return monthlyVisitPlanQuery.data.map( visitPlan => <VisitPlanListItem 
        id={visitPlan.id}
        key={visitPlan.id}
        month={visitPlan.month}
        description={visitPlan.description}
      />)
    }
  } */


  /* const employeeQuery = useQuery({
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
  }) */

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

  const visitPlansData = (type) =>{
    let data;
    if(type === "weekly"){
      data = weeklyVisitPlanQuery.data
    }else{
      data = monthlyVisitPlanQuery.data
    }
    
    return data;
  }

  const listVisitPlans = () =>{
    let visitPlans = visitPlansData(currentTab);
    if(visitPlans){
      return visitPlans.map( item =>{
        return (
          <VisitPlanListItem
          id={item.id}
          key={item.id}
          week={item.week}
          month={item.month}
          description={item.description}
          />
        )
      })
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

  const handleChangeSubordinate = (e) =>{
    e.preventDefault();
    setEmployeeId(e.target.value);
    
  }

  useEffect(()=>{
    if(employeeId){
      weeklyVisitPlanQuery.refetch()
      monthlyVisitPlanQuery.refetch()
    }
    
  }, [employeeId])

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Visit Plans</h3>
          <div className="btn-group me-2">
            <button className="btn btn-sm border-secondary rounded" type="button" disabled={weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading} data-bs-toggle="dropdown" aria-expanded="false">
              { (weeklyVisitPlanQuery.isFetching || monthlyVisitPlanQuery.isFetching) ? <Spinner /> : <i className="bi bi-filter fs-5"></i>} 
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
            <button className="btn btn-sm border-secondary rounded" disabled={weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading} style={{ height: "40px" }} onClick={() =>navigate('/app/plan/weekly/add')}>Add Weekly Plan</button></li>
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading} style={{ height: "40px" }} onClick={() =>navigate('/app/plan/monthly/add')}>Add Monthly Plan</button></li>
            </ul>
          </div>
        </header>
        <p>All {employeeId === id ? "your Visit Plans" : `Visit Plans for ${getEmployeeData(employeeId).fullName}`} are listed below</p>

        <ul className="nav nav-tabs mt-4">
          <li className="nav-item me-3">
            <button className={`nav-link py-3 px-4 text-dark ${currentTab === "weekly" && " border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("weekly")}>Weekly Visit Plan</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link py-3 px-4 text-dark ${currentTab === "monthly" && "border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("monthly")}>Monthly Visit Plan</button>
          </li>
        </ul>

        {(weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading) && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Visit Plans <Spinner />
        </div>}

        <ul className='mt-5'>
        {(!weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading) && (!weeklyVisitPlanQuery.isError || monthlyVisitPlanQuery.isError) && (listVisitPlans())}

        {(!weeklyVisitPlanQuery.isLoading || monthlyVisitPlanQuery.isLoading) && (!weeklyVisitPlanQuery.isError || monthlyVisitPlanQuery.isError) && (weeklyVisitPlanQuery?.data?.length === 0 || weeklyVisitPlanQuery?.data?.length === 0) && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Visit Plan was found !!</p>
              <span className='text-info'>Click on the dropdown to add a new visit plan</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllVisitPlansSupervisor;
