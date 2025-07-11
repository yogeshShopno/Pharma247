import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header";
import { Box } from "@mui/material";
import ProfileView from "../ProfileView";
import { useEffect, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { format, subDays, addYears } from "date-fns";
import { Button } from "@mui/material";
import Loader from "../../../componets/loader/Loader"

const Plans = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [togglePage, setTogglePage] = useState(true);
  const [plansDetails, setPlansDetails] = useState([]);
  const [tableData, setTableData] = useState([]);

  /*<============================================================================== Plans column ==============================================================================> */

  const plansColumns = [
    { id: "email", label: "email", minWidth: 150 },
    { id: "description", label: "description", minWidth: 150 },
    { id: "amount", label: "amount", minWidth: 150 },
    { id: "paid_on", label: "paid_on", minWidth: 150 },
    { id: "method", label: "Payment Mode", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 150 },
  ];

  useEffect( () =>  {
    if(togglePage){
      getPlan()
    }
  },[togglePage]);

  /*<=========================================================== get various dynamic plans details  to render table ===========================================================> */

  const getPlan = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("list-plan?", {}, {
      
      });

      if (response.status == 200) {
        setPlansDetails(response.data.data);
        setIsLoading(false);
      }
      getPurchaseHistory()
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);

    }
  };

/*<====================================================================== Call razorpay API to get payment ======================================================================> */

  const loadRazorpay = async (plan) => {
    console.log(plan.annual_price, "plan");
    try {
      const key = "rzp_test_qp5ViSvdWQsuNd";
      const name = localStorage.getItem("UserName");
      const contact = localStorage.getItem("contact");
      const email = localStorage.getItem("email");

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        if (!key) {
          toast.error("Payment key not available");
          return;
        }
        // const remainingTime = Math.floor((timer - Date.now()) / 1000);

        // console.log(remainingTime);
        const options = {
          key: key, // Use the fetched key
          amount: Number(plan.annual_price) * 100, // Razorpay expects the amount in paise
          currency: "INR",
          name: "pharma 24*7",
          description: plan.name,
          image: "pharmalogo.webp",
          planId: plan.id,

          handler: function (response) {
            submitPlan(response.razorpay_payment_id, plan.annual_price);
          },
          prefill: {
            name: name,
            contact: contact,
            email: email,
          },
          theme: {
            color: "#628a2f",
          },
          modal: {
            // On modal close
            ondismiss: function () {
              rzp.close();
            },
          },
          timeout: 300, // Razorpay expects timeout in seconds
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      // Append the Razorpay script to the document body
      document.body.appendChild(script);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch payment key"
      );
    }
  };

  /*<========================================================= call backend API to store plans Details after getting success response frm razorpay ====================================> */

  const submitPlan = async (PaymentId, amount) => {
    console.log(PaymentId, "PaymentId");
    let data = new FormData();
    data.append("payment_id", PaymentId);
    data.append("payment_date", format(new Date(), "yyyy-MM-dd"));
    data.append("expiry_date", format(addYears(new Date(), 1), "yyyy-MM-dd"));
    data.append("user_id", localStorage.getItem("userId"));
    data.append("plan_name", PaymentId);
    data.append("amount", amount);
    data.append("user_name", localStorage.getItem("UserName"));
    data.append("contact", localStorage.getItem("contact"));
    data.append("email", localStorage.getItem("email"));

    try {
      setIsLoading(true);
      const response = await axios.post("payment-details-store?", data, {
        header: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        console.log(response.data.data);
        getPurchaseHistory();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
    }
  };

  /*<====================================================================== get plans purchase history to render table ================================================================> */


  const getPurchaseHistory = async () => {
   
    try {
      const response = await axios.get("payment-history?",{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        setTableData(response.data.data);
      setIsLoading(false);

      }
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
        <ToastContainer

        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
          <ProfileView />
          <div className="p-8" style={{ width: '100%', minWidth: '50px' }}>
            <div className="flex justify-between items-center">
              <h1
                className="text-2xl flex items-center primary font-semibold  "
                style={{ marginBottom: "25px" }}
              >
                {togglePage ? "Plans" : "history"}
                <BsLightbulbFill className="ml-3 secondary  hover-yellow" />
              </h1>
              <div className="flex ">
                <Button
                  variant="contained"
                  style={{
                    background: "var(--color1)",
                    color: "white",
                    textTransform: "none",
                    marginBottom: "25px",
                  }}
                  onClick={() => { setTogglePage(!togglePage) }}
                >
                  {togglePage ? "SEE HISTORY" : "SEE PLANS"}
                </Button>
              </div>
            </div>
            {!togglePage ? (
              // <div>
              //   <table className="table-cashManage my-5 p-4">
              <div className="firstrow">
                <div className="overflow-x-auto mt-4 border-t pt-4">
                  <table
                    className="w-full border-collapse custom-table"
                    style={{
                      whiteSpace: "nowrap",
                      borderCollapse: "separate",
                      borderSpacing: "0 6px",
                    }}
                  >
                    <thead>
                      <tr>
                        {plansColumns.map((column) => (
                          <th
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </th>
                        ))}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ background: "#3f621217" }}>
                      {tableData?.map((item, index) => (
                        <tr key={index}>
                          {plansColumns.map((column) => (
                            <td key={column.id} style={{ borderRadius: "10px 0 0 10px" }}>{item[column.id]}</td>
                          ))}
                          <td style={{ borderRadius: "0 10px 10px 0" }}>
                            <GetAppIcon className="primary" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <section className="py-8 bg-gray-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl secondary font-bold plans_hdr_txtsss">
                      Selecting the Best Pricing Plan for Your Pharmacy
                    </h2>
                  </div>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      gap: "20px",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  ></div>
                  <div className="flex justify-around mt-5 gap-6 plns_cds">
                    {plansDetails.map((plan) => (
                      <div
                        key={plan.id}
                        className="border rounded-lg shadow-md bg-white text-center p-6" style={{ width: '100%' }}>
                        <div className="mb-4" style={{ borderBottom: '1px solid lightgray' }}>
                          <h5 className="text-xl font-semibold ">{plan.name}</h5>
                          <h2 className="text-2xl my-1 secondary font-bold">
                            {plan.annual_price} / Year
                          </h2>
                        </div>

                        <div className="flex flex-col justify-between" style={{ height: "86%" }}>
                          <ul
                            className="text-sm text-gray-600 space-y-2 "
                            style={{
                              maxHeight: "450px",
                              overflowY: "auto",
                              paddingRight: "8px",
                            }}
                          >
                            {plan.enable_modules.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                          <div className="mt-6" onClick={() => loadRazorpay(plan)}>
                            <a className="px-4 py-2 border border-[var(--color1)] primary rounded-lg font-medium hover:bg-[var(--color1)] hover:text-white cursor-pointer">
                              Buy Plan
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </Box>
      )}
    </>
  );
};
export default Plans;
