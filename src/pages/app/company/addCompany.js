import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Compress from "react-image-file-resizer";


const AddCompany = () => {
  const navigate = useNavigate()

  const queryClient = useQueryClient();
  const companyMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/company/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allCompanies"])
      navigate("/app/company")
    }
  })

  const productGroupQuery = useQuery({
    queryKey: ["allProductGroups"],
    queryFn: () => apiGet({url: "/productGroup"}).then( (res) => res.payload)
  })

  const [formData, setFormData] = useState({
    group: "",
    code: "",
    name: "",
    logo: "",
    email: "",
    address: "",
    extraData: {
      brands:[]
    }
  });

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  useEffect(()=>{
    if(formData.logo && formData.logoFileName){
      companyMutation.mutate()
    }
  }, [formData])

  const listBrands = () =>{
    return productGroupQuery.data.map(productGroup =>
      <div className="form-check" key={productGroup.id}>
        <input className="form-check-input" type="checkbox" onChange={handleCheck(productGroup.name)} value={productGroup.id} id={productGroup.id} />
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
        48, // width
        48, // height
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


  const handleCheck = (brand) =>(event) =>{
    if(event.target.checked){
      let brandData;
      productGroupQuery.data.forEach( item =>{
        if(item.name === brand){
          brandData = item;
        }
      })
      let state = formData;
      state.extraData.brands.push(brandData);
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }else{
      /* let brandData;
      productGroupQuery.data.forEach( item =>{
        if(item.name === brand){
          brandData = item;
        }
      }) */
      let state = formData;
      state.extraData.brands = state.extraData.brands.filter( function(item){ return item.name !== brand })
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }
    
   /*  let brandData;
    productGroupQuery.data.forEach( item =>{
      if(item.name === brand){
        brandData = item;
      }
    })
    let brands = formData.extraData.brands; */
    /* setFormData(prevState =>({
      ...prevState,
      extraData:{
        ...prevState.extraData,
        brands: [
          ...prevState.extraData.brands,
          brandData
        ]
      }
    })) */
  }

  const handleChange = (props) => (event) =>{

    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    return console.log(formData);
    let data = {...formData};
    data.logo = base64Image;
    data.logoFileName = selectedFile.name
    setFormData(prevState =>({
      ...prevState,
      ...data
    }))
  }



  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Company</header>
        <p>Fill in Company Information.</p>

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
            <input className="form-control form-control-lg" id="companyLogo" accept="image/*" type="file" onChange={uploadImage}/>
          </div>

          <div className="mb-3">
            <label htmlFor="companyEmail" className="form-label">Company Email</label>
            <input type="email" onChange={handleChange("email")} value={formData.email} className="form-control shadow-none" id="companyEmail" placeholder="Enter company email" />
          </div>

          <div className="mb-3">
            <label htmlFor="companyAddress" className="form-label">Company Address</label>
            <textarea className="form-control shadow-none" onChange={handleChange("address")} value={formData.address} id="companyAddress" rows={3}></textarea>
          </div>
          

          <div className="mb-3">
            <label htmlFor="brandsAssigned" className="form-label">Brands</label>
            {!productGroupQuery.isLoading && listBrands()}
            {/* <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
              <label className="form-check-label" htmlFor="defaultCheck1">
                Brand 1
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" />
              <label className="form-check-label" htmlFor="defaultCheck2">
                Brand 2
              </label>
            </div> */}
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={companyMutation.isLoading} onClick={handleSubmit}>Submit</button>
            <button className="btn btn-secondary ms-3 px-5" disabled={companyMutation.isLoading} onClick={() => navigate("/app/company")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddCompany;