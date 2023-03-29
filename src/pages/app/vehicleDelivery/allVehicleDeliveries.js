
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../services/apiService';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from '../../../components/spinner';



const VehicleDeliveryListItem = ({id, customerName, customerAddress, quantityDelivered}) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate(`/app/delivery/${id}`)}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-truck-flatbed text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>{customerName}</span> <br />
          <span>{customerAddress}</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small fw-bold ms-auto'>{quantityDelivered} Delivered</span>
      </div>
    </li>
  )
}

const AllVehicleDeliveries = () => {

  const vehicleDeliveryQuery = useQuery({
    queryKey: ["allVehicleDeliveries"],
    queryFn: () => apiGet({url: "/vehicleDelivery"}).then( (res) => res.payload)
  })

  const listVehicleDeliveries = () =>{
    return vehicleDeliveryQuery.data.map( vehicleDelivery => <VehicleDeliveryListItem 
      id={vehicleDelivery.id}
      key={vehicleDelivery.id}
      customerName={vehicleDelivery.customerName}
      customerAddress={vehicleDelivery.customerAddress}
      quantityDelivered={vehicleDelivery.quantityDelivered}
    />)
  }



  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All Vehicle Deliveries</h3>
          <a href='/app/delivery/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All Vehicle Deliveries are listed below</p>

        {vehicleDeliveryQuery.isLoading && <div className='mt-5 text-center h5 fw-bold text-secondary'>
            Fetching Vehicle Deliveries <Spinner />
        </div>}

        <ul className='mt-5'>
        {!vehicleDeliveryQuery.isLoading && !vehicleDeliveryQuery.isError && listVehicleDeliveries()}

        {!vehicleDeliveryQuery.isLoading && !vehicleDeliveryQuery.isError && vehicleDeliveryQuery?.data?.length === 0 && 
          <div className='bg-light rounded border border-secondary p-5'>
              <p className='h6 fw-bold'>No Vehicle Delivery was found !!</p>
              <span className='text-info'>Click the [+Add] button to add a new Vehicle Delivery</span>
          </div>}
        </ul>
      </section>
    </Layout>
  )
}

export default AllVehicleDeliveries;
