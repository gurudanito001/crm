
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



const MonthlyTargetListItem = ({id, month, numOfProductTargets}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/targetAchievements/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-bullseye text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'> Targets and Achievement for {month}</span> <br />
          <span>{numOfProductTargets} product target(s)</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{month}</span>
      </div>
    </li>
  )
}


const AllMonthlyTargetsSupervisor = () => {
  const dispatch = useDispatch();
  let {id} = getUserData();
  const [currentTab, setCurrentTab] = useState("approved")
  const [employeeId, setEmployeeId] = useState(id);

  const monthlyTargetQuery = useQuery({
    queryKey: ["allMonthlyTargets"],
    queryFn: () => apiGet({url: `/monthlyTarget/employee/${employeeId}`})
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

  const listAllMonthlyTargets = (type, length = false) =>{

    if(monthlyTargetQuery?.data?.length){
      return monthlyTargetQuery?.data?.map(monthlyTarget =>
        <MonthlyTargetListItem
          id={monthlyTarget.id}
          key={monthlyTarget.id}
          month={monthlyTarget.month}
          numOfProductTargets={monthlyTarget.monthlyTarget.length}
        />
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

  const handleChangeSubordinate = (e) =>{
    e.preventDefault();
    setEmployeeId(e.target.value);
    
  }

  useEffect(()=>{
    if(employeeId){
      monthlyTargetQuery.refetch()
    }
    
  }, [employeeId])

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Monthly Targets</h3>
          <div className="btn-group me-2">
            <button className="btn btn-sm border-secondary rounded" type="button" disabled={monthlyTargetQuery.isLoading} data-bs-toggle="dropdown" aria-expanded="false">
              { monthlyTargetQuery.isFetching ? <Spinner /> : <i className="bi bi-filter fs-5"></i>} 
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
          <a href='/app/targetAchievements/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All {employeeId === id ? "your Monthly Targets" : `Monthly Targets for ${getEmployeeData(employeeId).fullName}`} are listed below</p>

        {monthlyTargetQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Monthly Targets <Spinner />
        </div>}
        <ul className='mt-5'>
          {!monthlyTargetQuery.isLoading && !monthlyTargetQuery.isError && listAllMonthlyTargets(currentTab)}

          {!monthlyTargetQuery.isLoading && !monthlyTargetQuery.isError && monthlyTargetQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No MonthlyTarget was found !!</p>
              <span className='text-info'>Click the [+Add] button to add a new monthlyTarget</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllMonthlyTargetsSupervisor;