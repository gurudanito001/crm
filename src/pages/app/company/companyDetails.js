
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditCompanyDetails from './editCompanyDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';


const CompanyDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}:</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const CompanyDetails = (props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const companyDetailsQuery = useQuery({
    queryKey: ["allCompanies", id],
    queryFn: () => apiGet({url: `/company/${id}`}).then( (res) => res.payload)
  })

  const companyDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/company/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCompanies"])
      navigate("/app/company");
    }
  })
  const [currentScreen, setCurrentScreen] = useState("details")

  const listCompanyDetails = () =>{
    let keys = Object.keys(companyDetailsQuery.data);
    keys.splice(keys.indexOf("id"), 1)
    keys.splice(keys.indexOf("logo"), 1)
    keys.splice(keys.indexOf("extraData"), 1)
    return keys.map( key => <CompanyDetailListItem 
      key={key}
      title={key}
      description={companyDetailsQuery.data[key]}
    />)
  }

  if(companyDetailsQuery.isLoading){
    return "Fetching Company Details"
  }
  if(companyDetailsQuery.isError){
    return console.log(companyDetailsQuery.error)
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Company Details</h3>
          <button className='btn btn-outline-secondary' disabled={companyDeletion.isLoading} onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2' disabled={companyDeletion.isLoading} onClick={()=>companyDeletion.mutate()}>delete</button>
        </header>
        <p>Details of company listed below</p>

        <ul className='mt-5'>
          <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
            <header className="small text-uppercase col-lg-4">Logo:</header>
            <p className='fw-bold ms-lg-auto col-lg'><img src={companyDetailsQuery.data.logo} alt="Company Logo" /></p>
          </li>
          <CompanyDetailListItem title="Company Name" description={companyDetailsQuery.data.name} />
          <CompanyDetailListItem title="Company Group" description={companyDetailsQuery.data.group} />
          <CompanyDetailListItem title="Company Code" description={companyDetailsQuery.data.code} />
          <CompanyDetailListItem title="Company Address" description={companyDetailsQuery.data.address} />
          <CompanyDetailListItem title="Company Email" description={companyDetailsQuery.data.email} />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditCompanyDetails data={companyDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default CompanyDetails;