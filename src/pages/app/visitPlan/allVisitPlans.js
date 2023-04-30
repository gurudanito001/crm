import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllVisitPlansAdmin from './allVisitPlansAdmin';
import AllVisitPlansEmployees from './allVisitPlansEmployees';



const AllVisitPlans = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllVisitPlansAdmin />
    }else{
      return <AllVisitPlansEmployees />
    }
  }

  return (
    <>
      { component() }
    </>
  )
}

export default AllVisitPlans;