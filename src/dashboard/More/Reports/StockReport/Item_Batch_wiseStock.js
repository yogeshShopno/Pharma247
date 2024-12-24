import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from "axios";
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from "react-toastify";



const Item_Batch_wiseStock = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [reportType, setReportType] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [companyName, setCompanyName] = useState('')
    const [drugGroup, setDrugGroup] = useState('')
    const [location, setLocation] = useState('')
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [itemWiseBatchData, setItemWiseBatchData] = useState([])
    const totalPages = Math.ceil(itemWiseBatchData.length / rowsPerPage);
    const ItemBatchWiseStockColumns = [
        { id: 'company_name', label: 'Company Name', minWidth: 100 },
        { id: 'item_name', label: 'Item Name', minWidth: 100 },
        { id: 'unit', label: 'Unit', minWidth: 100 },
        { id: 'batch_name', label: 'batch', minWidth: 100 },
        { id: "expiry_date", label: "Exp. Date", minWidth: 100 },
        { id: "stock", label: "Stock", minWidth: 100 },
        { id: "ptr", label: "PTR", minWidth: 100 },
        { id: "mrp", label: "MRP", minWidth: 100 },
        { id: 'gst', label: 'GST%', minWidth: 100 },
        { id: 'location', label: "Location", minWidth: 100 },
        { id: "base", label: "Base Amount", minWidth: 100 },
        { id: "category_name", label: "catagory", minWidth: 100 },
        { id: 'drug_group', label: 'Drug Group', minWidth: 100 },
    ];

    const handlefilterData = async (currentPage) => {
        // if (validateForm()) {
        let data = new FormData()
        setIsLoading(true)
        const params = {
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
            location: location,
            drug_group: drugGroup,
            company_name: companyName,
            page: currentPage
        }
        try {
            await axios.post('iteam-batch-vise-stock?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                setIsLoading(false)
                setItemWiseBatchData(response.data.data)
                // setTotal(response.data.data.total_amount)
                // setTotalNetProfit(response.data.data.total_net_profite)
                // setQTY(response.data.data.total_qty)
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);

        }
        // }
    }

    const exportToCSV = () => {
        if (itemWiseBatchData.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {
            const filteredData = itemWiseBatchData?.map(({ company_name, batch_name, expiry_date, ptr, mrp, base, item_name, category_name, unit, stock, location, gst, drug_group }) => ({
                CompanyName: company_name,
                ItemName: item_name,
                CategoryName: category_name,
                Unit: unit,
                Batch: batch_name,
                ExpDate: expiry_date,
                Stock: stock,
                PTR: ptr,
                MRP: mrp,
                Location: location,
                GST: gst,
                BaseAmount: base,
                DrugGroup: drug_group

            }));
            // Headers for filtered data
            const headers = ['CompanyName', 'ItemName', 'Unit', 'Batch', 'ExpDate', 'Stock', 'PTR', 'MRP', 'GST', 'Location', 'BaseAmount', 'CategoryName', 'DrugGroup'];


            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Item_Batch_WiseStock.csv');
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
                                        <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                        </span>
                                        <ArrowForwardIosIcon style={{ fontSize: '17px', color: "var(--color1)" }} />
                                        <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "180px" }}>  Item Batch Wise Stock

                                        </span>
                                        <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                                    </div>
                                    <div className="headerList">
                                        <Button
                                            variant="contained"
                                            style={{
                                                background: "var(--color1)",
                                                color: "white",
                                                textTransform: "none",
                                                paddingLeft: "35px",
                                            }}
                                            onClick={exportToCSV}>
                                            <img src="/csv-file.png"
                                                className="report-icon absolute mr-10"
                                                alt="csv Icon" />

                                            Download
                                        </Button>
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
                                                <div style={{ maxWidth: "300px" }}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        value={companyName}
                                                        size="small"
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        variant="outlined"
                                                        placeholder="Type Here..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" >
                                                                    <span className="text-black">Company Name</span>
                                                                </InputAdornment>
                                                            ),
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
                                                <div style={{ maxWidth: "300px" }} >
                                                    <TextField
                                                        id="outlined-basic"
                                                        value={drugGroup}
                                                        size="small"
                                                        onChange={(e) => setDrugGroup(e.target.value)}
                                                        variant="outlined"
                                                        placeholder="Type Here..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" >
                                                                    <span className="text-black">Drug Group</span>
                                                                </InputAdornment>
                                                            ),
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
                                                <div style={{ maxWidth: "300px" }} >
                                                    <TextField
                                                        id="outlined-basic"
                                                        value={location}
                                                        size="small"
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        variant="outlined"
                                                        placeholder="Type Here..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" >
                                                                    <span className="text-black">Location</span>
                                                                </InputAdornment>
                                                            ),
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
                                                <Button style={{
                                                background: "var(--color1)",
                                            }} variant="contained" onClick={() => handlefilterData(currentPage)}>
                                                    Go
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                    {itemWiseBatchData.length > 0 ?
                                        <div className="p-4">
                                            <div className="overflow-x-auto mt-4">
                                                <table className="table-cashManage w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            {ItemBatchWiseStockColumns.map((column) => (
                                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                                    {column.label}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itemWiseBatchData?.map((item, index) => (
                                                            <tr key={index} >
                                                                {ItemBatchWiseStockColumns.map((column) => (
                                                                    <td key={column.id}>
                                                                        {item[column.id] && item[column.id].charAt(0).toUpperCase() + item[column.id].slice(1)}
                                                                    </td>
                                                                ))}

                                                            </tr>
                                                        ))}

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
            </div>
        </>
    )
}
export default Item_Batch_wiseStock