
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditPaymentDetails from './editPaymentDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';

const PaymentDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const PaymentDetails = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("details");
  const queryClient = useQueryClient();
  const { id } = useParams();

  const paymentDetailsQuery = useQuery({
    queryKey: ["allPayments", id],
    queryFn: () => apiGet({ url: `/payment/${id}` }).then((res) => res.payload),
    onSuccess: () => { console.log(paymentDetailsQuery.data) }
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Payment Details</h3>
          
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={paymentDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={paymentDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
        </header>
        <p>Details of payment listed below</p>

        {paymentDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Payment Details <Spinner />
        </div>}

        {!paymentDetailsQuery.isLoading && !paymentDetailsQuery.isError &&
          <ul className='mt-5'>
            <PaymentDetailListItem title="Invoice Number" description={paymentDetailsQuery.data.invoiceNumber || "----"} />
            <PaymentDetailListItem title="Invoice Date" description={new Date(paymentDetailsQuery.data.invoiceDate).toDateString() || "----"} />
            <PaymentDetailListItem title="Delivery Date" description={new Date(paymentDetailsQuery.data.deliveryDate).toDateString() || "----"} />
            <PaymentDetailListItem title="Name Of Customer" description={paymentDetailsQuery.data.nameOfCustomer || "----"} />
            <PaymentDetailListItem title="Customer Address" description={paymentDetailsQuery.data.customerAddress || "----"} />
            <PaymentDetailListItem title="Model Of Vehicle Purchased" description={paymentDetailsQuery.data.modelOfVehiclePurchased || "----"} />
            <PaymentDetailListItem title="Quantity Purchased" description={paymentDetailsQuery.data.quantityPurchased || "----"} />
            <PaymentDetailListItem title="Advance Payment Received" description={formatAsCurrency(paymentDetailsQuery.data.advancePaymentReceived) || "----"} />
            <PaymentDetailListItem title="Outstanding Amount" description={formatAsCurrency(paymentDetailsQuery.data.outstandingAmount) || "----"} />
            <PaymentDetailListItem title="VAT Deducted" description={formatAsCurrency(paymentDetailsQuery.data.vatDeducted) || "----"} />
            <PaymentDetailListItem title="WHT Deducted" description={formatAsCurrency(paymentDetailsQuery.data.whtDeducted) || "----"} />
            <PaymentDetailListItem title="VAT Payment Receipt" description={paymentDetailsQuery.data.vatPaymentReceipt || "----"} />
            <PaymentDetailListItem title="Additional Information" description={paymentDetailsQuery.data.additionalInformation || "----"} />
          </ul>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditPaymentDetails data={paymentDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default PaymentDetails;