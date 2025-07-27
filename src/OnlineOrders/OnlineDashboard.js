import React, { useEffect, useState } from 'react';
import Header from '../dashboard/Header';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Loader from '../componets/loader/Loader';
import ConfirmedOrder from './ConfirmedOrder';
import { BsLightbulbFill } from "react-icons/bs";

import AllOrder from './AllOrder';

const OnlineDashboard = () => {

  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory();

  {/*<========================================================================= ui ===================================================================> */ }

  return (
    <div>
      <Header />

      {isLoading ? (
        <div className="loaderdash">
          <Loader />
        </div>
      ) : (
        <div
          className="p-4"
          style={{ background: "rgb(231 230 230 / 36%)", height: "100%" }}
        >
          <div
            className="flex flex-col h-full w-full md:w-1/2"
            style={{ width: "100%" }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl flex items-center primary font-semibold  p-2 text-nowrap text-nowrap">
                  Online Orders
                  <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                </h1>
              </div>
              <div className="headerList">
                <Button
                  variant="contained"
                  className="sale_add_pdf"
                  style={{ background: "var(--color1)" }}
                  onClick={() => {
                    history.push("/settings/online-orders");
                  }}
                >
                  Settings
                </Button>
              </div>
            </div>

            {/*<========================================================================= status cards ===================================================================> */}

            <AllOrder />
          </div>
        </div>
      )}
    </div>
  );
}



export default OnlineDashboard; 