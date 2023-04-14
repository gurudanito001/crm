
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditProductDetails from './editProductDetails';
import { apiGet, apiDelete } from '../../../services/apiService';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmDeleteModal from '../../../components/confirmDeleteModal';
import formatAsCurrency from '../../../services/formatAsCurrency';
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';



const ProductDetailListItem = ({title, description}) =>{
  return(
    <li className='py-2 d-flex flex-column flex-lg-row align-items-lg-center border-bottom'>
      <header className="small text-uppercase col-lg-4">{title}</header>
      <p className='fw-bold ms-lg-auto col-lg'>{description}</p>
    </li>
  )
}


const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getUserData();

  const {state} = useLocation();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currentScreen, setCurrentScreen] = useState("details");



  const productDetailsQuery = useQuery({
    queryKey: ["allProducts", id],
    queryFn: () => apiGet({url: `/product/${id}`})
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

  const productDeletion = useMutation({
    mutationFn: ()=> apiDelete({ url: `/product/${id}`}).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allProducts"])
      navigate("/app/product");
    }).catch(error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Product Details</h3>

          { userData.staffCadre === "Administrator" &&
          <div className="btn-group">
            <button className="btn btn-sm border-secondary rounded" disabled={productDetailsQuery.isLoading} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-0">
              <li><button className='btn btn-sm btn-light text-dark fw-bold w-100' disabled={productDetailsQuery.isLoading} style={{ height: "40px" }} onClick={() => setCurrentScreen("editDetails")}>Edit</button></li>
              {/* <li><button className='btn btn-sm btn-light text-danger fw-bold w-100'  data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">delete</button></li> */}
            </ul>
          </div>}
        </header>
        <p>Details of product listed below</p>

        {productDetailsQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Product Details <Spinner />
        </div>}

          {!productDetailsQuery.isLoading &&
          <ul className='mt-5'>
            {state?.name && <><ProductDetailListItem title="Product Group Name" description={state.name || "----"} />
            <ProductDetailListItem title="Product Group Code" description={state.code || "----"} />
            <ProductDetailListItem title="Product Group Description" description={state.description || "----"} /> 
            </>}


            <ProductDetailListItem title="Product Name" description={productDetailsQuery.data.name || "----"} />
            <ProductDetailListItem title="Product Code" description={productDetailsQuery.data.code || "----"} />
            <ProductDetailListItem title="Product Description" description={productDetailsQuery.data.description || "----"} />
            <ProductDetailListItem title="Unit of Measurement" description={productDetailsQuery.data.unitOfMeasurement || "----"} />
            <ProductDetailListItem title="Product Specifications" description={productDetailsQuery.data.specifications || "----"} />
            <ProductDetailListItem title="Product Price" description={`${formatAsCurrency(productDetailsQuery.data.price)}`|| "----"} />
            <div className='d-flex flex-column mt-3'>
              <h6 className='small fw-bold'>Product Images</h6>
              <figure>
                {productDetailsQuery.data.images.map(image => <img key={image} src={image} className="m-2" alt="Product" width="200px" />)}
              </figure>
            </div>
          </ul>}
      </section>}


      <ConfirmDeleteModal entity="Product" onClick={() => productDeletion.mutate()} isLoading={productDeletion.isLoading} />

      {currentScreen === "editDetails" && 
        <EditProductDetails data={productDetailsQuery.data} handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default ProductDetails;