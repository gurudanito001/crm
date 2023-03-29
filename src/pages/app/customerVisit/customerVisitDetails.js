
import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import EditCustomerDetails from './editCustomerVisitDetails';
import { apiGet } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate,  } from 'react-router-dom';
import { Spinner } from '../../../components/spinner';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import ListItem from '../../../components/listItem';
import convertMinutes from '../../../services/convertToMinsHours';

const CustomerVisitDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}:</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const CustomerVisitDetails = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("details")
  const { id } = useParams();
  const [visitReport, setVisitReport] = useState({});
  const customerVisitDetailsQuery = useQuery({
    queryKey: ["allCustomerVisits", id],
    queryFn: () => apiGet({url: `/customerVisit/${id}`}).then( (res) =>{ 
      return res.payload
    }),
    onSuccess: (data) =>{
      if(data.visitReportId){
        fetchCustomerVisitReport(data.visitReportId)
      }
    }
  })


/*   useEffect(()=>{
    if(customerVisitDetailsQuery?.data?.visitReportId){
      fetchCustomerVisitReport(customerVisitDetailsQuery.data.visitReportId)
    }
  },[customerVisitDetailsQuery]) */

  const fetchCustomerVisitReport = (id) =>{
    apiGet({url: `/customerVisitReport/${id}`})
    .then(res =>{
      console.log(res.payload);
      setVisitReport(res.payload);
    })
    .catch(error =>{
      console.log(error)
    })
  }

  const listProductsDiscussed = () =>{
    let products = ""
    visitReport.productsDiscussed.forEach( data => {
      if(products === ""){
        products += `${data}`
      }else{
        products += ` | ${data}`
      }
    })
    return products;
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Customer Visit Details</h3>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={customerVisitDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              {<li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={customerVisitDetailsQuery?.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>}
              { !customerVisitDetailsQuery?.data?.visitReportId && <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={customerVisitDetailsQuery?.isLoading} style={{ height: "40px" }} onClick={() => navigate("/app/visit/report", { state: { customerVisitId: id } })}>Add Visit Report</button></li>}
            </ul>
          </div>
        </header>
        <p>Details of customer visit listed below</p>

        {customerVisitDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Customer Visit Details <Spinner />
        </div>}

        { !customerVisitDetailsQuery.isLoading &&
        <ul className='mt-5'>
          <CustomerVisitDetailListItem title="Company Name" description={customerVisitDetailsQuery.data.companyName}/>
          <CustomerVisitDetailListItem title="Contact Person" description={customerVisitDetailsQuery.data.personToVisitName}/>
          <CustomerVisitDetailListItem title="Meeting Date" description={new Date(customerVisitDetailsQuery.data.meetingDate).toDateString()}/>
          <CustomerVisitDetailListItem title="Meeting Time" description={customerVisitDetailsQuery.data.meetingTime}/>
          <CustomerVisitDetailListItem title="Meeting Purpose" description={customerVisitDetailsQuery.data.meetingPurpose}/>
          <CustomerVisitDetailListItem title="Meeting Venue" description={customerVisitDetailsQuery.data.meetingVenue}/>

          {Object.keys(visitReport).length > 0 && <>
            <CustomerVisitDetailListItem title="Call Type" description={visitReport.callType.toUpperCase()}/>
            <CustomerVisitDetailListItem title="Duration Of Meeting" description={convertMinutes(visitReport.durationOfMeeting)}/>
            <CustomerVisitDetailListItem title="Meeting Outcome" description={visitReport.meetingOutcome}/>
            <CustomerVisitDetailListItem title="Price" description={visitReport.price}/>
            <CustomerVisitDetailListItem title="Products Discussed" description={listProductsDiscussed(visitReport.productsDiscussed)}/>
            <CustomerVisitDetailListItem title="Quantity" description={visitReport.quantity}/>
            <CustomerVisitDetailListItem title="Status" description={visitReport.status}/>
          </>}
        </ul>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditCustomerDetails customerVisitScheduleData={customerVisitDetailsQuery.data} customerVisitReportData={visitReport} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default CustomerVisitDetails;