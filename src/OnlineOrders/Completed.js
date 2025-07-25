import React, { useEffect, useState } from 'react';
import Header from '../dashboard/Header';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Loader from '../componets/loader/Loader';
import Accepted from './Accepted';
import { BsLightbulbFill } from "react-icons/bs";
import Assigned from './Assigned';
import axios from 'axios';

const Completed = ({ orderid }) => {

  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [orderData, setOrderData] = useState([])


  useEffect(() => {

    orderdata()

  }, [orderid])

  const orderdata = async () => {

    let data = new FormData();
    // data.append("order_status", 0)
    // data.append("start_date", "2025-03-10")
    // data.append("end_date", "2025-03-31")
    // data.append("patient_name", "shailesh")

    try {
      await axios.post("chemist-order-list?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ).then((response) => {
        setIsLoading(false)
        setOrderData(response.data.data);
      })

    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);

    }
  }

  {/*<========================================================================= ui ===================================================================> */ }

  return (
    <div className="flex flex-col gap-4 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.16)] my-4">
      <div className="bg-teal-500/5 border border-teal-600 p-4 rounded-t-xl flex flex-row w-full justify-between items-center shadow-sm">
        <span className="text-lg font-medium text-teal-800">
          Orders ID : $#12424
        </span>
        <span className="text-lg font-medium text-teal-800">
          Reason : Out of stock
        </span>
      </div>

      <div className="flex flex-row w-full h-full">
        {/* Left: Grid */}
        <div className="grid grid-cols-2 w-1/2 gap-x-8 gap-y-4 p-6 flex-grow overflow-auto">
          <div className="font-semibold">Patient</div>
          <div>Umang rathod</div>

          <div className="font-semibold">Patient No</div>
          <div>9876543210</div>

          <div className="font-semibold">Address</div>
          <div>shopno,rcom pvt , surat</div>

          <div className="font-semibold">Date</div>
          <div>12/12/25</div>

          <div className="font-semibold">Delivery type</div>
          <div>Pickup / Delivery</div>

          <div className="font-semibold">Payment mode</div>
          <div>COD / Paid / Counter</div>

          <div className="font-semibold">Patient Location</div>
          <div className="break-all">https://maps.app.goo.gl/LctZArEPAfcqJ</div>

          <div className="font-semibold">Whatsapp</div>
          <div>98765436210</div>


          <div className="font-semibold">Prescription</div>
          <div>photo</div>
        </div>

        {/* Right: Button at bottom-right */}
        <div className="w-1/2 flex flex-col justify-end items-end p-6">
          <Button
            variant="contained"
            className="sale_add_pdf"
            style={{ background: "var(--color1)" }}>
            Print Bill
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Completed ;