import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import Loader from "../../../../componets/loader/Loader";

import { ToastContainer } from "react-toastify";
const Inventory_Reconciliation = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false);
    const [stockStatus, setStockStatus] = useState()
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const GstSaleRegisterColumns = [
        { id: 'date', label: 'Date', minWidth: 100 },
        { id: 'reportedBy', label: 'Reported By', minWidth: 100 },
        { id: "itemName", label: "Item Name", minWidth: 100 },
        { id: "unit", label: "Unit", minWidth: 100 },
        { id: 'manu', label: "Manuf.", minWidth: 100 },
        { id: 'location', label: 'Location', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'reportedStock', label: 'Reported Stock', minWidth: 100 },
        { id: 'systemStock', label: 'System Stock', minWidth: 100 },
        { id: 'rsImpact', label: 'Rs. Impact', minWidth: 100 },
    ];
    const [tableData, setTabledata] = useState([
        // { billno: "15", billdate: "25/12/2012", customerName: "mehul pativala", batch: "152", itemname: "moxiclav 625", unit: "12", expiry: "02/26", free: "5", Qty: "2", amount: "520", netprofit: "251" },
        // { billno: "15", billdate: "25/12/2012", customerName: "mehul pativala", batch: "152", itemname: "moxiclav 625", unit: "12", expiry: "02/26", free: "5", Qty: "2", amount: "520", netprofit: "251" },
        // { billno: "15", billdate: "25/12/2012", customerName: "mehul pativala", batch: "152", itemname: "moxiclav 625", unit: "12", expiry: "02/26", free: "5", Qty: "2", amount: "520", netprofit: "251" },
    ])
    return (
        <>
            <div>
                <div>
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
                    {isLoading ? <div className="loader-container ">
                        <Loader />
                    </div> :
                        <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '10px 20px 0px' }}>
                            <div className="flex gap-2 pb-2">
                                <div style={{ display: 'flex', flexWrap: 'wrap', width: '800px', gap: '7px', alignItems: "center" }}>
                                    <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                    </span>
                                    <ArrowForwardIosIcon style={{ fontSize: '17px', color: "rgba(4, 76, 157, 1)" }} />
                                    <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "180px" }}>  Reconciliation Report (Audit)
                                    </span>
                                    <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                                </div>
                                <div className="headerList">
                                    <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                                </div>
                            </div>
                            <div className="bg-white ">
                                <div className="manageExpenseRow" style={{
                                    padding: ' 20px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                                }}>
                                    <div className="flex gap-5 flex-wrap" >
                                        <div className="detail">
                                            <span className="text-gray-500">Start Date</span>
                                            <DatePicker
                                                className='custom-datepicker '
                                                selected={startDate}
                                                onChange={(newDate) => setStartDate(newDate)}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className="detail">
                                            <span className="text-gray-500">End Date</span>
                                            <DatePicker
                                                className='custom-datepicker '
                                                selected={endDate}
                                                onChange={(newDate) => setEndDate(newDate)}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className="mt-6">
                                            <FormControl sx={{ minWidth: 240 }} size="small">
                                                <InputLabel id="demo-select-small-label">Stock Status</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={stockStatus}
                                                    onChange={(e) => setStockStatus(e.target.value)}
                                                    label="Stock Status"

                                                >
                                                    <MenuItem value="" disabled>
                                                        Stock Status
                                                    </MenuItem>
                                                    <MenuItem value="sale">All</MenuItem>
                                                    <MenuItem value="saleReturn">Corrent Stock</MenuItem>
                                                    <MenuItem value="purchaseReturn">MisMatch Stock</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="mt-6">
                                            <Button variant="contained">
                                                Go
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {tableData.length > 0 ?
                                    <div>
                                        <div className="overflow-x-auto mt-4">
                                            <table className="table-cashManage w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        {GstSaleRegisterColumns.map((column) => (
                                                            <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                                {column.label}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData?.map((item, index) => (
                                                        <tr key={index} >
                                                            {GstSaleRegisterColumns.map((column) => (
                                                                <td key={column.id}>
                                                                    {item[column.id] && item[column.id].charAt(0).toUpperCase() + item[column.id].slice(1)}
                                                                </td>
                                                            ))}

                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="vector-image">
                                            <div style={{ maxWidth: "200px", marginBottom: "20px" }}>
                                                <img src="../empty_image.png" ></img>
                                            </div>
                                            <span className="text-gray-500 font-semibold">Oops !</span>
                                            <p className="text-gray-500 font-semibold">No Items found with your search criteria.</p>
                                        </div>
                                    </div>

                                }
                            </div>

                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default Inventory_Reconciliation