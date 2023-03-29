
import { useState, useEffect } from "react";
import { apiPost, apiPut, apiGet } from '../../../services/apiService';
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';

const EditPfiRequestDetails = ({ data, handleCancel }) => {
  const {id} = useParams();
  const queryClient = useQueryClient();
  const pfiRequestMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/pfiRequestForm/${id}`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allPfiRequests"])
      handleCancel()
    }
  })

  const [formData, setFormData] = useState({
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

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      ...data,
      whtDeduction: convertStringToBoolean(data.whtDeduction),
      vatDeduction: convertStringToBoolean(data.vatDeduction),
      registration: convertStringToBoolean(data.registration)
    }))
  }, [])

  const convertStringToBoolean = (value) =>{
    if(value === "true"){
      return true
    }else if( value === "false"){
      return false
    }else{
      return value
    }
  }

  const [contactPersons, setContactPersons] = useState([])
  const [products, setProducts] = useState([])

 
  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: "/customer"}).then( (res) => res.payload),
    onSuccess: () => console.log(customerQuery.data)
  })

  const listCustomerOptions = () =>{
    if(customerQuery?.data?.length){
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.companyName}>{customer.companyName}</option>
      )
    }
  }

  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"}).then( (res) => res.payload),
    onSuccess: () => console.log(productGroupQuery.data)
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
      companyAddress: getCompanyData(companyName).address1 || data.companyAddress
    }))
  }, [formData.companyName])

  useEffect(()=>{
    let contactPerson = formData.contactPerson;
    let contactPersonData = getContactPersonData(contactPerson);
    console.log(contactPersonData)
    setFormData( prevState => ({
      ...prevState,
      mobile: contactPersonData.phoneNumber1 || data.mobile,
      emailAddress: contactPersonData.email || data.emailAddress,
      designation: contactPersonData.designation || data.designation,
    }))
  }, [formData.contactPerson])

  

  useEffect(()=>{
    let productGroup = formData.productBrand;
    let productGroupData = getProductGroupData(productGroup);
    if(productGroup && productGroupQuery.data?.length){
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
        console.log(error)
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
      console.log(error)
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
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    // return console.log(formData);
    pfiRequestMutation.mutate()
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit PFI Request Details</header>
      <p>Make changes to PFI Request Information.</p>

      <form className="mt-5">
      <div className="mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="companyName" onChange={handleChange("companyName")} value={formData.companyName} aria-label="Default select example">
                <option value="">Select Company</option>
                {!customerQuery.isLoading && listCustomerOptions()}
              </select>
              <input type="text" className="form-control shadow-none ms-2" value={formData.companyName} onChange={handleChange("companyName")} id="companyName" placeholder="Custom Company Name" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="companyAddress" className="form-label">Company Address</label>
            <textarea className="form-control shadow-none" value={formData.companyAddress} onChange={handleChange("companyAddress")} id="companyAddress" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">Contact Person</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" id="contactPerson" onChange={handleChange("contactPerson")} value={formData.contactPerson} aria-label="Default select example">
                <option value="">Contact Person</option>
                {contactPersons.length > 0 && listContactPerson()}
              </select>
              <input type="text" className="form-control shadow-none ms-2" value={formData.contactPerson} onChange={handleChange("contactPerson")} id="contactPerson" placeholder="Custom Contact Person" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input type="text" className="form-control shadow-none" value={formData.mobile} onChange={handleChange("mobile")} id="phoneNumber" placeholder="Phone Number" />
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Designation</label>
            <input type="text" className="form-control shadow-none" value={formData.designation} onChange={handleChange("designation")} id="designation" placeholder="Designation" />
          </div>
          <div className="mb-3">
            <label htmlFor="emailAddress" className="form-label">Email Address</label>
            <input type="text" className="form-control shadow-none" value={formData.emailAddress} onChange={handleChange("emailAddress")} id="emailAddress" placeholder="Email Address" />
          </div>
          <div className="mb-3">
            <label htmlFor="productBrand" className="form-label">Product Brand</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" value={formData.productBrand} onChange={handleChange("productBrand")} id="productBrand" aria-label="Default select example">
                <option value="">Select Product Brand</option>
                {!productGroupQuery.isLoading && listProductGroupOptions()}
              </select>
              <input type="text" className="form-control shadow-none ms-2" value={formData.productBrand} onChange={handleChange("productBrand")} id="productBrand" placeholder="Custom Product Brand" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" value={formData.vehicleModel} onChange={handleChange("vehicleModel")} id="vehicleModel" aria-label="Default select example">
                <option value="">Select Vehicle Model</option>
                { listProducts()}
              </select>
              <input type="text" className="form-control shadow-none ms-2" value={formData.vehicleModel} onChange={handleChange("vehicleModel")} id="vehicleModel" placeholder="Custom Vehicle Model" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="bodyTypeDescription" className="form-label">Body Type Description</label>
            <textarea className="form-control shadow-none" value={formData.bodyTypeDescription} onChange={handleChange("bodyTypeDescription")} id="bodyTypeDescription" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleServiceDetails" className="form-label">Vehicle Service Details</label>
            <textarea className="form-control shadow-none" value={formData.vehicleServiceDetails} onChange={handleChange("vehicleServiceDetails")} id="vehicleServiceDetails" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="bodySpecialFitmentDetails" className="form-label">Vehicle Special Fitment Details</label>
            <textarea className="form-control shadow-none" value={formData.vehicleSpecialFitmentDetails} onChange={handleChange("vehicleSpecialFitmentDetails")} id="bodySpecialFitmentDetails" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="costOfBodySpecialFitment" className="form-label">Cost Of Body Special Fitment</label>
            <input type="number" className="form-control shadow-none" value={formData.costOfBodySpecialFitment} onChange={handleChange("costOfBodySpecialFitment")} id="costOfBodySpecialFitment" placeholder="Cost Of Body Special Fitment" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control shadow-none" value={formData.quantity} onChange={handleChange("quantity")} id="quantity" placeholder="Quantity of Products" />
          </div>
          <div className="mb-3">
            <label htmlFor="priceOfVehicle" className="form-label">Price of Vehicle</label>
            <input type="number" className="form-control shadow-none" value={formData.priceOfVehicle} onChange={handleChange("priceOfVehicle")} id="priceOfVehicle" placeholder="Price of Vehicle" />
          </div>
          <div className="mb-3">
            <label htmlFor="discount" className="form-label">Discount</label>
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
            <label htmlFor="refundRebaseAmount" className="form-label">Refund / Rebase Amount</label>
            <input type="text" className="form-control shadow-none" value={formData.refundRebaseAmount} onChange={handleChange("refundRebaseAmount")} id="refundRebaseAmount" placeholder="Amount to be Refunded" />
          </div>
          <div className="mb-3">
            <label htmlFor="refundRebaseRecipient" className="form-label">Refund / Rebase Recipient</label>
            <input type="text" className="form-control shadow-none" value={formData.refundRebaseRecipient} onChange={handleChange("refundRebaseRecipient")} id="refundRebaseRecipient" placeholder="Person to be Refunded" />
          </div>
          <div className="mb-3">
            <label htmlFor="relationshipWithTransaction" className="form-label">Relationship with Transaction</label>
            <input type="text" className="form-control shadow-none" value={formData.relationshipWithTransaction} onChange={handleChange("relationshipWithTransaction")} id="relationshipWithTransaction" placeholder="Relationship with Transaction" />
          </div>
          <div className="mb-3">
            <label htmlFor="estimatedOrderClosingTime" className="form-label">Estimated Order Closing Time</label>
            <input type="text" className="form-control shadow-none" value={formData.estimatedOrderClosingTime} onChange={handleChange("estimatedOrderClosingTime")} id="estimatedOrderClosingTime" placeholder="Estimated Order Closing Time" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryPeriod" className="form-label">Delivery Period</label>
            <input type="text" className="form-control shadow-none" value={formData.deliveryPeriod} onChange={handleChange("deliveryPeriod")} id="deliveryPeriod" placeholder="Delivery Period" />
          </div>
          <div className="mb-3">
            <label htmlFor="paymentType" className="form-label">Payment Type</label>
            <input type="text" className="form-control shadow-none" value={formData.paymentType} onChange={handleChange("paymentType")} id="paymentType" placeholder="Direct / Bank Finance" />
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Delivery Location</label>
            <textarea className="form-control shadow-none" value={formData.deliveryLocation} onChange={handleChange("deliveryLocation")} id="deliveryLocation" rows={3}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="deliveryLocation" className="form-label">Additional Information</label>
            <textarea className="form-control shadow-none" value={formData.additionalInformation} onChange={handleChange("additionalInformation")} id="deliveryLocation" rows={3}></textarea>
          </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={pfiRequestMutation.isLoading} onClick={handleSubmit}>{pfiRequestMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3  px-5" onClick={handleCancel}>Cancel</button>
        </div>

      </form>
    </section>

    

  )
}

export default EditPfiRequestDetails;