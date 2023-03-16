import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Compress from "react-image-file-resizer";
import { Spinner } from '../../../components/spinner';


const AddProduct = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/product/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allProducts"])
      navigate("/app/product")
    }
  })

  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"}).then( (res) => res.payload)
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

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState([]);
  const [ tempImageUrl, setTempImageUrl] = useState("")
  const [ base64Image, setBase64Image ] = useState([]);
  const [ tempBase64Image, setTempBase64Image] = useState("")

  useEffect(()=>{
    if(!formData.vatInclusive){
      setFormData( prevState =>({
        ...prevState,
        vatRate: ""
      }))
    }
  },[formData.vatInclusive])

  useEffect(()=>{
    if(formData.images.length > 0){
      productMutation.mutate()
    }
  }, [formData])


  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
      Compress.imageFileResizer(
        file, // the file from input
        48, // width
        48, // height
        "jpg", // compress format WEBP, JPEG, PNG
        50, // quality
        0, // rotation
        (uri) => {
          setTempBase64Image(uri)
          /* setBase64Image( prevState =>([
            ...prevState, uri
          ])) */
        },
        "base64" // blob or base64 default base64
      );
      setSelectedFile(file);
      setTempImageUrl(URL.createObjectURL(file))
      /* setImageUrl(prevState =>([
        ...prevState,
        URL.createObjectURL(file)
      ])); */
    }
  }

  useEffect(()=>{
    console.log({base64Image, imageUrl});
  }, [base64Image, imageUrl])

  const addImage = (e) =>{
    e.preventDefault()
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
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let data = formData;
    data.images = base64Image;
    //return console.log(data);
    setFormData(prevState =>({
      ...prevState,
      ...data
    }))
  }




  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Product</header>
        <p>Fill in Product Information.</p>

        <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input type="text" className="form-control shadow-none" value={formData.name} onChange={handleChange("name")} id="productName" placeholder="Product Name" />
          </div>

          <div className="mb-3">
            <label htmlFor="productCode" className="form-label">Product Code</label>
            <input type="text" className="form-control shadow-none" value={formData.code} onChange={handleChange("code")} id="productCode" placeholder="Product Code" />
          </div>

          <div className="mb-3">
            <label htmlFor="productGroup" className="form-label">Product Group</label>
            <select className="form-select shadow-none" value={formData.productGroupId} onChange={handleChange("productGroupId")} id="productGroup" aria-label="Default select example">
              <option value="">Select Product Group</option>
              {!productGroupQuery.isLoading && listProductGroupOptions()}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label">Product Description </label>
            <textarea className="form-control shadow-none" value={formData.description} onChange={handleChange("description")} id="productDescription" rows={3}></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="unitOfMeasurement" className="form-label">Unit Of Measurement</label>
            <input type="text" className="form-control shadow-none" value={formData.unitOfMeasurement} onChange={handleChange("unitOfMeasurement")} id="unitOfMeasurement" placeholder="Unit of Measurement" />
          </div>

          <div className="mb-3">
            <label htmlFor="specifications" className="form-label">Specifications</label>
            <input type="text" className="form-control shadow-none" value={formData.specifications} onChange={handleChange("specifications")} id="specifications" placeholder="Specifications" />
          </div>

          <div className="mb-3">
            <label htmlFor="brochure" className="form-label">Brochure</label>
            <input className="form-control form-control-lg shadow-none"  id="brochure" type="file" />
          </div>

          <div className="mb-3">
            <label htmlFor="brochure" className="form-label">Images</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none"  id="brochure" onChange={uploadImage} type="file" />
              <button className='btn btnPurple px-4 me-0' onClick={addImage}>Add</button>
            </div>

            {imageUrl.length !== 0 &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Images Preview</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listImages()}</ul>
            </div>}
          </div>

          <div className="mb-3">
            <label htmlFor="productType" className="form-label">Price Of Product</label>
            <div className='d-flex align-items-center'>
              <input type="text" className="form-control shadow-none" value={formData.price} onChange={handleChange("price")} id="productPrice" placeholder="Price" />
            </div>
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