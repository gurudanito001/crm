import SideBar from "./sidebar"
import InsideNav from "./insideNav"
import React from "react"


const Layout = ({children}) =>{

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
              <aside className="bg-white border h-100 rounded" style={{minWidth: "350px"}}>
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