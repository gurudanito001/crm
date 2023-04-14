import { useState, useEffect } from "react";
import { apiPut, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query" 
import { useNavigate } from "react-router";
import Compress from "react-image-file-resizer";
import { Spinner } from '../../../components/spinner';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import formValidator from "../../../services/validation";


const EditCompanyDetails = ({ data, handleCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const [errors, setErrors] = useState({});

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  const queryClient = useQueryClient();
  const companyDetailsMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/company/${data.id}`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      ); 
      queryClient.invalidateQueries(["allCompanies", data.id])
      handleCancel()
    })
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

  const companyGroupQuery = useQuery({
    queryKey: ["allCompanyGroups"],
    queryFn: () => apiGet({url: "/companyGroup"}).then( (res) => res.payload),
    onError: (error) =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error?.response?.data?.message || error?.message,
          key: Date.now(),
        })
      ); 
    }
  })

  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
      Compress.imageFileResizer(
        file, // the file from input
        120, // width
        120, // height
        "PNG", // compress format WEBP, JPEG, PNG
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

  const listCompanyGroupOptions = () =>{
    if(companyGroupQuery?.data?.length){
      return companyGroupQuery.data.map(group =>
        <option key={group.id} value={group.name}>{group.name}</option>
      )
    }
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
    setErrors( prevState =>({
      ...prevState,
      [props]: ""
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    let errors = formValidator(["group", "code", "name", "logo", "email", "brands"], formData);
    if(Object.keys(errors).length > 0){
      console.log(errors)
      dispatch(
        setMessage({
          severity: "error",
          message: "Form Validation Error",
          key: Date.now(),
        })
      );
      return setErrors(errors);
    }
    //return console.log(formData, );
    companyDetailsMutation.mutate();
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Company Details</header>
      <p>Make changes to Company Information.</p>

      <form className="mt-5">
        <div className="mb-3">
          <label htmlFor="groupName" className="form-label">Group Name (<span className='fst-italic text-warning'>required</span>)</label>
          <select className="form-select shadow-none" id="groupName" onChange={handleChange("group")} value={formData.group} aria-label="Default select example">
            <option value="">Select Company Group</option>
            {!companyGroupQuery.isLoading && listCompanyGroupOptions()}
          </select>
          <span className='text-danger font-monospace small'>{errors.group}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="companyCode" className="form-label">Company Code (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="companyCode" placeholder="Company Code" />
          <span className='text-danger font-monospace small'>{errors.code}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="text" onChange={handleChange("name")} value={formData.name} className="form-control shadow-none" id="companyName" placeholder="Company Name" />
          <span className='text-danger font-monospace small'>{errors.name}</span>
        </div>

        <div className="mb-3">
          <label htmlFor="companyLogo" className="form-label">Company Logo (<span className='fst-italic text-warning'>required</span>)</label>
          <input className="form-control form-control-lg" id="companyLogo" accept="image/*" type="file" onChange={uploadImage} />
          <span className='text-danger font-monospace small'>{errors.logo}</span>
          {(imageUrl || formData.logo) &&
          <div>
            <h6 className='small fw-bold mt-3'>Logo Preview</h6>
            <img src={formData.logo || imageUrl} alt="Logo Preview" className='border rounded' width="100px" />
          </div>}
        </div> 

        <div className="mb-3">
          <label htmlFor="companyEmail" className="form-label">Company Email (<span className='fst-italic text-warning'>required</span>)</label>
          <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="companyEmail" placeholder="Enter company email" />
          <span className='text-danger font-monospace small'>{errors.email}</span>
        </div>

        <div className="mb-3">
          <label htmlFor="brandsAssigned" className="form-label">Brands (<span className='fst-italic text-warning'>required</span>)</label>
          {!productGroupQuery.isLoading && listBrands()}
          <span className='text-danger font-monospace small'>{errors.brands}</span>
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