import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllVisitPlansAdmin from './allVisitPlansAdmin';
import AllVisitPlansEmployees from './allVisitPlansEmployees';
import AllVisitPlansSupervisor from './allVisitPlansSupervisor';



const AllVisitPlans = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllVisitPlansAdmin />
    }else if(staffCadre === "Supervisor"){
      return <AllVisitPlansSupervisor />
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