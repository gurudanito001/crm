
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditCustomerDetails from './editCustomerDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';

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
    onSuccess: () =>{ console.log(customerDetailsQuery.data)}
  })

  const customerDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/customer/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCustomers"])
      navigate("/app/customer");
    }
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Customer Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2' data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button>
        </header>
        <p>Details of customer listed below</p>
        {!customerDetailsQuery.isLoading && !customerDetailsQuery.isError &&
        <ul className='mt-5'>
          <CustomerDetailListItem title="Company Name" description={customerDetailsQuery.data.companyName || "null"} />
          <CustomerDetailListItem title="Address 1" description={customerDetailsQuery.data.address1 || "null"} />
          <CustomerDetailListItem title="Address 2" description={customerDetailsQuery.data.address2 || "null"} />
          <CustomerDetailListItem title="Location" description={`${customerDetailsQuery.data.lga} ${customerDetailsQuery.data.city} ${customerDetailsQuery.data.state}` || "null"} />
          <CustomerDetailListItem title="Company Website" description={customerDetailsQuery.data.companyWebsite || "null"} />
          <CustomerDetailListItem title="Chairman" description={customerDetailsQuery.data.chairman || "null"} />
          <CustomerDetailListItem title="MD / CEO" description={customerDetailsQuery.data.mdCeoName || "null"} />
          <CustomerDetailListItem title="Industry" description={customerDetailsQuery.data.industry || "null"} />
          <CustomerDetailListItem title="Business Type" description={customerDetailsQuery.data.businessType || "null"} />
          <CustomerDetailListItem title="Customer Type" description={customerDetailsQuery.data.customerType || "null"} />
          <CustomerDetailListItem title="Enquiry Source" description={customerDetailsQuery.data.enquirySource || "null"} />
        </ul>}
      </section>}

      <ConfirmDeleteModal entity="Customer" onClick={() => customerDeletion.mutate()} isLoading={customerDeletion.isLoading} />


      {currentScreen === "editDetails" && 
        <EditCustomerDetails data={customerDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default CustomerDetails;