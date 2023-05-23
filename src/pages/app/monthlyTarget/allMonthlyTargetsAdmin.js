
import '../../../styles/auth.styles.css';
import { Fragment, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';



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


const AllMonthlyTargetsAdmin = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("approved");

  const monthlyTargetQuery = useQuery({
    queryKey: ["allMonthlyTargets"],
    queryFn: () => apiGet({url: "/monthlyTarget"})
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

  const sortMonthlyTargets = () =>{
    let data = monthlyTargetQuery.data
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

  /* const returnListOfMonthlyTargets = (type, length = false) =>{

    if(monthlyTargetQuery?.data?.length){
      let list;
      if(type === "approved"){
        list = monthlyTargetQuery.data.filter( data =>  data.approved === true)
      }else if(type === "pendingApproval"){
        list = monthlyTargetQuery.data.filter( data =>  data.approved === false)
      }

      if(length){
        return list.length
      }
      return list
    }
  } */

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

  const listSortedMonthlyTargets = (type) =>{
    let sortedMonthlyTargets = sortMonthlyTargets(type);

    let keys = Object.keys(sortedMonthlyTargets);
    return keys.map( key => {
      let data = getEmployeeData(key)
      return (<Fragment key={key}>
        <li className='h6 fw-bold mt-4 fs-6'>
          <a className='small' href={`/app/employee/${data.id}`}>{data.fullName} ({data.email})</a>
        </li>
        
        {sortedMonthlyTargets[key].map( monthlyTarget => {
          return (
            <MonthlyTargetListItem
              id={monthlyTarget.id}
              key={monthlyTarget.id}
              month={monthlyTarget.month}
              numOfProductTargets={monthlyTarget.monthlyTarget.length}
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
          <h3 className='fw-bold me-auto'>All Monthly Targets</h3>
        </header>
        <p>All Monthly Targets are listed below</p>


        {monthlyTargetQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Monthly Targets <Spinner />
        </div>}
        <ul className='mt-5'>
          {!monthlyTargetQuery.isLoading && !employeeQuery.isLoading && listSortedMonthlyTargets(currentTab)}

          {!monthlyTargetQuery.isLoading && !monthlyTargetQuery.isError && monthlyTargetQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Monthly Target was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllMonthlyTargetsAdmin;