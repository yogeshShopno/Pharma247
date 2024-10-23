import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import axios from "axios";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../../componets/loader/Loader";
const PurchaseBillReport = () => {
    const history = useHistory()
    const [lastMonth, setLastMonth] = useState(subMonths(new Date(), 1));
    const [reportType, setReportType] = useState(null)
    const [purchaseType, setPurchaseType] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [errors, setErrors] = useState({});
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [purchaseGSTData, setPurchaseGSTData] = useState([])
    const [total, setTotal] = useState(0)

    const GSTPurchaseColumns = [
        { id: 'bill_no', label: 'Bill No', minWidth: 100 },
        { id: 'bill_date', label: 'Bill Date', minWidth: 100 },
        { id: 'distributor', label: 'Distributor', minWidth: 100 },
        { id: 'sgst', label: 'SGST', minWidth: 100 },
        { id: 'cgst', label: 'CGST', minWidth: 100 },
        { id: 'igst', label: 'IGST', minWidth: 100 },
        { id: 'net_amount', label: 'Bill Amount', minWidth: 100 },
    ];
    const [tableData, setTabledata] = useState([
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
    ])

    const validateForm = () => {
        const newErrors = {};
        if (!reportType) {
            newErrors.reportType = 'Select any Report Type.';
            toast.error(newErrors.reportType)
        } else if (reportType && !purchaseType) {
            newErrors.purchaseType = 'Select any Purchase Type.';
            toast.error(newErrors.purchaseType)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlefilterData = async () => {
        if (validateForm()) {
            let data = new FormData()
            setIsLoading(true);
            const params = {
                month_year: lastMonth ? format(lastMonth, 'MM-yyyy') : '',
                type: reportType,
                purchase_type: purchaseType,
            }
            try {
                await axios.post('report-gst-purches', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                ).then((response) => {
                    setIsLoading(false);
                    setPurchaseGSTData(response.data.data)
                    setTotal(response.data.data.net_amount)
                })
            } catch (error) {
                console.error("API error:", error);
            }
        }
    }

    const exportToCSV = () => {
        const filteredData = purchaseGSTData?.purches?.map(({ bill_no, bill_date, distributor, sgst, cgst, igst, net_amount }) => ({
            BillNo: bill_no,
            BillDate: bill_date,
            Distributor: distributor,
            SGST: sgst,
            CGST: cgst,
            IGST: igst,
            BillAmount: net_amount
        }));

        // Create a new worksheet from the filtered data
        const worksheet = XLSX.utils.json_to_sheet(filteredData);

        // Convert the worksheet to CSV format
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        // Convert the CSV string to a Blob
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Save the file using file-saver
        saveAs(blob, 'PurchaseBill_Report.csv');
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
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '10px 20px 0px' }}>
                        <div className="flex gap-2 pb-2">
                            <div style={{ display: 'flex', flexWrap: 'wrap', width: '800px', gap: '7px', alignItems: "center" }} s>
                                <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "180px" }}>GST Report Purchase Bills</span>
                                <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                            </div>
                            <div className="headerList" >
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="manageExpenseRow" style={{
                                padding: ' 12px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                            }}>
                                <div className="flex gap-5 flex-wrap" >
                                    <div >
                                        <div className="detail">
                                            {/* <span className="title mb-2">GST Report Month</span> */}
                                            <div style={{ width: "215px" }}>
                                                <DatePicker
                                                    className='custom-datepicker '
                                                    selected={lastMonth}
                                                    onChange={(newDate) => setLastMonth(newDate)}
                                                    dateFormat="MM/yyyy"
                                                    showMonthYearPicker
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <FormControl sx={{ minWidth: 250 }} size="small">
                                            <InputLabel id="demo-select-small-label">Report Type</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={reportType}
                                                onChange={(e) => setReportType(e.target.value)}
                                                label="Report Type">
                                                <MenuItem value="" disabled>
                                                    Select Report Type
                                                </MenuItem>
                                                <MenuItem value="0">Purchase</MenuItem>
                                                <MenuItem value="1">Purchase Return</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </div>
                                    <div>
                                        <div className="detail" >
                                            <FormControl sx={{ minWidth: 250 }} size="small">
                                                <InputLabel id="demo-select-small-label">Purchase Type</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={purchaseType}
                                                    onChange={(e) => setPurchaseType(e.target.value)}
                                                    label="Purchase Type">
                                                    <MenuItem disabled>Select Purchase Type</MenuItem>
                                                    <MenuItem value="0">With GST</MenuItem>
                                                    <MenuItem value="1">Without GST</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="contained" onClick={handlefilterData}>Go</Button>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex gap-5 ml-auto p-2 rounded-md" style={{ background: "rgba(4, 76, 157, 0.1)" }}>
                                        <span className="darkblue_text text-xl">Total</span>
                                        <p className="sky_text text-xl">Rs. {total}</p>
                                    </div>
                                </div>
                            </div>
                            {purchaseGSTData?.purches?.length > 0 ?
                                <div>
                                    <div className="overflow-x-auto mt-4">
                                        <table className="table-cashManage w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    {GSTPurchaseColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {purchaseGSTData?.purches?.map((item, index) => (
                                                    <tr key={index} >
                                                        {GSTPurchaseColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
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
                                    <div className="SearchIcon">
                                        <div>
                                            <FaSearch className="IconSize" />
                                        </div>
                                        <p className="text-gray-500 font-semibold">Apply filter to get records.</p>
                                    </div>
                                </div>


                            }
                        </div>

                    </div>
                </div >
            }
        </>
    )
}
export default PurchaseBillReport