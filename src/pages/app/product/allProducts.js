
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const ProductListItem = ({id, name, code, description, price}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/product/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-car-front text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name} - {code}</span> <br />
          <span>{description}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{formatAsCurrency(price)}</span>
      </div>
    </li>
  )
}


const AllProducts = () => {
  const dispatch = useDispatch();
  const userData = getUserData();

  const productQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => apiGet({url: "/product"})
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

  const listAllProducts = () =>{
    return productQuery.data.map( product => <ProductListItem 
      id={product.id}
      key={product.id}
      name={product.name}
      code={product.code}
      description={product.description}
      price={product.price}
    />)
  }

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Products</h3>
          { userData.staffCadre === "Administrator" &&
            <a href='/app/product/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
          }
        </header>
        <p>All your products are listed below</p>

        {productQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Products <Spinner />
        </div>}

        <ul className='mt-5'>
          {!productQuery.isLoading && !productQuery.isError && listAllProducts()}

          {!productQuery.isLoading && !productQuery.isError && productQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Product was found !!</p>
              {userData.staffCadre === "Administrator" && <span className='text-info'>Click the [+Add] button to add a new Product</span>}
          </div>}
        </ul>
      </section>
    </Layout>

  )
}

export default AllProducts;