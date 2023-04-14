
import '../../../styles/auth.styles.css';
import { useEffect, useState } from "react";
import PasswordInput from "../../../components/passwordInput";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const employeeMutation = useMutation({
    mutationFn: ()=> apiPost({ url: `/employee/create`, data: formData }).then(res => {
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allEmployees"])
      navigate("/app/employee")
    }).catch( error =>{
      dispatch(
        setMessage({
          severity: "error",
          message: error.message,
          key: Date.now(),
        })
      );
    })
  })

  const companyQuery = useQuery({
    queryKey: ["allCompanies"],
    queryFn: () => apiGet({url: "/company"})
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

  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({url: "/employee"})
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

  const branchQuery = useQuery({
    queryKey: ["allBranchess"],
    queryFn: () => apiGet({url: "/branch"})
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




  const [formData, setFormData] = useState({
    companyId: "",
    companyName: "",
    branchId: "",
    staffCadre: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "password1234",
    supervisor: "",
    productHead: "",
    locationManager: "",
    employmentDate: "",
    brandsAssigned: [],
  });

  const [errors, setErrors] = useState({})

  useEffect(()=>{
    let companyName = false;
    if(formData.companyId){
      companyQuery.data.forEach(company =>{
        if(company.id === formData.companyId){
          companyName = company.name
        }
      })
    }
    if(companyName){
      setFormData(prevState =>({
        ...prevState, 
        companyName: companyName
      }))
    }
  }, [formData.companyId])

  const handleChange = (props) => (event) =>{
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
    setErrors(prevState =>({
      ...prevState,
      [props]: ""
    }))
  }

  const listCompanyOptions = () =>{
    if(companyQuery.data.length > 0){
      return companyQuery.data.map(company =>
        <option key={company.id} value={company.id}>{company.name}</option>
      )
    }
  }

  const listEmployeeOptions = () =>{
    let eligibleEmployees = employeeQuery.data.filter( employee => employee.staffCadre !== "Sales Representative");
    if(eligibleEmployees.length > 0){
      return eligibleEmployees.map(employee =>
        <option key={employee.id} value={employee.id}>{employee.firstName} {employee.middleName[0]} {employee.lastName}</option>
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
      state.brandsAssigned.push(brandData);
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }else{
      let state = formData;
      state.brandsAssigned = state.brandsAssigned.filter( function(item){ return item.name !== brand })
      setFormData(prevState =>({
        ...prevState,
        ...state
      }))
    }
  }

  const isChecked = (prop) =>{
    let checked = false;
    formData.brandsAssigned.forEach( item =>{
      if(item.name === prop){
        checked = true
      }
    })
    return checked;
  }

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

  const listBranchOptions = () =>{ 
    let branches = branchQuery.data;
    if(formData.companyId){
      branches = branches.filter( branch => branch.companyId === formData.companyId)
    }
    if(branches.length > 0){
      return branches.map(branch =>
        <option key={branch.id} value={branch.id}>{branch.name}</option>
      )
    }
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let errors = formValidator(["companyId", "branchId", "staffCadre", "firstName", "lastName", "email", "brandsAssigned"], formData);
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
    // return console.log(formData)
    employeeMutation.mutate();
  }
  
  
    return (
      <Layout>
        <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
          <header className="h3 fw-bold">Add Employee</header>
          <p>Fill in Employee Information.</p>
  
          <form className="mt-5">
            <div className="mb-3">
              <label htmlFor="company" className="form-label">Company (<span className='fst-italic text-warning'>required</span>)</label>
              <select className="form-select shadow-none" id="company" onChange={handleChange("companyId")} value={formData.companyId} aria-label="Default select example">
                <option value="">Select Company</option>
                {!companyQuery.isLoading && listCompanyOptions()}
              </select>
              <span className='text-danger font-monospace small'>{errors.companyId}</span>   
            </div>
            <div className="mb-3">
              <label htmlFor="branch" className="form-label">Branch (<span className='fst-italic text-warning'>required</span>)</label>
              <select className="form-select shadow-none" id="branch" onChange={handleChange("branchId")} value={formData.branchId} aria-label="Default select example">
                <option value="">Select Branch</option>
                {!branchQuery.isLoading && listBranchOptions()}
              </select>
              <span className='text-danger font-monospace small'>{errors.branchId}</span>   
            </div>
            <div className="mb-3">
              <label htmlFor="staffCadre" className="form-label">Staff Cadre (<span className='fst-italic text-warning'>required</span>)</label>
              <select className="form-select shadow-none" id="staffCadre" onChange={handleChange("staffCadre")} value={formData.staffCadre} aria-label="Default select example">
                <option value="">Select Staff Cadre</option>
                <option value="Administrator">Administrator</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Sales Representative">Sales Representative</option>
              </select>
              <span className='text-danger font-monospace small'>{errors.staffCadre}</span>   
            </div>
            <div className="mb-3">
              <label htmlFor="firstname" className="form-label">First Name (<span className='fst-italic text-warning'>required</span>)</label>
              <input type="text" className="form-control shadow-none" id="firstname" onChange={handleChange("firstName")} value={formData.firstName} placeholder="Employee First Name" />
              <span className='text-danger font-monospace small'>{errors.firstName}</span>   
            </div>
            <div className="mb-3">
              <label htmlFor="middlename" className="form-label">Middle Name</label>
              <input type="text" className="form-control shadow-none" id="middlename" onChange={handleChange("middleName")} value={formData.middleName} placeholder="Employee Middle Name" />
            </div>
            <div className="mb-3">
              <label htmlFor="lastname" className="form-label">Last Name (<span className='fst-italic text-warning'>required</span>)</label>
              <input type="text" className="form-control shadow-none" id="lastname" onChange={handleChange("lastName")} value={formData.lastName} placeholder="Employee Last Name" />
              <span className='text-danger font-monospace small'>{errors.lastName}</span>   
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address (<span className='fst-italic text-warning'>required</span>)</label>
              <input type="email" className="form-control shadow-none" id="email" onChange={handleChange("email")}  value={formData.email} placeholder="Enter your email address" />
              <span className='text-danger font-monospace small'>{errors.email}</span>   
            </div>
            <PasswordInput defaultValue={formData.password} disabled={true} />
            <div className="mb-3">
              <label htmlFor="supervisor" className="form-label">Supervisor</label>
              <select className="form-select shadow-none" id="supervisor" value={formData.supervisor} onChange={handleChange("supervisor")} aria-label="Default select example">
                <option value="">Select Supervisor</option>
                {!employeeQuery.isLoading && listEmployeeOptions()}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="productHead" className="form-label">Product Head</label>
              <select className="form-select shadow-none" id="productHead" value={formData.productHead} onChange={handleChange("productHead")} aria-label="Default select example">
                <option value="">Select Product Head</option>
                {!employeeQuery.isLoading && listEmployeeOptions()}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="locationManager" className="form-label">Location Manager</label>
              <select className="form-select shadow-none" id="locationManager" value={formData.locationManager} onChange={handleChange("locationManager")} aria-label="Default select example">
                <option value="">Select Location Manager</option>
                {!employeeQuery.isLoading && listEmployeeOptions()}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="employmentDate" className="form-label">Employment Date</label>
              <input type="date" className="form-control shadow-none" id="employmentDate" onChange={handleChange("employmentDate")} value={formData.employmentDate} placeholder="Enter Employee Employment Date" />
            </div>
            <div className="mb-3">
              <label htmlFor="brandsAssigned" className="form-label">Brands Assigned (<span className='fst-italic text-warning'>required</span>)</label>
              <div className='d-flex'>{!productGroupQuery.isLoading && listBrands()}</div>
              <span className='text-danger font-monospace small'>{errors.brandsAssigned}</span>   
            </div>
            <div className="d-flex mt-5">
              <button className="btn btnPurple m-0 px-5" disabled={employeeMutation.isLoading} onClick={handleSubmit}>{employeeMutation.isLoading ? <Spinner /> : "Submit"}</button>
              <button className="btn btn-secondary ms-3  px-5" disabled={employeeMutation.isLoading} onClick={()=>navigate("/app/employee")}>Cancel</button>
            </div>
          </form>
        </section>
      </Layout>
    )
  }

export default AddEmployee;