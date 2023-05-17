import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import Compress from "react-image-file-resizer";
import formatAsCurrency from '../../../services/formatAsCurrency';
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';
import NaijaStates from 'naija-state-local-government';



const AddPfiRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, staffCadre } = getUserData();
  const [formData, setFormData] = useState({
    customerType: "",
    employeeId: "",
    customerId: "",
    companyName: "",
    contactPerson: "",
    mobile: "",
    companyAddress: "",
    emailAddress: "",
    pfiVehiclesData: [],
    refundRebaseRecipient: "",
    designation: "",
    relationshipWithTransaction: "",
    estimatedOrderClosingTime: "",
    deliveryPeriod: "",
    paymentType: "",
    deliveryLocation: "",
    additionalInformation: "",
  })

  let emptyVehicleDetailsObject = {
    productBrand: "",
    vehicleModel: "",
    bodyTypeDescription: "",
    vehicleServiceDetails: "",
    vehicleSpecialFitmentDetails: "",
    costOfBodySpecialFitment: "",
    quantity: "",
    priceOfVehicle: "",
    discount: "",
    vatDeduction: false,
    whtDeduction: false,
    registration: false,
    refundRebaseAmount: "",
  }

  const [vehicleDatails, setVehicleDetails] = useState(emptyVehicleDetailsObject)

  const [errors, setErrors] = useState({});
  const [vehicleDatailsErrors, setVehicleDetailsErrors] = useState({});
  const [contactPersons, setContactPersons] = useState([])

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      employeeId: id
    }))
  }, [])

  const queryClient = useQueryClient();
  const pfiRequestMutation = useMutation({
    mutationFn: () => apiPost({ url: `/pfiRequestForm/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allPfiRequests"])
      navigate(`/app/pfiRequest`)
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

  useEffect(() => {
    if (formData.companyName && formData.customerType === "existing customer") {
      let customerId = getCustomerIdBy(formData.companyName);
      setFormData(prevState => ({
        ...prevState,
        customerId
      }))
    }
  }, [formData.companyName])

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

  const getCustomerIdBy = (companyName) => {
    let customerId;
    customerQuery?.data?.forEach(customer => {
      if (customer.companyName === companyName) {
        customerId = customer.id
      }
    })
    return customerId
  }

  const listCustomerOptions = () => {
    if (customerQuery?.data?.length) {
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.companyName}>{customer.companyName}</option>
      )
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
  const deleteProduct = (product) => {
    let productBrands = formData.productBrands;
    productBrands = productBrands.filter(item => item !== product);
    setFormData(prevState => ({
      ...prevState,
      productBrands
    }))
  }

  const listProductsAsCards = () => {
    if (formData.productBrands.length > 0) {
      return formData.productBrands.map((product) => <li key={product} className='m-2 d-flex align-items-start border p-3 rounded'>
        <span>{product}</span>
        <button onClick={() => deleteProduct(product)} style={{ width: "10px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-25px", left: "25px" }}
          className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>)
    }
  }

  const listStateOptions = () => {
    return NaijaStates.states().map(state =>
      <option key={state} value={state}>{state}</option>
    )
  }

  useEffect(() => {
    let companyName = formData.companyName;
    let companyId = getCompanyData(companyName).id
    if (companyId) {
      fetchContactPersons(companyId)
    }
    setFormData(prevState => ({
      ...prevState,
      companyAddress: getCompanyData(companyName).address1
    }))
  }, [formData.companyName])

  useEffect(() => {
    let contactPerson = formData.contactPerson;
    let contactPersonData = getContactPersonData(contactPerson);
    if (contactPersonData) {
      setFormData(prevState => ({
        ...prevState,
        mobile: contactPersonData.phoneNumber1,
        emailAddress: contactPersonData.email,
      }))
    }
  }, [formData.contactPerson])

  const getCompanyData = (name) => {
    let data = {}
    if (!customerQuery.isLoading) {
      customerQuery.data.forEach(customer => {
        if (customer.companyName === name) {
          data = customer
        }
      })
    }
    return data
  }


  const fetchContactPersons = (id) => {
    apiGet({ url: `/contactPerson/customer/${id}` })
      .then(res => {
        console.log(res.payload)
        setContactPersons(res.payload);
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
  }

  const listContactPerson = () => {
    if (contactPersons.length > 0) {
      return contactPersons.map(contactPerson =>
        <option key={contactPerson.id} value={`${contactPerson.firstName} ${contactPerson.lastName}`}>{contactPerson.firstName} {contactPerson.lastName}</option>
      )
    }
  }

  const getContactPersonData = (name) => {
    let data = null
    contactPersons.forEach(person => {
      if (name === `${person.firstName} ${person.lastName}`) {
        data = person
      }
    })
    return data
  }

  const handleChange = (props) => (event) => {

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors(prevState => ({
      ...prevState,
      [props]: ""
    }))

    if (props === "customerType") {
      setFormData(prevState => ({
        ...prevState,
        companyName: "",
        companyAddress: "",
        contactPerson: "",
        mobile: "",
        emailAddress: "",
        customerId: ""
      }))
    }
  }

  const handleChangeVehicleDetails = (props) => (event) => {

    if (props === "registration" || props === "vatDeduction" || props === "whtDeduction") {
      setVehicleDetails(prevState => ({
        ...prevState,
        [props]: !prevState[props]
      }))
      return
    }
    setVehicleDetails(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setVehicleDetailsErrors(prevState => ({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //return console.log(formData);

    let errors = formValidator(["customerType", "companyName", "companyAddress", "contactPerson", "mobile", "emailAddress", "deliveryPeriod", "paymentType", "deliveryLocation", "pfiVehiclesData"], formData);
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
    pfiRequestMutation.mutate()
  }

  const handleSubmitVehicleDetails = (e) => {
    e.preventDefault();
    //return console.log(vehicleDatails);

    let errors = formValidator(["productBrand", "vehicleModel", "quantity", "priceOfVehicle"], vehicleDatails);
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
    let vehicles = formData.pfiVehiclesData;
    vehicles.push(vehicleDatails);
    setFormData(prevState => ({
      ...prevState,
      pfiVehiclesData: vehicles
    }))
    setVehicleDetails(emptyVehicleDetailsObject);
    console.log(formData)
  }

  const listVehiclesInPfiForm = () => {
    if (formData.pfiVehiclesData.length > 0) {
      return formData.pfiVehiclesData.map((item, index) => (
        <li key={index} className={`h6 d-flex align-items-center border rounded p-3 m-2 ${vehicleDatails.index === index && "border-primary"}`}>
          <span className='me-auto'>{item.quantity} {item.productBrand} for {formatAsCurrency(item.priceOfVehicle)} each</span>
          <i className="bi bi-trash fs-4 px-2" style={{ cursor: "pointer" }} title="Delete" onClick={() => deleteVehicleInPfiForm(index)}></i>
          <i className="bi bi-pencil-square fs-4 px-2" style={{ cursor: "pointer" }} onClick={() => onClickEdit(item, index)} title="Edit"></i>
        </li>
      ))
    }
  }

  const deleteVehicleInPfiForm = (vehicleIndex) => {
    let vehicles = formData.pfiVehiclesData;
    vehicles = vehicles.filter((vehicle, index) => index !== vehicleIndex)
    setFormData(prevState => ({
      ...prevState,
      pfiVehiclesData: vehicles
    }))
  }

  const onClickEdit = (item, index) => {
    console.log(index)
    setVehicleDetails({
      index: index,
      ...item
    })
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    let vehicles = formData.pfiVehiclesData;
    let index = vehicleDatails.index;
    let data = vehicleDatails;
    delete data.index;
    vehicles[index] = data;

    setFormData(prevState => ({
      ...prevState,
      pfiVehiclesData: vehicles
    }))
    setVehicleDetails(emptyVehicleDetailsObject)
  }

  const handleCancelEdit = (e) => {
    e.preventDefault()
    setVehicleDetails(emptyVehicleDetailsObject);
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add PFI Request</header>
        <p>Fill in PFI Request Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <select className="form-select shadow-none" id="customerType" onChange={handleChange("customerType")} value={formData.customerType} aria-label="Default select example">
              <option value="">Select Customer Type</option>
              <option value="existing customer">Existing Customer</option>
              <option value="new customer">New Customer</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none w-50" id="companyName" onChange={handleChange("companyName")} value={formData.companyName} aria-label="Default select example">
                <option value="">Select Company</option>
                {!customerQuery.isLoading && listCustomerOptions()}
              </select>
              <input type="text" className="form-control shadow-none w-50 ms-2" value={formData.companyName} onChange={handleChange("companyName")} id="companyName" placeholder="New Company Name" />
            </div>
            <span className='text-danger font-monospace small'>{errors.companyName}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress" className="form-label">Company Address (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.companyAddress} onChange={handleChange("companyAddress")} id="companyAddress" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.companyAddress}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none w-50" id="contactPerson" onChange={handleChange("contactPerson")} value={formData.contactPerson} aria-label="Default select example">
                <option value="">Contact Person</option>
                {contactPersons.length > 0 && listContactPerson()}
              </select>
              <input type="text" className="form-control shadow-none w-50 ms-2" value={formData.contactPerson} onChange={handleChange("contactPerson")} id="contactPerson" placeholder="Firstname Lastname" />
            </div>
            <span className='text-danger font-monospace small'>{errors.contactPerson}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.mobile} onChange={handleChange("mobile")} id="phoneNumber" placeholder="Phone Number" />
            <span className='text-danger font-monospace small'>{errors.mobile}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="emailAddress" className="form-label">Email Address (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.emailAddress} onChange={handleChange("emailAddress")} id="emailAddress" placeholder="Email Address" />
            <span className='text-danger font-monospace small'>{errors.emailAddress}</span>
          </div>
          <div>
            <h6 className='fw-bold'>Vehicles</h6>
            <ul>
              {listVehiclesInPfiForm()}
            </ul>
          </div>



          <section className='border border-primary rounded p-3 p-lg-4 my-5'>


            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    {vehicleDatails.index !== undefined ? "Edit" : "Add New"} Vehicle Details
                  </button>

                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <p className='lead mb-3'>This form in the blue box should be filled for <strong>each vehicle brand</strong>  in the PFI Request</p>
                    <div className="mb-3">
                      <label htmlFor="productBrand" className="form-label">Product Brand (<span className='fst-italic text-warning'>required</span>)</label>
                      <div className='d-flex align-items-center'>
                        <select className="form-select shadow-none" value={vehicleDatails.productBrand} onChange={handleChangeVehicleDetails("productBrand")} id="productBrand" aria-label="Default select example">
                          <option value="">Select Product Brand</option>
                          {!productQuery.isLoading && listProductOptions()}
                        </select>
                      </div>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.productBrand}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vehicleModel" className="form-label">Vehicle Model Specific Details (<span className='fst-italic text-warning'>required</span>)</label>
                      <textarea className="form-control shadow-none" value={vehicleDatails.vehicleModel} onChange={handleChangeVehicleDetails("vehicleModel")} id="vehicleModel" rows={3}></textarea>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.vehicleModel}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="bodyTypeDescription" className="form-label">Body Type Description / Any Extra Requirement Detail</label>
                      <textarea className="form-control shadow-none" value={vehicleDatails.bodyTypeDescription} onChange={handleChangeVehicleDetails("bodyTypeDescription")} id="bodyTypeDescription" rows={3}></textarea>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.bodyTypeDescription}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vehicleServiceDetails" className="form-label">Any Vehicle Service Given Details</label>
                      <textarea className="form-control shadow-none" value={vehicleDatails.vehicleServiceDetails} onChange={handleChangeVehicleDetails("vehicleServiceDetails")} id="vehicleServiceDetails" rows={3}></textarea>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.vehicleServiceDetails}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vehicleSpecialFitmentDetails" className="form-label">Body / Special Fitment details (please be specific)</label>
                      <textarea className="form-control shadow-none" value={vehicleDatails.vehicleSpecialFitmentDetails} onChange={handleChangeVehicleDetails("vehicleSpecialFitmentDetails")} id="vehicleSpecialFitmentDetails" rows={3}></textarea>
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.vehicleSpecialFitmentDetails}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="costOfBodySpecialFitment" className="form-label">Cost for Body/Super Structure/Special Fitment <span className='ms-3 fw-bold'>{formatAsCurrency(vehicleDatails.costOfBodySpecialFitment)}</span></label>
                      <input type="number" className="form-control shadow-none" value={vehicleDatails.costOfBodySpecialFitment} onChange={handleChangeVehicleDetails("costOfBodySpecialFitment")} id="costOfBodySpecialFitment" placeholder="Cost Of Body Special Fitment" />
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.costOfBodySpecialFitment}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label">Quantity  (<span className='fst-italic text-warning'>required</span>)</label>
                      <input type="number" className="form-control shadow-none" value={vehicleDatails.quantity} onChange={handleChangeVehicleDetails("quantity")} id="quantity" placeholder="Quantity of Products" />
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.quantity}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="priceOfVehicle" className="form-label">Price Per Vehicle (<span className='fst-italic text-warning'>required</span>)<span className='ms-3 fw-bold'>{formatAsCurrency(vehicleDatails.priceOfVehicle)}</span></label>
                      <input type="number" className="form-control shadow-none" value={vehicleDatails.priceOfVehicle} onChange={handleChangeVehicleDetails("priceOfVehicle")} id="priceOfVehicle" placeholder="Price of Vehicle" />
                      <span className='text-danger font-monospace small'>{vehicleDatailsErrors.priceOfVehicle}</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="discount" className="form-label">Discount, if any</label>
                      <input type="text" className="form-control shadow-none" value={vehicleDatails.discount} onChange={handleChangeVehicleDetails("discount")} id="discount" placeholder="Discount" />
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input shadow-none" type="checkbox" checked={vehicleDatails.vatDeduction} onChange={handleChangeVehicleDetails("vatDeduction")} id="vatDeduction" />
                      <label className="form-check-label" htmlFor="vatDeduction">
                        VAT Deduction
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input shadow-none" type="checkbox" checked={vehicleDatails.whtDeduction} onChange={handleChangeVehicleDetails("whtDeduction")} id="whtDeduction" />
                      <label className="form-check-label" htmlFor="whtDeduction">
                        WHT Deduction
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input shadow-none" type="checkbox" checked={vehicleDatails.registration} onChange={handleChangeVehicleDetails("registration")} id="registration" />
                      <label className="form-check-label" htmlFor="registration">
                        Registration
                      </label>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="refundRebaseAmount" className="form-label">Refund/Rebate amount, if any  <span className='ms-3 fw-bold'>{formatAsCurrency(vehicleDatails.refundRebaseAmount)}</span></label>
                      <input type="text" className="form-control shadow-none" value={vehicleDatails.refundRebaseAmount} onChange={handleChangeVehicleDetails("refundRebaseAmount")} id="refundRebaseAmount" placeholder="Amount to be Refunded" />
                    </div>

                    <div className="d-flex mt-5">
                      {vehicleDatails.index !== undefined ?
                        <>
                          <button className="btn btn-primary ms-auto me-3 px-5" onClick={handleSaveEdit}>Save Changes</button>
                          <button className="btn btn-secondary me-auto ms-3 px-5" onClick={handleCancelEdit}>Cancel</button>
                        </> :
                        <button className="btn btn-primary mx-auto px-5" onClick={handleSubmitVehicleDetails}>Add Vehicle to PFI Request</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className='text-center mt-4'>
              <span className='text-danger font-monospace'>{errors.pfiVehiclesData && "You must add at least one vehicle to the pfi request"}</span>
            </div>
          </section>










          <div className="mb-3">
            <label htmlFor="refundRebaseRecipient" className="form-label">Person name receiving refund/rebate</label>
            <input type="text" className="form-control shadow-none" value={formData.refundRebaseRecipient} onChange={handleChange("refundRebaseRecipient")} id="refundRebaseRecipient" placeholder="Person to be Refunded" />
          </div>
          <div className="mb-3">
            <label htmlFor="relationshipWithTransaction" className="form-label">Relationship with transaction (if rebate receiver is not working in buying company)</label>
            <input type="text" className="form-control shadow-none" value={formData.relationshipWithTransaction} onChange={handleChange("relationshipWithTransaction")} id="relationshipWithTransaction" placeholder="Relationship with Transaction" />
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Designation (when rebate receiver is working in buying company)</label>
            <input type="text" className="form-control shadow-none" value={formData.designation} onChange={handleChange("designation")} id="designation" />
          </div>
          <div className="mb-3">
            <label htmlFor="estimatedOrderClosingTime" className="form-label">Estimated Order Closing Time</label>
            <input type="text" className="form-control shadow-none" value={formData.estimatedOrderClosingTime} onChange={handleChange("estimatedOrderClosingTime")} id="estimatedOrderClosingTime" placeholder="Estimated Order Closing Time" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryPeriod" className="form-label">Delivery Period needed for vehicle  (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.deliveryPeriod} onChange={handleChange("deliveryPeriod")} id="deliveryPeriod" placeholder="Delivery Period" />
            <span className='text-danger font-monospace small'>{errors.deliveryPeriod}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="paymentType" className="form-label">Payment Type (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" id="paymentType" value={formData.paymentType} onChange={handleChange("paymentType")} aria-label="Default select example">
              <option value="">Select Payment Type</option>
              <option value="direct">Direct</option>
              <option value="bank finance">Bank Finance</option>
            </select>
            <span className='text-danger font-monospace small'>{errors.paymentType}</span>
          </div>
          {/* <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.deliveryLocation}</span>  
          </div> */}
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" aria-label="Default select example">
              <option value="">Select Delivery Location</option>
              {listStateOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.deliveryLocation}</span>
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="deliveryLocation" rows={6}></textarea>
          </div>


          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={pfiRequestMutation.isLoading} onClick={handleSubmit}>{pfiRequestMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={pfiRequestMutation.isLoading} onClick={() => navigate(`/app/pfiRequest/`)}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddPfiRequest;