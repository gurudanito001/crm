
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditMarkettingActivityDetails from './editMarkettingActivity';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';

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
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {state} = useLocation()
  const [currentScreen, setCurrentScreen] = useState("details")

  const dataQuery = useQuery({
    queryKey: ["allMarkettingActivities", id],
    queryFn: () => apiGet({url: `/markettingActivity/${id}`}).then( (res) => {
      setMarkettingActivityQuery( prevState =>({
      ...prevState,
      data: {...prevState.data, ...res.payload}
      }))
      return res.payload
    }),
    //onSuccess: () =>{ console.log(markettingActivityQuery.data)}
  })

  const [markettingActivityQuery, setMarkettingActivityQuery] = useState({
    isLoading: false,
    isError: false,
    data: state
  })

  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({url: `/employee`}).then( (res) => res.payload),
    onSuccess: () =>{ console.log(employeeQuery.data)}
  })

  const markettingActivityDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/markettingActivity/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allMarkettingActivities"])
      navigate("/app/markettingActivity");
    }
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
    markettingActivityQuery.data.participants.forEach( participantId => {
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
          <h3 className='fw-bold me-auto'>Marketting Activity Details</h3>

          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={markettingActivityQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={markettingActivityQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>
        </header>
        <p>Details of invoice request listed below</p>

        {markettingActivityQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Marketting Activity Details <Spinner />
        </div>}

        {!markettingActivityQuery.isLoading &&
          <ul className='mt-5'>
            <MarkettingActivityDetailListItem title="Marketting Activity Name" description={markettingActivityQuery.data.name || "----"} />
            <MarkettingActivityDetailListItem title="Marketting Activity Location" description={markettingActivityQuery.data.location || "----"} /> 
            <MarkettingActivityDetailListItem title="Marketting Activity Date" description={new Date(markettingActivityQuery.data.date).toDateString() || "----"} />
            <MarkettingActivityDetailListItem title="Objective" description={markettingActivityQuery.data.objective || "----"} />
            <MarkettingActivityDetailListItem title="Target Result" description={markettingActivityQuery.data.targetResult || "----"} />
            <MarkettingActivityDetailListItem title="Cost Incurred" description={markettingActivityQuery.data.costIncurred || "----"} />
            <MarkettingActivityDetailListItem title="Participants" description={(employeeQuery?.data?.length > 0 && listParticipants(markettingActivityQuery.data.participants)) || "----"} />
            <div className='d-flex flex-column mt-3'>
              <h6 className='small fw-bold'>Brief Report</h6>
              <p>{markettingActivityQuery.data.briefReport}</p>
            </div>
            <div className='d-flex flex-column mt-3'>
              <h6 className='small fw-bold'>Pictures from Event</h6>
              <figure>
                {markettingActivityQuery.data.pictures.map(image => <img key={image} src={image} className="m-2" alt="Product" width="200px" />)}
              </figure>
            </div>
          </ul>}


      </section>}

      {currentScreen === "editDetails" && 
        <EditMarkettingActivityDetails handleCancel={()=>setCurrentScreen("details")} data={markettingActivityQuery.data} />
      }
    </Layout>

  )
}

export default MarkettingActivityDetails;