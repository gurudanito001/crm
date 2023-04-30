
import '../../../styles/auth.styles.css';
import { useState } from "react";
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
        <span className='bgPurple p-3 me-3'><i className="bi bi-cash text-white fs-5"></i></span>
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


const AllMonthlyTargetsEmployees = () => {
  const dispatch = useDispatch();
  let {id} = getUserData();
  const [currentTab, setCurrentTab] = useState("approved")

  const monthlyTargetQuery = useQuery({
    queryKey: ["allMonthlyTargets"],
    queryFn: () => apiGet({url: `/monthlyTarget/employee/${id}`})
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

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Monthly Targets</h3>
          <a href='/app/targetAchievements/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All your Monthly Targets are listed below</p>

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

export default AllMonthlyTargetsEmployees;