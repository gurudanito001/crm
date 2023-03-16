
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const LgaListItem = ({id, name, state, code}) =>{
  const navigate = useNavigate();
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/lga/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-pin-map-fill text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
          <span>{state}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>{code}</span>
      </div>
    </li>
  )
}


const AllLgas = () => {

  const lgaQuery = useQuery({
    queryKey: ["allLgas"],
    queryFn: () => apiGet({url: "/lga"}).then( (res) => res.payload)
  })

  const listAllLgas = () =>{
    return lgaQuery.data.map( lga => <LgaListItem 
      id={lga.id}
      key={lga.id}
      name={lga.name}
      state={lga.state}
      code={lga.code}
    />)
  }
  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Local Govt Areas</h3>
          <a href='/app/lga/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Lgas are listed below</p>
        {lgaQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Lgas <Spinner />
        </div>}
        <ul className='mt-5'>
          {!lgaQuery.isLoading && !lgaQuery.isError && listAllLgas()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllLgas;