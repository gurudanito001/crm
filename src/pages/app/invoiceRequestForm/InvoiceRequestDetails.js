
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditInvoiceRequestDetails from './editInvoiceRequest';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';



const InvoiceRequestDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row flex-wrap align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const InvoiceRequestDetails = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {state} = useLocation()
  const [currentScreen, setCurrentScreen] = useState("details")

  const invoiceRequestDetailsQuery = useQuery({
    queryKey: ["allInvoiceRequests", id],
    queryFn: () => apiGet({url: `/invoiceRequestForm/${id}`}).then( (res) => {
      return res.payload
    }),
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Invoice Request Details</h3>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={invoiceRequestDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={invoiceRequestDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
        </header>
        <p>Details of invoice request listed below</p>

        {invoiceRequestDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Invoice Request Details <Spinner />
        </div>}

        {!invoiceRequestDetailsQuery.isLoading && !invoiceRequestDetailsQuery.isError &&
        <ul className='mt-5'>
          <InvoiceRequestDetailListItem title="Invoice Name" description={invoiceRequestDetailsQuery.data.invoiceName || "----"} />
          <InvoiceRequestDetailListItem title="Address 1" description={invoiceRequestDetailsQuery.data.address1 || "----"} />
          <InvoiceRequestDetailListItem title="Address 2" description={invoiceRequestDetailsQuery.data.address2 || "----"} />
          <InvoiceRequestDetailListItem title="Contact Person" description={invoiceRequestDetailsQuery.data.contactPerson || "----"} />
          <InvoiceRequestDetailListItem title="Contact Office Telephone" description={invoiceRequestDetailsQuery.data.contactOfficeTelephone || "----"} />
          <InvoiceRequestDetailListItem title="Email" description={invoiceRequestDetailsQuery.data.email || "----"} />
          <InvoiceRequestDetailListItem title="Sales Through" description={invoiceRequestDetailsQuery.data.salesThru || "----"} />
          <InvoiceRequestDetailListItem title="Industry" description={invoiceRequestDetailsQuery.data.industry || "----"} />
          <InvoiceRequestDetailListItem title="Business Type" description={invoiceRequestDetailsQuery.data.businessType || "----"} />
          <InvoiceRequestDetailListItem title="KYC Id" description={invoiceRequestDetailsQuery.data.kycId || "----"} />
          <InvoiceRequestDetailListItem title="Vehicle Brand" description={invoiceRequestDetailsQuery.data.vehicleBrand || "----"} />
          <InvoiceRequestDetailListItem title="Vehicle Model" description={invoiceRequestDetailsQuery.data.vehicleModel || "----"} />
          <InvoiceRequestDetailListItem title="Quantity" description={invoiceRequestDetailsQuery.data.quantity || "----"} />
          <InvoiceRequestDetailListItem title="Colour" description={invoiceRequestDetailsQuery.data.colour || "----"} />
          <InvoiceRequestDetailListItem title="Total Invoice Value Per Vehicle" description={invoiceRequestDetailsQuery.data.totalInvoiceValuePerVehicle || "----"} />
          <InvoiceRequestDetailListItem title="Type Of Body Building" description={invoiceRequestDetailsQuery.data.typeOfBodyBuilding || "----"} />
          <InvoiceRequestDetailListItem title="Body Fabricator Name" description={invoiceRequestDetailsQuery.data.bodyFabricatorName || "----"} />
          <InvoiceRequestDetailListItem title="Expected Delivery Date" description={new Date(invoiceRequestDetailsQuery.data.expectedDeliveryDate).toDateString() || "----"} />
          <InvoiceRequestDetailListItem title="Delivery Location" description={invoiceRequestDetailsQuery.data.deliveryLocation || "----"} />
          <InvoiceRequestDetailListItem title="Registration" description={(invoiceRequestDetailsQuery.data.registration ? "Yes" : "No") || "----"} />
          <InvoiceRequestDetailListItem title="Delivery By" description={invoiceRequestDetailsQuery.data.deliveryBy || "----"} />
          <InvoiceRequestDetailListItem title="VAT Deduction" description={(invoiceRequestDetailsQuery.data.vatDeduction ? "Yes" : "No") || "----"} />
          <InvoiceRequestDetailListItem title="WHT Deduction" description={(invoiceRequestDetailsQuery.data.whtDeduction ? "Yes" : "No") || "----"} />
          <InvoiceRequestDetailListItem title="Payment Status" description={invoiceRequestDetailsQuery.data.paymentStatus || "----"} />
          <InvoiceRequestDetailListItem title="LPO Number" description={invoiceRequestDetailsQuery.data.lpoNumber || "----"} />
          <InvoiceRequestDetailListItem title="LPO Pdf" description={invoiceRequestDetailsQuery.data.lpoPdf || "----"} />
          {/* <InvoiceRequestDetailListItem title="Warranty Certificate" description={invoiceRequestDetailsQuery.data.warrantyCertificate || "----"} /> */}
          <li className='py-2 d-flex flex-column flex-wrap border-bottom'>
            <header className="small text-uppercase mb-3">Warranty Certificate</header>
            <img src={invoiceRequestDetailsQuery.data.warrantyCertificate} alt="Warranty Certificate" />
          </li>
          <InvoiceRequestDetailListItem title="Agreed Credit Period" description={invoiceRequestDetailsQuery.data.agreedCreditPeriod || "----"} />
          <InvoiceRequestDetailListItem title="Rebate Reciever" description={invoiceRequestDetailsQuery.data.rebateReceiver || "----"} />
          <InvoiceRequestDetailListItem title="Rebate Amount" description={formatAsCurrency(invoiceRequestDetailsQuery.data.rebateAmount) || "----"} />
          <InvoiceRequestDetailListItem title="Relationship With Transaction" description={invoiceRequestDetailsQuery.data.relationshipWithTransaction || "----"} />
          <InvoiceRequestDetailListItem title="Account Details To Transfer" description={invoiceRequestDetailsQuery.data.accountDetailsToTransfer || "----"} />
          <InvoiceRequestDetailListItem title="Refund To Customer" description={formatAsCurrency(invoiceRequestDetailsQuery.data.refundToCustomer) || "----"} />
          <InvoiceRequestDetailListItem title="Service Package Details" description={invoiceRequestDetailsQuery.data.servicePackageDetails || "----"} />
          <InvoiceRequestDetailListItem title="Additional Information" description={invoiceRequestDetailsQuery.data.additionalInformation || "----"} />



        </ul>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditInvoiceRequestDetails handleCancel={()=>setCurrentScreen("details")} data={invoiceRequestDetailsQuery.data} />
      }
    </Layout>

  )
}

export default InvoiceRequestDetails;