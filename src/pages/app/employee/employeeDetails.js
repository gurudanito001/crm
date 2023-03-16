
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditEmployeeDetails from './editEmployeeDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';

const EmployeeDetailListItem = ({ title, description }) => {
  return (
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}:</header>
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
    let brands = ""
    employeeDetailsQuery.data.brandsAssigned.forEach(brand =>{
      if(brands === ""){
        brands += brand;
      }else{
        brands += `| ${brand}`
      }
    })
    return brands;
  }

  return (
    <Layout>
      {currentScreen === "details" &&
        <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
          <header className="d-flex align-items-center">
            <h3 className='fw-bold me-auto'>Employee Details</h3>
            <button className='btn btn-sm px-3 btn-outline-danger ms-2' data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button>
          </header>
          <p>Details of employee listed below</p>

          {!employeeDetailsQuery.isLoading && !employeeDetailsQuery.isError &&
            <ul className='mt-5'>
              <EmployeeDetailListItem title="First Name" description={employeeDetailsQuery.data.firstName|| "----"} />
              <EmployeeDetailListItem title="Middle Name" description={employeeDetailsQuery.data.middleName|| "----"} />
              <EmployeeDetailListItem title="Last Name" description={employeeDetailsQuery.data.lastName|| "----"} />
              <EmployeeDetailListItem title="Email" description={employeeDetailsQuery.data.email|| "----"} />
              <EmployeeDetailListItem title="Staff Cadre" description={employeeDetailsQuery.data.staffCadre|| "----"} />
              <EmployeeDetailListItem title="Supervisor" description={employeeDetailsQuery.data.supervisor.fullName || "----"} />
              <EmployeeDetailListItem title="Product Head" description={employeeDetailsQuery.data.productHead.fullName || "----"} />
              <EmployeeDetailListItem title="Location Manager" description={employeeDetailsQuery.data.locationManager.fullName || "----"} />
              <EmployeeDetailListItem title="Subordinate" description={employeeDetailsQuery.data.subordinate || "----"} />
              <EmployeeDetailListItem title="Employment Date" description={employeeDetailsQuery.data.employmentDate || "----"} />
              <EmployeeDetailListItem title="Brands Assigned" description={listBrands() || "----"} />
              {/* {listemployeeDetails()} */}
            </ul>}
        </section>}

      <ConfirmDeleteModal entity="Employee" onClick={() => employeeDeletion.mutate()} isLoading={employeeDeletion.isLoading} />

      {currentScreen === "editDetails" &&
        <EditEmployeeDetails handleCancel={() => setCurrentScreen("details")} />
      }
    </Layout>

  )
}


export default EmployeeDetails;