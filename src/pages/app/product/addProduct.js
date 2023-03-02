import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


const AddProduct = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Product</header>
        <p>Fill in Product Information.</p>

        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input type="text" className="form-control shadow-none" id="productName" placeholder="Product Name" />
          </div>

          <div className="mb-3">
            <label htmlFor="productCode" className="form-label">Product Code</label>
            <input type="text" className="form-control shadow-none" id="productCode" placeholder="Product Code" />
          </div>

          <div className="mb-3">
            <label htmlFor="productGroup" className="form-label">Product Group</label>
            <select className="form-select shadow-none" id="productGroup" aria-label="Default select example">
              <option value="1">Group 1</option>
              <option value="2">Group 2</option>
              <option value="3">Group 3</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label">Product Description </label>
            <textarea className="form-control shadow-none" id="productDescription" rows={3}></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="unitOfMeasurement" className="form-label">Unit Of Measurement</label>
            <input type="text" className="form-control shadow-none" id="unitOfMeasurement" placeholder="Unit of Measurement" />
          </div>

          <div className="mb-3">
            <label htmlFor="specifications" className="form-label">Specifications</label>
            <input type="text" className="form-control shadow-none" id="specifications" placeholder="Specifications" />
          </div>

          <div className="mb-3">
            <label htmlFor="brochure" className="form-label">Brochure</label>
            <input className="form-control form-control-lg shadow-none"  id="brochure" type="file" />
          </div>

          <div className="mb-3">
            <label htmlFor="brochure" className="form-label">Images</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none"  id="brochure" type="file" />
              <button className='btn btnPurple px-4 me-0'>Add</button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="productType" className="form-label">List Price For Product</label>
            <div className='d-flex align-items-center'>
              <input type="text" className="form-control shadow-none" id="productType" placeholder="Product Type" />
              <input type="text" className="form-control shadow-none ms-3" id="productPrice" placeholder="Price" />
              <button className='btn btnPurple px-4 me-0'>Add</button>
            </div>
          </div>

          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" role="switch" id="vatInclusive" />
            <label className="form-check-label" htmlFor="vatInclusive">VAT Inclusive</label>
          </div>

          <div className="mb-3">
            <label htmlFor="vatRate" className="form-label">VAT Rate</label>
            <input type="text" className="form-control shadow-none" id="vatRate" placeholder="VAT Rate" />
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5">Submit</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/product")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddProduct;