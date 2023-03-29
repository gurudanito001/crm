
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const VisitPlanListItem = ({id, monthlyVisitPlan, weeklyVisitPlan}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/plan/${id}`)}>
      <div className='w-75 d-flex align-items-start pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-calendar3 text-white fs-5"></i></span>
        <div>
          <article>
            <span className='h6 fw-bold'>Weekly Visit Plan</span> <br />
            <span>{weeklyVisitPlan}</span>
          </article>

          <article className='mt-3'>
            <span className='h6 fw-bold'>Monthly Visit Plan</span> <br />
            <span>{monthlyVisitPlan}</span>
          </article>
        </div>
        
      </div>
    </li>
  )
}


const AllVisitPlans = () => {
  const [showNotification, setShowNotification] = useState(false);

  const visitPlanQuery = useQuery({
    queryKey: ["allVisitPlans"],
    queryFn: () => apiGet({url: "/visitPlan"}).then( (res) => res.payload)
  })

  const listAllVisitPlans = () =>{
    return visitPlanQuery.data.map( visitPlan => <VisitPlanListItem 
      id={visitPlan.id}
      key={visitPlan.id}
      monthlyVisitPlan={visitPlan.monthlyVisitPlan}
      weeklyVisitPlan={visitPlan.weeklyVisitPlan}
    />)
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Visit Plans</h3>
          <a href='/app/plan/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Visit Plans are listed below</p>

        {visitPlanQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Visit Plans <Spinner />
        </div>}

        <ul className='mt-5'>
        {!visitPlanQuery.isLoading && !visitPlanQuery.isError && listAllVisitPlans()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllVisitPlans;
