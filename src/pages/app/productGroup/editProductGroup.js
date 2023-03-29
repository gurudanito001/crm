import { useState, useEffect } from "react";
import { apiPut } from '../../../services/apiService';
import { useMutation, useQueryClient } from "@tanstack/react-query" 
import { useNavigate } from "react-router";
import { Spinner } from '../../../components/spinner';


const EditProductGroupDetails = ({ data, handleCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: ""
  })

  const queryClient = useQueryClient();
  const productGroupDetailsMutation = useMutation({
    mutationFn: ()=> apiPut({ url: `/productGroup/${data.id}`, data: formData }).then(res => console.log(res)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allProductGroups", data.id])
      handleCancel()
    }
  })

  useEffect(()=>{
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
  }, [])

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    //return console.log(formData);
    productGroupDetailsMutation.mutate();
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
      <header className="h3 fw-bold">Edit Product Group Details</header>
      <p>Make changes to Product Group Information.</p>

      <form className="mt-5">
        <div className="mb-3">
          <label htmlFor="groupName" className="form-label">Product Group Name</label>
          <input type="text" onChange={handleChange("name")} value={formData.name} className="form-control shadow-none" id="groupName" placeholder="Product Group Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="groupCode" className="form-label">Product Group Code</label>
          <input type="text" onChange={handleChange("code")} value={formData.code} className="form-control shadow-none" id="groupCode" placeholder="Product Group Code" />
        </div>
        <div className="mb-3">
          <label htmlFor="productGroupDescription" className="form-label">Product Group Description </label>
          <textarea className="form-control shadow-none" value={formData.description} onChange={handleChange("description")} id="productGroupDescription" rows={3}></textarea>
        </div>

        <div className="d-flex mt-5">
          <button className="btn btnPurple m-0 px-5" disabled={productGroupDetailsMutation.isLoading} onClick={handleSubmit}> {productGroupDetailsMutation.isLoading ? <Spinner /> : "Save Changes"}</button>
          <button className="btn btn-secondary ms-3 px-5" disabled={productGroupDetailsMutation.isLoading} onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default EditProductGroupDetails;