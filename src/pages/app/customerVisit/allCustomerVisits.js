import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllCustomerVisitsAdmin from './allCustomerVisitsAdmin';
import AllCustomerVisitsEmployee from './allCustomerVisitsEmployees';
import AllCustomerVisitsSupervisor from './allCustomerVisitsSupervisor';



const AllCustomerVisits = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllCustomerVisitsAdmin />
    }else if(staffCadre === "Supervisor"){
      return <AllCustomerVisitsSupervisor />
    }else{
      return <AllCustomerVisitsEmployee />
    }
  }

  return (
    <>
      { component() }
    </>
  )
}

export default AllCustomerVisits;