import React, { useEffect, useState } from 'react';
import Header from '../dashboard/Header';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Loader from '../componets/loader/Loader';
import ConfirmedOrder from './ConfirmedOrder';
import { BsLightbulbFill } from "react-icons/bs";
import Assigned from './Assigned';
import Rejected from './Rejected';
import Pickup from './Pickup';
import Completed from './Completed';
import Processing from './Processing';
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

            <StatusCardsSection />
          </div>
        </div>
      )}
    </div>
  );
}

// Move the status cards logic to a separate component to avoid using hooks inside an IIFE
function StatusCardsSection() {
  const [selectedTab, setSelectedTab] = useState(0);


  const statusCards = [
    {
      label: "All",
      count: 30,
      bg: "from-lime-50 to-white border-lime-600 text-lime-800",
      component: <AllOrder />,
      borderColor: "#65a30d",
    },
    {
      label: "Confirmed Orders",
      count: 30,
      bg: "from-lime-50 to-white border-lime-600 text-lime-800",
      component: <ConfirmedOrder />,
      borderColor: "#65a30d",
    },
    // {
    //   label: "Assigned",
    //   count: 410,
    //   bg: "from-yellow-50 to-white border-yellow-400 text-yellow-800",
    //   component: <Assigned />,
    //   borderColor: "#facc15", 
    // },
    {
      label: "Processing",
      count: 150,
      bg: "from-red-50 to-white border-orange-400 text-orange-800",
      component: <Processing />,
      borderColor: "#fb923c",
    },
    {
      label: "Completed",
      count: 320,
      bg: "from-green-50 to-white border-teal-400 text-teal-800",
      component: <Completed />,
      borderColor: "#2dd4bf", // teal-400
    },
    {
      label: "Pickedup",
      count: 190,
      bg: "from-blue-50 to-white border-blue-400 text-blue-800",
      component: <Pickup />,
      borderColor: "#60a5fa", // blue-400
    },
    {
      label: "Rejected",
      count: 550,
      bg: "from-red-50 to-white border-red-400 text-red-800",
      component: <Rejected />,
      borderColor: "#fb7185", // rose-400
    },
    {
      label: "single",
      count: 550,
      bg: "from-red-50 to-white border-red-400 text-red-800",
      component: <Rejected />,
      borderColor: "#fb7185", // rose-400
    },
  ];

  return (
    <div className="flex flex-col gap-5 md:flex-row col-md-6" style={{ width: "100%" }}>
      <div className="w-full  p-6 ">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 text-center">
            {statusCards.map((card, idx) => (
              <div
                key={card.label}
                className={`bg-gradient-to-br ${card.bg} border-2 p-1 rounded-xl flex flex-row items-center justify-center gap-2 py-2 cursor-pointer`}
                onClick={() => setSelectedTab(idx)}
                style={{
                  borderWidth: selectedTab === idx ? "3px" : "1px",
                  borderColor: card.borderColor,
                  transition: "border-color 0.2s, border-width 0.2s",
                }}
              >
                <p className={`text-lg font-medium ${card.bg.split(" ")[3]}`}>
                  {card.label}
                </p>
                <p className={`text-lg font-medium ${card.bg.split(" ")[3]}`}>
                  {card.count}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            {/* Render the selected component, fallback to Accepted if null */}
            {statusCards[selectedTab].component || (
              <div className="text-center text-gray-500 py-12">
                <span>No view available for {statusCards[selectedTab].label}.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlineDashboard; 