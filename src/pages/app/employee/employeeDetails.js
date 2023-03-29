
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditEmployeeDetails from './editEmployeeDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import { Spinner } from '../../../components/spinner';

const EmployeeDetailListItem = ({ title, description }) => {
  return (
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const EmployeeDetails = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details")

  const employeeDetailsQuery = useQuery({
    queryKey: ["allEmployees", id],
    queryFn: () => apiGet({ url: `/employee/${id}` }).then((res) => res.payload),
    onSuccess: () => { console.log(employeeDetailsQuery.data) }
  })

  const employeeDeletion = useMutation({
    mutationFn: () => apiDelete({ url: `/employee/${id}` }).then(res => console.log(res)),
    onSuccess: () => {
      queryClient.invalidateQueries(["allEmployees"])
      navigate("/app/employee");
    }
  })

  const listBrands = () =>{
    let brandsAssigned = ""
    employeeDetailsQuery.data.brandsAssigned.forEach( data => {
      if(brandsAssigned === ""){
        brandsAssigned += `${data.name}`
      }else{
        brandsAssigned += ` | ${data.name}`
      }
    })
    return brandsAssigned;
  }

  return (
    <Layout>
      {currentScreen === "details" &&
        <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
          <header className="d-flex align-items-center">
            <h3 className='fw-bold me-auto'>Employee Details</h3>

            <div className="btn-group">
              <button className="btn btn-sm border-secondary rounded" disabled={employeeDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-three-dots-vertical fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-0">
                <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={employeeDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              </ul>
            </div>
          </header>
          <p>Details of employee listed below</p>

          {employeeDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Employee Details <Spinner />
        </div>}

          {!employeeDetailsQuery.isLoading && !employeeDetailsQuery.isError &&
            <ul className='mt-5'>
              <EmployeeDetailListItem title="First Name" description={employeeDetailsQuery.data.firstName|| "----"} />
              <EmployeeDetailListItem title="Middle Name" description={employeeDetailsQuery.data.middleName|| "----"} />
              <EmployeeDetailListItem title="Last Name" description={employeeDetailsQuery.data.lastName|| "----"} />
              <EmployeeDetailListItem title="Email" description={employeeDetailsQuery.data.email|| "----"} />
              <EmployeeDetailListItem title="Company Name" description={employeeDetailsQuery.data.companyName|| "----"} />
              <EmployeeDetailListItem title="Staff Cadre" description={employeeDetailsQuery.data.staffCadre|| "----"} />
              <EmployeeDetailListItem title="Supervisor" description={employeeDetailsQuery.data.supervisor.fullName || "----"} />
              <EmployeeDetailListItem title="Product Head" description={employeeDetailsQuery.data.productHead.fullName || "----"} />
              <EmployeeDetailListItem title="Location Manager" description={employeeDetailsQuery.data.locationManager.fullName || "----"} />
              <EmployeeDetailListItem title="Employment Date" description={employeeDetailsQuery.data.employmentDate || "----"} />
              <EmployeeDetailListItem title="Brands Assigned" description={listBrands() || "----"} />
            </ul>}
        </section>}

      <ConfirmDeleteModal entity="Employee" onClick={() => employeeDeletion.mutate()} isLoading={employeeDeletion.isLoading} />

      {currentScreen === "editDetails" &&
        <EditEmployeeDetails handleCancel={() => setCurrentScreen("details")} data={employeeDetailsQuery.data} />
      }
    </Layout>

  )
}


export default EmployeeDetails;