import Header from "../../../Header"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
const Top_Distributor = () => {
    const history = useHistory()
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [errors, setErrors] = useState({});
    const [topSellingBy, setTopSellingBy] = useState('')
    const [limit, setLimit] = useState('')
    const [topDistributorData, setTopDistributorData] = useState([])
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const TopDistributorColumns = [
        { id: 'distributor_name', label: 'Distributor Name', minWidth: 100 },
        { id: 'gst_in', label: 'GSTIN', minWidth: 100 },
        { id: 'total', label: 'Total Amount', minWidth: 100 },
        { id: 'count', label: 'Orders Count', minWidth: 100 },
        // { id: 'uniqueMedicines', label: 'Unique Medicines', minWidth: 100 },
    ];

    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(topDistributorData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const handlefilterData = async () => {
        let data = new FormData()
        setIsLoading(true);
        const params = {
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
        }
        try {
            await axios.post('top-distributor', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false);
                setTopDistributorData(response.data.data)
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const exportToCSV = () => {
        if (topDistributorData.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {

            const filteredData = topDistributorData?.map(({ distributor_name, gst_in, total, count }) => ({
                DistributorName: distributor_name,
                GSTIN: gst_in,
                TotalAmount: total,
                OrderCount: count
            }));

            // Headers for filtered data
            const headers = ['DistributorName', 'GSTIN', 'TotalAmount', 'OrderCount'];

            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Top_Distributors.csv');
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
                                <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "110px" }}> Top Distributors
                                </span>
                                <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                            </div>
                            <div className="headerList" >
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV} > <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
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

                                    <div className="mt-6">
                                        <Button variant="contained" onClick={handlefilterData}>
                                            Go
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {topDistributorData.length > 0 ?
                                <div>
                                    <div className="overflow-x-auto mt-4">
                                        <table className="table-cashManage w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    <th>SR. No</th>
                                                    {TopDistributorColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topDistributorData.map((row, index) => {
                                                    return (
                                                        <tr hover role="checkbox" tabIndex={-1} key={row.code}>
                                                            <td>{startIndex + index}</td>
                                                            {TopDistributorColumns.map((column) => {
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
export default Top_Distributor