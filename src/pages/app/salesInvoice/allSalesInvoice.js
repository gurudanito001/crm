
import '../../../styles/auth.styles.css';
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';


const SalesInvoiceListItem = ({id, customerName, date }) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/salesInvoice/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-rocket-takeoff text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{customerName}</span> <br />
          <span>{}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{new Date(date).toDateString()}</span>
      </div>
    </li>
  )
}


const AllSalesInvoices = () => {
  const dispatch = useDispatch(); 
  const {staffCadre} = getUserData();
  const salesInvoiceQuery = useQuery({
    queryKey: ["allSalesInvoices"],
    queryFn: () => apiGet({url: "/salesInvoice"}).then( (res) =>{
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

  

  const listSalesInvoices = (type) =>{
    if(salesInvoiceQuery.data?.length){
      return salesInvoiceQuery.data.map( invoice => <SalesInvoiceListItem 
        id={invoice.id}
        key={invoice.id}
        name={invoice.name}
        date={invoice.createdAt}
      />)
    }
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Sales Invoices</h3>
          {staffCadre === "Administrator" && <a href='/app/salesInvoice/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>}
        </header>
        <p>All Sales Invoices are listed below</p>

        {salesInvoiceQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Sales Invoices <Spinner />
        </div>}

        <ul className='mt-5'>
          {!salesInvoiceQuery.isLoading && !salesInvoiceQuery.isError  && listSalesInvoices()}

          {!salesInvoiceQuery.isLoading && !salesInvoiceQuery.isError && salesInvoiceQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
            <p className='h6 fw-bold'>No Sales Invoice was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>
  )
}

export default AllSalesInvoices;