
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditBranchDetails from './editBranchDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';


const BranchDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const BranchDetails = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details");

  const branchDetailsQuery = useQuery({
    queryKey: ["allBranches", id],
    queryFn: () => apiGet({url: `/branch/${id}`}).then( (res) => {
      console.log(res.payload)
      return res.payload
    }),
    onSuccess: () =>{ console.log(branchDetailsQuery.data)}
  })

  const branchDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/branch/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allBranches"])
      navigate(`/app/company/${state.id}`);
    }
  })

  const listCompanyBrands = () =>{
    let brands = ""
    state.brands.forEach( data => {
      if(brands === ""){
        brands += `${data.name}`
      }else{
        brands += ` | ${data.name}`
      }
    })
    return brands;
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Branch Details</h3>

          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={branchDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={branchDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>
          {/* <button className='btn btn-outline-danger ms-2' data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button> */}
        </header>
        <p>Details of branch listed below</p>

        {branchDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Branch Details <Spinner />
        </div>}

          {!branchDetailsQuery.isLoading &&
          <ul className='mt-5'>
            {(state?.group || state?.email) &&
              <>
                <BranchDetailListItem title="Company Group" description={state.group || "----"} />
                <BranchDetailListItem title="Company Name" description={state.name || "----"} />
                <BranchDetailListItem title="Company Email" description={state.email || "----"} />
                <BranchDetailListItem title="Company Brands" description={listCompanyBrands() || "----"} />
            </>}


            <BranchDetailListItem title="Branch Name" description={branchDetailsQuery.data.name || "----"} />
            <BranchDetailListItem title="Branch Code" description={branchDetailsQuery.data.code || "----"} />
            <BranchDetailListItem title="Branch Address" description={`${branchDetailsQuery.data.address}` || "----"} />
            <BranchDetailListItem title="LGA" description={`${branchDetailsQuery.data.lga}` || "----"} />
            <BranchDetailListItem title="State" description={`${branchDetailsQuery.data.state}` || "----"} />
            <BranchDetailListItem title="Head Office?" description={`${branchDetailsQuery.data.isHeadOffice ? "Yes" : "No" }` || "----"} />
            {/* <div className='d-flex flex-column mt-3'>
              <h6 className='small fw-bold'>Branch Images</h6>
              <figure>
                {branchDetailsQuery.data.images.map(image => <img key={image} src={image} className="m-2" alt="Branch" width="200px" />)}
              </figure>
              
            </div> */}

          </ul>}
      </section>}


      <ConfirmDeleteModal entity="Branch" onClick={() => branchDeletion.mutate()} isLoading={branchDeletion.isLoading} />

      {currentScreen === "editDetails" && 
        <EditBranchDetails data={branchDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default BranchDetails;