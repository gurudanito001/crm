import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate, useLocation } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Compress from "react-image-file-resizer";
import { Spinner } from '../../../components/spinner';
import formatAsCurrency from '../../../services/formatAsCurrency';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';


const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {state} = useLocation();

  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: (data)=> apiPost({ url: `/product/create`, data }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allProducts"])
      navigate("/app/product")
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

  const listProductGroupOptions = () =>{
    if(productGroupQuery.data.length > 0){
      return productGroupQuery.data.map(productGroup =>
        <option key={productGroup.id} value={productGroup.id}>{productGroup.name}</option>
      )
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    productGroupId: "",
    description: "",
    unitOfMeasurement: "",
    specifications: "",
    brochures: [],
    images: [],
    price: "",
    vatInclusive: false,
    vatRate: "",
    extraData: {}
  });
  
  const [errors, setErrors] = useState({})

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState([]);
  const [ tempImageUrl, setTempImageUrl] = useState("")
  const [ base64Image, setBase64Image ] = useState([]);
  const [ tempBase64Image, setTempBase64Image] = useState("")

  useEffect(()=>{
    if(state?.productGroupId){
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }
  }, [])

  useEffect(()=>{
    if(!formData.vatInclusive){
      setFormData( prevState =>({
        ...prevState,
        vatRate: ""
      }))
    }
  },[formData.vatInclusive])

  useEffect(()=>{
    if(tempBase64Image !== "" && tempImageUrl !== ""){
      addImage()
    }
  }, [tempBase64Image, tempImageUrl])


  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
      Compress.imageFileResizer(
        file, // the file from input
        200, // width
        200, // height
        "jpg", // compress format WEBP, JPEG, PNG
        50, // quality
        0, // rotation
        (uri) => {
          setTempBase64Image(uri)
        },
        "base64" // blob or base64 default base64
      );
      setSelectedFile(file);
      setTempImageUrl(URL.createObjectURL(file))
    }
  }

  useEffect(()=>{
    console.log({base64Image, imageUrl});
  }, [base64Image, imageUrl])

  const addImage = () =>{
    if(tempBase64Image && tempImageUrl){
      setBase64Image( prevState =>([
        ...prevState, 
        tempBase64Image
      ]))
      setTempBase64Image("")
      setImageUrl(prevState =>([
        ...prevState,
        tempImageUrl
      ])); 
      setTempImageUrl("")
      setSelectedFile("")
    }
  }

  const deleteImage = (i) => (e) =>{
    e.preventDefault();
    let base64Img = base64Image;
    base64Img = base64Img.filter(function(item, index){ return i !== index});
    setBase64Image(base64Img);

    let tempImgUrl = imageUrl;
    tempImgUrl = tempImgUrl.filter(function(item, index){ return i !== index});
    setImageUrl(tempImgUrl);
  }

  const listImages = ()=>{
    if(imageUrl.length > 0){
      return imageUrl.map( (img, index) => <li key={img + index} className='m-2 d-flex align-items-start'>
        <img src={img} alt="Product Item" width="200px" />
        <button onClick={deleteImage(index)} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>)
    }
  }

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors( prevState => ({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let data = formData;
    data.images = base64Image;
    let errors = formValidator(["code", "name", "description", "productGroupId", "price", "images"], data);
    if(Object.keys(errors).length > 0){
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      return setErrors(errors);
    }
    //return console.log(data);
    productMutation.mutate(data)
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Product</header>
        <p>Fill in Product Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="productGroup" className="form-label">Product Group (<span className='fst-italic text-warning'>required</span>)</label>
            <select className="form-select shadow-none" value={formData.productGroupId} onChange={handleChange("productGroupId")} id="productGroup" aria-label="Default select example">
              <option value="">Select Product Group</option>
              {!productGroupQuery.isLoading && listProductGroupOptions()}
            </select>
            <span className='text-danger font-monospace small'>{errors.productGroupId}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.name} onChange={handleChange("name")} id="productName" placeholder="Product Name" />
            <span className='text-danger font-monospace small'>{errors.name}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="productCode" className="form-label">Product Code (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.code} onChange={handleChange("code")} id="productCode" placeholder="Product Code" />
            <span className='text-danger font-monospace small'>{errors.code}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label">Product Description (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.description} onChange={handleChange("description")} id="productDescription" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.description}</span>
          </div>
          
          <div className="mb-3">
            <label htmlFor="unitOfMeasurement" className="form-label">Unit Of Measurement</label>
            <input type="text" className="form-control shadow-none" value={formData.unitOfMeasurement} onChange={handleChange("unitOfMeasurement")} id="unitOfMeasurement" placeholder="Unit of Measurement" />
          </div>

          <div className="mb-3">
            <label htmlFor="specifications" className="form-label">Specifications</label>
            <textarea className="form-control shadow-none" value={formData.specifications} onChange={handleChange("specifications")} id="specifications" rows={3}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="brochure" className="form-label">Brochure</label>
            <input className="form-control form-control-lg shadow-none"  id="brochure" type="file" />
          </div>

          <div className="mb-3">
            <label htmlFor="brochure" className="form-label">Images (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none"  id="brochure" onChange={uploadImage} type="file" />
            </div>
            <span className='text-danger font-monospace small'>{errors.images}</span>

            {imageUrl.length !== 0 &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Images Preview</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listImages()}</ul>
            </div>}
          </div>

          <div className="mb-3">
            <label htmlFor="productType" className="form-label">Price Of Product (<span className='fst-italic text-warning'>required</span>) <span className='ms-2 fw-bold'>{formatAsCurrency(formData.price)}</span> </label>
            <div className='d-flex align-items-center'>
              <input type="text" className="form-control shadow-none" value={formData.price} onChange={handleChange("price")} id="productPrice" placeholder="Price" />
            </div>
            <span className='text-danger font-monospace small'>{errors.price}</span>
          </div>

          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" role="switch" checked={formData.vatInclusive} onChange={(e)=>setFormData( prevState =>({
              ...prevState,
              vatInclusive: !prevState.vatInclusive
            }))} id="vatInclusive" />
            <label className="form-check-label" htmlFor="vatInclusive">VAT Inclusive</label>
          </div>

          {formData.vatInclusive && 
          <div className="mb-3">
            <label htmlFor="vatRate" className="form-label">VAT Rate</label>
            <input type="text" className="form-control shadow-none" value={formData.vatRate} onChange={handleChange("vatRate")} id="vatRate" placeholder="VAT Rate" />
          </div>}

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={productMutation.isLoading} onClick={handleSubmit}> {productMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/product")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddProduct;