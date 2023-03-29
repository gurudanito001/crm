import ProfilePic from "../images/profile-pic.png"
import { ListItem } from "./sidebar";
import { useLocation } from "react-router-dom";
import { logout } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const InsideNav = () => {
  const location = useLocation();
  let dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="navbar bg-white py-3" style={{ height: "80px" }}>
      <div className="container-fluid d-flex px-0 px-lg-3">
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <button className="btn btn-link dropdown-toggle sidebarDropdown shadow-none text-dark d-lg-none" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"><i className={`bi bi-list fs-4 `}></i></button>
            <ul className="dropdown-menu border pb-5" aria-labelledby="dropdownMenuLink" style={{ minWidth: "300px", marginTop: "18px", height: "calc(100vh - 150px)", overflow: "auto" }}>
              <ListItem title="Dashboard" link="/app/dashboard" pathname={location.pathname} active={false} icon="bi-bar-chart-line-fill" />
              {/* <ListItem title="States" link="/app/state" pathname={location.pathname} active={false}  icon="bi-globe-europe-africa" /> */}
              <ListItem title="Branches" link="/app/branch" pathname={location.pathname} active={false} icon="bi-house-fill" />
              {/* <ListItem title="Local Govt Areas" link="/app/lga" pathname={location.pathname} active={false} icon="bi-pin-map-fill" /> */}

              <ListItem title="Companies" link="/app/company" pathname={location.pathname} active={false} icon="bi-building" />
              <ListItem title="Employees" link="/app/employee" pathname={location.pathname} active={false} icon="bi-person-circle" />
              <ListItem title="Customers" link="/app/customer" pathname={location.pathname} active={false} icon="bi-buildings" />
              <ListItem title="Products" link="/app/product" pathname={location.pathname} active={false} icon="bi-car-front" />
              <ListItem title="Visit Plan" link="/app/plan" pathname={location.pathname} active={false} icon="bi-calendar3" />
              <ListItem title="Customer Visits" link="/app/visit" pathname={location.pathname} active={false} icon="bi-calendar-check " />
              <ListItem title="Marketting Activity" link="/app/markettingActivity" pathname={location.pathname} active={false} icon="bi-rocket-takeoff" />
              <ListItem title="PFI Request Form" link="/app/pfiRequest" pathname={location.pathname} active={false} icon="bi-receipt" />
              <ListItem title="Invoice Request Form" link="/app/invoiceRequest" pathname={location.pathname} active={false} icon="bi-receipt-cutoff" />
              <ListItem title="Vehicle Deliveries" link="/app/delivery" pathname={location.pathname} active={false} icon="bi-truck-flatbed" />
              <ListItem title="Payments" link="/app/payment" pathname={location.pathname} active={false} icon="bi-cash" />
            </ul>
          </div>

          <span className="navbar-brand">KCG-CRM</span>
        </div>

        <div className="d-flex align-items-center ms-auto">
          <i className="bi bi-envelope fs-5 px-2"></i>
          <i className="bi bi-bell fs-5 px-2 border-end"></i>
          <div className="dropdown">
            <button className="btn btn-link text-dark dropdown-toggle px-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img width="25px" src={ProfilePic} alt="Profile" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" href="#">View Profile</button></li>
              <li><button className="dropdown-item" href="#" onClick={()=>{
                dispatch(logout())
                navigate("/login")
                }}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default InsideNav;