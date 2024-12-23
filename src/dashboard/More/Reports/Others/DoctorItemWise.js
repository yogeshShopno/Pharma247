import Header from "../../../Header"
import { useEffect, useState } from "react";
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import Loader from "../../../../componets/loader/Loader";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from "react-toastify";
const DoctorItemWise = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [reportType, setReportType] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState()
    const [itemSearch, setItemSearch] = useState()
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [total, setTotal] = useState(0)
    const [qTY, setQTY] = useState('')
    const [totalNetProfit, setTotalNetProfit] = useState('')
    const [errors, setErrors] = useState({})
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const [doctorItemWiseData, setDoctorItemWiseData] = useState([])
    const totalPages = Math.ceil(doctorItemWiseData.length / rowsPerPage);
    const DoctorItemWiseColumns = [
        { id: "bill_no", label: "Bill No", minWidth: 100 },
        { id: "bill_date", label: "Bill Date", minWidth: 100 },
        { id: 'doctor_name', label: "Doctor Name ", minWidth: 100 },
        { id: 'phone_number', label: "Mobile", minWidth: 100 },
        { id: 'item_name', label: 'Item Name', minWidth: 100 },
        { id: 'unit', label: 'Unit', minWidth: 100 },
        { id: 'exp', label: 'Expiry', minWidth: 100 },
        { id: 'sales_rate', label: 'Sale Rate', minWidth: 100 },
        { id: 'qty', label: 'Qty', minWidth: 100 },
        { id: 'amount', label: 'Amount', minWidth: 100 },
        { id: 'net_profit', label: 'Net Profit', minWidth: 100 },
    ];
    const fieldsWithCurrency = ['sales_rate', 'amount', 'net_profit'];
    const validateForm = () => {
        const newErrors = {};
        if (!reportType) {
            newErrors.reportType = 'Select any Report Type.';
            toast.error(newErrors.reportType)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlefilterData = async (currentPage) => {
        if (validateForm()) {
            let data = new FormData()
            setIsLoading(true)
            const params = {
                start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
                end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
                type: reportType,
                item_name: itemSearch,
                doctor_name: doctorSearch,
                page: currentPage
            }
            try {
                await axios.post('item-wise-doctor', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((response) => {
                    setIsLoading(false)
                    setDoctorItemWiseData(response.data.data)
                    setTotal(response.data.data.total_amount)
                    setTotalNetProfit(response.data.data.total_net_profite)
                    setQTY(response.data.data.total_qty)
                    if(response.data.status === 401){ 
                        history.push('/');
                        localStorage.clear();
                    }
                })
            } catch (error) {
                console.error("API error:", error);

            }
        }
    }

    const exportToCSV = () => {
        if (doctorItemWiseData.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {
            const total_amount = doctorItemWiseData.total_amount;
            const total_net_profite = doctorItemWiseData.total_net_profite;
            const total_qty = doctorItemWiseData.total_qty;

            const filteredData = doctorItemWiseData?.doctor_report?.map(({ bill_no, bill_date, doctor_name, phone_number, net_profit, amount, sales_rate, qty, exp, unit, item_name, }) => ({
                BillNo: bill_no,
                BillDate: bill_date,
                DoctorName: doctor_name,
                MobileNo: phone_number,
                ItemName: item_name,
                Unit: unit,
                Expiry: exp,
                SaleRate: sales_rate,
                Qty: qty,
                Amount: amount,
                NetProfit: net_profit,

            }));

            // Custom data rows
            const customDataRows = [
                ['Total Amount', total_amount],
                ['Total Quantity', total_qty],
                ['Total Net Profit', total_net_profite],
                [],
            ];

            // Headers for filtered data
            const headers = ['BillNo', 'BillDate', 'DoctorName', 'MobileNo', 'ItemName', 'Unit', 'Expiry', 'SaleRate', 'Qty', 'Amount', 'NetProfit'];


            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [...customDataRows, headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Doctor_Item_Wise_Report.csv');
        }
    };

    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        handlefilterData(pageNum)
    };
    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            handlefilterData(newPage);
        }
    };

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        handlefilterData(newPage);
    };

    return (
        <>
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
                                <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '17px', color: "var(--color1)" }} />
                                <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "220px" }}>  Item Wise Doctor Wise Report
                                </span>
                                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                            </div>
                        </div>
                        <div className="bg-white ">
                            <div className="manageExpenseRow" style={{
                                padding: ' 20px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                            }}>
                                <div className="flex gap-5 flex-wrap" >
                                    <div className="detail">
                                        <span className="text-gray-500">Start Date</span>
                                        <div style={{ width: "215px" }}>
                                            <DatePicker
                                                className='custom-datepicker '
                                                selected={startDate}
                                                onChange={(newDate) => setStartDate(newDate)}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </div>

                                    <div className="detail">
                                        <span className="text-gray-500">End Date</span>
                                        <div style={{ width: "215px" }}>
                                            <DatePicker
                                                className='custom-datepicker '
                                                selected={endDate}
                                                onChange={(newDate) => setEndDate(newDate)}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <FormControl sx={{ minWidth: 250 }} size="small">
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
                                                <MenuItem value="0">Sale</MenuItem>
                                                <MenuItem value="1">Sale Return</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="mt-6">
                                        <div className="detail" >
                                            <TextField
                                                id="outlined-basic"
                                                value={doctorSearch}
                                                sx={{ minWidth: '250px' }}
                                                size="small"
                                                onChange={(e) => setDoctorSearch(e.target.value)}
                                                variant="outlined"
                                                placeholder="Doctor Name"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                    type: 'search'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="detail" >
                                            <TextField
                                                id="outlined-basic"
                                                value={itemSearch}
                                                sx={{ minWidth: '250px' }}
                                                size="small"
                                                onChange={(e) => setItemSearch(e.target.value)}
                                                variant="outlined"
                                                placeholder="item Name"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                    type: 'search'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button variant="contained" onClick={() => handlefilterData(currentPage)}>
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
                            {doctorItemWiseData?.doctor_report?.length > 0 ?
                                <div className="p-4">
                                    <div className="overflow-x-auto mt-4">
                                        <table className="saleRegisterTotal-table w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    {/* <th>SR No.</th> */}
                                                    {DoctorItemWiseColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    {DoctorItemWiseColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.id === 'amount' ? (
                                                                <span className="secondary">Rs. {total}</span>
                                                            ) : column.id === 'net_profit' ? (
                                                                <span className="secondary" >Rs. {totalNetProfit}</span>
                                                            ) : column.id === 'qty' ? (
                                                                <span className="secondary" >{qTY}</span>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctorItemWiseData?.doctor_report?.map((item, index) => (
                                                    <tr key={index} >
                                                        {DoctorItemWiseColumns.map((column) => (
                                                            <td key={column.id} style={{ minWidth: column.minWidth }}>
                                                                {fieldsWithCurrency.includes(column.id) ? `Rs.${item[column.id]}` : item[column.id]}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))}

                                                {/* {doctorItemWiseData?.doctor_report?.map((row, index) => {
                                                    return (
                                                        <tr hover role="checkbox" tabIndex={-1} key={row.code} >
                                                            <td>
                                                                {startIndex + index}
                                                            </td>
                                                            {DoctorItemWiseColumns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <td key={column.id} align={column.align}>
                                                                        {column.format && typeof value === 'number'
                                                                                ? column.format(value)
                                                                                : value}
                                                                        
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })} */}

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-4 space-x-1" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <button
                                            onClick={handlePrevious}
                                            className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'
                                                }`}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleClick(i + 1)}
                                                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'secondary-bg text-white' : 'bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleNext}
                                            className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'}`}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
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
        </>
    )
}
export default DoctorItemWise

