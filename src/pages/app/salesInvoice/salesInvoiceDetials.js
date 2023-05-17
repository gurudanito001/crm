
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditSalesInvoice from './editSalesInvoice';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';

const SalesInvoiceDetailsListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const SalesInvoiceDetails = () => {
  const navigate = useNavigate();
  let {staffCadre} = getUserData();
  const dispatch = useDispatch();
  const [currentScreen, setCurrentScreen] = useState("details");
  const queryClient = useQueryClient();
  const { id } = useParams();

  const salesInvoiceDetailsQuery = useQuery({
    queryKey: ["allSalesInvoices", id],
    queryFn: () => apiGet({ url: `/salesInvoice/${id}` })
    .then((res) => res.payload)
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

  const customerQuery = useQuery({
    queryKey: ["allCustomers", id],
    queryFn: () => apiGet({ url: `/customer` })
    .then((res) => res.payload)
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

  const employeeQuery = useQuery({
    queryKey: ["allEmployees", id],
    queryFn: () => apiGet({ url: `/employee` })
    .then((res) => res.payload)
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

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Sales Invoice Details</h3>
          
          {staffCadre === "Administrator" && <>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={salesInvoiceDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={salesInvoiceDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
            </ul>
          </div>
          </>}
        </header>
        <p>Details of Sales Invoice listed below</p>

        {salesInvoiceDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Sales Invoice Details <Spinner />
        </div>}

        {!salesInvoiceDetailsQuery.isLoading && !salesInvoiceDetailsQuery.isError &&
          <ul className='mt-5'>
            <SalesInvoiceDetailsListItem title="PDF Url" description={salesInvoiceDetailsQuery.data.invoiceNumber || "----"} />
            <SalesInvoiceDetailsListItem title="Description" description={salesInvoiceDetailsQuery.data.description || "----"} />
            <SalesInvoiceDetailsListItem title="Date Created" description={new Date(salesInvoiceDetailsQuery.data.createdAt).toLocaleString()  || "----"} />
            <SalesInvoiceDetailsListItem title="Last Updated" description={new Date(salesInvoiceDetailsQuery.data.updatedAt).toLocaleString()  || "----"} />
          </ul>}
      </section>}

      {currentScreen === "editDetails" && 
        <EditSalesInvoice data={salesInvoiceDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default SalesInvoiceDetails;