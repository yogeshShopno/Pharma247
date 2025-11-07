import './App.css';
import SignUp from './componets/pre-login/SignUp';
import Login from './componets/pre-login/Login';
import Forgot from './componets/pre-login/Forgot';
import Dashboard from './dashboard/Dashboard';
import Adminprotected from './protected/AdminProtect';
import Package from './dashboard/More/Package/Package';
import Protected from './protected/Protected';
// import Purchasereturn from './dashboard/Purchase/Purchasereturn';
import SaleView from './dashboard/Sale/SaleBill/saleView/SaleView';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
// import AddPurchaseReturn from './dashboard/Purchase/AddPurchaseReturn';
import Catagory from './dashboard/More/Catagory/Catagory';
import Itemmaster from './dashboard/ItemMaster/Itemmaster';
import PurchaseView from './dashboard/Purchase/PurchaseBill/Purchase-View/Purchase_View';
import DistributerView from './dashboard/More/Distributor/Distributer-View/DistributerView';
import PurchaseList from './dashboard/Purchase/PurchaseBill/PurchaseBillList/PurchaseList';
import EditPurchaseBill from './dashboard/Purchase/PurchaseBill/Edit-PurchaseBill/EditPurchaseBill';
import ReturnList from './dashboard/Purchase/ReturnBill/ReturnList/ReturnList';
import ReturnView from './dashboard/Purchase/ReturnBill/ReturnBill-View/ReturnBill-View';
import AddReturnbill from './dashboard/Purchase/ReturnBill/Add-ReturnBill/AddReturnbill';
import SalereturnList from './dashboard/Sale/saleReturnBill/ReturnList/SalereturnList';

import InventoryView from './dashboard/Inventory/InventoryView/InventoryView';
import InventoryList from './dashboard/Inventory/InventoryList/inventoryList';
import AddPurchaseBill from './dashboard/Purchase/PurchaseBill/Add-PurchaseBill/AddPurchasebill';
import EditReturnBill from './dashboard/Purchase/ReturnBill/Edit-ReturnBill/EditReturnBill';
import PaymentList from './dashboard/Purchase/Payment/PaymentList/paymentList';
import AddDistributer from './dashboard/More/Distributor/AddDistributer/AddDistributer';
import DistributerList from './dashboard/More/Distributor/DistriubutorList/DistributorList';
import ProfileView from './dashboard/profile/ProfileView';
import CustomerList from './dashboard/More/Customer/CustomerList/CustomerList';
import DoctorList from './dashboard/More/Doctor/DoctorList/doctorList';
import DoctorView from './dashboard/More/Doctor/DoctorView/doctorView';
import Salelist from './dashboard/Sale/SaleBill/SaleList/Salelist';
import Addsale from './dashboard/Sale/SaleBill/AddSale/Addsale';
import EditSaleBill from './dashboard/Sale/SaleBill/Edit-SaleBill/EditSaleBill';
import CustomerView from './dashboard/More/Customer/CustomerList/CustomerView/CustomerView';
import SaleReturnView from './dashboard/Sale/saleReturnBill/ReturnView/SaleReturnView';
import Salereturn from './dashboard/Sale/saleReturnBill/AddReturn/AddSaleReturnbill';
import EditSaleReturn from './dashboard/Sale/saleReturnBill/EditReturn/EditSaleReturn';
import ReportsMain from './dashboard/More/Reports/ReportsMain';
import OrderList from './dashboard/OrderList/OrderList';
import CashManage from './dashboard/More/CashManagement/CashManage';
import ManageExpense from './dashboard/More/ManageExpense/manageExpenseList';
import BankAccount from './dashboard/More/BankAccounts/BankAccount';
import ItemWiseMargin from './dashboard/More/Reports/MarginReport/ItemWiseMargin';
import BillItemWiseMargin from './dashboard/More/Reports/MarginReport/BillItemWiseMargin';
import PurchaseRegister from './dashboard/More/Reports/GstReport/PurchaseRegister';
import AdjustStock from './dashboard/More/AdjustStock/AdjustStock';
import SalesRegister from './dashboard/More/Reports/GstReport/SalesRegister';
import SalesBill from './dashboard/More/Reports/GstReport/SalesBill';
import PurchaseBillReport from './dashboard/More/Reports/GstReport/PurchaseBill_Report';
import DayWiseSummary from './dashboard/More/Reports/GstReport/DayWiseSummary';
import PurchasePaymentSummary from './dashboard/More/Reports/AccountingReports/Purchase_Payment_summary';
import DoctorItemWise from './dashboard/More/Reports/Others/DoctorItemWise';
import CompanyItemWise from './dashboard/More/Reports/Others/CompanyItemWise';
import StaffWiseActivity from './dashboard/More/Reports/Others/Staff_Wise_Activity';
import SaleSummary from './dashboard/More/Reports/Others/SaleSummary';
import Inventory_Reconciliation from './dashboard/More/Reports/StockReport/Inventory_Reconciliation';
import Item_Batch_wiseStock from './dashboard/More/Reports/StockReport/Item_Batch_wiseStock';
import Non_Moving_items from './dashboard/More/Reports/StockReport/Non_Moving_Items';
import Stock_AdjustMent_Report from './dashboard/More/Reports/StockReport/Stock_AdjustMent_Report';
import Purchase_Return_Report from './dashboard/More/Reports/StockReport/Purchase_Return_Report';
import Monthly_sales_Overview from './dashboard/More/Reports/eNteligentReport/Monthly_sales_Overview';
import Top_Selling_Items from './dashboard/More/Reports/eNteligentReport/Top_Selling_Items';
import Top_Customers from './dashboard/More/Reports/eNteligentReport/Top_Customers';
import Top_Distributor from './dashboard/More/Reports/eNteligentReport/Top_Distributors';
import HsnWiseGst from './dashboard/More/Reports/GstReport/HsnWiseGst';
import Gstr1 from './dashboard/More/Reports/GstReport/Gstr1';
import Gstr_3B from './dashboard/More/Reports/GstReport/Gstr_3B';
import AboutInfo from './dashboard/profile/About/AboutInfo';
import Documents from './dashboard/profile/About/Documents';
import ReferEarn from './dashboard/profile/About/ReferEarn';
import Plans from './dashboard/profile/About/Plans';
import Password from './dashboard/profile/About/Password';
import StaffMember from './dashboard/profile/Staff-Sessions/StaffMember';
import ManageStaffRole from './dashboard/profile/Staff-Sessions/ManageStaffRole';
import Sessions from './dashboard/profile/Staff-Sessions/LogActivity';
import CreateRole from './dashboard/profile/Staff-Sessions/Create-Role/CreateRole';
import ErrorPage from './componets/ErrorPage/errorPage';
import { ProtectedComponent, ProtectedRoute } from './componets/permission';
import Company from './dashboard/More/Company/Company';
import DrugGroup from './dashboard/More/DrugGroup/DrugGroup';
import LogSessions from './dashboard/profile/Staff-Sessions/LogActivity';
import LogActivity from './dashboard/profile/Staff-Sessions/LogActivity';
import Gstr2 from './dashboard/More/Reports/GstReport/Gstr2';
import Reconciliation from './dashboard/More/Reconciliation/reconciliation';
import ReconciliationManage from './dashboard/profile/Staff-Sessions/ReconciliationManage';
import LoyaltyPoint from './dashboard/More/LoyaltyPoint/LoyaltyPoint';

import CssBaseline from '@mui/material/CssBaseline'; // Reset default styles
// import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@material-tailwind/react';
import theme from './theme';
import { useEffect } from 'react';
import OnlineOrders from './dashboard/profile/Settings/OnlineOrders';

import LoginSignup from './componets/Login/LoginSignup';
import OnlineDashboard from './OnlineOrders/OnlineDashboard';
import DrugGroupView from './dashboard/More/DrugGroup/DrugGroupView/DrugGroupView';
import TrialEnd from './componets/pre-login/TrialEnd';

function App() {
  const goFullScreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen(); // IE11
    }
  };


  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    /* ================================
          CUSTOM DIALOG SCOPED STYLES
       ================================ */
    .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212;
    }
    .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212;
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }
    .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212;
      border-width: 2px;
    }

    .MuiInputLabel-root {
      color: #3f6212;
    }
    .MuiInputLabel-root.Mui-focused {
      color: #3f6212 !important;
    }

    /* Underline (Standard TextFields) */
    .MuiInput-underline:before {
      border-bottom: 2px solid #3f6212;
    }
    .MuiInput-underline:hover:not(.Mui-disabled):before {
      border-bottom: 2px solid #3f6212;
    }
    .MuiInput-underline:after {
      border-bottom: 2px solid #3f6212;
    }

    /* Buttons */
    .custom-dialog .MuiButton-root:hover {
      background-color: #3f6212;
    }

    /* Radio checked */
    .custom-dialog .MuiRadio-root.Mui-checked {
      color: var(--color1) !important;
    }

    /* Switch checked */
    .custom-dialog .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track {
      background-color: var(--COLOR_UI_PHARMACY) !important;
    }

    /* Tabs indicator */
    .custom-dialog .MuiTabs-indicator {
      background-color: var(--color2) !important;
    }

    /* ================================
              DIALOG BASE
       ================================ */
    .custom-dialog .MuiDialog-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .custom-dialog .MuiDialog-paper {
      border-radius: 8px !important;
    }
    .custom-dialog .MuiDialogTitle-root {
      background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      font-weight: 600 !important;
      padding: 12px 16px !important;
    }
    .custom-dialog .MuiDialogActions-root {
      justify-content: flex-end !important;
      padding: 16px 24px !important;
    }

    /* ================================
        SHARED: Stock Adjustment / Expense Dialogs
       ================================ */
    .custom-dialog.modal_991 .MuiDialog-paper {
      width: 800px !important;
      max-width: 95% !important;
    }
    .custom-dialog.modal_991 .MuiButton-contained {
      background: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      box-shadow: none !important;
    }
    .custom-dialog.modal_991 .MuiButton-contained:hover {
      background: #2e520d !important;
    }
    .custom-dialog.modal_991 .MuiButton-contained.MuiButton-colorError {
      background: #F31C1C !important;
    }

    /* Inputs inside dialog */
    .custom-dialog.modal_991 .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: rgba(0,0,0,0.3);
    }
    .custom-dialog.modal_991 .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: var(--color1);
    }
    .custom-dialog.modal_991 .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: var(--color1);
    }
    .custom-dialog.modal_991 .MuiInputLabel-root.Mui-focused {
      color: var(--color1) !important;
    }

    /* Payment button */
    .custom-dialog .payment_btn_divv {
      text-transform: none !important;
      background: var(--color1) !important;
      color: white !important;
      box-shadow: none !important;
    }
    .custom-dialog .payment_btn_divv:hover {
      background: var(--color1) !important;
      opacity: 0.9 !important;
    }

    /* Autocomplete */
    .custom-dialog .custom-autocomplete .MuiInputBase-root {
      height: 20px !important;
      font-size: 1.10rem !important;
    }
    .custom-dialog .custom-autocomplete .MuiAutocomplete-inputRoot {
      padding: 10px 14px !important;
    }

    /* ================================
        CUSTOM BILL FORM STYLES
       ================================ */
    .custom-dialog .detail.custommedia .MuiOutlinedInput-root {
      width: 250px !important;
    }
    .custom-dialog .detail.custommedia .MuiInputBase-root {
      height: 40px !important;
      font-size: 1rem !important;
    }
    .custom-dialog .detail.custommedia .MuiAutocomplete-root {
      width: 100% !important;
    }
    .custom-dialog .detail.custommedia .MuiAutocomplete-inputRoot {
      padding: 10px 14px !important;
    }
      /* ================================
          ADD DISTRIBUTOR DIALOG
       ================================ */
    .add-distributor-dialog .MuiDialog-paper {
      border-radius: 8px !important;
      width: 700px !important;
      max-width: 95% !important;
    }
    .add-distributor-dialog .MuiDialogTitle-root {
     background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
    }
    .add-distributor-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }
    .add-distributor-dialog .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }
    .add-distributor-dialog .MuiInputLabel-root.Mui-focused {
      color: #3f6212 !important;
    }
    .add-distributor-dialog .MuiButton-contained {
      background: #3f6212 !important;
      color: white !important;
    }

    /* ================================
          ADD ITEM DIALOG
       ================================ */
    .add-item-dialog .MuiDialog-paper {
      border-radius: 8px !important;
      width: 700px !important;
      max-width: 95% !important;
    }
    .add-item-dialog .MuiDialogTitle-root {
      background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
    }
    .add-item-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
    .add-item-dialog .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
      .add-item-dialog .MuiOutlinedInput-root:focus .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
       /* ================================
          ADD COMPANY DIALOG
       ================================ */
    .add-company-dialog .MuiDialog-paper {
      border-radius: 8px !important;
      width: 700px !important;
      max-width: 95% !important;
    }

    .add-company-dialog .MuiDialogTitle-root {
      background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      font-weight: 600 !important;
    }

    .add-company-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }

    .add-company-dialog .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
      border-width: 2px !important;
    }

    .add-company-dialog .MuiInputLabel-root.Mui-focused {
      color: #3f6212 !important;
    }

    .add-company-dialog .MuiButton-contained {
      background: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      box-shadow: none !important;
    }

    .add-company-dialog .MuiButton-contained:hover {
      background: #2e520d !important;
    }

    .add-company-dialog .MuiButton-root[style*="F31C1C"] {
      background: #F31C1C !important;
      color: white !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);




  return (
    <div className="App">

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Router>
          <Switch>
            <Route path='/trial-end'>
              <TrialEnd />
            </Route>
             <Route path='/trial-ends'>
              <SubscriptionModal />
            </Route>

            <Route exact path='/'>
              <LoginSignup />
            </Route>
            <Route path='/Register/:referralCode'>
              <LoginSignup />
            </Route>
            <Route path='/Register'>
              <LoginSignup />
            </Route>
            <Route path='/login/:referralCode'>
              <LoginSignup />
            </Route>
            <Route path='/login'>
              <LoginSignup />
            </Route>
            <Route path='/forgotPassword'>
              <Forgot />
            </Route>
            <Route path='/admindashboard'>
              <Protected>
                <Dashboard />
              </Protected>
              <Adminprotected />
            </Route>
            <Route path='/onlinedashboard'>
              <Protected>
                <OnlineDashboard />
              </Protected>
              <Adminprotected />
            </Route>
            <Route path='/itemmaster'>
              <Protected>
                <Itemmaster />
              </Protected>
            </Route>
            <Route path='/inventory'>
              <Protected>
                <InventoryList />
              </Protected>
            </Route>
            <Route path='/inventoryView/:id'>
              <Protected>
                <InventoryView />
              </Protected>
            </Route>
            <Route path='/more/catagory'>
              <Protected>
                <Catagory />
              </Protected>
            </Route>
            <Route path='/more/package'>
              <Protected>
                <Package />
              </Protected>
            </Route>
            <Route path='/more/customer'>
              <Protected>
                <CustomerList />
              </Protected>
            </Route>
            <Route path='/more/customerView/:id'>
              <Protected>
                <CustomerView />
              </Protected>
            </Route>
            <Route path='/more/doctors'>
              <Protected>
                <DoctorList />
              </Protected>
            </Route>
            <Route path='/more/doctor/:id'>
              <Protected>
                <DoctorView />
              </Protected>
            </Route>
            <Route path='/more/addDistributer'>
              <Protected>
                <AddDistributer />
              </Protected>
            </Route>
            <Route path='/more/DistributorList'>
              <Protected>
                <DistributerList />
              </Protected>
            </Route>
            <Route path='/more/reconciliation'>
              <Protected>
                <Reconciliation />
              </Protected>
            </Route>
            <Route path='/more/loyaltypoints'>
              <Protected>
                <LoyaltyPoint />
              </Protected>
            </Route>
            <Route path='/Resports'>
              <ReportsMain />
            </Route>
            <Route path='/DistributerView/:id'>
              <Protected>
                <DistributerView />
              </Protected>
            </Route>
            <Route path='/purchase/paymentList'>
              <Protected>
                <PaymentList />
              </Protected>
            </Route>
            <Route path='/purchase/purchasebill'>
              <Protected>
                <PurchaseList />
              </Protected>
            </Route>
            <Route path='/purchase/view/:id'>
              <Protected>
                <PurchaseView />
              </Protected>
            </Route>
            <Route path='/purchase/edit/:id/:randomNumber'>
              <Protected>
                <EditPurchaseBill />
              </Protected>
            </Route>
            <Route path='/purchase/return'>
              <Protected>
                <ReturnList />
              </Protected>
            </Route>
            <Route path='/return/view/:id'>
              <Protected>
                <ReturnView />
              </Protected>
            </Route>
            <Route path='/return/edit/:id'>
              <Protected>
                <EditReturnBill />
              </Protected>
            </Route>
            <Route path='/purchase/return'>
              <Protected>
                <ReturnList />
              </Protected>
            </Route>

            <Route path='/purchase/addPurchaseBill'>
              <Protected>
                <AddPurchaseBill />
              </Protected>
            </Route>
            <Route path='/return/add'>
              <Protected>
                <AddReturnbill />
              </Protected>
            </Route>
            {/* <Route path='/purchase/purchasereturn'>
              <Purchasereturn />
            </Route> */}
            {/* <Route path='/purchase/addPurchaseReturn'>
              <Protected>
                <AddPurchaseReturn />
              </Protected>
            </Route> */}
            <Route path='/salelist'>
              <Salelist />
            </Route>
            <Route path='/addsale'>
              <Addsale />
            </Route>
            <Route path='/salebill/view/:id'>
              <SaleView />
            </Route>
            <Route path='/salebill/edit/:id/:randomNumber'>
              <EditSaleBill />
            </Route>
            <Route path='/saleReturn/list'>
              <SalereturnList />
            </Route>
            <Route path='/saleReturn/Add'>
              <Salereturn />
            </Route>
            <Route path='/SaleReturn/View/:id'>
              <SaleReturnView />
            </Route>
            <Route path='/SaleReturn/Edit/:id'>
              <EditSaleReturn />
            </Route>
            <Route path='/profile'>
              <ProfileView />
            </Route>
            <Route path='/OrderList'>
              <OrderList />
            </Route>
            <Route path='/more/Cashmanagement'>
              <CashManage />
            </Route>

            <Route path='/more/expense-manage'>
              <Protected>
                <ManageExpense />
              </Protected>
            </Route>
            <Route path='/more/BankAccountdetails'>
              <Protected>
                <BankAccount />
              </Protected>
            </Route>
            <Route path='/Report/margin-report/item-wise'>
              <Protected>
                <ItemWiseMargin />
              </Protected>
            </Route>
            <Route path='/Report/margin-report/bill-item-wise-margin'>
              <Protected>
                <BillItemWiseMargin />
              </Protected>
            </Route>
            <Route path='/Reports/gst-purchase-register'>
              <Protected>
                <PurchaseRegister />
              </Protected>
            </Route>
            <Route path='/Reports/gst-purchase-bills'>
              <Protected>
                <PurchaseBillReport />
              </Protected>
            </Route>

            <Route path='/Reports/gst-sales-register'>
              <Protected>
                <SalesRegister />
              </Protected>
            </Route>
            <Route path='/Reports/gst-sales-bills'>
              <Protected>
                <SalesBill />
              </Protected>
            </Route>
            <Route path='/Reports/gst-hsn-wise'>
              <Protected>
                <HsnWiseGst />
              </Protected>
            </Route>
            <Route path='/Reports/gst-GSTR1'>
              <Protected>
                <Gstr1 />
              </Protected>
            </Route>
            <Route path='/Reports/gst-GSTR2'>
              <Protected>
                <Gstr2 />
              </Protected>
            </Route>
            <Route path='/Reports/gst-GSTR-3B'>
              <Protected>
                <Gstr_3B />
              </Protected>
            </Route>
            <Route path='/Reports/day-wise-summary'>
              <Protected>
                <DayWiseSummary />
              </Protected>
            </Route>
            <Route path='/Reports/account-purchase-payment-summary'>
              <Protected>
                <PurchasePaymentSummary />
              </Protected>
            </Route>
            <Route path='/Reports/others-item-doctor-wise'>
              <Protected>
                <DoctorItemWise />
              </Protected>
            </Route>
            <Route path='/Reports/others-company-items-analysis'>
              <Protected>
                <CompanyItemWise />
              </Protected>
            </Route>
            <Route path='/Reports/others-staff-wise-activity-summary'>
              <Protected>
                <StaffWiseActivity />
              </Protected>
            </Route>
            <Route path='/Reports/others-sales-summary-report'>
              <Protected>
                <SaleSummary />
              </Protected>
            </Route>
            <Route path='/Reports/stock-purchase-return-report'>
              <Protected>
                <Purchase_Return_Report />
              </Protected>
            </Route>
            <Route path='/Reports/stock-inventory-reconciliation'>
              <Protected>
                <Inventory_Reconciliation />
              </Protected>
            </Route>
            <Route path='/Reports/stock-item-batchwise'>
              <Protected>
                <Item_Batch_wiseStock />
              </Protected>
            </Route>
            <Route path='/Reports/stock-non-moving'>
              <Protected>
                <Non_Moving_items />
              </Protected>
            </Route>
            <Route path='/Reports/stock-stock-adjustment'>
              <Protected>
                <Stock_AdjustMent_Report />
              </Protected>
            </Route>
            <Route path='/Reports/monthly-sales-overview'>
              <Protected>
                <Monthly_sales_Overview />
              </Protected>
            </Route>
            <Route path='/Reports/top-selling-items'>
              <Protected>
                <Top_Selling_Items />
              </Protected>
            </Route>
            <Route path='/Reports/top-customers'>
              <Protected>
                <Top_Customers />
              </Protected>
            </Route>
            <Route path='/Reports/top-distributors'>
              <Protected>
                <Top_Distributor />
              </Protected>
            </Route>
            <Route path='/about-info'>
              <Protected>
                <AboutInfo />
              </Protected>
            </Route>
            <Route path='/documents'>
              <Protected>
                <Documents />
              </Protected>
            </Route>
            <Route path='/plans'>
              <Protected>
                <Plans />
              </Protected>
            </Route>
            <Route path='/refer&earn'>
              <Protected>
                <ReferEarn />
              </Protected>
            </Route>
            <Route path='/password'>
              <Protected>
                <Password />
              </Protected>
            </Route>
            <Route path='/Staff-sessions/staff-member'>
              <Protected>
                <StaffMember />
              </Protected>
            </Route>
            <Route path='/Staff-sessions/manage-staffrole'>
              <Protected>
                <ManageStaffRole />
              </Protected>
            </Route>
            <Route path='/Staff-sessions/reconciliation-manage'>
              <Protected>
                <ReconciliationManage />
              </Protected>
            </Route>
            <Route path='/Staff-sessions/sessions'>
              <Protected>
                <Sessions />
              </Protected>
            </Route>
            <Route path='/settings/online-orders'>
              <Protected>
                <OnlineOrders />
              </Protected>
            </Route>
            <Route path='/add-roles'>
              <Protected>
                <CreateRole />
              </Protected>
            </Route>
            <Route path='/edit-role/:id'>
              <Protected>
                <CreateRole />
              </Protected>
            </Route>
            <Route path='/errorPage'>
              <ErrorPage />
            </Route>
            <Route path='/more/company'>
              <Company />
            </Route>
            <Route path='/more/drug-group'>
              <DrugGroup />
            </Route>
            <Route path='/more/drugGroupView/:id'>
              <DrugGroupView />
            </Route>
            <Route path='/more/adjust-stock'>
              <Protected>
                <AdjustStock />
              </Protected>
            </Route>
            <Route path='/Staff-sessions/sessions'>
              <LogActivity />
            </Route>
            <Route path='*'>
              <ErrorPage />
            </Route>
            {/* <Route path='/mehul'>
            <AddPurchaseReturn />
          </Route> */}
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;