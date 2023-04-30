
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditWeeklyVisitPlan from './editWeeklyVisitPlan';
import EditMonthlyVisitPlan from './editMonthlyVisitPlan';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const VisitPlanDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const VisitPlanDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getUserData();

  const {state} = useLocation();
  const queryClient = useQueryClient();
  const { id, type } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details");


  const visitPlanDetailsQuery = useQuery({
    queryKey: [`all${type}VisitPlans`, id],
    queryFn: () => apiGet({url: `/${type}VisitPlan/${id}`})
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

  const visitPlanDeletion = useMutation({
    mutationFn: ()=> apiDelete({url: `/${type}VisitPlan/${id}`}).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries([`all${type}VisitPlans`])
      navigate("/app/plan");
    }).catch(error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto text-capitalize'>{type} Visit Plan Details</h3>

          { userData.staffCadre !== "Administrator" &&
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={visitPlanDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={visitPlanDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>}
        </header>
        <p>Details of {type} visit plan listed below</p>

        {visitPlanDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching {type} visit plan Details <Spinner />
        </div>}

          {!visitPlanDetailsQuery.isLoading &&
          <ul className='mt-5'>
            {visitPlanDetailsQuery.data.week && <VisitPlanDetailListItem title="Week" description={visitPlanDetailsQuery.data.week || "----"} />}
            <VisitPlanDetailListItem title="Month" description={visitPlanDetailsQuery.data.month || "----"} />
            <VisitPlanDetailListItem title="Visit Plan" description={visitPlanDetailsQuery.data.description || "----"} />
          </ul>}
      </section>}


      <ConfirmDeleteModal entity="VisitPlan" onClick={() => visitPlanDeletion.mutate()} isLoading={visitPlanDeletion.isLoading} />

      {currentScreen === "editDetails" && 
      <>
        {type === "weekly" && <EditWeeklyVisitPlan data={visitPlanDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />}
        {type === "monthly" && <EditMonthlyVisitPlan data={visitPlanDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />}
      </>
      }
    </Layout>

  )
}

export default VisitPlanDetails;