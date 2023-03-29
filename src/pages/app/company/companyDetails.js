
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditCompanyDetails from './editCompanyDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate,  } from 'react-router-dom';
import { Spinner } from '../../../components/spinner';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import ListItem from '../../../components/listItem';


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
    queryFn: () => apiGet({url: `/company/${id}`}).then( (res) =>{ 
      console.log(res.payload)
      return res.payload
    })
  })

  const branchQuery = useQuery({
    queryKey: ["allBranches", id],
    queryFn: () => apiGet({url: `/branch/company/${id}`}).then( (res) =>{ 
      console.log(res.payload)
      return res.payload
    })
  })

  const companyDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/company/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCompanies"])
      navigate("/app/company");
    }
  })
  const [currentScreen, setCurrentScreen] = useState("details")

  const listCompanyBrands = () =>{
    let brands = ""
    companyDetailsQuery.data.brands.forEach( data => {
      if(brands === ""){
        brands += `${data.name}`
      }else{
        brands += ` | ${data.name}`
      }
    })
    return brands;
  }

  const listBranches = () =>{
    return branchQuery.data.map( branch => <ListItem 
      key={branch.id}
      title={branch.name}
      description={`${branch.address} ${branch.lga} ${branch.state}`}
      sideInfo={branch.code}
      icon="bi-house-fill"
      onClick={()=>navigate(`/app/branch/${branch.id}`, {state: companyDetailsQuery.data})}
    />)
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Company Details</h3>


            <div className="btn-group">
              <button className="btn btn-sm border-secondary rounded" disabled={companyDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-three-dots-vertical fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-0">
                <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={companyDetailsQuery.isLoading} style={{height: "40px"}} onClick={()=>setCurrentScreen("editDetails")}>Edit</button></li>
                <li><button className='btn btn-sm btn-light text-dark fw-bold w-100'  disabled={companyDetailsQuery.isLoading} style={{height: "40px"}} onClick={()=>navigate("/app/branch/add", {state: {companyId: id}})} >Add Branch</button></li>
                {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
              </ul>
            </div>
          
          
        </header>
        <p>Details of company listed below</p>

        {companyDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Company Details <Spinner />
        </div>}

        {!companyDetailsQuery.isLoading && !companyDetailsQuery.isError &&
        <ul className='mt-5'>
          <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
            <header className="small text-uppercase col-lg-4">Logo:</header>
            <p className='fw-bold ms-lg-auto col-lg'><img src={companyDetailsQuery.data.logo} alt="Company Logo" /></p>
          </li>
          <CompanyDetailListItem title="Company Name" description={companyDetailsQuery.data.name} />
          <CompanyDetailListItem title="Company Group" description={companyDetailsQuery.data.group} />
          <CompanyDetailListItem title="Company Code" description={companyDetailsQuery.data.code} />
          <CompanyDetailListItem title="Company Email" description={companyDetailsQuery.data.email} />
          <CompanyDetailListItem title="Company Brands" description={listCompanyBrands()} />
        </ul>}

        {branchQuery?.data?.length > 0  && <>
          <header className='mt-5 fw-bold'>Branches</header>
          <ul>
            {!branchQuery.isLoading && listBranches()}
          </ul>
        </>}
      </section>}

      <ConfirmDeleteModal entity="Company" onClick={() => companyDeletion.mutate()} isLoading={companyDeletion.isLoading} />


      {currentScreen === "editDetails" && 
        <EditCompanyDetails data={companyDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default CompanyDetails;