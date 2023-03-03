import Music from "../../../images/music.svg";
import Health from "../../../images/health.svg";
import Family from "../../../images/family.svg";
import Travel from "../../../images/travel.svg";
import Technology from "../../../images/technology.svg";
import Food from "../../../images/food.svg";
import Education from "../../../images/education.svg";
import Automobile from "../../../images/automobile.svg";
import Business from "../../../images/business.svg";
import Finance from "../../../images/finance.svg";

import { useState } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";






const styles = {
  cardContainer: {
    maxWidth: "800px",
    border: "1px solid white"
  },
  card: {
    width: "160px",
    height: "132px",
    borderRadius: "20px",
    boxShadow: "1px 5px 5px 7px #c586fc11 "/*  #840cee */
  }

}
const DashboardCard = ({ amount, title }) => {
  return <figure style={styles.card} className="d-inline-flex flex-column mx-auto my-4 align-items-center">
    <span className="fs-2 mt-auto fw-bold">{amount}</span>
    <figcaption className="mb-auto mt-3">{title}</figcaption>
  </figure>
}


const Dashboard = () => {
  return (
    <Layout>
      <main style={styles.cardContainer} className="py-5 mx-auto">

        <div className="d-flex flex-wrap">
          <DashboardCard amount={25} title="Total Customers" />
          <DashboardCard amount={25} title="Total Visits" />
          <DashboardCard amount={25} title="Total Visit Reports" />
          <DashboardCard amount={25} title="Total Companies" />
          <DashboardCard amount={25} title="Total Invoice Requests" />
          <DashboardCard amount={25} title="Total Products" />
          <DashboardCard amount={25} title="Total Payments" />
          <DashboardCard amount={25} title="Total Employees" />
        </div>

      </main>

    </Layout>
  )
}

export default Dashboard