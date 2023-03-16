import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost } from '../../../services/apiService';
import { useMutation, useQueryClient } from "@tanstack/react-query";


const AddProductGroup = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const productGroupMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/productGroup/create`, data: formData }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allProductGroups"])
      navigate("/app/prodGroup")
    }
  })

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    //return console.log(formData);
    productGroupMutation.mutate()
  }




  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Product Group</header>
        <p>Fill in Product Group Information.</p>

        <form className="mt-5">
          <div className="mb-3">
            <label htmlFor="productGroupName" className="form-label">Product Group Name</label>
            <input type="text" className="form-control shadow-none" onChange={handleChange("name")} value={formData.name} id="productGroupName" placeholder="Product Group Name" />
          </div>

          <div className="mb-3">
            <label htmlFor="productGroupCode" className="form-label">Product Group Code</label>
            <input type="text" className="form-control shadow-none" onChange={handleChange("code")} value={formData.code} id="productGroupCode" placeholder="Product Group Code" />
          </div>

          <div className="mb-3">
            <label htmlFor="productGroupDescription" className="form-label">Product Group Description </label>
            <textarea className="form-control shadow-none" onChange={handleChange("description")} value={formData.description} id="productGroupDescription" rows={3}></textarea>
          </div>

          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/prodGroup")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default AddProductGroup;