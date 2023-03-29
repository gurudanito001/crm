import { useState, useEffect } from "react";
import { apiPut, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query" 
import { useNavigate } from "react-router";
import Compress from "react-image-file-resizer";
import { Spinner } from '../../../components/spinner';


const EditCompanyDetails = ({ data, handleCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    group: "",
    code: "",
    name: "",
    logo: "",
    email: "",
    address: "",
    extraData: {
    }
  })

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  const queryClient = useQueryClient();
  const companyDetailsMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/company/${data.id}`, data: formData }).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCompanies", data.id])
      handleCancel()
    }
  })

  useEffect(()=>{
    if(base64Image){
      setFormData( prevState => ({
        ...prevState,
        logo: base64Image
      }))
    }
  }, [base64Image])

  useEffect(()=>{
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
  }, [])

  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"}).then( (res) => res.payload)
  })

  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
      Compress.imageFileResizer(
        file, // the file from input
        100, // width
        100, // height
        "jpg", // compress format WEBP, JPEG, PNG
        70, // quality
        0, // rotation
        (uri) => {
          setBase64Image(uri)
        },
        "base64" // blob or base64 default base64
      );
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }

  const listBrands = () =>{
    return productGroupQuery.data.map(productGroup =>
      <div className="form-check" key={productGroup.id}>
        <input className="form-check-input" type="checkbox" checked={isChecked(productGroup.name)} onChange={handleCheck(productGroup.name)} value={productGroup.id} id={productGroup.id} />
        <label className="form-check-label fw-bold" htmlFor={productGroup.id}>
          {productGroup.name}
        </label>
      </div>
    )
  }

  const handleCheck = (brand) =>(event) =>{
    if(event.target.checked){
      let brandData;
      productGroupQuery.data.forEach( item =>{
        if(item.name === brand){
          brandData = item;
        }
      })
      let state = formData;
      state.brands.push(brandData);
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }else{
      let state = formData;
      state.brands = state.brands.filter( function(item){ return item.name !== brand })
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }
  }

  const isChecked = (prop) =>{
    let checked = false;
    if(formData.brands?.length > 0){
      formData.brands.forEach( item =>{
        if(item.name === prop){
          checked = true
        }
      })
    }
    
    return checked;
  }

  

  const handleChange = (props) => (event) =>{

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    //return console.log(formData, );
    companyDetailsMutation.mutate();
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Company Details</header>
      <p>Make changes to Company Information.</p>

      <form className="mt-5">
        <div className="mb-3">
          <label htmlFor="groupName" className="form-label">Group Name</label>
          <input type="text" onChange={handleChange("group")} value={formData.group} className="form-control shadow-none" id="groupName" placeholder="Group Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="companyCode" className="form-label">Company Code</label>
          <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="companyCode" placeholder="Company Code" />
        </div>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name</label>
          <input type="text" onChange={handleChange("name")} value={formData.name} className="form-control shadow-none" id="companyName" placeholder="Company Name" />
        </div>

        <div className="mb-3">
          <label htmlFor="companyLogo" className="form-label">Company Logo</label>
          <input className="form-control form-control-lg" id="companyLogo" accept="image/*" type="file" onChange={uploadImage} />
          {(imageUrl || formData.logo) &&
          <div>
            <h6 className='small fw-bold mt-3'>Logo Preview</h6>
            <img src={formData.logo || imageUrl} alt="Logo Preview" className='border rounded' width="100px" />
          </div>}
        </div> 

        <div className="mb-3">
          <label htmlFor="companyEmail" className="form-label">Company Email</label>
          <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="companyEmail" placeholder="Enter company email" />
        </div>

        <div className="mb-3">
          <label htmlFor="brandsAssigned" className="form-label">Brands</label>
          {!productGroupQuery.isLoading && listBrands()}
        </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={companyDetailsMutation.isLoading} onClick={handleSubmit}> {companyDetailsMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3 px-5" disabled={companyDetailsMutation.isLoading} onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default EditCompanyDetails;