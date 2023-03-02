
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';



const VehicleDeliveryListItem = ({handleClick}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate("/app/delivery/r355645")}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-car-front text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>Name of Customer</span> <br />
          <span> Other details about the vehicle delivery</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>Stock count</span>
      </div>
    </li>
  )
}

const AllVehicleDeliveries = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Vehicle Deliveries</h3>
          <a href='/app/delivery/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Vehicle Deliveries are listed below</p>

        <ul className='mt-5'>
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
          <VehicleDeliveryListItem />
        </ul>
      </section>
    </Layout>
  )
}

export default AllVehicleDeliveries;
