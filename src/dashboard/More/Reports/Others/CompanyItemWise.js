import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { FormControl, InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from "react-toastify";
const CompanyItemWise = () => {
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [reportType, setReportType] = useState()
    const [searchManu, setSearchManu] = useState()
    const [errors, setErrors] = useState({})
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [companyData, setCompanyData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const GstSaleRegisterColumns = [
        { id: 'iteam_name', label: 'Item Name', minWidth: 100 },
        { id: 'unite', label: 'Unit', minWidth: 100 },
        { id: "bill_no", label: "Bill No", minWidth: 100 },
        { id: "bill_date", label: "Bill Date", minWidth: 100 },
        { id: 'batch', label: "Batch", minWidth: 100 },
        { id: 'exp_dt', label: 'Expiry', minWidth: 100 },
        { id: 'qty', label: 'Qty', minWidth: 100 },
        { id: 'free_qty', label: 'Free', minWidth: 100 },
        { id: 'net_rate', label: 'Amount', minWidth: 100 },
    ];


    const validateForm = () => {
        const newErrors = {}
        if (!searchManu) {
            newErrors.searchManu = 'Search Any Company Name'
            toast.error(newErrors.searchManu)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleFilterData = async () => {
        if (validateForm()) {
            let data = new FormData();
            setIsLoading(true);
            const params = {
                start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
                end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
                company_name: searchManu
            }
            setIsLoading(true);
            try {
                await axios.post('company-items-analysis-report', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                ).then((response) => {
                    setIsLoading(false);
                    setCompanyData(response.data.data)
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
        if (companyData.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {
            const total_amount = companyData.total;
            const filteredData = companyData?.item_list?.map(({ iteam_name, unite, bill_no, bill_date, batch, free_qty, net_rate, qty, exp_dt }) => ({
                ItemName: iteam_name,
                Unit: unite,
                BillNo: bill_no,
                BillDate: bill_date,
                Batch: batch,
                Expiry: exp_dt,
                Qty: qty,
                Free: free_qty,
                Amount: net_rate,

            }));

            // Custom data rows
            const customDataRows = [
                ['Total Amount', total_amount],
                [],
            ];

            // Headers for filtered data
            const headers = ['ItemName', 'Unit', 'BillNo', 'BillDate', 'Batch', 'Expiry', 'Qty', 'Free', 'Amount'];

            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [...customDataRows, headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Compaany_Item_Wise_Report.csv');
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
                                    <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                    </span>
                                    <ArrowForwardIosIcon style={{ fontSize: '17px', color: "var(--color1)" }} />
                                    <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "250px" }}>  Company Items Analysis Report
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
                                    </Button></div>
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
                                            <div className="detail" >
                                                <TextField
                                                    id="outlined-basic"
                                                    value={searchManu}
                                                    sx={{ minWidth: '300px' }}
                                                    size="small"
                                                    onChange={(e) => setSearchManu(e.target.value)}
                                                    variant="outlined"
                                                    placeholder="Search by Company Name"
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
                                            <Button style={{
                                                background: "var(--color1)",
                                            }}  variant="contained" onClick={handleFilterData}>

                                                Go
                                            </Button>
                                        </div>

                                    </div>
                                    <div>
                                        <div className="flex gap-5 ml-auto p-2 rounded-md" style={{ background: "rgba(4, 76, 157, 0.1)" }}>
                                            <span className="primary text-xl">Total</span>
                                            <p className="secondary text-xl">Rs. {companyData.total}</p>
                                        </div>
                                    </div>
                                </div>
                                {companyData?.item_list?.length > 0 ?
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
                                                    {companyData?.item_list?.map((item, index) => (
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
export default CompanyItemWise