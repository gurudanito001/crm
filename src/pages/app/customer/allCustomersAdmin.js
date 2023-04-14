
import '../../../styles/auth.styles.css';
import { Fragment, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';



const CustomerListItem = ({id, companyName, address1, address2, industry}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/customer/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-buildings text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{companyName}</span> <br />
          <span> {address1 || address2} </span>
        </article>      
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{industry}</span>
      </div>
    </li>
  )
}


const AllCustomersAdmin = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("approved");

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({url: "/customer"})
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

  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({url: "/employee"})
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

  const sortCustomers = (type) =>{
    let data = returnListOfCustomers(type);
    let sortedData = {};
    if(data?.length){
      data.forEach( item => {
        if(sortedData[item.employeeId]){
          sortedData[item.employeeId].push(item) 
        }else{
          sortedData[item.employeeId] = [item]
        }
      })
    }
    return sortedData;
  }

  const returnListOfCustomers = (type, length = false) =>{

    if(customerQuery?.data?.length){
      let list;
      if(type === "approved"){
        list = customerQuery.data.filter( data =>  data.approved === true)
      }else if(type === "pendingApproval"){
        list = customerQuery.data.filter( data =>  data.approved === false)
      }

      if(length){
        return list.length
      }
      return list
    }
  }

  const getEmployeeData = (id) =>{
    let data = {};
    if(employeeQuery.data?.length){
      employeeQuery.data.forEach( item => {
        if(item.id === id){
          data = {id: item.id, fullName: `${item.firstName} ${item.lastName}`, email: item.email}
        }
      })
    }
    return data;
  }

  const listSortedCustomers = (type) =>{
    let sortedCustomers = sortCustomers(type);

    let keys = Object.keys(sortedCustomers);
    return keys.map( key => {
      let data = getEmployeeData(key)
      return (<Fragment key={key}>
        <li className='h6 fw-bold mt-4 fs-6'>
          <a className='small' href={`/app/employee/${data.id}`}>{data.fullName} ({data.email})</a>
        </li>
        
        {sortedCustomers[key].map( customer => {
          return (
            <CustomerListItem
              id={customer.id}
              key={customer.id}
              companyName={customer.companyName}
              address1={customer.address1}
              address2={customer.address2}
              industry={customer.industry}
            />
          )
        })}
      </Fragment>
      )
    })
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Customers</h3>
        </header>
        <p>All customers are listed below</p>

        <ul className="nav nav-tabs mt-4">
          <li className="nav-item me-3">
            <button className={`nav-link py-3 px-4 text-dark ${currentTab === "approved" && " border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("approved")}>Approved</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link py-3 px-4 text-dark d-flex align-items-center ${currentTab === "pendingApproval" && "border border-bottom-0 fw-bold"} `} onClick={()=>setCurrentTab("pendingApproval")}>Pending Approval { returnListOfCustomers("pendingApproval", true) > 0 && <span className="badge text-bg-secondary ms-2">{returnListOfCustomers("pendingApproval", true)}</span>}</button>
          </li>
        </ul>

        {customerQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Customers <Spinner />
        </div>}
        <ul className='mt-5'>
          {!customerQuery.isLoading && !employeeQuery.isLoading && listSortedCustomers(currentTab)}

          {!customerQuery.isLoading && !customerQuery.isError && customerQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Customer was found !!</p>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllCustomersAdmin;