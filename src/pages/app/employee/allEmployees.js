
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const EmployeeListItem = ({id, firstName, middleName, lastName,  staffCadre, email}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/employee/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-file-person-fill text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{firstName}. {middleName[0]}. {lastName}</span> <br />
          <span>{email}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{staffCadre}</span>
      </div>
    </li>
  )
}


const AllEmployees = () => {

  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({url: "/employee"}).then( (res) => res.payload)
  })

  const listAllEmployees = () =>{
    return employeeQuery.data.map( employee => <EmployeeListItem 
      id={employee.id}
      key={employee.id}
      firstName={employee.firstName}
      middleName={employee.middleName}
      lastName={employee.lastName}
      staffCadre={employee.staffCadre}
      email={employee.email}
    />)
  }

  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Employees</h3>
          <a href='/app/employee/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All your employees are listed below</p>
        {employeeQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Employees <Spinner />
        </div>}
        <ul className='mt-5'>
          {!employeeQuery.isLoading && !employeeQuery.isError && listAllEmployees()}
          {!employeeQuery.isLoading && !employeeQuery.isError && employeeQuery?.data?.length === 0 && <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Employee was found !!</p>
              <span className='text-info'>Click the [+Add] button to add a new employee</span>
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllEmployees;