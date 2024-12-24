import Header from "../../Header"
import { Button, TextField, Alert, AlertTitle, Select, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { BsLightbulbFill } from "react-icons/bs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MenuItem } from "@material-tailwind/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CashManage = () => {
    const history = useHistory()

    const token = localStorage.getItem("token")
    const cashManageDetailscolumns = [
        { id: 'date', label: 'Date', minWidth: 170 },
        // { id: 'opining_balance', label: 'Opening Balance', minWidth: 100 },
        { id: 'description', label: 'Voucher', minWidth: 100 },
        { id: 'description', label: 'Ref. No', minWidth: 100 },
        { id: 'credit', label: 'Credit', minWidth: 100 },
        { id: 'debit', label: 'Debit', minWidth: 100 },
        { id: 'amount', label: 'Total Balance', minWidth: 100 },
    ];
    const paymentOptions = [
        { id: 1, label: 'Credit' },
        { id: 2, label: 'Debit' },
    ]
    const initialSearchTerms = cashManageDetailscolumns.map(() => '');
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
    const [openAddPopUpDownload, setOpenAddPopUpDownload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pdfIcon = process.env.PUBLIC_URL + '/pdf.png';
    const [tableData, setTableData] = useState([
    ]);
    const [startdate, setStartDate] = useState(subDays(new Date(), 15));
    const [enddate, setEndDate] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [catagory, setCatagory] = useState([])
    const [description, setDescription] = useState([])
    const [cashManageDetails, setCashmageDetails] = useState([])
    const [cashType, setCashType] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    // const paginatedData = cashManage?.cash_list?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const [data, setData] = useState([])

    useEffect(() => {
        CatagoryList();
        CaseManageMentList();
    }, [page, rowsPerPage])

    const CatagoryList = async () => {
        let data = new FormData()
        setIsLoading(true);
        try {
            await axios.post('cash-category-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false)
                setCatagory(response.data.data)
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }
    const CaseManageMentList = async () => {
        let data = new FormData()
        setIsLoading(true);
        const params = {
            start_date: startdate ? format(startdate, 'yyyy-MM-dd') : '',
            end_date: enddate ? format(enddate, 'yyyy-MM-dd') : '',
            page: page + 1,
            limit: rowsPerPage
        }
        try {
            await axios.post('cash-managment-list', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false);
                setCashmageDetails(response.data.data)
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const sortByColumn = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...tableData].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setTableData(sortedData);
    };

    // const filteredList = paginatedData.filter(row => {
    //     return searchTerms.every((term, index) => {
    //         const value = row[cashManageDetailscolumns[index].id];
    //         return String(value).toLowerCase().includes(term.toLowerCase());
    //     });
    // });
    const handlePdf = () => {
        setOpenAddPopUpDownload(true)
        pdfGenerator();
    }

    const pdfGenerator = async () => {
        let data = new FormData();
        const params = {
            start_date: startdate ? format(startdate, 'yyyy-MM-dd') : '',
            end_date: enddate ? format(enddate, 'yyyy-MM-dd') : ''
        }
        try {
            const response = await axios.post("cash-managment-pdf", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                // responseType: 'blob', // Ensure the response is in blob format

            });
            if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }

        } catch (error) {
            console.error("API error:", error);
        }
    };
    // const capitalizeFirstLetter = (string) => {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <div>
                <Header />
                {isLoading ? <div className="loader-container ">
                    <Loader />
                </div> :
                    <div style={{ backgroundColor: 'rgb(239 239 239)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                        <div className='pt-4' style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '7px', marginBottom: "10px", alignItems: 'center' }}>
                                <span className='primary' style={{ display: 'flex', fontWeight: 700, fontSize: '20px', width: '180px' }} >Cash Management</span>
                                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
                            </div>
                            <div className="headerList" style={{ marginBottom: "10px" }}>
                                <Button variant="contained" style={{ background: 'var(--color1)', color: 'white', paddingLeft: "35px", textTransform: 'none' }} onClick={handlePdf} ><img src="/csv-file.png"
                                    className="report-icon absolute mr-10"
                                    alt="csv Icon"
                                />Download</Button>
                            </div>
                        </div>
                        <div className="firstrow flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="detail">
                                    <span className="text-gray-500">Start Date</span>
                                    <DatePicker
                                        className='custom-datepicker'
                                        selected={startdate}
                                        onChange={(newDate) => setStartDate(newDate)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="detail">
                                    <span className="text-gray-500">End Date</span>
                                    <DatePicker
                                        className='mt-4 md:mt-0 min-h-[41px] h-[41px] flex items-center justify-center custom-datepicker'
                                        selected={enddate}
                                        onChange={(newDate) => setEndDate(newDate)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="detail mt-5">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={CaseManageMentList}
                                        className="mt-4 md:mt-0 min-h-[41px] h-[41px]  text-white flex items-center justify-center"
                                        style={{ background: "#3f6212" }}
                                    >
                                        <FilterAltIcon className="text-white text-lg" />
                                        Filter
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 bg-gray-200 p-3 rounded-lg mt-4 md:mt-0">
                                <div>
                                    <div className="relative">
                                        <h2 className="secondary font-medium text-xl ml-6"><FaArrowDown className="absolute left-0 bg-blue-500 text-white rounded-full p-1 mt-1" />Total In</h2>
                                    </div>
                                    <div className="flex">
                                        <h2 className="secondary font-bold text-xl ml-6">Rs.{parseInt(cashManageDetails.credit).toFixed(2)}</h2>
                                    </div>
                                </div>
                                <div>
                                    <div className="relative">
                                        <h2 className="text-red-600 font-medium text-xl ml-6"><FaArrowUp className="absolute left-0 bg-red-600 text-white rounded-full p-1 mt-1" />Total Out</h2>
                                    </div>
                                    <div className="flex">
                                        <h2 className="text-red-600 font-bold text-xl ml-6">Rs.{parseInt(cashManageDetails.debit).toFixed(2)}</h2>
                                    </div>
                                </div>
                                <div >
                                    <div className="relative">
                                        <h2 className="primary font-medium text-xl ml-6">Net</h2>
                                    </div>
                                    <div className="flex">
                                        <h2 className="secondary font-bold text-xl ml-6">Rs.{parseInt(cashManageDetails.total).toFixed(2)}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto mt-4" >
                            <table className="w-full border-collapse custom-table">
                                <thead>
                                    <tr>
                                        {cashManageDetailscolumns.map((column) => (
                                            <th
                                                key={column.id}
                                                onClick={() => sortByColumn(column.id)}
                                                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                <div className="headerStyle">
                                                    <span>{column.label}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashManageDetails?.cash_list?.map((row) => {
                                        return (
                                            <tr
                                                key={row.code}
                                                className="hover:bg-gray-100 cursor-pointer"
                                                tabIndex={-1}
                                            >
                                                {cashManageDetailscolumns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <td
                                                            key={column.id}
                                                            align={column.align}
                                                            className={`px-4 py-2 whitespace-nowrap ${column.id === 'debit' ? 'debit-cell' :
                                                                column.id === 'credit' ? 'credit-cell' : ''
                                                                }`}
                                                        >
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 12]}
                            component="div"
                            count={cashManageDetails?.count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                        <Dialog open={openAddPopUpDownload}
                            sx={{
                                "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                        width: "600px",
                                        maxWidth: "1500px",
                                        backgroundColor: 'none',
                                        boxShadow: 'none',
                                        marginBottom: "0"
                                    },
                                },
                            }}
                        >
                            <Alert

                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={(() => { setOpenAddPopUpDownload(false) })}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                            >
                                <h4 className="font-bold text-lg">  Please check your email. </h4>
                                <span className="text-base">You will receive a maill from us within the next few minutes.</span>
                            </Alert>
                        </Dialog>
                    </div>
                }
            </div>
        </>
    )
}
export default CashManage