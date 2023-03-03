import { useState } from "react";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";


const styles = {
  container: {
    maxWidth: "300px"
  },
  header: {
    height: "80px"
  }
}



export const ListItem = ({title, active, icon, closeSidebar, link, pathname}) =>{



  return(
    <li>
      <a className={`d-flex align-items-center p-3 sidebarItem ${pathname.includes(link) && "activeSidebar"}`} href={link}>
        <i className={`bi ${icon} fs-4 ${closeSidebar ? "mx-auto" : "me-3"}`}></i>
        <span>{!closeSidebar && title}</span>
      </a>
    </li>
  )
}

const SideBar = () =>{
  const location = useLocation();
  const [closeSidebar, setCloseSidebar] = useState(false);
  console.log(location.pathname)
  const handleToggleSidebar = () =>{
    setCloseSidebar(prevState => !prevState)
  }


  return(
    <aside className="p-0 col d-none d-lg-block sticky-top bg-white" style={{maxWidth: closeSidebar ? "100px" : "300px"}}>
      <header style={styles.header} className="d-flex align-items-center px-3 ">
        {!closeSidebar &&
        <Fragment>
          <i className="bi bi-person-circle fs-1"></i> 
          <div className="ms-3">
            <span className="fs-6">Firstname Lastname</span><br />
            <span className="small text-secondary">Administrator</span>
          </div>
        </Fragment>}
        <button className={`btn btn-link ${closeSidebar ? "mx-auto" : "ms-auto"}`} onClick={handleToggleSidebar}>
          <i className={`bi bi-list fs-4 text-dark`}></i>
        </button>
        
      </header>
      <ul className="pb-5" style={{height: "calc(100vh - 81px)", overflow: "auto"}}>
        <ListItem title="Dashboard" link="/app/dashboard" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-bar-chart-line-fill" />
        <ListItem title="Companies" link="/app/company" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-building" />
        <ListItem title="Employees" link="/app/employee" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-person" />
        <ListItem title="Customers" link="/app/customer" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-buildings" />
        <ListItem title="Products" link="/app/product" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-car-front" />
        <ListItem title="Visit Plan" link="/app/plan" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-calendar3"  />
        <ListItem title="Customer Visits" link="/app/visit" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-calendar-check " />
        <ListItem title="Marketting Activity" link="/app/markettingActivity" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-rocket-takeoff" />
        <ListItem title="PFI Request Form" link="/app/pfiRequest" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-receipt" />
        <ListItem title="Invoice Request Form" link="/app/invoiceRequest" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-receipt-cutoff" />
        <ListItem title="Vehicle Deliveries" link="/app/delivery" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-truck-flatbed" />
        <ListItem title="Payments" link="/app/payment" pathname={location.pathname} active={false} closeSidebar={closeSidebar} icon="bi-cash" />
      </ul>
    </aside>
  )
}

export default SideBar;