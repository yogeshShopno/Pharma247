import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import * as XLSX from 'xlsx';
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import axios from "axios";
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from "react-toastify";
const DayWiseSummary = () => {
    const history = useHistory()
    const [monthDate, setMonthDate] = useState(new Date());
    const [reportType, setReportType] = useState()
    const [dayWiseSummaryData, setDayWiseSummaryData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [errors, setErrors] = useState({});
    const [total, setTotal] = useState(0)
    const DayWiseSummaryColumns = [
        { id: "bill_date", label: "Bill Date", minWidth: 100 },
        { id: "bill_no", label: "Bill No", minWidth: 100 },
        { id: 'name', label: "Person Name", minWidth: 100 },
        { id: 'cgst', label: 'CGST', minWidth: 100 },
        { id: 'sgst', label: 'SGST', minWidth: 100 },
        { id: 'total_amount', label: 'Total', minWidth: 100 },
    ];
    const validateForm = () => {
        const newErrors = {};
        if (!reportType) {
            newErrors.reportType = 'Select any Report Type.';
            toast.error(newErrors.reportType)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlefilterData = async () => {
        if (validateForm()) {
            let data = new FormData()
            setIsLoading(true);
            const params = {
                month_year: monthDate ? format(monthDate, 'MM-yyyy') : '',
                type: reportType
            }
            try {
                await axios.post('day-vise-summry?', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                ).then((response) => {
                    setIsLoading(false);
                    setDayWiseSummaryData(response.data.data)
                    setTotal(response.data.data.total)
                    if (response.data.status === 401) {
                        history.push('/');
                        localStorage.clear();
                    }
                })
            } catch (error) {
                console.error("API error:", error);
            }
        }

    }

    const exportToCSV = async () => {
        if (dayWiseSummaryData?.length == 0) {
            toast.error('Apply filter, then download records.')
        } else {
            let data = new FormData()
            const params = {
                month_year: monthDate.format('MM-YYYY'),
                type: reportType
            }
            try {
                const response = await axios.post('day-vise-summry?', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(response.data.data.bill_list); // Ensure bill_list is used
                const total = parseFloat(response.data.data.total).toFixed(2);

                // Add a row for total after the bill list
                const totalRow = {
                    id: '',
                    bill_no: '',
                    bill_date: '',
                    name: '',
                    cgst: '',
                    sgst: 'Total',
                    total_amount: total // Show the calculated total here
                };
                const totalRowIndex = XLSX.utils.sheet_add_json(worksheet, [totalRow], {
                    skipHeader: true,
                    origin: XLSX.utils.decode_range(worksheet['!ref']).e.r + 1 // Add the total row after the last row of bill_list
                });
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

                if (reportType == 0) {
                    saveAs(blob, 'Purchase-DayWise-Summary-Report.xlsx');
                } else if (reportType == 1) {
                    saveAs(blob, 'Purchase-Return-DayWise-Summary-Report.xlsx');
                } else if (reportType == 2) {
                    saveAs(blob, 'Sale-DayWise-Summary-Report.xlsx');
                } else if (reportType == 3) {
                    saveAs(blob, 'Sale-Return-DayWise-Summary-Report.xlsx');
                }
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            } catch (error) {
                console.error("API error:", error);
            }
        }
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
                            <div style={{ display: 'flex', flexWrap: 'wrap', width: '800px', gap: '7px', alignItems: "center" }}>
                                <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '17px', color: "var(--color1)" }} />
                                <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "150px" }}> Day wise Summary

                                </span>
                                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList" >
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                            </div>
                        </div>
                        <div className="bg-white ">
                            <div className="manageExpenseRow" style={{
                                padding: ' 20px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                            }}>
                                <div className="flex gap-5 flex-wrap" >
                                    <div>
                                        <div style={{ width: "215px" }}>
                                            <DatePicker
                                                className='custom-datepicker '
                                                selected={monthDate}
                                                onChange={(newDate) => setMonthDate(newDate)}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <FormControl sx={{ minWidth: 200 }} size="small">
                                            <InputLabel id="demo-select-small-label">Report Type</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={reportType}
                                                onChange={(e) => setReportType(e.target.value)}
                                                label="Report Type"

                                            >
                                                <MenuItem value="" disabled>
                                                    Select Report Type
                                                </MenuItem>
                                                <MenuItem value="0">Purchase</MenuItem>
                                                <MenuItem value="1">Purchase Return</MenuItem>
                                                <MenuItem value="2">Sales</MenuItem>
                                                <MenuItem value="3">Sales Return</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div>
                                        <Button variant="contained" onClick={handlefilterData}>
                                            Go
                                        </Button>
                                    </div>

                                </div>
                                <div>
                                    <div className="flex gap-5 ml-auto p-2 rounded-md" style={{ background: "rgba(4, 76, 157, 0.1)" }}>
                                        <span className="primary text-xl">Total</span>
                                        <p className="secondary text-xl">Rs. {total}</p>
                                    </div>
                                </div>
                            </div>
                            {dayWiseSummaryData?.bill_list?.length > 0 ?
                                <div>
                                    <div className="overflow-x-auto mt-4">
                                        <table className="table-cashManage w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    {DayWiseSummaryColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dayWiseSummaryData?.bill_list?.map((item, index) => (
                                                    <tr key={index} >
                                                        {DayWiseSummaryColumns.map((column) => (
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
                </div>
            }
        </>
    )
}
export default DayWiseSummary