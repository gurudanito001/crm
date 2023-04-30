
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditMonthlyTargetDetails from './editMonthlyTarget';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';

const MonthlyTargetDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const MonthlyTargetDetails = () => {
  const navigate = useNavigate();
  let {staffCadre} = getUserData();
  const dispatch = useDispatch();
  const [currentScreen, setCurrentScreen] = useState("details");
  const queryClient = useQueryClient();
  const { id } = useParams();

  const monthlyTargetDetailsQuery = useQuery({
    queryKey: ["allMonthlyTargets", id],
    queryFn: () => apiGet({ url: `/monthlyTarget/${id}` })
    .then((res) => res.payload)
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

  const listMonthlyTargets = () =>{
    if(monthlyTargetDetailsQuery.data?.monthlyTarget?.length > 0){
      return monthlyTargetDetailsQuery.data.monthlyTarget.map( (item, index) =>
        <li key={index} className='py-2 d-flex flex-row align-items-lg-center border-bottom'>
          <header className="small text-uppercase col-8">{item.product}</header>
          <p className='fw-bold col'>{item.number}</p>
        </li>
      )
    }
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Monthly Target Details</h3>
          
          {staffCadre !== "Administrator" && <>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={monthlyTargetDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={monthlyTargetDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
          </>}
        </header>
        <p>Details of Monthly Target listed below</p>

        {monthlyTargetDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Monthly Target Details <Spinner />
        </div>}

        {!monthlyTargetDetailsQuery.isLoading && !monthlyTargetDetailsQuery.isError &&
          <ul className='mt-5'>
            <MonthlyTargetDetailListItem title="Month" description={monthlyTargetDetailsQuery.data.month || "----"} />
            <MonthlyTargetDetailListItem title="Plan For Month" description={monthlyTargetDetailsQuery.data.planForMonth || "----"} />
          </ul>}

          <ul>
            <li className='py-2 d-flex flex-row align-items-lg-center border-bottom mt-4'>
              <h6 className="col-8">Product</h6>
              <h6 className='fw-bold col'>Target For Month</h6>
            </li>
            {listMonthlyTargets()}
          </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditMonthlyTargetDetails data={monthlyTargetDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>
  )
}

export default MonthlyTargetDetails;