
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditInvoiceRequestDetails from './editInvoiceRequest';
import { apiGet, apiDelete, apiPut } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';
import Compress from "react-image-file-resizer";
import formValidator from '../../../services/validation';



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
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {state} = useLocation()
  const {staffCadre} = getUserData();
  const [currentScreen, setCurrentScreen] = useState("details");
  const [approvingInvoiceRequest, setApprovingInvoiceRequest] = useState( false );
  const [errors, setErrors] = useState({})

  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const [formData, setFormData] = useState({
    warrantyCertificate: "",
    approvedByGM: false,
    approved: true,
    kycId: ""
  })

  const invoiceRequestDetailsQuery = useQuery({
    queryKey: ["allInvoiceRequests", id],
    queryFn: () => apiGet({url: `/invoiceRequestForm/${id}`}).then( (res) => {
      console.log(res.payload)
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

  const approveInvoiceRequest = () =>{
    //return console.log(base64Image)

    let errors = formValidator(["kycId"], formData);
    
    if (Object.keys(errors).length > 0) {
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      console.log(errors)
      return setErrors(errors);
    }else if(!formData.approvedByGM){
      dispatch(
        setMessage({
          severity: "error",
          message: "GM and Product Head must Approve",
          key: Date.now(),
        })
      );
      return setErrors({
        approvedByGM: "GM and Product Head Approval is required"
      });
    }
    let data = { ...invoiceRequestDetailsQuery.data, ...formData, warrantyCertificate: base64Image}
    console.log(data)
    invoiceRequestDetailsMutation.mutate(data)
  }

  const invoiceRequestDetailsMutation = useMutation({
    mutationFn: (data)=> apiPut({ url: `/invoiceRequestForm/${id}`, data }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allInvoiceRequests", id])
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

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
    setErrors(prevState => ({
      ...prevState,
      [prop]: ""
    }))
  }

  const handleCheck = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.checked
    }))
    setErrors(prevState => ({
      ...prevState,
      [prop]: ""
    }))
  }

  const uploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      Compress.imageFileResizer(
        file, // the file from input
        480, // width
        480, // height
        "jpg", // compress format WEBP, JPEG, PNG
        70, // quality
        0, // rotation
        (uri) => {
          setBase64Image(uri)
        },
        "base64" // blob or base64 default base64
      );
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }

  const vehicleAccordionItems = () =>{
    return invoiceRequestDetailsQuery.data.vehiclesData.map( (item, index) =>{
      return(
        <div key={index} className="accordion-item mb-2">
          <h2 className="accordion-header">
            <button className={`accordion-button`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
              {item.quantity} {item.vehicleBrand} for {formatAsCurrency(item.totalInvoiceValuePerVehicle)} each
            </button>
          </h2>
          <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <ul className="accordion-body">
              <InvoiceRequestDetailListItem title="Vehicle Brand" description={item.vehicleBrand || "----"} />
              <InvoiceRequestDetailListItem title="Vehicle Model Specific Details" description={item.vehicleModel || "----"} />
              <InvoiceRequestDetailListItem title="Quantity" description={item.quantity || "----"} />
              <InvoiceRequestDetailListItem title="Color" description={item.color || "----"} />
              <InvoiceRequestDetailListItem title="Price Per Vehicle" description={formatAsCurrency(item.totalInvoiceValuePerVehicle) || "----"} />
              <InvoiceRequestDetailListItem title="Type Of Body Building" description={item.typeOfBodyBuilding || "----"} />
              <InvoiceRequestDetailListItem title="Body Fabricator Name" description={item.bodyFabricatorName || "----"} />
              <InvoiceRequestDetailListItem title="VAT Deduction" description={`${item.vatDeduction ? "Yes" : "No"}`} />
              <InvoiceRequestDetailListItem title="WHT Deduction" description={`${item.whtDeduction ? "Yes" : "No"}`} />
              <InvoiceRequestDetailListItem title="Registration" description={item.registration} />
              <InvoiceRequestDetailListItem title="Service Package Details" description={item.servicePackageDetails || "----"} />
              <InvoiceRequestDetailListItem title="Rebate Amount" description={formatAsCurrency(item.rebateAmount) || "----"} />
              <InvoiceRequestDetailListItem title="Refund To Customer" description={formatAsCurrency(item.refundToCustomer) || "----"} />
            </ul>
          </div>
        </div>
      )
    })
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Invoice Request Details</h3>

          {!invoiceRequestDetailsQuery.isLoading && !invoiceRequestDetailsQuery.isError && invoiceRequestDetailsQuery.data.approved && <span className='border border-success text-success py-2 px-3 rounded me-3'>Approved <i className="bi bi-check-circle text-success"></i></span> }
          {staffCadre === "Administrator" && !invoiceRequestDetailsQuery.isLoading && !invoiceRequestDetailsQuery.isError && !invoiceRequestDetailsQuery.data.approved && 
          <button className="btn btnPurple px-4 ms-auto" disabled={invoiceRequestDetailsMutation.isLoading} onClick={approveInvoiceRequest}>{invoiceRequestDetailsMutation.isLoading ? <Spinner /> : "Approve"}</button>
          }

          {
            staffCadre !== "Administrator" && 
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={invoiceRequestDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={invoiceRequestDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
          }
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
          <InvoiceRequestDetailListItem title="Expected Delivery Date" description={new Date(invoiceRequestDetailsQuery.data.expectedDeliveryDate).toDateString() || "----"} />
          <InvoiceRequestDetailListItem title="Delivery Location" description={invoiceRequestDetailsQuery.data.deliveryLocation || "----"} />
          <InvoiceRequestDetailListItem title="Delivery By" description={invoiceRequestDetailsQuery.data.deliveryBy || "----"} />
          <InvoiceRequestDetailListItem title="Payment Status" description={invoiceRequestDetailsQuery.data.paymentStatus || "----"} />
          <InvoiceRequestDetailListItem title="LPO Number" description={invoiceRequestDetailsQuery.data.lpoNumber || "----"} />
          <InvoiceRequestDetailListItem title="LPO Pdf" description={invoiceRequestDetailsQuery.data.lpoPdf || "----"} />
          <h6 className='mt-5'>List of Vehicles</h6>
          <div className="accordion" id="accordionExample">
            {vehicleAccordionItems()}
          </div>
          <InvoiceRequestDetailListItem title="Agreed Credit Period" description={invoiceRequestDetailsQuery.data.agreedCreditPeriod || "----"} />
          <InvoiceRequestDetailListItem title="Rebate Reciever" description={invoiceRequestDetailsQuery.data.rebateReceiver || "----"} />
          <InvoiceRequestDetailListItem title="Relationship With Transaction" description={invoiceRequestDetailsQuery.data.relationshipWithTransaction || "----"} />
          <InvoiceRequestDetailListItem title="Account Details To Transfer" description={invoiceRequestDetailsQuery.data.accountDetailsToTransfer || "----"} />
          <InvoiceRequestDetailListItem title="Additional Information" description={invoiceRequestDetailsQuery.data.additionalInformation || "----"} />
          <InvoiceRequestDetailListItem title="Approved By GM & Product Head" description={`${invoiceRequestDetailsQuery.data.approved ? "Yes" : "No"}`} />
          <li className='py-2 d-flex flex-column flex-wrap border-bottom'>
            <header className="small text-uppercase mb-3">Warranty Certificate</header>
            {invoiceRequestDetailsQuery.data.warrantyCertificate && <img src={invoiceRequestDetailsQuery.data.warrantyCertificate} alt="Warranty Certificate" />}
          </li>
          <InvoiceRequestDetailListItem title="Date Created" description={new Date(invoiceRequestDetailsQuery.data.createdAt).toLocaleString()  || "----"} />
          <InvoiceRequestDetailListItem title="Last Updated" description={new Date(invoiceRequestDetailsQuery.data.updatedAt).toLocaleString()  || "----"} />
          

          {
            !invoiceRequestDetailsQuery.data.approved && staffCadre === "Administrator" &&
            <>
              <div className="mb-3 mt-5">
                <label htmlFor="kycId" className="form-label">KYC ID(<span className='fst-italic text-warning'>required</span>)</label>
                <input type="text" className="form-control shadow-none" value={formData.kycId} onChange={handleChange("kycId")} id="kycId" placeholder="KYC ID" />
                <span className='text-danger font-monospace small'>{errors.kycId}</span>
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input shadow-none" checked={formData.approvedByGM} onChange={handleCheck("approvedByGM")} type="checkbox" id="approvedByGM" />
                <label className="form-check-label" htmlFor="approvedByGM">
                  Approved By GM & Product Head
                </label> <br />
                <span className='text-danger font-monospace small'>{errors.approvedByGM}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="warrantyCertificate" className="form-label">Warranty Certificate</label>
                <input type="file" className="form-control shadow-none" onChange={uploadImage} id="warrantyCertificate" placeholder="Warranty Certificate" />

                {imageUrl &&
                  <div>
                    <h6 className='small fw-bold mt-3'>Warranty Certificate Preview</h6>
                    <img src={imageUrl} alt="Logo Preview" className='border rounded' width="300px" />
                  </div>}
              </div>
            </>
          }
        </ul>}
          
        
      </section>}

      {currentScreen === "editDetails" && 
        <EditInvoiceRequestDetails handleCancel={()=>setCurrentScreen("details")} data={invoiceRequestDetailsQuery.data} />
      }
    </Layout>

  )
}

export default InvoiceRequestDetails;