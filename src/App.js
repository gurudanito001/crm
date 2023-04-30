import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/app/dashboard/dashboard';
import Login from './pages/auth/login';
import VerifyEmail from './pages/auth/verifyEmail';
import ForgotPassword from './pages/auth/forgotPassword';
import ResetPassword from './pages/auth/resetPassword';

import AddCompany from './pages/app/company/addCompany';
import AllCompanies from './pages/app/company/allCompanies';
import CompanyDetails from './pages/app/company/companyDetails';

import AddState from './pages/app/state/addState';
import AllStates from './pages/app/state/allStates';

import AddBranch from './pages/app/branch/addBranch';
import AllBranches from './pages/app/branch/allBranches';
import BranchDetails from './pages/app/branch/branchDetails';

import AddLga from './pages/app/lga/addLga';
import AllLgas from './pages/app/lga/allLgas';

import AddEmployee from './pages/app/employee/addEmployee';
import AllEmployees from './pages/app/employee/allEmployees';
import EmployeeDetails from './pages/app/employee/employeeDetails';

import AddCustomer from './pages/app/customer/addCustomer';
import AllCustomers from './pages/app/customer/allCustomers';
import CustomerDetails from './pages/app/customer/customerDetails';

import AddContactPerson from './pages/app/contactPerson/addContactPerson';
import ContactPersonDetails from './pages/app/contactPerson/contactPersonDetails';

import ScheduleCustomerVisit from './pages/app/customerVisit/scheduleCustomerVisit';
import ReportCustomerVisit from './pages/app/customerVisit/reportCustomerVisit';
import AllCustomerVisits from './pages/app/customerVisit/allCustomerVisits';
import CustomerVisitDetails from './pages/app/customerVisit/customerVisitDetails';

import AddProductGroup from './pages/app/productGroup/addProductGroup';
import AllProductGroups from './pages/app/productGroup/allProductGroups';
import ProductGroupDetails from './pages/app/productGroup/productGroupDetails';

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

import AddWeeklyVisitPlan from './pages/app/visitPlan/addWeeklyVisitPlan';
import AddMonthlyVisitPlan from './pages/app/visitPlan/addMonthlyVisitPlan';
import AllVisitPlans from './pages/app/visitPlan/allVisitPlans';
import VisitPlanDetails from './pages/app/visitPlan/visitPlanDetails';

import AddVehicleDelivery from './pages/app/vehicleDelivery/addVehicleDelivery';
import AllVehicleDeliveries from './pages/app/vehicleDelivery/allVehicleDeliveries';
import VehicleDeliveryDetails from './pages/app/vehicleDelivery/vehicleDeliveryDetails';

import AddMonthlyTarget from './pages/app/monthlyTarget/addMonthlyTarget';
import AllMonthlyTargets from './pages/app/monthlyTarget/allMonthlyTargets';
import MonthlyTargetDetails from './pages/app/monthlyTarget/monthlyTargetDetails';

import AddSalesInvoice from './pages/app/salesInvoice/addSalesInvoice';
import AllSalesInvoice from './pages/app/salesInvoice/allSalesInvoice';
import SalesInvoiceDetails from './pages/app/salesInvoice/salesInvoiceDetials';

import AlertNotification from './components/notifications';







function App() {
  return (
    <>
      <AlertNotification />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/" element={<Dashboard />} />
          <Route path="/app/dashboard" element={<Dashboard />} />

          <Route path="/app/state" element={<AllStates />} />
          <Route path="/app/state/add" element={<AddState />} />

          <Route path="/app/lga" element={<AllLgas />} />
          <Route path="/app/lga/add" element={<AddLga />} />

          <Route path="/app/company" element={<AllCompanies />} />
          <Route path="/app/company/add" element={<AddCompany />} />
          <Route path="/app/company/:id" element={<CompanyDetails />} />

          {/* <Route path="/app/company/branch" element={<AllBranches />} /> */}
          <Route path="/app/company/branch/add" element={<AddBranch />} />
          <Route path="/app/company/branch/:id" element={<BranchDetails />} />

          <Route path="/app/employee/" element={<AllEmployees />} />
          <Route path="/app/employee/add" element={<AddEmployee />} />
          <Route path="/app/employee/:id" element={<EmployeeDetails />} />

          <Route path="/app/customer/" element={<AllCustomers />} />
          <Route path="/app/customer/add" element={<AddCustomer />} />
          <Route path="/app/customer/:id" element={<CustomerDetails />} />

          <Route path="/app/customer/contactPerson/add" element={<AddContactPerson />} />
          <Route path="/app/customer/contactPerson/:id" element={<ContactPersonDetails />} />

          <Route path="/app/visit/" element={<AllCustomerVisits />} />
          <Route path="/app/visit/:id" element={<CustomerVisitDetails />} />
          <Route path="/app/visit/schedule" element={<ScheduleCustomerVisit />} />
          <Route path="/app/visit/report" element={<ReportCustomerVisit />} />
          

          <Route path="/app/prodGroup" element={<AllProductGroups />} />
          <Route path="/app/prodGroup/add" element={<AddProductGroup />} />
          <Route path="/app/prodGroup/:id" element={<ProductGroupDetails />} />

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
          <Route path="/app/plan/weekly/add" element={<AddWeeklyVisitPlan />} />
          <Route path="/app/plan/monthly/add" element={<AddMonthlyVisitPlan />} />
          <Route path="/app/plan/:type/:id" element={<VisitPlanDetails />} />

          <Route path="/app/delivery/" element={<AllVehicleDeliveries />} />
          <Route path="/app/delivery/add" element={<AddVehicleDelivery />} />
          <Route path="/app/delivery/:id" element={<VehicleDeliveryDetails />} />

          <Route path="/app/targetAchievements" element={<AllMonthlyTargets />} />
          <Route path="/app/targetAchievements/add" element={<AddMonthlyTarget />} />
          <Route path="/app/targetAchievements/:id" element={<MonthlyTargetDetails />} />

          <Route path="/app/salesInvoice" element={<AllSalesInvoice />} /> 
          <Route path="/app/salesInvoice/add" element={<AddSalesInvoice />} />
          <Route path="/app/salesInvoice/:id" element={<SalesInvoiceDetails />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
