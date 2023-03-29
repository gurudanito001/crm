
import '../../../styles/auth.styles.css';
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';


const MarkettingActivityListItem = ({id, name, date, location, completeData }) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/markettingActivity/${id}`, {state: {...completeData}})}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-calendar-check text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{name}</span> <br />
          <span>{location}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{new Date(date).toDateString()}</span>
      </div>
    </li>
  )
}


const AllMarkettingActivities = () => {
  const markettingActivityQuery = useQuery({
    queryKey: ["allMarkettingActivities"],
    queryFn: () => apiGet({url: "/markettingActivity"}).then( (res) =>{
      console.log(res.payload)
      return res.payload
    } )
  })

  const getCompleteData = (id) =>{
    let result = {}
    if(markettingActivityQuery.data.length > 0){
      markettingActivityQuery.data.forEach( data =>{
        if(data.id === id){
          result = data
        }
      })
    }
    return result
  }

  const listMarkettingActivities = () =>{
    return markettingActivityQuery.data.map( activity => <MarkettingActivityListItem 
      id={activity.id}
      key={activity.id}
      name={activity.name}
      date={activity.date}
      location={activity.location}
      completeData={getCompleteData(activity.id)}
    />)
  }


  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Marketting Activities</h3>
          <a href='/app/markettingActivity/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All your Marketting Activities are listed below</p>

        {markettingActivityQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Marketting Activities <Spinner />
        </div>}

        <ul className='mt-5'>
          {!markettingActivityQuery.isLoading && !markettingActivityQuery.isError  && listMarkettingActivities()}
        </ul>
      </section>
    </Layout>

  )
}

export default AllMarkettingActivities;