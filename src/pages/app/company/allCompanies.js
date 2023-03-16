
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const CompanyListItem = ({id, name, group, code, address }) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/company/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-building text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
          <span>{address}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>{code}</span>
      </div>
    </li>
  )
}


const AllCompanies = () => {

  const companyQuery = useQuery({
    queryKey: ["allCompanies"],
    queryFn: () => apiGet({url: "/company"})
    .then( (res) => res.payload)
    .catch()
  })

  const listAllCompanies = () =>{
    console.log(companyQuery)
    return companyQuery?.data?.map( company => <CompanyListItem 
      key={company.id}
      id={company.id}
      name={company.name}
      group={company.group}
      code={company.code}
      address={company.address}
    />)
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Companies</h3>
          <a href='/app/company/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Companies are listed below</p>
        {companyQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Companies <Spinner />
        </div>}
        <ul className='mt-5'>
          {!companyQuery.isLoading && !companyQuery.isError && listAllCompanies()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllCompanies;