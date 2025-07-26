import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { GoInfo } from "react-icons/go";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import ImageCarousel from "../componets/ImageCarousel/ImageCarousel ";

const ConfirmedOrder = ({ orderid }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState(1);

  const token = localStorage.getItem("token");

  const [orderData, setOrderData] = useState([]);
  const [roleList, setRolelist] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState("");

  const imageUrls = [
    "https://testadmin.pharma247.in/public/front_photo/1744182037Aspirin.jpg",
    "https://testadmin.pharma247.in/public/front_photo/1744182037Aspirin.jpg",
    "https://testadmin.pharma247.in/public/front_photo/1744182037Aspirin.jpg",
    "https://testadmin.pharma247.in/public/front_photo/1744182037Aspirin.jpg",
    "https://testadmin.pharma247.in/public/front_photo/1744182037Aspirin.jpg",
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setIsLoading(true);
    axios
      .post("manage-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoading(false);
        setRolelist(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  };

  useEffect(() => {
    orderdata();
  }, [orderid]);

  const orderdata = async () => {
    let data = new FormData();
    data.append("order_id", orderid);
    // data.append("order_status", 0)
    // data.append("start_date", "2025-03-10")
    // data.append("end_date", "2025-03-31")
    // data.append("patient_name", "shailesh")

    try {
      await axios
        .post("patient-order-details?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setOrderData(response.data.data);
          console.log("orderData", response.data.data);
        });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.16)] my-4">
      <div className="bg-lime-500/5 border border-lime-600 p-4 rounded-t-xl flex flex-row w-full justify-between items-center shadow-sm">
        <span className="text-lg font-medium text-lime-800">
          Orders ID : {orderData?.bill_no}
        </span>
        <span className="text-lg font-medium text-lime-800">
          Date/Time : {orderData?.date}
        </span>
        <span className="text-lg font-medium text-lime-800">
          Amount : {orderData?.total_amount}
        </span>
      </div>

      <div className="flex flex-row w-full h-full">
        {/* Left: Grid */}
        <div className="grid grid-cols-2 w-1/2 gap-x-8 gap-y-4 p-6 flex-grow overflow-auto">
          <div className="font-semibold">Patient</div>
          <div>{orderData?.patient_name}</div>

          <div className="font-semibold">Patient No</div>
          <div>{orderData?.patient_number}</div>

          <div className="font-semibold">Address</div>
          <div>{orderData?.address}</div>
          <div className="font-semibold">Landmark</div>
          <div>{orderData?.area_landmark}</div>
          <div className="font-semibold">City</div>
          <div>{orderData?.city}</div>
          <div className="font-semibold">Pincode</div>
          <div>{orderData?.pincode}</div>
          <div className="font-semibold">Date</div>
          <div>{orderData?.date}</div>

          <div className="font-semibold">Delivery type</div>
          <div>{orderData?.delivery_status}</div>

          <div className="font-semibold">Payment mode</div>
          <div>{orderData?.payment_method}</div>

          <div className="font-semibold">Patient Location</div>
          <div className="break-all">https://maps.app.goo.gl/LctZArEPAfcqJ</div>

          <div className="font-semibold ">Prescription</div>
  
            <ImageCarousel imageUrls={imageUrls} />
         
        </div>

        {/* Right: Button at bottom-right */}
        <div className="w-1/2 flex flex-col justify-end items-end p-6">
          <FormControl sx={{ width: "150px" }} size="small">
            <InputLabel id="demo-select-small-label">Assign Role</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              label="Assign Role"
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              {roleList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
};
export default ConfirmedOrder;
