import React, { useState, useEffect } from "react";
import axios from "axios";


import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import ConfirmedOrder from "./ConfirmedOrder";
import ReadyForPickup from "./ReadyForPickup";
import Delivered from "./Completed";
import Rejected from "./Cancelled";
import AssignedPharmacy from "./AssignedPharmacy";

const AllOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(1);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [billData, setBilldata] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderdata();
    // eslint-disable-next-line
  }, [currentPage, selectedStatus]);

  const statusOptions = [
    { id: "", value: "All Orders" },
    { id: "1", value: "Assigned pharmacy" },
    { id: "2", value: "Cancel By Customer" },
    { id: "3", value: "Cancel By Pharmacy" },
    { id: "4", value: "Confirmed Orders" },
    { id: "5", value: "Ready For Pickup" },
    { id: "6", value: "Completed" },
  ];

  const orderdata = async () => {
    let data = new FormData();
    data.append("order_status", selectedStatus);
    data.append("page", currentPage);
    try {
      setIsLoading(true);
      await axios
        .post("chemist-order-list?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setBilldata(response.data.data);
          const records = response?.data?.total_records;
          const pages = Math.ceil(Number(records) / 10);
          setTotalPages(pages);
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

const openOrderDetails = (order) => {
  setSelectedOrder(order);
  console.log("Selected Order:", order);
};


  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
       <div className="text-center mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => setSelectedOrder(null)}
          >
            Back to Orders
          </button>
        </div>
       {selectedOrder ? (
      <>
       {selectedOrder.status === "Assigned Pharmacy" && (
          <AssignedPharmacy orderid={selectedOrder.id} />
        )}
     
        {selectedOrder.status === "Order Confirmed" && (
          <ConfirmedOrder orderid={selectedOrder.id} />
        )}
        {selectedOrder.status === "Completed" && (
          <Delivered orderid={selectedOrder.id} />
        )}
        {selectedOrder.status === "Ready For Pickup" && (
          <ReadyForPickup orderid={selectedOrder.id} />
        )}
        {(selectedOrder.status === "Cancelled By Customer" ||
          selectedOrder.status === "Cancelled By Pharmacy") && (
            <Rejected orderid={selectedOrder.id} />
        )}
       
      </>
    ) : (
      <div className="dashbd_crd_bx gap-5  p-8 grid grid-cols-1 md:grid-cols-1  sm:grid-cols-1">
        <div
          className="gap-4 flex flex-col justify-between"
          style={{ height: "100%" }}
        >
          
          <TabContext value={selectedStatus}>
            <TabList
              onChange={(event, newValue) => setSelectedStatus(newValue)}
              aria-label="Sales Purchase Tabs"
              TabIndicatorProps={{ style: { display: "none" } }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  borderRadius: "999px",
                  color: "#374151",
                  backgroundColor: "#fff",
                  mx: 0.5,
                  transition: "0.3s ease",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  minWidth: { xs: "auto", sm: "64px" },
                  minHeight: { xs: "32px", sm: "40px" },
                },
                "& .Mui-selected": {
                  backgroundColor: "var(--color1)",
                  color: "white",
                },
                "& .MuiTabs-scrollButtons": {
                  display: { xs: "flex", sm: "none" },
                },
              }}
            >
              {statusOptions.map((status) => (
                <Tab
                  key={status.id}
                  value={status.id}
                  label={status.value}
                  className="whitespace-nowrap"
                />
              ))}
            </TabList>
          </TabContext>

          <div
            className="bg-white  px-2 py-1 rounded-lg flex flex-col justify-between"
            style={{
              boxShadow: "0 0 16px rgba(0, 0, 0, .16)",
              height: "450px",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full custom-table">
                <thead className="primary ">
                  <tr>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Order ID
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Patient Name
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Patient Number
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Date
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Delivery Type
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Status
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Net Amount
                    </th>
                    <th className="border-b border-gray-200 font-bold px-4 py-2">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billData?.map((order, index) => (
                    <tr
                      onClick={() => openOrderDetails(order)}
                      key={index}
                      className="border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition"
                      style={{ textAlign: "center" }}
                    >
                      <td className="px-4 py-2">{order.order_id}</td>
                      <td className="px-4 py-2">{order.patient_name}</td>
                      <td className="px-4 py-2">{order.patient_number}</td>
                      <td className="px-4 py-2">{order.date}</td>
                      <td className="px-4 py-2">{order.delivery_status}</td>
                      <td className="px-4 py-2">{order.status}</td>
                      <td className="px-4 py-2">{order.net_amount}</td>
                      <td className="px-4 py-2">{order.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div
            className="flex justify-center mt-4"
            style={{
              marginTop: "auto",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <button
              onClick={handlePrevious}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-700"
                  : "secondary-bg text-white"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {currentPage > 2 && (
              <button
                onClick={() => handleClick(currentPage - 2)}
                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
              >
                {currentPage - 2}
              </button>
            )}
            {currentPage > 1 && (
              <button
                onClick={() => handleClick(currentPage - 1)}
                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
              >
                {currentPage - 1}
              </button>
            )}
            <button
              onClick={() => handleClick(currentPage)}
              className="mx-1 px-3 py-1 rounded secondary-bg text-white"
            >
              {currentPage}
            </button>
            {currentPage < totalPages && (
              <button
                onClick={() => handleClick(currentPage + 1)}
                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
              >
                {currentPage + 1}
              </button>
            )}
            <button
              onClick={handleNext}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage >= totalPages
                  ? "bg-gray-200 text-gray-700"
                  : "secondary-bg text-white"
              }`}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
export default AllOrder;
