
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditVehicleDeliveryDetails from './editVehicleDeliveryDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';

const VehicleDeliveryDetailListItem = ({id, title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const VehicleDeliveryDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details");
  let {staffCadre} = getUserData();

  const vehicleDeliveryDetailsQuery = useQuery({
    queryKey: ["allVehicleDeliveries", id],
    queryFn: () => apiGet({url: `/vehicleDelivery/${id}`})
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



  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Vehicle Delivery Details</h3>
          {staffCadre === "Administrator" && <>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={vehicleDeliveryDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={vehicleDeliveryDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>
          </>}
        </header>
        <p>Details of vehicle delivery listed below</p>

        {vehicleDeliveryDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Vehicle Delivery Details <Spinner />
        </div>}

        {!vehicleDeliveryDetailsQuery.isLoading &&
          <ul className='mt-5'>
            <VehicleDeliveryDetailListItem title="Customer Name" description={vehicleDeliveryDetailsQuery.data.customerName} />
            <VehicleDeliveryDetailListItem title="Customer Address" description={vehicleDeliveryDetailsQuery.data.customerAddress} />
            <VehicleDeliveryDetailListItem title="Invoice Number" description={vehicleDeliveryDetailsQuery.data.invoiceNumber} />
            <VehicleDeliveryDetailListItem title="Delivery Note Number" description={vehicleDeliveryDetailsQuery.data.deliveryNoteNumber} />
            <VehicleDeliveryDetailListItem title="Chasis Numbers" description={vehicleDeliveryDetailsQuery.data.chasisNumbers} />
            <VehicleDeliveryDetailListItem title="Body Building" description={vehicleDeliveryDetailsQuery.data.bodyBuilding} />
            <VehicleDeliveryDetailListItem title="Total Order Quantity" description={vehicleDeliveryDetailsQuery.data.totalOrderQuantity} />
            <VehicleDeliveryDetailListItem title="Quantity Delivered" description={vehicleDeliveryDetailsQuery.data.quantityDelivered} />
            <VehicleDeliveryDetailListItem title="Quantity Pending" description={vehicleDeliveryDetailsQuery.data.quantityPending} />
            <VehicleDeliveryDetailListItem title="Name of Driver" description={vehicleDeliveryDetailsQuery.data.nameOfDriver} />
            <VehicleDeliveryDetailListItem title="Vehicle Recipient Name" description={vehicleDeliveryDetailsQuery.data.vehicleRecipientName} />
            <VehicleDeliveryDetailListItem title="Vehicle Recipient Phone" description={vehicleDeliveryDetailsQuery.data.vehicleRecipientPhone} />
            <VehicleDeliveryDetailListItem title="Reciever Relationship with Buyer" description={vehicleDeliveryDetailsQuery.data.receiverRelationshipWithBuyer} />
            <VehicleDeliveryDetailListItem title="Additional Information" description={vehicleDeliveryDetailsQuery.data.additionalInformation} />
            <VehicleDeliveryDetailListItem title="Date Created" description={new Date(vehicleDeliveryDetailsQuery.data.createdAt).toLocaleString()  || "----"} />
            <VehicleDeliveryDetailListItem title="Last Updated" description={new Date(vehicleDeliveryDetailsQuery.data.updatedAt).toLocaleString()  || "----"} />
          </ul>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditVehicleDeliveryDetails data={vehicleDeliveryDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>
  )
}

export default VehicleDeliveryDetails;