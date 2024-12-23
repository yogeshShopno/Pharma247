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
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from "axios";
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from "react-toastify";

const Purchase_Return_Report = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [reportType, setReportType] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [distributorName, setDistributorName] = useState('')
    const [drugGroup, setDrugGroup] = useState('')
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [purchaseReturnData, setPurchaseReturnData] = useState([])
    const totalPages = Math.ceil(purchaseReturnData?.purches_return?.length / rowsPerPage);

    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const GstSaleRegisterColumns = [
        { id: 'bill_date', label: 'Bill Date', minWidth: 100 },
        { id: 'bill_no', label: 'Bill No', minWidth: 100 },
        { id: 'distributer', label: 'Distributor Name', minWidth: 100 },
        { id: "type", label: "Type", minWidth: 100 },
        { id: "amount", label: "Amount", minWidth: 100 }
    ];

    const exportToCSV = () => {
        if (purchaseReturnData?.purches_return?.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {
            const total = purchaseReturnData?.purches_return_total;

            const filteredData = purchaseReturnData?.purches_return?.map(({ bill_no, bill_date, distributer, type, amount, }) => ({
                BillNo: bill_no,
                BillDate: bill_date,
                DistributorName: distributer,
                Type: type,
                Amount: amount,

            }));

            // Custom data rows
            const customDataRows = [
                ['Total Amount', total],
                [],
            ];

            // Headers for filtered data
            const headers = ['BillNo', 'BillDate', 'DistributorName', 'Type', 'Amount'];


            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [...customDataRows, headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Purchase_Return_Report.csv');
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

    const handlefilterData = async (currentPage) => {
        let data = new FormData()
        setIsLoading(true)
        const params = {
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
            distributer_name: distributorName,
            page: currentPage
        }
        try {
            await axios.post('purches-return-report', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                setIsLoading(false)
                setPurchaseReturnData(response.data.data)
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }

                if (response.data.data.length >= rowsPerPage) {
                    // Implement a state variable or logic to disable the button
                    setNextButtonDisabled(false); // Example state variable
                } else {
                    setNextButtonDisabled(true); // Enable the button if more data is available
                }
            })
        } catch (error) {
            console.error("API error:", error);

        }
    }
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
                                <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "190px" }}>
                                    Purchase Return Report
                                </span>
                                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList" >
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV} ><img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
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
                                                value={distributorName}
                                                size="small"
                                                onChange={(e) => setDistributorName(e.target.value)}
                                                variant="outlined"
                                                placeholder="Type Here..."
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" >
                                                            <span className="text-black">Distributor Name</span>
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
                                        <Button variant="contained" onClick={() => handlefilterData(currentPage)}>
                                            Go
                                        </Button>
                                    </div>

                                </div>
                                <div className="mt-6">
                                    <div className="flex gap-5 ml-auto p-2 rounded-md" style={{ background: "rgba(4, 76, 157, 0.1)" }}>
                                        <span className="primary text-xl">Total</span>
                                        <p className="secondary text-xl">Rs. {!purchaseReturnData?.purches_return_total ? 0 : purchaseReturnData?.purches_return_total}</p>
                                    </div>
                                </div>
                            </div>
                            {purchaseReturnData?.purches_return?.length > 0 ?
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
                                                {purchaseReturnData?.purches_return?.map((item, index) => (
                                                    <tr key={index} >
                                                        {GstSaleRegisterColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
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
                                            className={`mx-1 px-3 py-1 rounded ${nextButtonDisabled ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'}`}
                                            disabled={nextButtonDisabled}
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
        </>
    )
}
export default Purchase_Return_Report