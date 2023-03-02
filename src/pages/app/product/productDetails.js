
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import EditProductDetails from './editProductDetails';


const ProductDetailListItem = ({title, description}) =>{
  return(
    <li className='py-3 border-bottom'>
      <header className='small'>{title}</header>
      <p>{description}</p>
    </li>
  )
}


const ProductDetails = () => {
  const [currentScreen, setCurrentScreen] = useState("details")

  return (
    <Layout>
      { currentScreen === "details" &&
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>Product Details</h3>
          <button className='btn btn-outline-secondary' onClick={()=>setCurrentScreen("editDetails")}>edit</button>
          <button className='btn btn-outline-danger ms-2'>delete</button>
        </header>
        <p>Details of product listed below</p>

        <ul className='mt-5'>
          <ProductDetailListItem />
          <ProductDetailListItem />
          <ProductDetailListItem />
          <ProductDetailListItem />
          <ProductDetailListItem />
          <ProductDetailListItem />
          <ProductDetailListItem />
        </ul>
      </section>}

      {currentScreen === "editDetails" && 
        <EditProductDetails handleCancel={()=>setCurrentScreen("details")} />
      }
    </Layout>

  )
}

export default ProductDetails;