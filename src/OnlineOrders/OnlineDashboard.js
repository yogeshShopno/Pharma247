import React, { useEffect, useState } from 'react';
import Header from '../dashboard/Header';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Loader from '../componets/loader/Loader';
import Accepted from './Accepted';
import { BsLightbulbFill } from "react-icons/bs";
import Assigned from './Assigned';
import Rejected from './Rejected';
import Pickup from './Pickup';

const OnlineDashboard = () => {

  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory();

  {/*<========================================================================= ui ===================================================================> */ }

  return (
    <div >
      <div>
        <Header />

        {isLoading ? <div className="loaderdash">
          <Loader />
        </div> :
          <div className='p-4' style={{ background: 'rgb(231 230 230 / 36%)', height: '100%' }}>

            <div className='flex flex-col h-full w-full md:w-1/2' style={{ width: '100%' }}>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl flex items-center primary font-semibold  p-2 text-nowrap text-nowrap" >Online Orders
                    <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                  </h1>
                </div>
                <div className="headerList">
                  <Button
                    variant="contained"
                    className="sale_add_pdf"
                    style={{ background: "var(--color1)" }}
                    onClick={() => { history.push("/settings/online-orders") }}>
                    Settings
                  </Button>
                </div>
              </div>
{/*<========================================================================= status cards ===================================================================> */}

              <div className="flex flex-col gap-5 md:flex-row col-md-6" style={{ width: "100%" }}>
                <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 text-center">

                      {/* Accepted */}
                      <div className="bg-gradient-to-br from-lime-50 to-white border border-lime-600 p-1 rounded-xl flex flex-col items-center justify-center gap-2 py-4 cursor-pointer">
                        <p className="text-lg font-medium text-lime-800">Accepted</p>
                        <p className="text-lg font-medium text-lime-800">30</p>
                      </div>

                      {/* Assigned */}
                      <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-400 p-1 rounded-xl flex flex-col items-center justify-center gap-2 py-4 cursor-pointer">
                        <p className="text-lg font-medium text-yellow-800">Assigned</p>
                        <p className="text-lg font-medium text-yellow-800">410</p>
                      </div>

                      {/* In Process */}
                      <div className="bg-gradient-to-br from-red-50 to-white border border-orange-400 p-1 rounded-xl flex flex-col items-center justify-center gap-2 py-4 cursor-pointer">
                        <p className="text-lg font-medium text-orange-800">Processing</p>
                        <p className="text-lg font-medium text-orange-800">150</p>
                      </div>

                      {/* Delivered */}
                      <div className="bg-gradient-to-br from-green-50 to-white border border-teal-400 p-1 rounded-xl flex flex-col items-center justify-center gap-2 py-4 cursor-pointer">
                        <p className="text-lg font-medium text-teal-800">Delivered</p>
                        <p className="text-lg font-medium text-teal-800">320</p>
                      </div>

                      {/* Pickedup */}
                      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-400 p-1 rounded-xl flex flex-col items-center justify-center gap-2 py-4 cursor-pointer">
                        <p className="text-lg font-medium text-blue-800">Pickedup</p>
                        <p className="text-lg font-medium text-blue-800">190</p>
                      </div>

                      {/* Rejected */}
                      <div className="bg-gradient-to-br from-red-50 to-white border border-rose-400 p-1 rounded-xl flex flex-col items-center justify-center gap-2 py-4 cursor-pointer">
                        <p className="text-lg font-medium text-rose-800">Rejected</p>
                        <p className="text-lg font-medium text-rose-800 ">15510</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {/* <Accepted /> */}
              {/* <Assigned /> */}
              {/* <Rejected /> */}
              {/* <Pickup /> */}
            </div>
          </div>}
      </div>
    </div>)
}

export default OnlineDashboard