
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditPfiRequestDetails from './editPfiRequest';
import { apiGet } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';

const PfiRequestDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const PfiRequestDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const pfiRequestDetailsQuery = useQuery({
    queryKey: ["allPfiRequests", id],
    queryFn: () => apiGet({url: `/pfiRequestForm/${id}`}).then( (res) => res.payload),
    onSuccess: () =>{ console.log(pfiRequestDetailsQuery.data)}
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>PFI Request Details</h3>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={pfiRequestDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={pfiRequestDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
        </header>
        <p>Details of PFI request listed below</p>

        {pfiRequestDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching PFI Request Details <Spinner />
        </div>}

        {!pfiRequestDetailsQuery.isLoading &&
        <ul className='mt-5'>
          <PfiRequestDetailListItem title="Company Name" description={pfiRequestDetailsQuery.data.companyName || "----"} />
          <PfiRequestDetailListItem title="Company Address" description={pfiRequestDetailsQuery.data.companyAddress || "----"} />
          <PfiRequestDetailListItem title="Contact Person" description={pfiRequestDetailsQuery.data.contactPerson || "----"} />
          <PfiRequestDetailListItem title="Phone Number" description={pfiRequestDetailsQuery.data.mobile || "----"} />
          <PfiRequestDetailListItem title="Designation" description={pfiRequestDetailsQuery.data.designation || "----"} />
          <PfiRequestDetailListItem title="Email Address" description={pfiRequestDetailsQuery.data.emailAddress || "----"} />
          <PfiRequestDetailListItem title="Product Brand" description={pfiRequestDetailsQuery.data.productBrand || "----"} />
          <PfiRequestDetailListItem title="Vehicle Model" description={pfiRequestDetailsQuery.data.vehicleModel || "----"} />
          <PfiRequestDetailListItem title="Cost Of Body Special Fitment" description={formatAsCurrency(pfiRequestDetailsQuery.data.costOfBodySpecialFitment) || "----"} />
          <PfiRequestDetailListItem title="Quantity" description={pfiRequestDetailsQuery.data.quantity || "----"} />
          <PfiRequestDetailListItem title="Price of Vehicle" description={formatAsCurrency(pfiRequestDetailsQuery.data.priceOfVehicle) || "----"} />
          <PfiRequestDetailListItem title="Discount" description={pfiRequestDetailsQuery.data.discount || "----"} />
          <PfiRequestDetailListItem title="VAT Deduction" description={`${pfiRequestDetailsQuery.data.vatDeduction}` || "----"} />
          <PfiRequestDetailListItem title="WHT Deduction" description={`${pfiRequestDetailsQuery.data.whtDeduction}` || "----"} />
          <PfiRequestDetailListItem title="Registration" description={`${pfiRequestDetailsQuery.data.registration}` || "----"} />
          <PfiRequestDetailListItem title="Refund/Rebase Amount" description={formatAsCurrency(pfiRequestDetailsQuery.data.refundRebaseAmount) || "----"} />
          <PfiRequestDetailListItem title="Refund/Rebase Recipient" description={pfiRequestDetailsQuery.data.refundRebaseRecipient || "----"} />
          <PfiRequestDetailListItem title="Relationship with Transaction" description={pfiRequestDetailsQuery.data.relationshipWithTransaction || "----"} />
          <PfiRequestDetailListItem title="Estimated Order Closing Time" description={pfiRequestDetailsQuery.data.estimatedOrderClosingTime || "----"} />
          <PfiRequestDetailListItem title="Delivery Period" description={pfiRequestDetailsQuery.data.deliveryPeriod || "----"} />
          <PfiRequestDetailListItem title="Payment Type" description={pfiRequestDetailsQuery.data.paymentType || "----"} />
          <PfiRequestDetailListItem title="Delivery Location" description={pfiRequestDetailsQuery.data.deliveryLocation || "----"} />
          <PfiRequestDetailListItem title="Body Type Description" description={pfiRequestDetailsQuery.data.bodyTypeDescription || "----"} />
          <PfiRequestDetailListItem title="Vehicle Service Details" description={pfiRequestDetailsQuery.data.vehicleServiceDetails || "----"} />
          <PfiRequestDetailListItem title="Vehicle Special Fitment Details" description={pfiRequestDetailsQuery.data.vehicleSpecialFitmentDetails || "----"} />
          <PfiRequestDetailListItem title="Additional Information" description={pfiRequestDetailsQuery.data.additionalInformation || "----"} />
        </ul>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditPfiRequestDetails data={pfiRequestDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default PfiRequestDetails;