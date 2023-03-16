
import '../../../styles/auth.styles.css';
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';


const BranchListItem = ({id, name, code, address}) =>{
  const navigate = useNavigate();
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/branch/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-house-fill text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
          <span className=''>{address}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>{code}</span>
      </div>
    </li>
  )
}


const AllBranches = () => {

  const branchQuery = useQuery({
    queryKey: ["allBranches"],
    queryFn: () => apiGet({url: "/branch"}).then( (res) => res.payload)
  })

  const listAllBranches = () =>{
    return branchQuery.data.map( branch => <BranchListItem 
      id={branch.id}
      key={branch.id}
      name={branch.name}
      code={branch.code}
      address={branch.address}
    />)
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Branches</h3>
          <a href='/app/Branch/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Branches are listed below</p>
        {branchQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Branches <Spinner />
        </div>}
        <ul className='mt-5'>
          {!branchQuery.isLoading && !branchQuery.isError && listAllBranches()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllBranches;