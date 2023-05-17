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
  const { id } = getUserData()
  const [formData, setFormData] = useState({
    customerType: "",
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
    vehiclesData: [],
    expectedDeliveryDate: "",
    deliveryLocation: "",
    deliveryBy: "",
    paymentStatus: "",
    lpoNumber: "",
    lpoPdf: "",
    agreedCreditPeriod: "",
    rebateReceiver: "",
    relationshipWithTransaction: "",
    accountDetailsToTransfer: "",
    additionalInformation: "",
  });

  const emptyVehicleDataObject = {
    vehicleBrand: "",
    vehicleModel: "",
    quantity: "",
    colour: "",
    totalInvoiceValuePerVehicle: "",
    typeOfBodyBuilding: "",
    bodyFabricatorName: "",
    vatDeduction: false,
    whtDeduction: false,
    registration: false,
    servicePackageDetails: "",
    rebateAmount: "",
    refundToCustomer: "",
  }


  const [vehicleDataObject, setVehicleDataObject] = useState(emptyVehicleDataObject);
  const [vehiclesFromPfi, setVehiclesFromPfi] = useState([]);
  const [errors, setErrors] = useState({});
  const [vehicleDatailsErrors, setVehicleDetailsErrors] = useState({});



  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      employeeId: id
    }))
  }, [])

  useEffect(() => {
    if (formData.pfiRequestFormId) {
      let pfiRequestData = getPfiRequestDataBy(formData.pfiRequestFormId);
      let customerData = getCustomerBy(pfiRequestData.customerId);
      setFormData(prevState => ({
        ...prevState,
        customerId: pfiRequestData.customerId || "",
        customerType: pfiRequestData.customerType || "",
        invoiceName: pfiRequestData.companyName || "",
        contactOfficeTelephone: pfiRequestData.mobile || "",
        contactPerson: pfiRequestData.contactPerson || "",
        address1: pfiRequestData.companyAddress || "",
        email: pfiRequestData.emailAddress || "",
        deliveryLocation: pfiRequestData.deliveryLocation || "",
        rebateReceiver: pfiRequestData.refundRebaseRecipient || "",
        relationshipWithTransaction: pfiRequestData.relationshipWithTransaction || "",
        industry: customerData.industry || "",
        businessType: customerData.businessType || ""
      }))
      const vehicleDataList = [];
      pfiRequestData.pfiVehiclesData.forEach(item => {
        let vehicleData = {
          ...emptyVehicleDataObject,
          vehicleBrand: item.productBrand,
          vehicleModel: item.vehicleModel,
          whtDeduction: item.whtDeduction,
          vatDeduction: item.vatDeduction,
          totalInvoiceValuePerVehicle: item.priceOfVehicle,
          quantity: item.quantity,
          typeOfBodyBuilding: item.bodyTypeDescription,
          rebateAmount: item.refundRebaseAmount,
          servicePackageDetails: item.vehicleServiceDetails
        };
        vehicleDataList.push(vehicleData);
      })
      setVehiclesFromPfi(vehicleDataList)
    }
  }, [formData.pfiRequestFormId])

  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const queryClient = useQueryClient();
  const invoiceRequestMutation = useMutation({
    mutationFn: (data) => apiPost({ url: `/invoiceRequestForm/create`, data }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allInvoiceRequests"])
      navigate("/app/invoiceRequest")
    }).catch(error => {
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
    queryFn: () => apiGet({ url: `/pfiRequestForm/employee/${id}` })
      .then((res) => {
        return res.payload
      })
      .catch(error => {
        dispatch(
          setMessage({
            severity: "error",
            message: error.message,
            key: Date.now(),
          })
        );
      })
  })

  const listPfiRequestOptions = () => {
    if (pfiRequestQuery?.data?.length) {
      return pfiRequestQuery.data.map(pfiRequest =>
        <option key={pfiRequest.id} value={pfiRequest.id}>PFI request for {pfiRequest.companyName} buying {pfiRequest?.pfiVehiclesData?.length} vehicle brands</option>
      )
    }
  }

  const getPfiRequestDataBy = (id) => {
    let data;
    pfiRequestQuery.data.forEach(pfiRequest => {
      if (pfiRequest.id === id) {
        data = pfiRequest
      }
    })
    return data;
  }

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({ url: `/customer/employee/${id}` })
      .then((res) => res.payload)
      .catch(error => {
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
    customerQuery?.data?.forEach(customer => {
      if (customer.id === id) {
        customerData = customer
      }
    })
    return customerData;
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

  const productQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => apiGet({ url: "/product" })
      .then((res) => res.payload)
      .catch(error => {
        dispatch(
          setMessage({
            severity: "error",
            message: error.message,
            key: Date.now(),
          })
        );
      })
  })

  const listProductOptions = () => {
    if (productQuery?.data?.length) {
      return productQuery.data.map(product =>
        <option key={product.id} value={product.name}>{product.name}</option>
      )
    }
  }

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
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // return console.log(formData);
    let data = formData;
    data.warrantyCertificate = base64Image;
    data.vehiclesData = [...data.vehiclesData, ...vehiclesFromPfi]
    let errors = formValidator(["invoiceName", "address1", "contactPerson", "contactOfficeTelephone", "expectedDeliveryDate", "paymentStatus", "deliveryLocation", "deliveryBy", "pfiRequestFormId", "vehiclesData"], data);
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
    }
    //return console.log(data);
    invoiceRequestMutation.mutate(data)
  }



  const handleChangeVehicleDetails = (props) => (event) => {

    if (props === "vatDeduction" || props === "whtDeduction") {
      setVehicleDataObject(prevState => ({
        ...prevState,
        [props]: !prevState[props]
      }))
      return
    }
    setVehicleDataObject(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setVehicleDetailsErrors(prevState => ({
      ...prevState,
      [props]: ""
    }))
  }


  const handleSubmitVehicleDetails = (e) => {
    e.preventDefault();
    //return console.log(vehicleDatails);

    let errors = formValidator(["vehicleBrand", "vehicleModel", "colour", "quantity", "totalInvoiceValuePerVehicle",], vehicleDataObject);
    if (Object.keys(errors).length > 0) {
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      console.log(errors)
      return setVehicleDetailsErrors(errors);
    }
    let vehicles = formData.vehiclesData;
    vehicles.push(vehicleDataObject);
    setFormData(prevState => ({
      ...prevState,
      vehiclesData: vehicles
    }))
    setVehicleDataObject(emptyVehicleDataObject);
    console.log(formData)
  }

  const listVehiclesInInvoiceForm = () => {
    let vehicles = []
    if(vehiclesFromPfi.length > 0){
      vehiclesFromPfi.forEach((item, index) => (
        vehicles.push(
          <li key={`fromPfi${index}`} className={`h6 d-flex align-items-center border rounded p-3 m-2 ${vehicleDataObject.index === index && "border-primary"}`}>
            <span className='me-auto'>{item.quantity} {item.vehicleBrand} for {formatAsCurrency(item.totalInvoiceValuePerVehicle)} each</span>
            <i className="bi bi-trash fs-4 px-2" style={{ cursor: "pointer" }} title="Delete" onClick={() => deleteVehicleInInvoiceForm(index, true)}></i>
            <i className="bi bi-pencil-square fs-4 px-2" style={{ cursor: "pointer" }} onClick={() => onClickEdit(item, index, true)} title="Edit"></i>
          </li>
        )
      ))
    }
    if (formData.vehiclesData.length > 0) {
      formData.vehiclesData.forEach((item, index) => (
        vehicles.push(
          <li key={`fromInvoice${index}`} className={`h6 d-flex align-items-center border rounded p-3 m-2 ${vehicleDataObject.index === index && "border-primary"}`}>
            <span className='me-auto'>{item.quantity} {item.vehicleBrand} for {formatAsCurrency(item.totalInvoiceValuePerVehicle)} each</span>
            <i className="bi bi-trash fs-4 px-2" style={{ cursor: "pointer" }} title="Delete" onClick={() => deleteVehicleInInvoiceForm(index)}></i>
            <i className="bi bi-pencil-square fs-4 px-2" style={{ cursor: "pointer" }} onClick={() => onClickEdit(item, index)} title="Edit"></i>
          </li>
        )
      ))
    }
    return vehicles
  }

  const deleteVehicleInInvoiceForm = (vehicleIndex, fromPfi = false) => {
    let vehicles;
    if(fromPfi){
      vehicles = vehiclesFromPfi;
      vehicles = vehicles.filter((vehicle, index) => index !== vehicleIndex)
      setVehiclesFromPfi(vehicles)
    }else{
      vehicles = formData.vehiclesData;
      vehicles = vehicles.filter((vehicle, index) => index !== vehicleIndex)
      setFormData(prevState => ({
        ...prevState,
        vehiclesData: vehicles
      }))
    }
  }

  const onClickEdit = (item, index, fromPfi = false) => {
    console.log(index)
    setVehicleDataObject({
      fromPfi,
      index: index,
      ...item
    })
  }

  const handleSaveEdit = (e) => {
    e.preventDefault();
    let vehicles;
    if(vehicleDataObject.fromPfi){
      vehicles = vehiclesFromPfi
      let data = vehicleDataObject;
      let index = vehicleDataObject.index;
      delete data.index;
      delete data.fromPfi;
      vehicles[index] = data;
      setVehiclesFromPfi(vehicles);
    }else{
      vehicles = formData.vehiclesData;
      let data = vehicleDataObject;
      let index = vehicleDataObject.index;
      delete data.index;
      delete data.fromPfi;
      vehicles[index] = data;
      setFormData(prevState => ({
        ...prevState,
        vehiclesData: vehicles
      }))
    }
    
    setVehicleDataObject(emptyVehicleDataObject)
  }

  const handleCancelEdit = (e) => {
    e.preventDefault()
    setVehicleDataObject(emptyVehicleDataObject);
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
            <label htmlFor="customerType" className="form-label"> Customer Type </label>
            <select className="form-select shadow-none" id="customerType" onChange={handleChange("customerType")} value={formData.customerType} aria-label="Default select example">
              <option value="">Select Customer Type</option>
              <option value="existing customer">Existing Customer</option>
              <option value="new customer">New Customer</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="invoiceName" className="form-label">Invoice Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.invoiceName} onChange={handleChange("invoiceName")} id="invoiceName" placeholder="Invoice Name" />
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
            <select className="form-select shadow-none" id="salesThrough" value={formData.salesThru} onChange={handleChange("salesThru")} aria-label="Default select example">
              <option value="">Select Sales Through</option>
              <option value="KA">KA</option>
              <option value="Retail">Retails</option>
              <option value="Agent">Agent</option>
              <option value="Govt">Govt</option>
              <option value="Fleet">Fleet</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <input type="text" className="form-control shadow-none" value={formData.industry} onChange={handleChange("industry")} id="industry" placeholder="Industry" />
          </div>
          <div className="mb-3">
            <label htmlFor="businessType" className="form-label">Business Type</label>
            <input type="text" className="form-control shadow-none" value={formData.businessType} onChange={handleChange("businessType")} id="businessType" placeholder="Business Type" />
          </div>

          <section className='border border-primary rounded p-3 p-lg-4 my-5'>
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    {vehicleDataObject.index !== undefined ? "Edit" : "Add New"} Vehicle Details
                  </button>

                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                  <p className='lead mb-3'>This form in the blue box should be filled for <strong className='fw-bold'>each vehicle brand</strong>  in the Invoice Request</p>

                    <div className="mb-3">
                      <label htmlFor="vehicleBrand" className="form-label">Vehicle Brand (<span className='fst-italic text-warning'>required</span>)</label>
                      <div className='d-flex align-items-center'>
                        <select className="form-select shadow-none" value={vehicleDataObject.vehicleBrand} onChange={handleChangeVehicleDetails("vehicleBrand")} id="vehicleBrand" aria-label="Default select example">
                          <option value="">Select Vehicle Brand</option>
                          {!productQuery.isLoading && listProductOptions()}
                        </select>
                      </div>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.vehicleBrand}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vehicleModel" className="form-label">Vehicle Model Specific Details (<span className='fst-italic text-warning'>required</span>)</label>
                      <textarea className="form-control shadow-none" value={vehicleDataObject.vehicleModel} onChange={handleChangeVehicleDetails("vehicleModel")} id="vehicleModel" rows={3}></textarea>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.vehicleModel}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label">Quantity (<span className='fst-italic text-warning'>required</span>)</label>
                      <input type="number" className="form-control shadow-none" value={vehicleDataObject.quantity} onChange={handleChangeVehicleDetails("quantity")} id="quantity" placeholder="Quantity of Products" />
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.quantity}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="colour" className="form-label">Colour (<span className='fst-italic text-warning'>required</span>)</label>
                      <input type="text" className="form-control shadow-none" value={vehicleDataObject.colour} onChange={handleChangeVehicleDetails("colour")} id="colour" placeholder="Colour" />
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.colour}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="totalInvoiceValuePerVehicle" className="form-label">Total Invoice Value Per Vehicle  (<span className='fst-italic text-warning'>required</span>) <span className='fw-bold ms-2'>{formatAsCurrency(vehicleDataObject.totalInvoiceValuePerVehicle)}</span></label>
                      <input type="text" className="form-control shadow-none" value={vehicleDataObject.totalInvoiceValuePerVehicle} onChange={handleChangeVehicleDetails("totalInvoiceValuePerVehicle")} id="totalInvoiceValuePerVehicle" placeholder="Value for each vehicle" />
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.totalInvoiceValuePerVehicle}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="typeOfBodyBuilding" className="form-label">Type of Body Building</label>
                      <input type="text" className="form-control shadow-none" value={vehicleDataObject.typeOfBodyBuilding} onChange={handleChangeVehicleDetails("typeOfBodyBuilding")} id="typeOfBodyBuilding" placeholder="Type of Body Building" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="bodyFabricatorName" className="form-label">Body Fabricator Name (if any)</label>
                      <input type="text" className="form-control shadow-none" value={vehicleDataObject.bodyFabricatorName} onChange={handleChangeVehicleDetails("bodyFabricatorName")} id="bodyFabricatorName" placeholder="Body Fabricator Name" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="registration" className="form-label">Registration</label>
                      <select className="form-select shadow-none" id="registration" value={vehicleDataObject.registration} onChange={handleChangeVehicleDetails("registration")} aria-label="Default select example">
                        <option value="">Select Registration Type</option>
                        <option value="private">Private</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input shadow-none" checked={vehicleDataObject.vatDeduction} onChange={handleChangeVehicleDetails("vatDeduction")} type="checkbox" id="vatDeduction" />
                      <label className="form-check-label" htmlFor="vatDeduction">
                        VAT Deduction
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input shadow-none" checked={vehicleDataObject.whtDeduction} onChange={handleChangeVehicleDetails("whtDeduction")} type="checkbox" id="whtDeduction" />
                      <label className="form-check-label" htmlFor="whtDeduction">
                        WHT Deduction
                      </label>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="rebateAmount" className="form-label">Rebate Amount <span className='fw-bold'>{formatAsCurrency(vehicleDataObject.rebateAmount)}</span></label>
                      <input type="text" className="form-control shadow-none" value={vehicleDataObject.rebateAmount} onChange={handleChangeVehicleDetails("rebateAmount")} id="rebateAmount" placeholder="Rebate Amount" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="refundToCustomer" className="form-label">Refund To Customer (If any) <span className='fw-bold'>{formatAsCurrency(vehicleDataObject.refundToCustomer)}</span></label>
                      <input type="text" className="form-control shadow-none" value={vehicleDataObject.refundToCustomer} onChange={handleChangeVehicleDetails("refundToCustomer")} id="refundToCustomer" placeholder="Refund To Customer" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="servicePackageDetails" className="form-label">Service Package Details (If given)</label>
                      <textarea className="form-control shadow-none" value={vehicleDataObject.servicePackageDetails} onChange={handleChangeVehicleDetails("servicePackageDetails")} id="servicePackageDetails" rows={3}></textarea>
                    </div>

                    <div className="d-flex mt-5">
                      {vehicleDataObject.index !== undefined ?
                        <>
                          <button className="btn btn-primary ms-auto me-3 px-5" onClick={handleSaveEdit}>Save Changes</button>
                          <button className="btn btn-secondary me-auto ms-3 px-5" onClick={handleCancelEdit}>Cancel</button>
                        </> :
                        <button className="btn btn-primary mx-auto px-5" onClick={handleSubmitVehicleDetails}>Add Vehicle to Invoice Request</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='text-center mt-4'>
              <span className='text-danger font-monospace'>{errors.vehiclesData && "You must add at least one vehicle to the invoice request"}</span>
            </div>
          </section>

          <div className='mb-5'>
            <h6 className='fw-bold'>Vehicles List</h6>
            <ul>
              {listVehiclesInInvoiceForm()}
            </ul>
          </div>


          <div className="mb-3">
            <label htmlFor="deliveryDate" className="form-label">Expected Delivery Date (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="date" className="form-control shadow-none" value={formData.expectedDeliveryDate} onChange={handleChange("expectedDeliveryDate")} id="deliveryDate" />
            <span className='text-danger font-monospace small'>{errors.expectedDeliveryDate}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location (Address) (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.deliveryLocation}</span>
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
          <div className="mb-3">
            <label htmlFor="paymentStatus" className="form-label">Payment Status (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="paymentStatus" value={formData.paymentStatus} onChange={handleChange("paymentStatus")} aria-label="Default select example">
              <option value="">Select Payment Status</option>
              <option value="Paid to Bank">Paid to Bank Name / LPO No</option>
              <option value="Cash Transaction">Cash transaction \ Credit billing</option>
            </select>
            <span className='text-danger font-monospace small'>{errors.paymentStatus}</span>
          </div>
          {
            formData.paymentStatus === "Paid to Bank" &&
            <>
              <div className="mb-3">
                <label htmlFor="lpoNumber" className="form-label">LPO Number</label>
                <input type="text" className="form-control shadow-none" value={formData.lpoNumber} onChange={handleChange("lpoNumber")} id="lpoNumber" placeholder="LPO Number" />
              </div>
              <div className="mb-3">
                <label htmlFor="lpoPdf" className="form-label">LPO PDF</label>
                <input type="file" className="form-control shadow-none" value={formData.lpoPdf} onChange={handleChange("lpoPdf")} id="lpoPdf" placeholder="LPO PDF" />
              </div>
            </>
          }


          <div className="mb-3">
            <label htmlFor="agreedCreditPeriod" className="form-label">Agreed Credit Period</label>
            <input type="text" className="form-control shadow-none" value={formData.agreedCreditPeriod} onChange={handleChange("agreedCreditPeriod")} id="agreedCreditPeriod" placeholder="Agreed Credit Period" />
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