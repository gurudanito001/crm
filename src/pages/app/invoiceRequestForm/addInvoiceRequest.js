import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import Compress from "react-image-file-resizer";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';
import formatAsCurrency from '../../../services/formatAsCurrency';


const AddInvoiceRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = getUserData()
  const [formData, setFormData] = useState({
    employeeId: "",
    customerId: "",
    pfiRequestFormId: "",
    invoiceName: "",
    address1: "",
    address2: "",
    contactPerson: "",
    contactOfficeTelephone: "",
    email: "",
    salesThru: "",
    industry: "",
    businessType: "",
    kycId: "",
    vehicleBrand: "",
    vehicleModel: "",
    quantity: "",
    colour: "",
    totalInvoiceValuePerVehicle: "",
    typeOfBodyBuilding: "",
    bodyFabricatorName: "",
    expectedDeliveryDate: "",
    deliveryLocation: "",
    registration: false,
    deliveryBy: "",
    vatDeduction: false,
    whtDeduction: false,
    paymentStatus: "",
    lpoNumber: "",
    lpoPdf: "",
    warrantyCertificate: "",
    agreedCreditPeriod: "",
    rebateReceiver: "",
    rebateAmount: "",
    relationshipWithTransaction: "",
    accountDetailsToTransfer: "",
    refundToCustomer: "",
    servicePackageDetails: "",
    additionalInformation: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      employeeId: id
    }))
  }, [])

  useEffect( ()=>{
    if(formData.pfiRequestFormId){
      let pfiRequestData = getPfiRequestDataBy(formData.pfiRequestFormId);
      let customerData = getCustomerBy(pfiRequestData.customerId);
      setFormData( prevState =>({
        ...prevState,
        customerId: pfiRequestData.customerId,
        invoiceName: pfiRequestData.companyName,
        contactOfficeTelephone: pfiRequestData.mobile,
        contactPerson: pfiRequestData.contactPerson,
        address1: pfiRequestData.companyAddress,
        email: pfiRequestData.emailAddress,
        vehicleModel: pfiRequestData.vehicleModel,
        vehicleBrand: pfiRequestData.productBrand,
        whtDeduction: pfiRequestData.whtDeduction,
        vatDeduction: pfiRequestData.vatDeduction,
        quantity: pfiRequestData.quantity,
        deliveryLocation: pfiRequestData.deliveryLocation,
        rebateAmount: pfiRequestData.refundRebaseAmount,
        rebateReceiver: pfiRequestData.refundRebaseRecipient,
        relationshipWithTransaction: pfiRequestData.relationshipWithTransaction,
        industry: customerData.industry,
        businessType: customerData.businessType
      }))
    }
  }, [formData.pfiRequestFormId])

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  const queryClient = useQueryClient();
  const invoiceRequestMutation = useMutation({
    mutationFn: (data)=> apiPost({ url: `/invoiceRequestForm/create`, data }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allInvoiceRequests"])
      navigate("/app/invoiceRequest")
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

  const pfiRequestQuery = useQuery({
    queryKey: ["allPfiRequests"],
    queryFn: () => apiGet({url: `/pfiRequestForm/employee/${id}`})
    .then( (res) =>{
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

  const listPfiRequestOptions = () =>{
    if(pfiRequestQuery?.data?.length){
      return pfiRequestQuery.data.map(pfiRequest =>
        <option key={pfiRequest.id} value={pfiRequest.id }>{pfiRequest.companyName} buying {pfiRequest.quantity}  {pfiRequest.productBrand} for {formatAsCurrency(pfiRequest.priceOfVehicle)}</option>
      )
    }
  }

  const getPfiRequestDataBy = (id) =>{
    let data;
    pfiRequestQuery.data.forEach( pfiRequest =>{
      if(pfiRequest.id === id){
        data = pfiRequest
      }
    })
    return data;
  }

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: `/customer/employee/${id}`})
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

  const getCustomerBy = (id) => {
    let customerData;
    customerQuery?.data?.forEach( customer =>{
      if(customer.id === id){
        customerData = customer
      }
    })
    return customerData;
  }


  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
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

  const handleChange = (prop) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [prop]: ""
    }))
  }

  const handleCheck = (prop) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.checked
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    //return console.log(formData);
    let data = formData;
    data.warrantyCertificate = base64Image;
    let errors = formValidator(["invoiceName", "address1", "contactPerson", "contactOfficeTelephone", "vehicleBrand", "vehicleModel", "colour", "quantity", "totalInvoiceValuePerVehicle", "expectedDeliveryDate", "paymentStatus", "deliveryLocation", "deliveryBy", "pfiRequestFormId"], data);
    if(Object.keys(errors).length > 0){
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      console.log(errors)
      return setErrors(errors);
    }
    //return console.log(data);
    invoiceRequestMutation.mutate(data)
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Invoice Request </header>
        <p>Fill in Invoice Request Information.</p>
        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="pfiRequestFormId" className="form-label">Pfi Request (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="pfiRequestFormId" value={formData.pfiRequestFormId} onChange={handleChange("pfiRequestFormId")} aria-label="Default select example">
              <option value="">Select PFI Request</option>
              {!pfiRequestQuery.isLoading && listPfiRequestOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.pfiRequestFormId}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="invoiceName" className="form-label">Invoice Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceName} onChange={handleChange("invoiceName")}  id="invoiceName" placeholder="Invoice Name" />
            <span className='text-danger font-monospace small'>{errors.invoiceName}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress1" className="form-label">Address 1 (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.address1} onChange={handleChange("address1")} id="companyAddress1" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.address1}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress2" className="form-label">Address 2</label>
            <textarea className="form-control shadow-none" value={formData.address2} onChange={handleChange("address2")} id="companyAddress2" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.contactPerson} onChange={handleChange("contactPerson")} id="contactPerson" placeholder="Contact Person" />
            <span className='text-danger font-monospace small'>{errors.contactPerson}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="officePhoneNumber" className="form-label">Contact Office Telephone (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.contactOfficeTelephone} onChange={handleChange("contactOfficeTelephone")} id="officePhoneNumber" placeholder="Office Phone Number" />
            <span className='text-danger font-monospace small'>{errors.contactOfficeTelephone}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="emailAddress" className="form-label">Email Address</label>
            <input type="email" className="form-control shadow-none" value={formData.email} onChange={handleChange("email")} id="emailAddress" placeholder="Email Address" />
          </div>
          <div className="mb-3">
            <label htmlFor="salesThrough" className="form-label">Sales Through</label>
            <input type="text" className="form-control shadow-none" value={formData.salesThru} onChange={handleChange("salesThru")} id="salesThrough" placeholder="KA/Retail/Agent/Govt/Fleet/others" />
          </div>
          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <input type="text" className="form-control shadow-none" value={formData.industry} onChange={handleChange("industry")} id="industry" placeholder="Industry" />
          </div>
          <div className="mb-3">
            <label htmlFor="businessType" className="form-label">Business Type</label>
            <input type="text" className="form-control shadow-none" value={formData.businessType} onChange={handleChange("businessType")} id="businessType" placeholder="Business Type" />
          </div>
          {/* <div className="mb-3">
            <label htmlFor="kycId" className="form-label">KYC Id (Customer Code) (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.kycId} onChange={handleChange("kycId")} id="kycId" placeholder="KYC Id" />
            <span className='text-danger font-monospace small'>{errors.kycId}</span>  
          </div> */}
          <div className="mb-3">
            <label htmlFor="vehicleBrand" className="form-label">Vehicle Brand (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleBrand} onChange={handleChange("vehicleBrand")} id="vehicleBrand" placeholder="Vehicle Details" />
            <span className='text-danger font-monospace small'>{errors.vehicleBrand}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleModel" className="form-label">Vehicle Model (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleModel} onChange={handleChange("vehicleModel")} id="vehicleModel" placeholder="Vehicle Details" />
            <span className='text-danger font-monospace small'>{errors.vehicleModel}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="number" className="form-control shadow-none" value={formData.quantity} onChange={handleChange("quantity")} id="quantity" placeholder="Quantity of Products" />
            <span className='text-danger font-monospace small'>{errors.quantity}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="colour" className="form-label">Colour (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.colour} onChange={handleChange("colour")} id="colour" placeholder="Colour" />
            <span className='text-danger font-monospace small'>{errors.colour}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="totalInvoiceValuePerVehicle" className="form-label">Total Invoice Value Per Vehicle  (<span className='fst-italic text-warning'>required</span>) <span className='fw-bold ms-2'>{formatAsCurrency(formData.totalInvoiceValuePerVehicle)}</span></label>
            <input type="text" className="form-control shadow-none" value={formData.totalInvoiceValuePerVehicle} onChange={handleChange("totalInvoiceValuePerVehicle")} id="totalInvoiceValuePerVehicle" placeholder="Value for each vehicle" />
            <span className='text-danger font-monospace small'>{errors.totalInvoiceValuePerVehicle}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="typeOfBodyBuilding" className="form-label">Type of Body Building</label>
            <input type="text" className="form-control shadow-none" value={formData.typeOfBodyBuilding} onChange={handleChange("typeOfBodyBuilding")} id="typeOfBodyBuilding" placeholder="Type of Body Building" />
          </div>
          <div className="mb-3">
            <label htmlFor="bodyFabricatorName" className="form-label">Body Fabricator Name (if any)</label>
            <input type="text" className="form-control shadow-none" value={formData.bodyFabricatorName} onChange={handleChange("bodyFabricatorName")} id="bodyFabricatorName" placeholder="Body Fabricator Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryDate" className="form-label">Expected Delivery Date (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="date" className="form-control shadow-none" value={formData.expectedDeliveryDate} onChange={handleChange("expectedDeliveryDate")} id="deliveryDate" />
            <span className='text-danger font-monospace small'>{errors.expectedDeliveryDate}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.deliveryLocation}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="registration" className="form-label">Registration</label>
            <select className="form-select shadow-none" id="registration" value={formData.registration} onChange={handleChange("registration")} aria-label="Default select example">
              <option value="">Select Registration Type</option>
              <option value="private">Private</option>
              <option value="commercial">Commercial</option>
            </select> 
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryBy" className="form-label">Delivery By (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="deliveryBy" value={formData.deliveryBy} onChange={handleChange("deliveryBy")} aria-label="Default select example">
              <option value="">To Be Delivered By</option>
              <option value="KNL">KNL</option>
              <option value="Customer">Customer</option>
            </select> 
            <span className='text-danger font-monospace small'>{errors.deliveryBy}</span>  
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" checked={formData.vatDeduction} onChange={handleCheck("vatDeduction")} type="checkbox"  id="vatDeduction" />
            <label className="form-check-label" htmlFor="vatDeduction">
              VAT Deduction
            </label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" checked={formData.whtDeduction} onChange={handleCheck("whtDeduction")} type="checkbox" id="whtDeduction" />
            <label className="form-check-label" htmlFor="whtDeduction">
              WHT Deduction
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="paymentStatus" className="form-label">Payment Status (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.paymentStatus} onChange={handleChange("paymentStatus")} id="paymentStatus" placeholder="Payment Status" />
            <span className='text-danger font-monospace small'>{errors.paymentStatus}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="lpoNumber" className="form-label">LPO Number</label>
            <input type="text" className="form-control shadow-none" value={formData.lpoNumber} onChange={handleChange("lpoNumber")} id="lpoNumber" placeholder="LPO Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="lpoPdf" className="form-label">LPO PDF</label>
            <input type="file" className="form-control shadow-none" value={formData.lpoPdf} onChange={handleChange("lpoPdf")} id="lpoPdf" placeholder="LPO PDF" />
          </div>

          {/* <div className="mb-3">
            <label htmlFor="warrantyCertificate" className="form-label">Warranty Certificate</label>
            <input type="file" className="form-control shadow-none" value={formData.selectedFile} onChange={uploadImage} id="warrantyCertificate" placeholder="Warranty Certificate" />

            {imageUrl &&
            <div>
              <h6 className='small fw-bold mt-3'>Warranty Certificate Preview</h6>
              <img src={imageUrl} alt="Logo Preview" className='border rounded' width="100px"/>
            </div>}
          </div> */}
          <div className="mb-3">
            <label htmlFor="agreedCreditPeriod" className="form-label">Agreed Credit Period</label>
            <input type="text" className="form-control shadow-none" value={formData.agreedCreditPeriod} onChange={handleChange("agreedCreditPeriod")} id="agreedCreditPeriod" placeholder="Agreed Credit Period" />
          </div>
          <div className="mb-3">
            <label htmlFor="rebateAmount" className="form-label">Rebate Amount <span className='fw-bold'>{formatAsCurrency(formData.rebateAmount)}</span></label>
            <input type="text" className="form-control shadow-none" value={formData.rebateAmount} onChange={handleChange("rebateAmount")} id="rebateAmount" placeholder="Rebate Amount" />
          </div>
          <div className="mb-3">
            <label htmlFor="rebateReceiver" className="form-label">Rebate Reciever</label>
            <input type="text" className="form-control shadow-none" value={formData.rebateReceiver} onChange={handleChange("rebateReceiver")} id="rebateReceiver" placeholder="Rebate Reciever" />
          </div>
          
          <div className="mb-3">
            <label htmlFor="relationshipWithTransaction" className="form-label">Relationship With Transaction</label>
            <input type="text" className="form-control shadow-none" value={formData.relationshipWithTransaction} onChange={handleChange("relationshipWithTransaction")} id="relationshipWithTransaction" placeholder="Relationship With Transaction" />
          </div>
          <div className="mb-3">
            <label htmlFor="accountDetailsToTransfer" className="form-label">Account Details To Transfer</label>
            <textarea className="form-control shadow-none" value={formData.accountDetailsToTransfer} onChange={handleChange("accountDetailsToTransfer")} id="accountDetailsToTransfer" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="refundToCustomer" className="form-label">Refund To Customer (If any) <span className='fw-bold'>{formatAsCurrency(formData.refundToCustomer)}</span></label>
            <input type="text" className="form-control shadow-none" value={formData.refundToCustomer} onChange={handleChange("refundToCustomer")} id="refundToCustomer" placeholder="Refund To Customer" />
          </div>
          <div className="mb-3">
            <label htmlFor="servicePackageDetails" className="form-label">Service Package Details (If given)</label>
            <textarea className="form-control shadow-none" value={formData.servicePackageDetails} onChange={handleChange("servicePackageDetails")} id="servicePackageDetails" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="additionalInformation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="additionalInformation" rows={3}></textarea>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={invoiceRequestMutation.isLoading} onClick={handleSubmit}> {invoiceRequestMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3  px-5" onClick={() => navigate("/app/invoiceRequest")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddInvoiceRequest;