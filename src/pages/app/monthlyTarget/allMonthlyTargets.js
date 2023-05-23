import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllMonthlyTargetsAdmin from './allMonthlyTargetsAdmin';
import AllMonthlyTargetsEmployees from './allMonthlyTargetsEmployees';
import AllMonthlyTargetsSupervisor from './allMonthlyTargetsSupervisor';



const AllMonthlyTargets = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllMonthlyTargetsAdmin />
    }else if(staffCadre === "Supervisor"){
      return <AllMonthlyTargetsSupervisor />
    }else{
      return <AllMonthlyTargetsEmployees />
    }
  }

  return (
    <>
      { component() }
    </>
  )
}

export default AllMonthlyTargets;