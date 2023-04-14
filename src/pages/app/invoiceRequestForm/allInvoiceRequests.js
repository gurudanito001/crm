import '../../../styles/auth.styles.css';
import { getUserData } from '../../../services/localStorageService';
import AllInvoiceRequestsAdmin from './allInvoiceRequestsAdmin';
import AllInvoiceRequestsEmployees from './allInvoiceRequestsEmployees';



const AllInvoiceRequests = () => {
  const {staffCadre} = getUserData();

  let component = () =>{
    if(staffCadre === "Administrator"){
      return <AllInvoiceRequestsAdmin />
    }else{
      return <AllInvoiceRequestsEmployees />
    }
  }

  return (
    <>
      { component() }
    </>
  )
}

export default AllInvoiceRequests;