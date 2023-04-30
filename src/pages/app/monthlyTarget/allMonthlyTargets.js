import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllMonthlyTargetsAdmin from './allMonthlyTargetsAdmin';
import AllMonthlyTargetsEmployees from './allMonthlyTargetsEmployees';



const AllMonthlyTargets = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllMonthlyTargetsAdmin />
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