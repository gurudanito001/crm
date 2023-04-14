
import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllMarkettingActivitiesAdmin from './allMarketingActivitiesAdmin';
import AllMarkettingActivitiesEmployees from './allMarketingActivitiesEmployees';



const AllMarkettingActivities = () => {
  const {staffCadre} = getUserData();
  
  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllMarkettingActivitiesAdmin />
    }else{
      return <AllMarkettingActivitiesEmployees />
    }
  }


  return (
    <>
      { component() }
    </>
  )
}

export default AllMarkettingActivities;