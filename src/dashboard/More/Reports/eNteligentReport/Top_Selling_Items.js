import Header from "../../../Header"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from "react-toastify";
const Top_Selling_Items = () => {
    const history = useHistory()
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [errors, setErrors] = useState({});
    // const [topSellingBy, setTopSellingBy] = useState()
    // const [limit, setLimit] = useState('')
    const [topSellingData, setTopSellingData] = useState([])
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [topSaleData, setTopSaleData] = useState([])
    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(topSaleData.length / rowsPerPage);

    const TopSallingColumns = [
        { id: 'iteam_name', label: 'Medicine Name', minWidth: 100 },
        { id: 'company_name', label: 'Company Name', minWidth: 100 },
        { id: 'qty', label: 'Total Quantity', minWidth: 100 },
        { id: 'amt', label: 'Sales Amount', minWidth: 100 },
        // { id: 'uniqueorder', label: 'Unique Orders', minWidth: 100 },
    ];
    const startIndex = (currentPage - 1) * rowsPerPage + 1;

    useEffect(() => {
        listOfCompany()
    }, [])
    let listOfCompany = () => {
        axios
            .get("company-list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                //console.log("API Response Pharma:===", response);
                setCompanyList(response.data.data);
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    };

    const handlefilterData = async (currentPage) => {
        let data = new FormData()
        setIsLoading(true);
        const params = {
            // start_date: startDate.format('YYYY-MM-DD'),
            // end_date: endDate.format('YYYY-MM-DD'),
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
            page: currentPage,
            company_name: selectedCompany?.id,
        }
        try {
            await axios.post('top-selling-items?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false);
                setTopSaleData(response.data.data)
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }
    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        handlefilterData(pageNum);
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


    const exportToCSV = () => {
        if (topSaleData.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {

            const filteredData = topSaleData?.map(({ iteam_name, company_name, qty, amt }) => ({
                MedicineName: iteam_name,
                CompanyName: company_name,
                TotalQuantity: qty,
                SalesAmount: amt
            }));

            // Headers for filtered data
            const headers = [
                'MedicineName', ' CompanyName', 'TotalQuantity', 'SalesAmount'];

            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Top_Selling_Items.csv');
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
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "120px" }}> Top Selling Items
                                </span>
                                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="manageExpenseRow" style={{
                                padding: ' 12px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
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
                                    <div className="fields" style={{ marginTop: "25px" }}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={companyList}
                                            size="small"
                                            value={selectedCompany}
                                            onChange={(e, value) => setSelectedCompany(value)}
                                            sx={{ width: 300 }}
                                            getOptionLabel={(option) => option.company_name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Company"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <Button variant="contained" onClick={() => handlefilterData(currentPage)} >
                                            Go
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {topSaleData.length > 0 ?
                                <div className="p-4">
                                    <div className="overflow-x-auto mt-4">
                                        <table className="table-cashManage w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    <th>SR. No</th>
                                                    {TopSallingColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topSaleData
                                                    .map((row, index) => {
                                                        return (
                                                            <tr hover role="checkbox" tabIndex={-1} key={row.code} >
                                                                <td>
                                                                    {startIndex + index}
                                                                </td>
                                                                {TopSallingColumns.map((column) => {
                                                                    const value = row[column.id];
                                                                    const formattedValue =
                                                                        typeof value === 'string' && value.length > 0
                                                                            ? value.charAt(0).toUpperCase() + value.slice(1)
                                                                            : value;
                                                                    return (
                                                                        <td key={column.id} align={column.align}>
                                                                            {column.format && typeof value === 'number'
                                                                                ? column.format(value)
                                                                                : formattedValue}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-4 space-x-1" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                                    >
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
                                            className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'
                                                }`}
                                            disabled={currentPage != totalPages}
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
                </div >
            }
        </>
    )
}
export default Top_Selling_Items