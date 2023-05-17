
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditMarkettingActivityDetails from './editMarkettingActivity';
import { apiGet, apiDelete, apiPut } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const MarkettingActivityDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const MarkettingActivityDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { id } = useParams();
  // const {state} = useLocation();
  const [currentScreen, setCurrentScreen] = useState("details")
  const {staffCadre} = getUserData();
  const [approvingMarketingActivity, setApprovingMarketingActivity] = useState( false );

  const markettingActivityQuery = useQuery({
    queryKey: ["allMarkettingActivities", id],
    queryFn: () => apiGet({url: `/markettingActivity/${id}`}).then( (res) => {
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
    queryFn: () => apiGet({url: `/employee`})
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

  const approveMarketingActivity = () =>{
    setApprovingMarketingActivity(true)
    apiPut({ url: `/markettingActivity/approve/${id}`})
    .then( res =>{
      setApprovingMarketingActivity(false);
      queryClient.invalidateQueries(["allMarkettingActivities", id])
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
    }).catch( error => {
      setApprovingMarketingActivity(false);
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  }

  const markettingActivityDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/markettingActivity/${id}`}).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allMarkettingActivities"])
      navigate("/app/markettingActivity");
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

  const getParticipantName = (id) =>{
    let name = ""
    employeeQuery.data.forEach( employee =>{
      if(employee.id === id){
        name = `${employee.firstName}  ${employee.lastName}`
      }
    })
    return name;
  }

  const listParticipants = () =>{
    let participants = "";
    markettingActivityQuery?.data?.participants.forEach( participantId => {
      if(participants === ""){
        participants += getParticipantName(participantId);
      }else{
        participants += `| ${getParticipantName(participantId)}`;
      }
    })
    return participants
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Marketing Activity Details</h3>

          {!markettingActivityQuery.isLoading && !markettingActivityQuery.isError && markettingActivityQuery.data?.approved && <span className='border border-success text-success py-2 px-3 rounded me-3'>Approved <i className="bi bi-check-circle text-success"></i></span> }
          {staffCadre === "Administrator" && !markettingActivityQuery.isLoading && !markettingActivityQuery.isError && !markettingActivityQuery.data.approved && <button className="btn btnPurple px-4 ms-auto" disabled={approvingMarketingActivity} onClick={approveMarketingActivity}>{approvingMarketingActivity ? <Spinner /> : "Approve"}</button>
          }

          { staffCadre !== "Administrator" && <>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={markettingActivityQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={markettingActivityQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div> 
          </>}
        </header>
        <p>Details of marketing activity listed below</p>

        {markettingActivityQuery?.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Marketing Activity Details <Spinner />
        </div>}

        {!markettingActivityQuery?.isLoading &&
          <ul className='mt-5'>
            <MarkettingActivityDetailListItem title="Marketing Activity Name" description={markettingActivityQuery?.data?.name || "----"} />
            <MarkettingActivityDetailListItem title="Marketing Activity Location" description={markettingActivityQuery?.data?.location || "----"} /> 
            <MarkettingActivityDetailListItem title="Marketing Activity Date" description={new Date(markettingActivityQuery?.data?.date).toDateString() || "----"} />
            <MarkettingActivityDetailListItem title="Objective" description={markettingActivityQuery?.data?.objective || "----"} />
            <MarkettingActivityDetailListItem title="Target Result" description={markettingActivityQuery?.data?.targetResult || "----"} />
            <MarkettingActivityDetailListItem title="Cost Incurred" description={formatAsCurrency(markettingActivityQuery?.data?.costIncurred) || "----"} />
            <MarkettingActivityDetailListItem title="Participants" description={(employeeQuery?.data?.length > 0 && listParticipants(markettingActivityQuery?.data?.participants)) || "----"} />
            <MarkettingActivityDetailListItem title="Approved" description={markettingActivityQuery?.data?.approved ? "Yes" : "No"} />
            <div className='d-flex flex-column mt-3'>
              <h6 className='small fw-bold'>Brief Report</h6>
              <p>{markettingActivityQuery?.data?.briefReport}</p>
            </div>
            <div className='d-flex flex-column mt-3'>
              <h6 className='small fw-bold'>Pictures from Event</h6>
              <figure>
                {markettingActivityQuery?.data?.pictures.map(image => <img key={image} src={image} className="m-2" alt="Product" width="200px" />)}
              </figure>
            </div>
            <MarkettingActivityDetailListItem title="Date Created" description={new Date(markettingActivityQuery.data.createdAt).toLocaleString()  || "----"} />
            <MarkettingActivityDetailListItem title="Last Updated" description={new Date(markettingActivityQuery.data.updatedAt).toLocaleString()  || "----"} />
          </ul>}


      </section>}

      {currentScreen === "editDetails" && 
        <EditMarkettingActivityDetails handleCancel={()=>setCurrentScreen("details")} data={markettingActivityQuery?.data} />
      }
    </Layout>

  )
}

export default MarkettingActivityDetails;