import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Compress from "react-image-file-resizer";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';


const AddCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const companyMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/company/create`, data: formData })
    .then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allCompanies"])
      navigate("/app/company")
    })
    .catch(error => {
      console.log(error)
      dispatch(
        setMessage({
          severity: "error",
          message: error?.response?.data?.message || error?.message,
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

  const listCompanyGroupOptions = () =>{
    if(companyGroupQuery?.data?.length){
      return companyGroupQuery.data.map(group =>
        <option key={group.id} value={group.name}>{group.name}</option>
      )
    }
  }

  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"}).then( (res) => res.payload),
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

  const [formData, setFormData] = useState({
    group: "",
    code: "",
    name: "",
    logo: "",
    email: "",
    address: "",
    brands:[]
  });
  const [errors, setErrors] = useState({});

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  useEffect(()=>{
    if(base64Image){
      setFormData( prevState => ({
        ...prevState,
        logo: base64Image
      }))
    }
  }, [base64Image])

  const listBrands = () =>{
    return productGroupQuery.data.map(productGroup =>
      <div className="form-check ms-3" key={productGroup.id}>
        <input className="form-check-input" type="checkbox" checked={isChecked(productGroup.name)} onChange={handleCheck(productGroup.name)} value={productGroup.id} id={productGroup.id} />
        <label className="form-check-label fw-bold" htmlFor={productGroup.id}>
          {productGroup.name}
        </label>
      </div>
    )
  }

  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
      Compress.imageFileResizer(
        file, // the file from input
        120, // width
        120, // height
        "PNG", // compress format WEBP, JPEG, PNG
        80, // quality
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
    formData.brands.forEach( item =>{
      if(item.name === prop){
        checked = true
      }
    })
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
    //return console.log(formData);
    let errors = formValidator(["group", "code", "name", "logo", "email", "address", "brands"], formData);
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
    companyMutation.mutate();
  }



  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        
        <header className="h3 fw-bold">Add Company</header>
        <p>Fill in Company Information.</p>

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
            <input className="form-control form-control-lg" id="companyLogo" accept="image/*" type="file" onChange={uploadImage}/>
            <span className='text-danger font-monospace small'>{errors.logo}</span>
            {imageUrl &&
            <div>
              <h6 className='small fw-bold mt-3'>Logo Preview</h6>
              <img src={imageUrl} alt="Logo Preview" className='border rounded' width="100px"/>
            </div>}
          </div>


          <div className="mb-3">
            <label htmlFor="companyEmail" className="form-label">Company Email (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="companyEmail" placeholder="Enter company email" />
            <span className='text-danger font-monospace small'>{errors.email}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="companyAddress" className="form-label">Company Address (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" onChange={handleChange("address")} value={formData.address} id="companyAddress" rows={3}></textarea>
            <span className='text-danger font-monospace small'>{errors.address}</span>
          </div>
          

          <div className="mb-3">
            <label htmlFor="brandsAssigned" className="form-label">Brands (<span className='fst-italic text-warning'>required</span>)</label>
            {!productGroupQuery.isLoading && !productGroupQuery.isError &&
            <div className='d-flex'> {listBrands()} </div>}
            <span className='text-danger font-monospace small'>{errors.brands}</span>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={companyMutation.isLoading} onClick={handleSubmit}> {companyMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={companyMutation.isLoading} onClick={() => navigate("/app/company")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddCompany;