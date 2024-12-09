import Header from "../../Header";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Checkbox,
  TextField,
  Button,
  Typography,
  DialogContentText,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../componets/loader/Loader";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from '@mui/icons-material/Add';
import { Textarea } from "@material-tailwind/react";
import { Label } from "@mui/icons-material";

const Reconciliation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [maxItems, setMaxItems] = useState(10);

  useEffect(() => {
    getItem()

  }, [])

  let getItem = async () => {
    setIsLoading(true);
    try {
      const res = await axios
        .post("item-search?", {}, {
          //   params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.data.data);
          if (response.data.data.data.length == 0) {
            toast.error("No Record Found");
          }
          setIsLoading(false);
          console.log(data, "data");
          // console.log(searchItem);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div >
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
      <div >
        {isLoading ? (
          <Loader />
        ) : (
          < div style={{ padding: '0px 20px 0px' }}>
            <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span className='primary' style={{ display: 'flex', fontWeight: 700, fontSize: '20px', width: '125px' }} >Reconciliation</span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
              </div>
              <div className="headerList">
                <Button variant="contained" size='small'  > <AddIcon />Submit </Button>
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 place-content-center align-content-center`}>

              {data.slice(0, maxItems).map((item, index) => (
                <div
                  key={index} // Add a unique key for each item
                  className="bg-white rounded-md flex flex-col text"
                  style={{
                    boxShadow: 'rgb(0 0 0 / 8%) 1px 7px 13px'
                  }}
                >
                  <div className="flex p-3 gap-4">
                    <div className="imgdiv00 w-24 h-24">
                      <img
                        className="w-full h-full object-cover rounded"
                        src={item.front_photo ? item.front_photo : "/tablet.png"}
                        alt="Item"
                      />
                    </div>
                    <div className="cardcontentdiv w-full flex-1">
                      <h2 className="font-bold mb-2">
                        {item.iteam_name.length > 20 ? `${item.iteam_name.substring(0, 20)}...` : item.iteam_name}
                      </h2>
                      <span className="flex justify-between w-full align-center">
                        <p className="inline text-gray-400 text-sm font-normal">
                          1 pack of {item.weightage ? item.weightage : 0} unit
                        </p>
                        <p className="inline text-gray-600 text-sm font-bold">₹ {item.mrp ? item.mrp : 0}</p>
                      </span>
                      <span className="flex justify-between items-center w-full gap-2">
                        <p className="">
                          LOC:<span className="primary"> {item.location ? item.location : 0}</span>
                        </p>
                        <TextField
                          id="outlined-number"
                          placeholder="Add Stock"
                          type="number"
                          style={{ width: '110px', marginBlock: '5px' }}
                          size="small"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
};
export default Reconciliation;
