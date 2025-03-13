import { BsLightbulbFill } from "react-icons/bs"
import axios from "axios"
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Card, CardContent, Typography,  TextField, } from "@mui/material"
import { useEffect, useState, useRef } from "react"
import Loader from "../../../componets/loader/Loader"
import { toast, ToastContainer } from "react-toastify"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom/cjs/react-router-dom"

const ReferEarn = () => {
  const history = useHistory()
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);

  {/*<============================================================================== add Item field  =============================================================================> */ }

  const [tableData, setTableData] = useState([])
  const [referralBalance, setReferralBalance] = useState("")
  const [referralCode, setReferralCode] = useState("")

  
  const [column, setColumn] = useState(["name", "mobile_number", "registration_date", "referral_user_plan"])


  {/*<============================================================================== add Item field  =============================================================================> */ }

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const [selectedId, setSelectedId] = useState(null); // ID of selected row
  const tableRef = useRef(null); // Reference for table container

  // Handle key presses for navigating rows
  const handleKeyPress = (e) => {
    const key = e.key;
    console.log(key)
    if (key === "ArrowDown") {
      // Move selection down
      setSelectedIndex((prev) =>
        prev < tableData.length - 1 ? prev + 1 : prev
      );
    } else if (key === "ArrowUp") {
      // Move selection up
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (key === "Enter" && selectedIndex !== -1) {
      // Confirm selection
      const selectedRow = tableData[selectedIndex];
      setSelectedId(selectedRow.id);
      alert(`Selected ID: ${selectedRow.id}`);
    }
  };

  // Ensure the table container listens for key events
  useEffect(() => {
    const currentRef = tableRef.current;
    if (currentRef) {
      currentRef.focus(); // Ensure focus for capturing key events
      currentRef.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("keydown", handleKeyPress);
      }
    };
  }, [selectedIndex, tableData]);

  // Update selectedId when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0) {
      setSelectedId(tableData[selectedIndex]?.id || null);
    }
  }, [selectedIndex, tableData]);
  useEffect(() => {
    getReferral()
  }, [])
  let getReferral = () => {
    axios
      .post("about-get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReferralBalance(response.data.data.referral_balance)
        setReferralCode(response.data.data.login_user_referral_code)
        setTableData(response.data.data.referral_list);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

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
          <Box sx={{ display: "flex" }}>
            <ProfileView />
            <div className="pt-8 pl-8 w-full">
              <div>
                <h1
                  className="text-2xl flex items-center font-semibold p-2 mb-5"
                  style={{ color: "var(--color1)", marginBottom: "25px" }}
                >
                  Refer & Earn
                  <BsLightbulbFill className="ml-4 secondary hover-yellow" />
                </h1>
                <p>Your Points : {referralBalance}</p>
                <span className="lowercase" >https://medical.pharma247.in/Register/{referralCode}</span> <Button >share</Button>
                

              </div>
              <div
                ref={tableRef}
                tabIndex={0} // Make the container focusable
                className="outline-none"
              >
                <table>
                  <thead>
                    <tr className="flex flex-row justify-between">
                      {column.map((item, index) => (
                        <th
                          className="flex flex-row mx-5 justify-between"
                          key={index}
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr
                        className={`flex flex-row justify-between ${index === selectedIndex
                            ? "bg-blue-500 text-white"
                            : ""
                          }`}
                        key={item.id}
                        onClick={() => {
                          setSelectedIndex(index);
                          setSelectedId(item.id);
                        }}
                        onDoubleClick={() =>
                          alert(`Double-clicked ID: ${item.id}`)
                        }
                      >
                        {column.map((col, colIndex) => (
                          <td className="mx-5" key={colIndex}>

                            {item[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col gap-6 p-4">
      {/* Referral Card */}
      <Card className="rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4260/4260951.png"
            alt="Referral"
            className="w-40 h-40 object-contain"
          />
          <div className="flex flex-col gap-2">
            <Typography variant="h6" className="font-bold text-gray-800">
              Earn ₹50 For Each Friend You Refer
            </Typography>
            <div className="flex items-center gap-2 text-gray-600">
              {/* <DirectionsBus className="text-purple-600" /> */}
              <Typography>Share the referral link with your friends</Typography>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              {/* <DirectionsBus className="text-purple-600" /> */}
              <Typography>Friend gets ₹50 on their first complete ticket booking</Typography>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TextField
                value="241010691"
                variant="outlined"
                size="small"
                className="w-32"
                InputProps={{
                  readOnly: true,
                }}
              />
              {/* <IconButton color="primary">
                <ContentCopy />
              </IconButton> */}
            </div>
            <Button variant="contained" color="secondary" className="mt-2 bg-purple-700">
              Referral A Friend!
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="rounded-2xl shadow-lg p-4 w-full max-w-2xl">
        <CardContent>
          <Typography variant="h6" className="font-bold text-gray-800 mb-2">
            Transaction History
          </Typography>
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              {/* <LocalAtm className="text-green-500" /> */}
              <div>
                <Typography className="text-gray-700">Referral Amount → <span className="font-bold">mahek</span></Typography>
                <Typography className="text-green-500 text-sm">Credit</Typography>
              </div>
            </div>
            <Typography className="text-green-600 font-bold">+₹50</Typography>
          </div>
        </CardContent>
      </Card>
    </div>
              </div>
            </div>
            
          </Box>
          
          
        </div>
        
      )}
    </>
  );
}
export default ReferEarn