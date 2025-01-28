import { BsLightbulbFill } from "react-icons/bs"
import axios from "axios"
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material"
import { useEffect, useState ,useRef  } from "react"
import Loader from "../../../componets/loader/Loader"
import { toast, ToastContainer } from "react-toastify"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ReferEarn = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);

    {/*<============================================================================== add Item field  =============================================================================> */ }

    const [tableData,

    ] = useState([
        {
            "id": 101,
            "iteam_name": "rahni",

            "random_number": "67430",
            "batch_number": "122",
            "total_stock": "90",
            "expiry": "12\/26",
            "mrp": "120",
            "net_rate": "124.74",

        },
        {
            "id": 102,
            "iteam_name": "rahni",

            "random_number": "67430",
            "batch_number": "122",
            "total_stock": "90",
            "expiry": "12\/26",
            "mrp": "120",
            "net_rate": "124.74",

        },
        {
            "id": 103,
            "iteam_name": "rahni",

            "random_number": "67430",
            "batch_number": "122",
            "total_stock": "90",
            "expiry": "12\/26",
            "mrp": "120",
            "net_rate": "124.74",

        },
        {
            "id": 104,
            "iteam_name": "rahni",

            "random_number": "67430",
            "batch_number": "122",
            "total_stock": "90",
            "expiry": "12\/26",
            "mrp": "120",
            "net_rate": "124.74",

        },
        {
            "id": 105,
            "iteam_name": "rahni",

            "random_number": "67430",
            "batch_number": "122",
            "total_stock": "90",
            "expiry": "12\/26",
            "mrp": "120",
            "net_rate": "124.74",

        },
    ])
    const [column, setColumn] = useState(["id", "iteam_name", "batch_number", "total_stock", "expiry", "mrp", "net_rate"])

    
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
                <p>Your Points (static): 100</p>
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
                          {index + 1} {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr
                        className={`flex flex-row justify-between ${
                          index === selectedIndex
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
              </div>
            </div>
          </Box>
        </div>
      )}
    </>
  );
}
export default ReferEarn