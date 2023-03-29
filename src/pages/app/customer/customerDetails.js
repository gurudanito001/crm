
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditCustomerDetails from './editCustomerDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import ListItem from '../../../components/listItem';
import { Spinner } from '../../../components/spinner';

const CustomerDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}:</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const CustomerDetails = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details")

  const customerDetailsQuery = useQuery({
    queryKey: ["allCustomers", id],
    queryFn: () => apiGet({url: `/customer/${id}`}).then( (res) => res.payload),
    onSuccess: () => console.log(customerDetailsQuery.data)
  })

  const customerDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/customer/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCustomers"])
      navigate("/app/customer");
    }
  })

  const contactPersonQuery = useQuery({
    queryKey: ["allContactPersons", id],
    queryFn: () => apiGet({url: `/contactPerson/customer/${id}`}).then( (res) => res.payload),
    onSuccess: () => console.log(contactPersonQuery.data)
  })

  const listContactPersons = () =>{
    return contactPersonQuery.data.map( contactPerson => <ListItem 
      key={contactPerson.id}
      title={`${contactPerson.title} ${contactPerson.firstName} ${contactPerson.lastName}`}
      description={`${contactPerson.phoneNumber1}`}
      sideInfo={contactPerson.department}
      icon="bi-person-badge"
      onClick={()=>navigate(`/app/customer/contactPerson/${contactPerson.id}`, {state: { companyName: customerDetailsQuery.data.companyName}})}
    />)
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Customer Details</h3>

          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={customerDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={customerDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={customerDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => navigate("/app/customer/contactPerson/add", { state: { customerId: id } })} >Add Contact Person</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>
        </header>
        <p>Details of customer listed below</p>

        {customerDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Customer Details <Spinner />
        </div>}


        {!customerDetailsQuery.isLoading && !customerDetailsQuery.isError &&
        <ul className='mt-5'>
          <CustomerDetailListItem title="Company Name" description={customerDetailsQuery.data.companyName || "----"} />
          <CustomerDetailListItem title="Address 1" description={customerDetailsQuery.data.address1 || "----"} />
          <CustomerDetailListItem title="Address 2" description={customerDetailsQuery.data.address2 || "----"} />
          <CustomerDetailListItem title="Location" description={`${customerDetailsQuery.data.lga} ${customerDetailsQuery.data.city} ${customerDetailsQuery.data.state}` || "----"} />
          <CustomerDetailListItem title="Company Website" description={customerDetailsQuery.data.companyWebsite || "----"} />
          <CustomerDetailListItem title="Chairman" description={customerDetailsQuery.data.chairman || "----"} />
          <CustomerDetailListItem title="MD / CEO" description={customerDetailsQuery.data.mdCeoName || "----"} />
          <CustomerDetailListItem title="Industry" description={customerDetailsQuery.data.industry || "----"} />
          <CustomerDetailListItem title="Business Type" description={customerDetailsQuery.data.businessType || "----"} />
          <CustomerDetailListItem title="Customer Type" description={customerDetailsQuery.data.customerType || "----"} />
          <CustomerDetailListItem title="Enquiry Source" description={customerDetailsQuery.data.enquirySource || "----"} />
        </ul>}

        {contactPersonQuery?.data?.length > 0  && <>
          <header className='mt-5 fw-bold'>Contact Persons</header>
          <ul>
            {!contactPersonQuery.isLoading && listContactPersons()}
          </ul>
        </>}
      </section>}

      <ConfirmDeleteModal entity="Customer" onClick={() => customerDeletion.mutate()} isLoading={customerDeletion.isLoading} />


      {currentScreen === "editDetails" && 
        <EditCustomerDetails data={customerDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default CustomerDetails;