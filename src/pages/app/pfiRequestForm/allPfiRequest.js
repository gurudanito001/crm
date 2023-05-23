import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllPfiRequestsAdmin from './allPfiRequestsAdmin';
import AllPfiRequestsEmployee from './allPfiRequestsEmployees';
import AllPfiRequestsSupervisor from './allPfiRequestsSupervisor';



const AllPfiRequests = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllPfiRequestsAdmin />
    }else if(staffCadre === "Supervisor"){
      return <AllPfiRequestsSupervisor />
    }else{
      return <AllPfiRequestsEmployee />
    }
  }

  return (
    <>
      { component() }
    </>
  )
}

export default AllPfiRequests;