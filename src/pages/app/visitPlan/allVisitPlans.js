
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';



const VisitPlanListItem = ({handleClick}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate("/app/plan/r355645")}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-car-front text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>Name of Visit Plan</span> <br />
          <span> Other details about the visit plan</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>Stock count</span>
      </div>
    </li>
  )
}


const AllVisitPlans = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Visit Plans</h3>
          <a href='/app/plan/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Visit Plans are listed below</p>

        <ul className='mt-5'>
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
          <VisitPlanListItem />
        </ul>
      </section>
    </Layout>

  )
}

export default AllVisitPlans;
