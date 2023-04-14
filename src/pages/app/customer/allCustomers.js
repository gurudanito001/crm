
import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllCustomersAdmin from './allCustomersAdmin';
import AllCustomersEmployees from './allCustomersEmployees';





const AllCustomers = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllCustomersAdmin />
    }else{
      return <AllCustomersEmployees />
    }
  }

  return (
    <>
      { component() }
    </>
  )
}

export default AllCustomers;