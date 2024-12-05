import { useEffect, useState } from "react";
import Loader from "../../../componets/loader/Loader"
import Header from "../../Header"
import ProfileView from "../ProfileView";
import { Box, Button, Switch, TextField } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast, ToastContainer } from "react-toastify";


const ReconciliationManage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [count,setCount] = useState(10)
 // Variables for the three sections (percentages)
 const value1 = 30; // e.g., 30%
 const value2 = 45; // e.g., 45%
 const value3 = 25; // e.g., 25%

 // Calculate cumulative percentages
 const total = value1 + value2 + value3;
 const percentage1 = (value1 / total) * 100;
 const percentage2 = (value2 / total) * 100;
 const percentage3 = (value3 / total) * 100;

 // Stroke offsets for the chart
 const offset1 = 25; // Start point for full circle offset
 const offset2 = offset1 - percentage1; // Second segment offset
 const offset3 = offset2 - percentage2; // Third segment offset
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
  
    const handleCount = (type) => {
        if (type === 0) {
          setCount((prevCount) => prevCount - 1);
        } else if (type === 1) {
          setCount((prevCount) => prevCount + 1);
        }
      };

  
    return (
        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <Box sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-8  w-full">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl flex items-center darkblue_text font-semibold  p-2  mr-4"  >Manage Reconciliation Audit
                                    <BsLightbulbFill className="ml-4 sky_text  hover-yellow" />

                                        <Switch
                                            className="darkblue_text"
                                            {...label}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#044C9D',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#044C9D',
                                                },
                                            }}
                                        />
                                    </h1>
                                </div>

                                <div className="flex items-center">

                                    <RemoveIcon
                                     sx={{
                                        backgroundColor: '#044C9D', 
                                        color: 'white',
                                        borderRadius: '50%', 
                                        padding: '8px',
                                        width: '35px',
                                        height: '35px', 

                                      }}
                                      onClick={()=>handleCount(0)}

                                     />

                                    <TextField 

                                        id="outlined-number"
                                        placeholder="Item Count "
                                        value={count}
                                        type="number"
                                        style={{ width: "45px",marginInline:"5px" }}
                                        size="small"
                                        onChange={(e)=> {let enterdInput=e.target.value; setCount(Number(enterdInput))}}
                                       
                                          
                                    />
                                    <AddIcon 
                                     sx={{
                                        backgroundColor: '#044C9D', 
                                        color: 'white',
                                        borderRadius: '50%', 
                                        padding: '8px',
                                        width: '35px',
                                        height: '35px', 
                                      }}
                                      onClick={()=>handleCount(1)}
                                      />
                                    {/* <Button variant="contained" color="primary" style={{ textTransform: 'none', marginBottom: "25px" }}> <AddIcon className="mr-2" />Create Role</Button> */}
                                </div>
                            </div>
                            
                        </div>
                    </Box>
                    <div className="flex justify-center items-center">
      <svg width="250" height="250" viewBox="0 0 36 36" className="inline-block">
        {/* Background circle */}
        <circle
          cx="28"
          cy="28"
          r="15.915"
          fill="none"
          className="stroke-gray-200"
          strokeWidth="3"
        />
        {/* First segment */}
        <circle
          cx="28"
          cy="28"
          r="15.915"
          fill="none"
          className="stroke-blue-500"
          strokeWidth="3"
          strokeDasharray={`${percentage1} ${100 - percentage1}`}
          strokeDashoffset={offset1}
        />
        {/* Second segment */}
        <circle
          cx="28"
          cy="28"
          r="15.915"
          fill="none"
          className="stroke-green-500"
          strokeWidth="3"
          strokeDasharray={`${percentage2} ${100 - percentage2}`}
          strokeDashoffset={offset2}
        />
        {/* Third segment */}
        <circle
          cx="28"
          cy="28"
          r="15.915"
          fill="none"
          className="stroke-red-500"
          strokeWidth="3"
          strokeDasharray={`${percentage3} ${100 - percentage3}`}
          strokeDashoffset={offset3}
        />
      </svg>
    </div>
                </div>
            }
        </>
    )
}
export default ReconciliationManage