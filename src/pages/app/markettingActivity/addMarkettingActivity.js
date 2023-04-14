import '../../../styles/auth.styles.css';
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import Compress from "react-image-file-resizer";
import formatAsCurrency from '../../../services/formatAsCurrency';
import { apiPost, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';
import formValidator from '../../../services/validation';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/slices/notificationMessagesSlice';
import { getUserData } from '../../../services/localStorageService';


const AddMarkettingActivity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = getUserData();
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    date: "",
    participants: [],
    location: "",
    objective: "",
    targetResult: "",
    briefReport: "",
    costIncurred: "",
    pictures: [],
    pdfDetails: ""
  })

  const [errors, setErrors] = useState({});

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      employeeId: id
    }))
  }, [])

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState([]);
  const [ tempImageUrl, setTempImageUrl] = useState("")
  const [ base64Image, setBase64Image ] = useState([]);
  const [ tempBase64Image, setTempBase64Image] = useState("")

  const queryClient = useQueryClient();
  const markettingActivityMutation = useMutation({
    mutationFn: (data)=> apiPost({ url: `/markettingActivity/create`, data }).then(res =>{
      dispatch(
        setMessage({
          severity: "success",
          message: res.message,
          key: Date.now(),
        })
      );
      queryClient.invalidateQueries(["allMarkettingActivities"])
      navigate("/app/markettingActivity")
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

  const listEmployeeOptions = () =>{
    if(employeeQuery.data.length > 0){
      return employeeQuery.data.map(employee =>
        <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
      )
    }
  }

  useEffect(()=>{
    addImage()
  }, [tempBase64Image, tempImageUrl])

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

  const getEmployeeName = (id) =>{
    let name = ""
    employeeQuery.data.forEach( employee => {
      if(employee.id === id){
        name = employee.firstName + " " + employee.lastName;
      }
    })
    return name;
  }

  const deleteParticipant = (id) =>{
    let participants = formData.participants;
    participants = participants.filter( item => item !== id);
    setFormData( prevState => ({
      ...prevState,
      participants
    }))
  }

  const listParticipants = () =>{
    if(formData.participants.length > 0){
      return formData.participants.map( (participant) => <li key={participant} className='m-2 d-flex align-items-start border p-3 rounded'>
        <span>{getEmployeeName(participant)}</span>
        <button onClick={()=>deleteParticipant(participant)} style={{ width: "10px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-25px", left: "25px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>)
    }
  }


  const handleChange = (props) => (event) =>{
    if(props === "participants"){
      let participants = formData.participants;
      if(!participants.includes(event.target.value)){
        participants.push(event.target.value)
        setFormData( prevState =>({
          ...prevState,
          participants
        }));
      }
      return;
    }
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
    data.pictures = base64Image;
    let errors = formValidator(["name", "date", "participants", "location", "objective", "targetResult", "briefReport", "costIncurred", "pictures"], data);
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
    markettingActivityMutation.mutate(data)
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Marketing Activity </header>
        <p>Fill in Marketing Activity Information.</p>
          <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="activityName" className="form-label">Marketing Activity Name (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="text" className="form-control shadow-none" value={formData.name} onChange={handleChange("name")} id="activityName" placeholder="Enter Activity Name" />
            <span className='text-danger font-monospace small'>{errors.name}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="activityDate" className="form-label">Activity Date (<span className='fst-italic text-warning'>required</span>)</label>
            <input type="date" className="form-control shadow-none" value={formData.date} onChange={handleChange("date")} id="activityDate" placeholder="Enter Activity Date" />
            <span className='text-danger font-monospace small'>{errors.date}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="participants" className="form-label">Participants (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" onChange={handleChange("participants")} id="participants" aria-label="Default select example">
                <option value="">Select Participants</option>
                {employeeQuery?.data?.length   && listEmployeeOptions()}
              </select>
            </div>
            <span className='text-danger font-monospace small'>{errors.participants}</span>  

            {formData.participants.length > 0 &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Participants</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listParticipants()}</ul>
            </div>}
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.location} placeholder="Marketing Location" onChange={handleChange("location")} id="location" rows={2}></textarea>
            <span className='text-danger font-monospace small'>{errors.location}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="objective" className="form-label">Objective (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.objective} placeholder="Objective" onChange={handleChange("objective")} id="objective" rows={2}></textarea>
            <span className='text-danger font-monospace small'>{errors.objective}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="targetResult" className="form-label">Target Result (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.targetResult} placeholder="Target Result" onChange={handleChange("targetResult")} id="targetResult" rows={2}></textarea>
            <span className='text-danger font-monospace small'>{errors.targetResult}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="briefReport" className="form-label">Brief Report (200 Words)  (<span className='fst-italic text-warning'>required</span>)</label>
            <textarea className="form-control shadow-none" value={formData.briefReport} placeholder="Brief Report" onChange={handleChange("briefReport")} id="briefReport" rows={4}></textarea>
            <span className='text-danger font-monospace small'>{errors.briefReport}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="costIncurred" className="form-label">Cost Incurred (<span className='fst-italic text-warning'>required</span>) <small className='fw-bold ms-2'>{formatAsCurrency(formData.costIncurred)}</small></label>
            <input type="number" className="form-control shadow-none" value={formData.costIncurred} onChange={handleChange("costIncurred")} id="costIncurred" placeholder="Expenses Made during Activity" />
            <span className='text-danger font-monospace small'>{errors.costIncurred}</span>  
          </div>

          <div className="mb-3">
            <label htmlFor="pictures" className="form-label">Pictures (1-15 pic, of max. 2 MB each) (<span className='fst-italic text-warning'>required</span>)</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none" onChange={uploadImage}  id="pictures" type="file" placeholder='Pictures from event' />
            </div>
            <span className='text-danger font-monospace small'>{errors.pictures}</span>  


            {imageUrl.length !== 0 &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Images Preview</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listImages()}</ul>
            </div>}
          </div>

          <div className="mb-3">
            <label htmlFor="pdfDetails" className="form-label">Upload File with details (PDF)</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none"  id="pdfDetails" type="file" placeholder='PDF Description of event' />
            </div>
          </div>


          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={markettingActivityMutation.isLoading} onClick={handleSubmit}> {markettingActivityMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={() => navigate("/app/markettingActivity")}>Cancel</button>
          </div>
        </form>
      </section>
    </Layout>

  )
}

export default AddMarkettingActivity;