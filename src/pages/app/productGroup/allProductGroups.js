
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const ProductGroupListItem = ({id, name, code, description}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/prodGroup/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-diagram-3-fill text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
          <span>{description}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{code}</span>
      </div>
    </li>
  )
}


const AllProductGroups = () => {
  const dispatch = useDispatch();
  let userData = getUserData();


  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"})
    .then( (res) => res.payload)
    .catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const listAllProductGroups = () =>{
    return productGroupQuery.data.map( productGroup => <ProductGroupListItem 
      id={productGroup.id}
      key={productGroup.id}
      name={productGroup.name}
      code={productGroup.code}
      description={productGroup.description}
    />)
  }
  
  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Product Groups</h3>
          { userData.staffCadre === "Administrator" &&
            <a href='/app/prodGroup/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
          }
        </header>
        <p>All your Product Groups are listed below</p>
        {productGroupQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Product Groups <Spinner />
        </div>}
        <ul className='mt-5'>
          {!productGroupQuery.isLoading && !productGroupQuery.isError && listAllProductGroups()}

          {!productGroupQuery.isLoading && !productGroupQuery.isError && productGroupQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Product Group was found !!</p>
              { userData.staffCadre === "Administrator" && <span className='text-info'>Click the [+Add] button to add a new Product Group</span>}
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllProductGroups;