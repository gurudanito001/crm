
import '../../../styles/auth.styles.css';
import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from 'react-router-dom';


interface PfiRequestListItemProps {
  handleClick?: ()=>void
}
const PfiRequestListItem = ({handleClick}: PfiRequestListItemProps) =>{
  const navigate = useNavigate()
  return(
    <li className='d-flex border-bottom py-3 listItem' onClick={()=>navigate("/app/pfiRequest/r355645")}>
      <div className='w-75 d-flex align-items-center pe-2'>
        <span className='bgPurple p-3 me-3'><i className="bi bi-car-front text-white fs-5"></i></span>
        <article>
          <span className='h6 fw-bold'>Name of PFI Request</span> <br />
          <span> Other details about the product</span>
        </article>
      </div>
      <div className='w-25 d-flex align-items-center'>
        <span className='small'>Stock count</span>
      </div>
    </li>
  )
}


const AllPfiRequests = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <Layout>
      <section className="px-3 py-5 p-lg-5" style={{ maxWidth: "700px" }}>
        <header className="d-flex align-items-center">
          <h3 className='fw-bold me-auto'>All PFI Requests</h3>
          <a href='/app/pfiRequest/add' className='btn btnPurple d-flex align-items-center mx-0 px-3'><i className="bi bi-plus"></i>Add </a>
        </header>
        <p>All PFI Requests are listed below</p>

        <ul className='mt-5'>
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
          <PfiRequestListItem />
        </ul>
      </section>
    </Layout>

  )
}

export default AllPfiRequests;