
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const StateListItem = ({id, name, code}) =>{
  const navigate = useNavigate();
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/employee/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-globe-europe-africa text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>{code}</span>
      </div>
    </li>
  )
}


const AllStates = () => {

  const stateQuery = useQuery({
    queryKey: ["allStates"],
    queryFn: () => apiGet({url: "/state"}).then( (res) => res.payload)
  })

  const listAllStates = () =>{
    return stateQuery.data.map( state => <StateListItem 
      id={state.id}
      key={state.id}
      name={state.name}
      code={state.code}
    />)
  }

  /* if(employeeQuery.isLoading){
    return "Fetching Employees"
  }
  if(employeeQuery.isError){
    return console.log(employeeQuery.error)
  } */
  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All States</h3>
          <a href='/app/state/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All states are listed below</p>
        {stateQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching States <Spinner />
        </div>}
        <ul className='mt-5'>
          {!stateQuery.isLoading && !stateQuery.isError && listAllStates()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllStates;