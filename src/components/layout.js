import SideBar from "./sidebar"
import InsideNav from "./insideNav"
import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { getToken, getUserData } from "../services/localStorageService";
import { useNavigate } from "react-router-dom";


const Layout = ({children}) =>{
  //const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  let userData = getUserData()
  const [sidebarTab, setSidebarTab] = useState("notifications")

  useEffect(() =>{
    let parsedUserData = JSON.parse(userData)
    if(!parsedUserData.token){
      navigate("/login")
    }
  }, [])



  return (
    <div className="container-fluid" style={{height: "100vh"}}>
      <div className="row h-100">
        <SideBar />
        <main className="col">
          <div className="row sticky-top">
            <div className="col bg-white border-bottom border-start px-0 px-lg-3 pb-">
              <InsideNav />
            </div>
          </div>
          <div className="row">
            <div className="col px-0 px-lg-3 pt-lg-3">
              <div className="bg-white rounded pb-5 mainContent" >
                {children}
              </div>
            </div>
            <div className="col-lg-auto d-none d-lg-block px-lg-0 pt-lg-3" >
              <aside className="bg-white border h-100 rounded" style={{ minWidth: "350px" }}>
                <ul className="nav nav-pills border">
                  <li className="nav-item w-50">
                    <button onClick={()=>setSidebarTab("notifications")} className={`nav-link rounded-0  ${sidebarTab === "notifications" && "border-bottom border-2 border-primary text-primary fw-bold"}`} aria-current="page" href="#">Notifications</button>
                  </li>
                  <li className="nav-item w-50">
                    <button onClick={()=>setSidebarTab("messages")} className={`nav-link rounded-0 ${sidebarTab === "messages" && "border-bottom border-2 border-primary text-primary rounded-0 fw-bold"}`} href="#">Messages</button>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </main>
        <aside>
          
        </aside>
      </div>

    </div>
  )
}

export default Layout