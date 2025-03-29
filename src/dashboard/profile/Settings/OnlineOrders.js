import { useEffect, useState } from "react";

import Loader from "../../../componets/loader/Loader";
import Header from "../../Header";
import ProfileView from "../ProfileView";
import { Box, Switch, TextField, Button, } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const OnlineOrders = () => {
  const token = localStorage.getItem("token");
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [reconciliationData, setReconciliationData] = useState({});
  const [toggle, setToggle] = useState(false);

  const [settings, setSettings] = useState({
    accept_online_orders: 0,
    delivery_online_orders: 0,
    pickup_online_orders: 0,
    minimum_order_amount: 100,
    order_shipping_price: 102,
    delivery_estimated_time: dayjs('2022-04-17T15:30'),
    order_manager: 120,
    google_location_link: 120,
    delivery_start_time: 102,
    delivery_end_time: 120,
    delivery_executive: 120,
    pharmacist_number: 9876543210,
    pharmacy_whatsapp: 9876543210,
    email: 9876543210,
    delivery_start_time: "10 AM",
    delivery_end_time: "10 PM",
  });

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  {/*<============================================================================= get setting data intially ====================================================================> */ }
  // Function to update state using an object
  
  const updateState = (newState) => {
    setSettings((prevState) => ({
      ...prevState,
      ...newState, // Merging the new state
    }));
    console.log(settings);
  };


  useEffect(() => {
    getSettingData()
  }, []);


  const getSettingData = async () => {
    try {
      setIsLoading(true);
  
      const { data } = await axios.post("about-get", {
        headers: { Authorization: `Bearer ${token}` },
      });

  
      const { accept_online_orders, delivery_online_orders, 
        pickup_online_orders,minimum_order_amount,order_shipping_price,delivery_estimated_time,order_manager,google_location_link,delivery_executive,pharmacist_number,pharmacy_whatsapp,email,delivery_start_time,delivery_end_time} = data?.data || {};
  
      setSettings((prev) => {
        const newState = { ...prev, accept_online_orders, delivery_online_orders, 
          pickup_online_orders,minimum_order_amount,order_shipping_price,delivery_estimated_time,order_manager,google_location_link,delivery_start_time,delivery_end_time,order_manager,delivery_executive,pharmacist_number,pharmacy_whatsapp,email,delivery_start_time,delivery_end_time };
        console.log(newState);
        return newState;
      });
  
    } catch (error) {
      console.error("API error:", error);
     
    } finally {
      setIsLoading(false);
    }
  };
  

  {/*<==================================================================================== UI ===========================================================================> */ }

  const updateSettings = async () => {
    const data = new FormData();
    
    data.append("accept_online_orders", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_online_orders", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("pickup_online_orders", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("minimum_order_amount", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("order_shipping_price", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_estimated_time", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("order_manager", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("google_location_link", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_start_time", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_end_time", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("order_manager", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_executive", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("pharmacist_number", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("pharmacy_whatsapp", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("email", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_start_time", settings.accept_online_orders?settings.accept_online_orders:"");
    data.append("delivery_end_time", settings.accept_online_orders?settings.accept_online_orders:"");

    try {
      setIsLoading(true);
      const response = await axios.post("chemist-store-details", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        toast.success("Updated successfully");
        getSettingData(); // Refresh data after update
      }
    } catch (error) {
      console.error("API error:", error);

    } finally {
      setIsLoading(false);
    }
  };

  {/*<==================================================================================== UI ===========================================================================> */ }

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
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div>
          <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
            <ProfileView />
            <div className="p-8 w-full ">
              <div className="">
                <div>
                  <h1 className="text-2xl flex items-center primary font-semibold p-2 mr-4">
                    online order setting
                    <BsLightbulbFill className="ml-4 secondary hover-yellow" />
                  </h1>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col items-start mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-lg pass_boxx_flds">
                  {/* Turn On Reconciliation */}
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Accept Online Orders :</span>
                    <Switch
                      checked={settings.accept_online_orders == 1}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "lightgray",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "var(--color1) !important",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                        "&.Mui-checked .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                      }}
                      onchecked={settings.accept_online_orders == 1}
                      onClick={() => updateState({ accept_online_orders: settings.accept_online_orders })}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Home Delivery Online Orders :</span>
                    <Switch
                      checked={settings.delivery_online_orders == 1}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "lightgray",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "var(--color1) !important",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                        "&.Mui-checked .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                      }}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Store Pickup Online Orders :</span>
                    <Switch
                      checked={settings.pickup_online_orders ==1}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "lightgray",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "var(--color1) !important",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                        "&.Mui-checked .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                      }}
                      onClick={() => updateState({ pickup_online_orders: settings.pickup_online_orders })}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Minimum order amount:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      value={settings.minimum_order_amount}
                      type="number"
                      style={{ width: "100px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                      onClick={() => updateState({ minimum_order_amount: settings.minimum_order_amount })}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery charges:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      value={settings.order_shipping_price}
                      type="number"
                      style={{ width: "50px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                      onClick={() => updateState({ order_shipping_price: settings.order_shipping_price })}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">estimated Delivery time:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      value={settings.order_shipping_price}
                      type="number"
                      style={{ width: "50px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                      onClick={() => updateState({ delivery_estimated_time: settings.delivery_estimated_time })}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-lg pass_boxx_flds">
                  {/* Turn On Reconciliation */}
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Pharmacy whatsapp:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      type="number"
                      style={{ width: "300px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                      value={settings.pharmacy_whatsapp}

                      onClick={() => updateState({ pharmacy_whatsapp: settings.pharmacy_whatsapp })}

                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">pharmacy email:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      value={settings.pharmacy_email}

                      type="number"
                      style={{ width: "300px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Person:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      value={count}
                      type="number"
                      style={{ width: "300px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">order manager:</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      placeholder="Item Count"
                      value={count}
                      type="number"
                      style={{ width: "300px", marginInline: "5px" }}
                      size="small"
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Hours From:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['TimePicker', 'TimePicker']}>
                        <TimePicker
                          
                          // value={settings.delivery_estimated_time}
                          onClick={() => updateState({ delivery_estimated_time: settings.delivery_estimated_time })}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Hours To:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['TimePicker', 'TimePicker']}>
                        <TimePicker
                          
                          // value={settings.delivery_estimated_time}
                          onClick={() => updateState({ delivery_estimated_time: settings.delivery_estimated_time })}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="w-full flex">

                <Button
                  variant="contained"
                  style={{
                    background: "var(--color1)",
                    color: "white",
                    width: "150px",
                    marginRight: "50px",
                    marginTop: "50px"

                  }}
                  className="w-full py-2 text-sm font-medium rounded-lg shadow hover:opacity-90"
                  onClick={updateSettings}
                >
                  Update
                </Button>
              </div>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default OnlineOrders;
