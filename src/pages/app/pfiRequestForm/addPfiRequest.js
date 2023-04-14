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


const AddPfiRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id, staffCadre} = getUserData();
  const [formData, setFormData] = useState({
    customerType: "existing customer",
    employeeId: "",
    customerId: "",
    companyName: "",
    contactPerson: "",
    mobile: "",
    companyAddress: "",
    emailAddress: "",
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
    refundRebaseRecipient: "",
    designation: "",
    relationshipWithTransaction: "",
    estimatedOrderClosingTime: "",
    deliveryPeriod: "",
    paymentType: "",
    deliveryLocation: "",
    additionalInformation: "",
  })

  const [errors, setErrors] = useState({});

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      employeeId: id
    }))
  }, [])

  useEffect(()=>{
    if(formData.companyName && formData.customerType === "existing customer"){
      let customerId = getCustomerIdBy(formData.companyName);
      setFormData( prevState => ({
        ...prevState,
        customerId
      }))
    }
  }, [formData.companyName])

  const [contactPersons, setContactPersons] = useState([])
  const [products, setProducts] = useState([])

  const queryClient = useQueryClient();
  const pfiRequestMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/pfiRequestForm/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allPfiRequests"])
      navigate(`/app/pfiRequest`)
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

  const getCustomerIdBy = (companyName) => {
    let customerId;
    customerQuery?.data?.forEach( customer =>{
      if(customer.companyName === companyName){
        customerId = customer.id
      }
    })
    return customerId
  }

  const listCustomerOptions = () =>{
    if(customerQuery?.data?.length){
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.companyName}>{customer.companyName}</option>
      )
    }
  }

  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"})
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

  const listProductGroupOptions = () =>{
    if(productGroupQuery?.data?.length){
      return productGroupQuery.data.map(productGroup =>
        <option key={productGroup.id} value={productGroup.name}>{productGroup.name}</option>
      )
    }
  }

  const getProductGroupData = (name) =>{
    let data = {}
    if(!productGroupQuery.isLoading){
      productGroupQuery.data.forEach( productGroup => {
        if(productGroup.name === name){
          data = productGroup
        }
      })
    }
    return data
  }

  

  useEffect(()=>{
    let companyName = formData.companyName;
    let companyId = getCompanyData(companyName).id
    if(companyId){
      fetchContactPersons(companyId)
    }
    setFormData( prevState => ({
      ...prevState,
      companyAddress: getCompanyData(companyName).address1
    }))
  }, [formData.companyName])

  useEffect(()=>{
    let contactPerson = formData.contactPerson;
    if(formData.customerType === "existing customer"){
      let contactPersonData = getContactPersonData(contactPerson);
      setFormData( prevState => ({
        ...prevState,
        mobile: contactPersonData.phoneNumber1,
        emailAddress: contactPersonData.email,
      }))
    }
  }, [formData.contactPerson])

  

  useEffect(()=>{
    let productGroup = formData.productBrand;
    let productGroupData = getProductGroupData(productGroup);
    if(productGroup){
      fetchProducts(productGroupData.id)
    }
  }, [formData.productBrand])

  const fetchProducts = (id) =>{
    apiGet({ url: `/product/productGroup/${id}`})
      .then( res => {
        console.log(res.payload)
        setProducts(res.payload)
      })
      .catch( error => {
        dispatch(
          setMessage({
            severity: "error",
            message: error.message,
            key: Date.now(),
          })
        );
      })
  }

  const listProducts = () => {
    if(products.length > 0){
      return products.map(product =>
        <option key={product.id} value={product.name}>{product.name}</option>
      )
    }
  }

  const getCompanyData = (name) =>{
    let data = {}
    if(!customerQuery.isLoading){
      customerQuery.data.forEach( customer => {
        if(customer.companyName === name){
          data = customer
        }
      })
    }
    return data
  }


  const fetchContactPersons = (id) =>{
    apiGet({url: `/contactPerson/customer/${id}`})
    .then( res =>{
      console.log(res.payload)
      setContactPersons(res.payload);
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
  }

  const listContactPerson = () =>{
    if(contactPersons.length > 0){
      return contactPersons.map(contactPerson =>
        <option key={contactPerson.id} value={`${contactPerson.firstName} ${contactPerson.lastName}`}>{contactPerson.firstName} {contactPerson.lastName}</option>
      )
    }
  }

  const getContactPersonData = (name) =>{
    let data = {}
    contactPersons.forEach( person => {
      if(name === `${person.firstName} ${person.lastName}`){
        data = person
      }
    })
    return data
  }

  const handleChange = (props) => (event) =>{
    if(props === "registration" || props === "vatDeduction" || props === "whtDeduction"){
      setFormData(prevState => ({
        ...prevState,
        [props]: !prevState[props]
      }))
      return
    }
    
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [props]: ""
    }))

    if(props === "customerType"){
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

  const handleSubmit = (e) =>{
    e.preventDefault();
    //return console.log(formData);

    let errors = formValidator(["companyName", "companyAddress", "contactPerson", "mobile", "emailAddress", "productBrand", "vehicleModel", "quantity", "priceOfVehicle", "deliveryPeriod", "paymentType", "deliveryLocation"], formData);
    if(Object.keys(errors).length > 0){
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      return setErrors(errors);
    }
    pfiRequestMutation.mutate()
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add PFI Request</header>
        <p>Fill in PFI Request Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <select className="form-select shadow-none" id="customerType" onChange={handleChange("customerType")} value={formData.customerType} aria-label="Default select example">
              <option value="existing customer">Existing Customer</option>
              <option value="new customer">New Customer</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              { formData.customerType === "existing customer" ?
                <select className="form-select shadow-none" id="companyName" onChange={handleChange("companyName")} value={formData.companyName} aria-label="Default select example">
                <option value="">Select Company</option>
                {!customerQuery.isLoading && listCustomerOptions()}
              </select> :
              <input type="text" className="form-control shadow-none" value={formData.companyName} onChange={handleChange("companyName")} id="companyName" placeholder="New Company Name" />
              }
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
              {formData.customerType === "existing customer" ?
                <select className="form-select shadow-none" id="contactPerson" onChange={handleChange("contactPerson")} value={formData.contactPerson} aria-label="Default select example">
                  <option value="">Contact Person</option>
                  {contactPersons.length > 0 && listContactPerson()}
                </select> :
                <input type="text" className="form-control shadow-none" value={formData.contactPerson} onChange={handleChange("contactPerson")} id="contactPerson" placeholder="Firstname Lastname" />
              }
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
          <div className="mb-3">
            <label htmlFor="productBrand" className="form-label">Product Brand (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" value={formData.productBrand} onChange={handleChange("productBrand")} id="productBrand" aria-label="Default select example">
                <option value="">Select Product Brand</option>
                {!productGroupQuery.isLoading && listProductGroupOptions()}
              </select>
              <input type="text" className="form-control shadow-none ms-2" value={formData.productBrand} onChange={handleChange("productBrand")} id="productBrand" placeholder="Custom Product Brand" />
            </div>
            <span className='text-danger font-monospace small'>{errors.productBrand}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleModel" className="form-label">Vehicle Model Specific Details (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.vehicleModel} onChange={handleChange("vehicleModel")} id="vehicleModel" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.vehicleModel}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="bodyTypeDescription" className="form-label">Body Type Description / Any Extra Requirement Detail</label>
            <textarea className="form-control shadow-none" value={formData.bodyTypeDescription} onChange={handleChange("bodyTypeDescription")} id="bodyTypeDescription" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.bodyTypeDescription}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleServiceDetails" className="form-label">Any Vehicle Service Given Details</label>
            <textarea className="form-control shadow-none" value={formData.vehicleServiceDetails} onChange={handleChange("vehicleServiceDetails")} id="vehicleServiceDetails" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.vehicleServiceDetails}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleSpecialFitmentDetails" className="form-label">Body / Special Fitment details (please be specific)</label>
            <textarea className="form-control shadow-none" value={formData.vehicleSpecialFitmentDetails} onChange={handleChange("vehicleSpecialFitmentDetails")} id="vehicleSpecialFitmentDetails" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.vehicleSpecialFitmentDetails}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="costOfBodySpecialFitment" className="form-label">Cost for Body/Super Structure/Special Fitment <span className='ms-3 fw-bold'>{formatAsCurrency(formData.costOfBodySpecialFitment)}</span></label>
            <input type="number" className="form-control shadow-none" value={formData.costOfBodySpecialFitment} onChange={handleChange("costOfBodySpecialFitment")} id="costOfBodySpecialFitment" placeholder="Cost Of Body Special Fitment" />
            <span className='text-danger font-monospace small'>{errors.costOfBodySpecialFitment}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity  (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="number" className="form-control shadow-none" value={formData.quantity} onChange={handleChange("quantity")} id="quantity" placeholder="Quantity of Products" />
            <span className='text-danger font-monospace small'>{errors.quantity}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="priceOfVehicle" className="form-label">Price of Vehicle (<span className='fst-italic text-warning'>required</span>)<span className='ms-3 fw-bold'>{formatAsCurrency(formData.priceOfVehicle)}</span></label>
            <input type="number" className="form-control shadow-none" value={formData.priceOfVehicle} onChange={handleChange("priceOfVehicle")} id="priceOfVehicle" placeholder="Price of Vehicle" />
            <span className='text-danger font-monospace small'>{errors.priceOfVehicle}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="discount" className="form-label">Discount, if any</label>
            <input type="text" className="form-control shadow-none" value={formData.discount} onChange={handleChange("discount")} id="discount" placeholder="Discount" />
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" checked={formData.vatDeduction} onChange={handleChange("vatDeduction")} id="vatDeduction" />
              <label className="form-check-label" htmlFor="vatDeduction">
                VAT Deduction
              </label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" checked={formData.whtDeduction} onChange={handleChange("whtDeduction")} id="whtDeduction" />
              <label className="form-check-label" htmlFor="whtDeduction">
                WHT Deduction
              </label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input shadow-none" type="checkbox" checked={formData.registration} onChange={handleChange("registration")} id="registration" />
              <label className="form-check-label" htmlFor="registration">
                Registration
              </label>
          </div>
          <div className="mb-3">
            <label htmlFor="refundRebaseAmount" className="form-label">Refund/Rebate amount, if any  <span className='ms-3 fw-bold'>{formatAsCurrency(formData.refundRebaseAmount)}</span></label>
            <input type="text" className="form-control shadow-none" value={formData.refundRebaseAmount} onChange={handleChange("refundRebaseAmount")} id="refundRebaseAmount" placeholder="Amount to be Refunded" />
          </div>
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
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.deliveryLocation}</span>  
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="deliveryLocation" rows={3}></textarea>
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