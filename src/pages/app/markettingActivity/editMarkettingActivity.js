
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Compress from "react-image-file-resizer";
import formatAsCurrency from '../../../services/formatAsCurrency';
import { apiPost, apiPut, apiGet } from '../../../services/apiService';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const EditMarkettingActivityDetails = ({ handleCancel, data }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState([]);
  const [ tempImageUrl, setTempImageUrl] = useState("")
  const [ base64Image, setBase64Image ] = useState([]);
  const [ tempBase64Image, setTempBase64Image] = useState("")

  const queryClient = useQueryClient();
  const markettingActivityMutation = useMutation({
    mutationFn: (data)=> apiPut({ url: `/markettingActivity/${data.id}`, data }).then(res => console.log(res.payload)),
    onSuccess: () =>{
      queryClient.invalidateQueries(["allMarkettingActivities"])
      handleCancel()
    }
  })


  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({url: "/employee"}).then( (res) => res.payload)
  })

  const listEmployeeOptions = () =>{
    if(employeeQuery.data.length > 0){
      return employeeQuery.data.map(employee =>
        <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
      )
    }
  }

  useEffect(()=>{
    console.log("data", data)
    setFormData({
      ...data
    })
  }, [])

  useEffect(()=>{
    addImage()
  }, [tempBase64Image, tempImageUrl])

  const addImage = () =>{
    if(tempBase64Image !== "" && tempImageUrl !== ""){
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

  const deleteImage = (i, source) => (e) =>{
    e.preventDefault();
    if(source === "database"){
      let images = formData.pictures;
      images = images.filter( (image, index) => i !== index);
      setFormData( prevState =>({
        ...formData,
        pictures: images
      }))
      return
    }
    let base64Img = base64Image;
    base64Img = base64Img.filter(function(item, index){ return i !== index});
    setBase64Image(prevState => ([
      ...prevState,
      ...base64Img
    ]));

    let imgUrl = imageUrl;
    imgUrl = imgUrl.filter(function(item, index){ return i !== index});
    setImageUrl(prevState => ([
      ...prevState,
      ...imgUrl
    ]));
  }

  const listDBImages = ()=>{
    return formData.pictures.map((img, index) => <li key={img} className='m-2 d-flex align-items-start'>
      <img src={img} alt="Product Item" width="200px" />
      <button onClick={deleteImage(index, "database")} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px" }}
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
    </li>)

    /* if(formData.pictures.length > 0){
      formData.pictures.forEach( (img, index) => images.push(<li key={img + index} className='m-2 d-flex align-items-start'>
        <img src={img} alt="Product Item" width="200px" />
        <button onClick={deleteImage(index, "database")} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>))
    }
    if(imageUrl.length > 0){
      imageUrl.forEach( (img, index) => images.push(<li key={img + index} className='m-2 d-flex align-items-start'>
        <img src={img} alt="Product Item" width="200px" />
        <button onClick={deleteImage(index, "local")} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
      </li>))
    } */
  }
  const listLocalImages = () =>{
    let images = [...new Set(imageUrl)];
    return images.map((img, index) => <li key={img} className='m-2 d-flex align-items-start'>
      <img src={img} alt="Product Item" width="200px" />
      <button onClick={deleteImage(index, "local")} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px" }}
        className='btn d-flex align-items-center justify-content-center text-white'><i className="bi bi-x"></i></button>
    </li>)
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
      if(!participants.includes(event.target.value)  && event.target.value !== ""){
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
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    let data = formData;
    data.pictures = [...data.pictures, ...new Set(base64Image)] ;
    //return console.log(data, base64Image, imageUrl);
    markettingActivityMutation.mutate(data)
  }

  return (
    <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="h3 fw-bold">Add Marketting Activity </header>
        <p>Fill in Marketting Activity Information.</p>
          <form className="mt-5">

          <div className="mb-3">
            <label htmlFor="activityName" className="form-label">Activity Name</label>
            <input type="text" className="form-control shadow-none" value={formData.name} onChange={handleChange("name")} id="activityName" placeholder="Enter Activity Name" />
          </div>

          <div className="mb-3">
            <label htmlFor="activityDate" className="form-label">Activity Date</label>
            <input type="date" className="form-control shadow-none" value={formData.date} onChange={handleChange("date")} id="activityDate" placeholder="Enter Activity Date" />
          </div>

          <div className="mb-3">
            <label htmlFor="participants" className="form-label">Participants</label>
            <div className='d-flex align-items-center'>
              <select className="form-select shadow-none" multiple={true} value={formData.participants} onChange={handleChange("participants")} id="participants" aria-label="Default select example">
                <option value="">Select Participants</option>
                {employeeQuery?.data?.length   && listEmployeeOptions()}
              </select>
            </div>

            {formData.participants.length > 0 &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Participants List</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listParticipants()}</ul>
            </div>}
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" className="form-control shadow-none" value={formData.location} onChange={handleChange("location")} id="location" placeholder="Address of Venue" />
          </div>

          <div className="mb-3">
            <label htmlFor="objective" className="form-label">Objective</label>
            <input type="text" className="form-control shadow-none" value={formData.objective} onChange={handleChange("objective")} id="objective" placeholder="Objective of Marketting Activity" />
          </div>

          <div className="mb-3">
            <label htmlFor="targetResult" className="form-label">Target Result</label>
            <input type="text" className="form-control shadow-none" value={formData.targetResult} onChange={handleChange("targetResult")} id="targetResult" placeholder="Target Result of Marketting Activity" />
          </div>

          <div className="mb-3">
            <label htmlFor="briefReport" className="form-label">Brief Report </label>
            <textarea className="form-control shadow-none" value={formData.briefReport} onChange={handleChange("briefReport")} id="briefReport" rows={4}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="costIncurred" className="form-label">Cost Incurred</label>
            <input type="text" className="form-control shadow-none" value={`${formatAsCurrency(formData.costIncurred)}`} onChange={handleChange("costIncurred")} id="costIncurred" placeholder="Expenses Made during Activity" />
          </div>

          <div className="mb-3">
            <label htmlFor="pictures" className="form-label">Pictures</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none" onChange={uploadImage}  id="pictures" type="file" placeholder='Pictures from event' />
              {/* <button className='btn btnPurple px-4 me-0'>Add</button> */}
            </div>

            {(formData.pictures.length > 0  || imageUrl.length > 0 ) &&
            <div className='my-2'>
              <h6 className='small fw-bold'>Images Preview</h6>
              <ul className='d-flex flex-wrap align-items-center'>{listDBImages()} {listLocalImages()}</ul>
            </div>}
          </div>

          <div className="mb-3">
            <label htmlFor="pdfDetails" className="form-label">PDF Details</label>
            <div className='d-flex align-items-center'>
              <input className="form-control form-control-lg shadow-none"  id="pdfDetails" type="file" placeholder='PDF Description of event' />
              {/* <button className='btn btnPurple px-4 me-0'>Add</button> */}
            </div>
          </div>


          <div className="d-flex mt-5">
            <button className="btn btnPurple m-0 px-5" disabled={markettingActivityMutation.isLoading} onClick={handleSubmit}> {markettingActivityMutation.isLoading ? <Spinner /> : "Submit"}</button>
            <button className="btn btn-secondary ms-3 px-5" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </section>

  )
}

export default EditMarkettingActivityDetails;