
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditContactPersonDetails from './editContactPersonDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import ListItem from '../../../components/listItem';
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';

const ContactPersonDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}:</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const ContactPersonDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {state} = useLocation();
  const [currentScreen, setCurrentScreen] = useState("details")

  const contactPersonDetailsQuery = useQuery({
    queryKey: ["allContactPersons", id],
    queryFn: () => apiGet({url: `/contactPerson/${id}`})
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

  const contactPersonDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/contactPerson/${id}`}).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allContactPersons"])
      navigate("/app/contactPerson");
    })
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Contact Person Details</h3>

          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={contactPersonDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={contactPersonDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>
        </header>
        <p>Details of Contact Person listed below</p>

        {contactPersonDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Contact Person Details <Spinner />
        </div>}


        {!contactPersonDetailsQuery.isLoading && !contactPersonDetailsQuery.isError &&
        <ul className='mt-5'>
          {state?.companyName && 
          <ContactPersonDetailListItem title="Company Name" description={state?.companyName || "----"} />}
          <ContactPersonDetailListItem title="Full Name" description={`${contactPersonDetailsQuery.data.title || ""} ${contactPersonDetailsQuery.data.firstName || ""} ${contactPersonDetailsQuery.data.lastName || ""}` || "----"} />
          <ContactPersonDetailListItem title="Email" description={contactPersonDetailsQuery.data.email || "----"} />
          <ContactPersonDetailListItem title="Department" description={contactPersonDetailsQuery.data.department || "----"} />
          <ContactPersonDetailListItem title="Designation" description={contactPersonDetailsQuery.data.designation || "----"} />
          <ContactPersonDetailListItem title="Role" description={contactPersonDetailsQuery.data.role || "----"} />
          <ContactPersonDetailListItem title="Phone Number 1" description={contactPersonDetailsQuery.data.phoneNumber1 || "----"} />
          <ContactPersonDetailListItem title="Phone Number 2" description={contactPersonDetailsQuery.data.phoneNumber2 || "----"} />
          <ContactPersonDetailListItem title="Date Created" description={new Date(contactPersonDetailsQuery.data.createdAt).toLocaleString()  || "----"} />
          <ContactPersonDetailListItem title="Last Updated" description={new Date(contactPersonDetailsQuery.data.updatedAt).toLocaleString()  || "----"} />
        </ul>}
      </section>}

      {/* <ConfirmDeleteModal entity="ContactPerson" onClick={() => contactPersonDeletion.mutate()} isLoading={contactPersonDeletion.isLoading} /> */}


      {currentScreen === "editDetails" && 
        <EditContactPersonDetails data={contactPersonDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default ContactPersonDetails;