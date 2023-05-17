
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditPfiRequestDetails from './editPfiRequest';
import { apiGet, apiPut } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';

const PfiRequestDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-6">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const PfiRequestDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {staffCadre} = getUserData();

  const pfiRequestDetailsQuery = useQuery({
    queryKey: ["allPfiRequests", id],
    queryFn: () => apiGet({url: `/pfiRequestForm/${id}`})
    .then( (res) => {
      console.log(res.payload)
      return res.payload
    })
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

  const vehicleAccordionItems = () =>{
    return pfiRequestDetailsQuery.data.pfiVehiclesData.map( (item, index) =>{
      return(
        <div key={index} className="accordion-item mb-2">
          <h2 className="accordion-header">
            <button className={`accordion-button`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
              {item.quantity} {item.productBrand} for {formatAsCurrency(item.priceOfVehicle)} each
            </button>
          </h2>
          <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <ul className="accordion-body">
              <PfiRequestDetailListItem title="Product Brand" description={item.productBrand || "----"} />
              <PfiRequestDetailListItem title="Vehicle Model Specific Details" description={item.vehicleModel || "----"} />
              <PfiRequestDetailListItem title="Body Type Description" description={item.bodyTypeDescription || "----"} />
              <PfiRequestDetailListItem title="Any Vehicle Service Given Details" description={item.vehicleServiceDetails || "----"} />
              <PfiRequestDetailListItem title="Body Special Fitment Details" description={item.vehicleSpecialFitmentDetails || "----"} />
              <PfiRequestDetailListItem title="Cost for Body/Super Structure/Special Fitment" description={item.costOfBodySpecialFitment || "----"} />
              <PfiRequestDetailListItem title="Quantity" description={item.quantity || "----"} />
              <PfiRequestDetailListItem title="Price Per Vehicle" description={item.priceOfVehicle || "----"} />
              <PfiRequestDetailListItem title="Discount" description={item.discount || "----"} />
              <PfiRequestDetailListItem title="VAT Deduction" description={`${item.vatDeduction ? "Yes" : "No"}`} />
              <PfiRequestDetailListItem title="WHT Deduction" description={`${item.whtDeduction ? "Yes" : "No"}`} />
              <PfiRequestDetailListItem title="Registration" description={`${item.registration ? "Yes" : "No"}`} />
              <PfiRequestDetailListItem title="Refund / Rebate Amount" description={item.refundRebaseAmount || "----"} />
            </ul>
          </div>
        </div>
      )
    })
  }

  const pfiRequestDetailsMutation = useMutation({
    mutationFn: (data)=> apiPut({ url: `/pfiRequestForm/approve/${id}` }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allPfiRequests", id])
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

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>PFI Request Details</h3>

          {!pfiRequestDetailsQuery.isLoading && !pfiRequestDetailsQuery.isError && pfiRequestDetailsQuery.data.approved && <span className='border border-success text-success py-2 px-3 rounded me-3'>Approved <i className="bi bi-check-circle text-success"></i></span> }
          {staffCadre === "Administrator" && !pfiRequestDetailsQuery.isLoading && !pfiRequestDetailsQuery.isError && !pfiRequestDetailsQuery.data.approved && 
          <button className="btn btnPurple px-4 ms-auto" disabled={pfiRequestDetailsMutation.isLoading} onClick={pfiRequestDetailsMutation.mutate}>{pfiRequestDetailsMutation.isLoading ? <Spinner /> : "Approve"}</button>
          }
          {
            staffCadre !== "Administrator" && 
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={pfiRequestDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={pfiRequestDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
          }
        </header>
        <p>Details of PFI request listed below</p>

        {pfiRequestDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching PFI Request Details <Spinner />
        </div>}

        {!pfiRequestDetailsQuery.isLoading &&
        <>
        <ul className='mt-5'>
          <PfiRequestDetailListItem title="Company Name" description={pfiRequestDetailsQuery.data.companyName || "----"} />
          <PfiRequestDetailListItem title="Company Address" description={pfiRequestDetailsQuery.data.companyAddress || "----"} />
          <PfiRequestDetailListItem title="Contact Person" description={pfiRequestDetailsQuery.data.contactPerson || "----"} />
          <PfiRequestDetailListItem title="Phone Number" description={pfiRequestDetailsQuery.data.mobile || "----"} />
          <PfiRequestDetailListItem title="Email Address" description={pfiRequestDetailsQuery.data.emailAddress || "----"} />
          <h6 className='mt-5'>List of Vehicles</h6>
          <div className="accordion" id="accordionExample">
            {vehicleAccordionItems()}
          </div>
          {/* <PfiRequestDetailListItem title="Product Brands" description={listProductBrands() || "----"} />
          <PfiRequestDetailListItem title="Vehicle Model" description={pfiRequestDetailsQuery.data.vehicleModel || "----"} />
          <PfiRequestDetailListItem title="Cost Of Body Special Fitment" description={formatAsCurrency(pfiRequestDetailsQuery.data.costOfBodySpecialFitment) || "----"} />
          <PfiRequestDetailListItem title="Quantity" description={pfiRequestDetailsQuery.data.quantity || "----"} />
          <PfiRequestDetailListItem title="Price of Vehicle" description={formatAsCurrency(pfiRequestDetailsQuery.data.priceOfVehicle) || "----"} />
          <PfiRequestDetailListItem title="Discount" description={pfiRequestDetailsQuery.data.discount || "----"} />
          <PfiRequestDetailListItem title="VAT Deduction" description={`${pfiRequestDetailsQuery.data.vatDeduction ? "Yes" : "No"}`} />
          <PfiRequestDetailListItem title="WHT Deduction" description={`${pfiRequestDetailsQuery.data.whtDeduction ? "Yes" : "No"}`} />
          <PfiRequestDetailListItem title="Registration" description={`${pfiRequestDetailsQuery.data.registration ? "Yes" : "No"}`} />
          <PfiRequestDetailListItem title="Refund / Rebate Amount" description={formatAsCurrency(pfiRequestDetailsQuery.data.refundRebaseAmount) || "----"} /> */}
          <PfiRequestDetailListItem title="Refund / Rebate Recipient" description={pfiRequestDetailsQuery.data.refundRebaseRecipient || "----"} />
          <PfiRequestDetailListItem title="Relationship with Transaction" description={pfiRequestDetailsQuery.data.relationshipWithTransaction || "----"} />
          <PfiRequestDetailListItem title="Designation" description={pfiRequestDetailsQuery.data.designation || "----"} />
          <PfiRequestDetailListItem title="Estimated Order Closing Time" description={pfiRequestDetailsQuery.data.estimatedOrderClosingTime || "----"} />
          <PfiRequestDetailListItem title="Delivery Period" description={pfiRequestDetailsQuery.data.deliveryPeriod || "----"} />
          <PfiRequestDetailListItem title="Payment Type" description={pfiRequestDetailsQuery.data.paymentType || "----"} />
          <PfiRequestDetailListItem title="Delivery Location" description={pfiRequestDetailsQuery.data.deliveryLocation || "----"} />
          {/* <PfiRequestDetailListItem title="Body Type Description" description={pfiRequestDetailsQuery.data.bodyTypeDescription || "----"} />
          <PfiRequestDetailListItem title="Vehicle Service Details" description={pfiRequestDetailsQuery.data.vehicleServiceDetails || "----"} />
          <PfiRequestDetailListItem title="Vehicle Special Fitment Details" description={pfiRequestDetailsQuery.data.vehicleSpecialFitmentDetails || "----"} /> */}
          <PfiRequestDetailListItem title="Additional Information" description={pfiRequestDetailsQuery.data.additionalInformation || "----"} />
          <PfiRequestDetailListItem title="Date Created" description={new Date(pfiRequestDetailsQuery.data.createdAt).toLocaleString()  || "----"} />
          <PfiRequestDetailListItem title="Last Updated" description={new Date(pfiRequestDetailsQuery.data.updatedAt).toLocaleString()  || "----"} />
        </ul>
        </>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditPfiRequestDetails data={pfiRequestDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default PfiRequestDetails;