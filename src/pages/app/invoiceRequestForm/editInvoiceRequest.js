
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet, apiPut } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import Compress from "react-image-file-resizer";



const EditInvoiceRequestDetails = ({data, handleCancel}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    approvedBy: "",
    additionalInformation: "",
  });

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  const queryClient = useQueryClient();
  const invoiceRequestDetailsMutation = useMutation({
    mutationFn: (data)=> apiPut({ url: `/invoiceRequestForm/${data.id}`, data }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allInvoiceRequests"])
      handleCancel()
    }
  })

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      ...data
    }))
  }, [])

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
  }

  const handleCheck = (prop) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.checked
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let data = formData;
    if(base64Image){
      data.warrantyCertificate = base64Image;    
    }
    //return console.log(data);
    invoiceRequestDetailsMutation.mutate(data)
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Invoice Request Details</header>
      <p>Make changes to Invoice Request Information.</p>

      <form className="mt-5">

      <div className="mb-3">
            <label htmlFor="invoiceName" className="form-label">Invoice Name</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceName} onChange={handleChange("invoiceName")}  id="invoiceName" placeholder="Invoice Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress1" className="form-label">Address 1</label>
            <textarea className="form-control shadow-none" value={formData.address1} onChange={handleChange("address1")} id="companyAddress1" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress2" className="form-label">Address 2</label>
            <textarea className="form-control shadow-none" value={formData.address2} onChange={handleChange("address2")} id="companyAddress2" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person</label>
            <input type="text" className="form-control shadow-none" value={formData.contactPerson} onChange={handleChange("contactPerson")} id="contactPerson" placeholder="Contact Person" />
          </div>
          <div className="mb-3">
            <label htmlFor="officePhoneNumber" className="form-label">Contact Office Telephone</label>
            <input type="text" className="form-control shadow-none" value={formData.contactOfficeTelephone} onChange={handleChange("contactOfficeTelephone")} id="officePhoneNumber" placeholder="Office Phone Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="emailAddress" className="form-label">Email Address</label>
            <input type="email" className="form-control shadow-none" value={formData.email} onChange={handleChange("email")} id="emailAddress" placeholder="Email Address" />
          </div>
          <div className="mb-3">
            <label htmlFor="salesThrough" className="form-label">Sales Through</label>
            <input type="text" className="form-control shadow-none" value={formData.salesThru} onChange={handleChange("salesThru")} id="salesThrough" placeholder="Sales Through" />
          </div>
          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <input type="text" className="form-control shadow-none" value={formData.industry} onChange={handleChange("industry")} id="industry" placeholder="Industry" />
          </div>
          <div className="mb-3">
            <label htmlFor="businessType" className="form-label">Business Type</label>
            <input type="text" className="form-control shadow-none" value={formData.businessType} onChange={handleChange("businessType")} id="businessType" placeholder="Business Type" />
          </div>
          <div className="mb-3">
            <label htmlFor="kycId" className="form-label">KYC Id</label>
            <input type="text" className="form-control shadow-none" value={formData.kycId} onChange={handleChange("kycId")} id="kycId" placeholder="KYC Id" />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleBrand" className="form-label">Vehicle Brand</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleBrand} onChange={handleChange("vehicleBrand")} id="vehicleBrand" placeholder="Vehicle Details" />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
            <input type="text" className="form-control shadow-none" value={formData.vehicleModel} onChange={handleChange("vehicleModel")} id="vehicleModel" placeholder="Vehicle Details" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control shadow-none" value={formData.quantity} onChange={handleChange("quantity")} id="quantity" placeholder="Quantity of Products" />
          </div>
          <div className="mb-3">
            <label htmlFor="colour" className="form-label">Colour</label>
            <input type="text" className="form-control shadow-none" value={formData.colour} onChange={handleChange("colour")} id="colour" placeholder="Colour" />
          </div>
          <div className="mb-3">
            <label htmlFor="totalInvoiceValuePerVehicle" className="form-label">Total Invoice Value Per Vehicle</label>
            <input type="text" className="form-control shadow-none" value={formData.totalInvoiceValuePerVehicle} onChange={handleChange("totalInvoiceValuePerVehicle")} id="totalInvoiceValuePerVehicle" placeholder="Value for each vehicle" />
          </div>
          <div className="mb-3">
            <label htmlFor="typeOfBodyBuilding" className="form-label">Type of Body Building</label>
            <input type="text" className="form-control shadow-none" value={formData.typeOfBodyBuilding} onChange={handleChange("typeOfBodyBuilding")} id="typeOfBodyBuilding" placeholder="Type of Body Building" />
          </div>
          <div className="mb-3">
            <label htmlFor="bodyFabricatorName" className="form-label">Body Fabricator Name</label>
            <input type="text" className="form-control shadow-none" value={formData.bodyFabricatorName} onChange={handleChange("bodyFabricatorName")} id="bodyFabricatorName" placeholder="Body Fabricator Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryDate" className="form-label">Expected Delivery Date</label>
            <input type="date" className="form-control shadow-none" value={formData.expectedDeliveryDate} onChange={handleChange("expectedDeliveryDate")} id="deliveryDate" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location</label>
            <textarea className="form-control shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" rows={3}></textarea>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" checked={formData.registration} onChange={handleCheck("registration")} type="checkbox" id="registration" />
            <label className="form-check-label" htmlFor="registration">
              Registration
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryBy" className="form-label">Delivery By</label>
            <input type="text" className="form-control shadow-none" value={formData.deliveryBy} onChange={handleChange("deliveryBy")} id="deliveryBy" placeholder="Delivery By" />
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
            <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
            <input type="text" className="form-control shadow-none" value={formData.paymentStatus} onChange={handleChange("paymentStatus")} id="paymentStatus" placeholder="Payment Status" />
          </div>
          <div className="mb-3">
            <label htmlFor="lpoNumber" className="form-label">LPO Number</label>
            <input type="text" className="form-control shadow-none" value={formData.lpoNumber} onChange={handleChange("lpoNumber")} id="lpoNumber" placeholder="LPO Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="lpoPdf" className="form-label">LPO PDF</label>
            <input type="file" className="form-control shadow-none" value={formData.lpoPdf} onChange={handleChange("lpoPdf")} id="lpoPdf" placeholder="LPO PDF" />
          </div>



          <div className="mb-3">
            <label htmlFor="warrantyCertificate" className="form-label">Warranty Certificate</label>
            <input type="file" className="form-control shadow-none" value={formData.selectedFile} onChange={uploadImage} id="warrantyCertificate" placeholder="Warranty Certificate" />

            {(imageUrl || formData.warrantyCertificate) &&
            <div>
              <h6 className='small fw-bold mt-3'>Warranty Certificate Preview</h6>
              <img src={imageUrl || formData.warrantyCertificate} alt="Logo Preview" className='border rounded' width="100px"/>
            </div>}
          </div>
          <div className="mb-3">
            <label htmlFor="agreedCreditPeriod" className="form-label">Agreed Credit Period</label>
            <input type="text" className="form-control shadow-none" value={formData.agreedCreditPeriod} onChange={handleChange("agreedCreditPeriod")} id="agreedCreditPeriod" placeholder="Agreed Credit Period" />
          </div>
          <div className="mb-3">
            <label htmlFor="rebateReceiver" className="form-label">Rebate Reciever</label>
            <input type="text" className="form-control shadow-none" value={formData.rebateReceiver} onChange={handleChange("rebateReceiver")} id="rebateReceiver" placeholder="Rebate Reciever" />
          </div>
          <div className="mb-3">
            <label htmlFor="rebateAmount" className="form-label">Rebate Amount</label>
            <input type="text" className="form-control shadow-none" value={formData.rebateAmount} onChange={handleChange("rebateAmount")} id="rebateAmount" placeholder="Rebate Amount" />
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
            <label htmlFor="refundToCustomer" className="form-label">Refund To Customer</label>
            <input type="text" className="form-control shadow-none" value={formData.refundToCustomer} onChange={handleChange("refundToCustomer")} id="refundToCustomer" placeholder="Refund To Customer" />
          </div>
          <div className="mb-3">
            <label htmlFor="servicePackageDetails" className="form-label">Service Package Details</label>
            <textarea className="form-control shadow-none" value={formData.servicePackageDetails} onChange={handleChange("servicePackageDetails")} id="servicePackageDetails" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="additionalInformation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="additionalInformation" rows={3}></textarea>
          </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={invoiceRequestDetailsMutation.isLoading} onClick={handleSubmit}>{invoiceRequestDetailsMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={handleCancel}>Cancel</button>
        </div>
        
      </form>
    </section>

  )
}

export default EditInvoiceRequestDetails;