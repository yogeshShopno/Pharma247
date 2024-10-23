import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from "react-toastify";

const Stock_AdjustMent_Report = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    // const [startDate, setStartDate] = useState(dayjs().add(-2, 'day'));
    // const [endDate, setEndDate] = useState(dayjs())
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [itemSearch, setItemSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const rowsPerPage = 10;
    const [adjustStockListData, setAdjustStockListData] = useState([]);
    const totalPages = Math.ceil(adjustStockListData.length / rowsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0)

    const GstSaleRegisterColumns = [
        { id: 'adjusted_by', label: 'Adjusted By', minWidth: 100 },
        { id: 'adjustment_date', label: 'Adjustment Date', minWidth: 10 },
        { id: 'iteam_name', label: 'Item Name', minWidth: 100 },
        { id: 'batch_name', label: 'Batch', minWidth: 100 },
        { id: 'unite', label: 'Unit', minWidth: 100 },
        { id: 'expriy', label: 'Expiry', minWidth: 100 },
        { id: 'company_name', label: 'Company Name', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'stock', label: 'Total Stock', minWidth: 100 },
        { id: 'stock_adjust', label: 'Stock Adjusted', minWidth: 100 },
        // { id: 'remaining_stock', label: 'Remaining Stock', minWidth: 100 },
        { id: 'stock_adjust_amount', label: 'Stock Adjust Amount', minWidth: 100 },
    ];
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';

    const adjustStockList = async () => {
        let data = new FormData();
        const params = {
            page: currentPage,
            search: itemSearch,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        };
        try {
            const res = await axios.post("adjust-stock-list", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setAdjustStockListData(response.data.data.data);
                setTotal(response.data.data.total_amount)
                toast.success(response.data.message)
            })
        } catch (error) {
            toast.success(error.data.message)
        }
    }

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        adjustStockList(newPage);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            adjustStockList(newPage);
        }
    };

    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        adjustStockList(pageNum);
    };


    const exportToCSV = () => {
        if (adjustStockListData?.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {
            // const total = adjustStockListData?.purches_return_total;

            const filteredData = adjustStockListData?.map(({ adjusted_by, adjustment_date, iteam_name, batch_name, unite, expriy, company_name, mrp, stock, stock_adjust, remaining_stock }) => ({
                AdjustedBy: adjusted_by,
                AdjustDate: adjustment_date,
                ItemName: iteam_name,
                BatchName: batch_name,
                Expiry: expriy,
                CompanyName: company_name,
                MRP: mrp,
                Stock: stock,
                AdjustStock: stock_adjust,
                RemainingStock: remaining_stock

            }));

            // Custom data rows
            const customDataRows = [
                ['Total Amount', 0],
                [],
            ];

            // Headers for filtered data
            const headers = ['AdjustedBy', 'AdjustDate', 'ItemName', 'BatchName', 'Expiry', 'CompanyName', 'MRP', 'Stock', 'AdjustStock', 'RemainingStock'];


            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [...customDataRows, headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Stock_Adjustment_Report.csv');
        }
    };

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
                                    <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "182px" }}>  Stock Adjustment Report

                                    </span>
                                    <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                                </div>
                                <div className="headerList">
                                    <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                                </div>
                            </div>
                            <div className="bg-white ">
                                <div
                                    className="manageExpenseRow"
                                    style={{
                                        padding: '20px 24px',
                                        borderBottom: "2px solid rgb(0 0 0 / 0.1)",
                                    }}
                                >
                                    <div className="contents flex-wrap">
                                        <div className="flex gap-5 flex-wrap">
                                            <div className="detail">
                                                <span className="text-gray-500">Start Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={startDate}
                                                    onChange={(newDate) => setStartDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>

                                            <div className="detail">
                                                <span className="text-gray-500">End Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={endDate}
                                                    onChange={(newDate) => setEndDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>

                                            <div className="detail mt-6">
                                                <TextField
                                                    id="outlined-basic"
                                                    value={itemSearch}
                                                    sx={{ minWidth: '300px' }}
                                                    size="small"
                                                    onChange={(e) => setItemSearch(e.target.value)}
                                                    variant="outlined"
                                                    placeholder="Search by Item name, adjusted by"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                        type: 'search',
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-6">
                                                <Button variant="contained" onClick={() => adjustStockList(currentPage)}>
                                                    Go
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-6 ml-auto">
                                            <div
                                                className="flex gap-5 p-2 rounded-md"
                                                style={{ background: "rgba(4, 76, 157, 0.1)" }}
                                            >
                                                <span className="darkblue_text text-xl">Total</span>
                                                <p className="sky_text text-xl">Rs.{total}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {adjustStockListData.length > 0 ?
                                    <div className="p-4">
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
                                                    {adjustStockListData?.map((item, index) => (
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
                                        <div className="mt-4 space-x-1" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} >
                                            <button
                                                onClick={handlePrevious}
                                                className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg_darkblue text-white'
                                                    }`}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleClick(i + 1)}
                                                    className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg_darkblue text-white' : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleNext}
                                                className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'bg_darkblue text-white'
                                                    }`}
                                            // disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
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
                    }
                </div>
            </div>
        </>
    )
}
export default Stock_AdjustMent_Report