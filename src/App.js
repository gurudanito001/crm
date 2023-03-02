import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/app/dashboard/dashboard';
import Login from './pages/auth/login';
import VerifyEmail from './pages/auth/verifyEmail';
import ForgotPassword from './pages/auth/forgotPassword';
import ResetPassword from './pages/auth/resetPassword';

import AddCompany from './pages/app/company/addCompany';
import AllCompanies from './pages/app/company/allCompanies';
import CompanyDetails from './pages/app/company/companyDetails';

import AddEmployee from './pages/app/employee/addEmployee';
import AllEmployees from './pages/app/employee/allEmployees';
import EmployeeDetails from './pages/app/employee/employeeDetails';


import AddCustomer from './pages/app/customer/addCustomer';
import AllCustomers from './pages/app/customer/allCustomers';
import CustomerDetails from './pages/app/customer/customerDetails';

import AddCustomerVisit from './pages/app/customerVisit/addCustomerVisit';
import AllCustomerVisits from './pages/app/customerVisit/allCustomerVisits';
import CustomerVisitDetails from './pages/app/customerVisit/customerVisitDetails';

import AddProduct from './pages/app/product/addProduct';
import AllProducts from './pages/app/product/allProducts';
import ProductDetails from './pages/app/product/productDetails';

import AddInvoiceRequest from './pages/app/invoiceRequestForm/addInvoiceRequest';
import AllInvoiceRequests from './pages/app/invoiceRequestForm/allInvoiceRequests';
import InvoiceRequestDetails from './pages/app/invoiceRequestForm/InvoiceRequestDetails';

import AddPayment from './pages/app/payment/addPayment';
import AllPayments from './pages/app/payment/allPayments';
import PaymentDetails from './pages/app/payment/paymentDetails';

import AddMarkettingActivity from './pages/app/markettingActivity/addMarkettingActivity';
import AllMarkettingActivities from './pages/app/markettingActivity/allMarkettingActivities';
import MarkettingActivityDetails from './pages/app/markettingActivity/markettingActivityDetails';

import AddPfiRequest from './pages/app/pfiRequestForm/addPfiRequest';
import AllPfiRequests from './pages/app/pfiRequestForm/allPfiRequest';
import PfiRequestDetails from './pages/app/pfiRequestForm/pfiRequestDetails';

import AddVisitPlan from './pages/app/visitPlan/addVisitPlan';
import AllVisitPlans from './pages/app/visitPlan/allVisitPlans';
import VisitPlanDetails from './pages/app/visitPlan/visitPlanDetails';

import AddVehicleDelivery from './pages/app/vehicleDelivery/addVehicleDelivery';
import AllVehicleDeliveries from './pages/app/vehicleDelivery/allVehicleDeliveries';
import VehicleDeliveryDetails from './pages/app/vehicleDelivery/vehicleDeliveryDetails';



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/" element={<Dashboard />} />

          <Route path="/app/company/" element={<AllCompanies />} />
          <Route path="/app/company/add" element={<AddCompany />} />
          <Route path="/app/company/:id" element={<CompanyDetails />} />

          <Route path="/app/employee/" element={<AllEmployees />} />
          <Route path="/app/employee/add" element={<AddEmployee />} />
          <Route path="/app/employee/:id" element={<EmployeeDetails />} />

          <Route path="/app/customer/" element={<AllCustomers />} />
          <Route path="/app/customer/add" element={<AddCustomer />} />
          <Route path="/app/customer/:id" element={<CustomerDetails />} />

          <Route path="/app/visit/" element={<AllCustomerVisits />} />
          <Route path="/app/visit/add" element={<AddCustomerVisit />} />
          <Route path="/app/visit/:id" element={<CustomerVisitDetails />} />

          <Route path="/app/product/" element={<AllProducts />} />
          <Route path="/app/product/add" element={<AddProduct />} />
          <Route path="/app/product/:id" element={<ProductDetails />} />

          <Route path="/app/invoiceRequest/" element={<AllInvoiceRequests />} />
          <Route path="/app/invoiceRequest/add" element={<AddInvoiceRequest />} />
          <Route path="/app/invoiceRequest/:id" element={<InvoiceRequestDetails />} />

          <Route path="/app/payment/" element={<AllPayments />} />
          <Route path="/app/payment/add" element={<AddPayment />} />
          <Route path="/app/payment/:id" element={<PaymentDetails />} />

          <Route path="/app/markettingActivity/" element={<AllMarkettingActivities />} />
          <Route path="/app/markettingActivity/add" element={<AddMarkettingActivity />} />
          <Route path="/app/markettingActivity/:id" element={<MarkettingActivityDetails />} />

          <Route path="/app/pfiRequest/" element={<AllPfiRequests />} />
          <Route path="/app/pfiRequest/add" element={<AddPfiRequest />} />
          <Route path="/app/pfiRequest/:id" element={<PfiRequestDetails />} />

          <Route path="/app/plan/" element={<AllVisitPlans />} />
          <Route path="/app/plan/add" element={<AddVisitPlan />} />
          <Route path="/app/plan/:id" element={<VisitPlanDetails />} />

          <Route path="/app/delivery/" element={<AllVehicleDeliveries />} />
          <Route path="/app/delivery/add" element={<AddVehicleDelivery />} />
          <Route path="/app/delivery/:id" element={<VehicleDeliveryDetails />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
