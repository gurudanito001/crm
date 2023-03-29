
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditProductGroup from './editProductGroup';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';
import ListItem from '../../../components/listItem';


const ProductGroupDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const ProductGroupDetails = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details");

  const productGroupDetailsQuery = useQuery({
    queryKey: ["allProductGroups", id],
    queryFn: () => apiGet({url: `/productGroup/${id}`}).then( (res) => res.payload),
    onSuccess: () =>{ console.log(productGroupDetailsQuery.data)}
  })

  const productsQuery = useQuery({
    queryKey: ["allProducts", id],
    queryFn: () => apiGet({url: `/product/productGroup/${id}`}).then( (res) => res.payload),
    onSuccess: () =>{ console.log(productsQuery.data)}
  })

  const productGroupDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/productGroup/${id}`}).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allProductGroups"])
      navigate("/app/productGroup");
    }
  })

  const listProducts = () =>{
    return productsQuery.data.map( product => <ListItem 
      key={product.id}
      title={`${product.name} - ${product.code}`}
      description={`${product.description}`}
      sideInfo={`₦${formatAsCurrency(product.price)}`}
      icon="bi-car-front"
      onClick={()=>navigate(`/app/product/${product.id}`, {state: productGroupDetailsQuery.data})}
    />)
  }

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Product Group Details</h3>
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={productGroupDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={productGroupDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={productGroupDetailsQuery.isLoading} style={{ height: "40px" }} 
                onClick={()=>navigate("/app/product/add", {state: {productGroupId: id}})}>Add Product</button></li>
            </ul>
          </div>
        </header>
        <p>Details of product group listed below</p>

        {productGroupDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Product Group Details <Spinner />
        </div>}

          {!productGroupDetailsQuery.isLoading &&
          <ul className='mt-5'>
            <ProductGroupDetailListItem title="Product Group Name" description={productGroupDetailsQuery.data.name || "----"} />
            <ProductGroupDetailListItem title="Product Group Code" description={productGroupDetailsQuery.data.code || "----"} />
            <ProductGroupDetailListItem title="Product Group Description" description={productGroupDetailsQuery.data.description || "----"} />
            {productsQuery?.data?.length > 0 && <>
              <header className='mt-5 fw-bold'>Products</header>
              <ul>
                {!productsQuery.isLoading && listProducts()}
              </ul>
            </>}
          </ul>}
      </section>}

      <ConfirmDeleteModal entity="Product" onClick={() => productGroupDeletion.mutate()} isLoading={productGroupDeletion.isLoading} />

      {currentScreen === "editDetails" && 
        <EditProductGroup data={productGroupDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default ProductGroupDetails;