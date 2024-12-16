import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header";
import { Box } from "@mui/material";
import ProfileView from "../ProfileView";
import { useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
const Plans = () => {
  const plansColumns = [
    { id: "subscription", label: "Subscription", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "duration", label: "Duration", minWidth: 100 },
    { id: "payment", label: "Payment", minWidth: 100 },
    { id: "paidon", label: "Paid on", minWidth: 100 },
    { id: "paymentmode", label: "Payment Mode", minWidth: 100 },
    { id: "description", label: "Description", minWidth: 100 },
  ];
  const [tableData, setTableData] = useState([
    {
      subscription: "Capsule Package",
      status: "active",
      duration: "21-06-24 -21-06-25",
      payment: "121454",
      paidon: "	21-06-24 09:03 AM",
      paymentmode: "UPI",
      description: "	Subscription for package - Capsule Package has been added.",
    },
    {
      subscription: "Capsule Package",
      status: "active",
      duration: "21-06-24 -21-06-25",
      payment: "121454",
      paidon: "	21-06-24 09:03 AM",
      paymentmode: "UPI",
      description: "	Subscription for package - Capsule Package has been added.",
    },
    {
      subscription: "Capsule Package",
      status: "active",
      duration: "21-06-24 -21-06-25",
      payment: "121454",
      paidon: "	21-06-24 09:03 AM",
      paymentmode: "UPI",
      description: "	Subscription for package - Capsule Package has been added.",
    },
  ]);
  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <ProfileView />
        <div className="p-8 w-full">
          <div>
            <h1
              className="text-2xl flex items-center primary font-semibold  p-2 mb-5"
              style={{ marginBottom: "25px" }}
            >
              Active Plan
              <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
            </h1>
          </div>
          <div>
            <h1
              className="text-2xl flex items-center  font-semibold  p-2 mb-5 secondary"
              style={{ marginBottom: "25px" }}
            >
              History
            </h1>
          </div>
          <table className="table-cashManage p-4">
            <thead>
              <tr>
                {plansColumns.map((column) => (
                  <th key={column.id} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((item, index) => (
                <tr key={index}>
                  {plansColumns.map((column) => (
                    <td key={column.id}>{item[column.id]}</td>
                  ))}
                  <td>
                    <GetAppIcon className="primary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </>
  );
};
export default Plans;
