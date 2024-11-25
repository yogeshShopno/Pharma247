import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Header from "../../../Header"
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { MdDelete } from "react-icons/md";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Loader from "../../../../componets/loader/Loader";
import { FaFilePdf } from "react-icons/fa6";
import usePermissions, { hasPermission } from "../../../../componets/permission";
import { toast } from "react-toastify";
import { format, subDays } from "date-fns";
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';

const columns = [
    { id: 'bill_no', label: 'Bill No', minWidth: 70, height: 100 },
    { id: 'bill_date', label: 'Bill Date', minWidth: 50 },
    { id: 'name', label: 'Customer Name', minWidth: 100 },
    { id: 'mobile_numbr', label: 'Mobile No. ', minWidth: 100 },
    { id: "payment_name", label: 'Payment Mode', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'net_amt', label: 'Bill Amount', minWidth: 100 },
];
const Salelist = () => {
    const permissions = usePermissions();
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [tableData, setTableData] = useState([]);
    const rowsPerPage = 10;
    const initialSearchTerms = columns.map(() => '');
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [IsDelete, setIsDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // const [startIndex, setStartIndex] = useState(0);
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15))
    const [PdfendDate, setPdfEndDate] = useState(new Date());
    const [openAddPopUp, setOpenAddPopUp] = useState(false);

    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const [saleId, setSaleId] = useState(null)
    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        saleBillList(pageNum);
    };
    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            saleBillList(newPage);
        }
    };

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        saleBillList(newPage);
    };

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

    const handleSearchChange = (index, value) => {
        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = value;
        setSearchTerms(newSearchTerms);
    };

    const filteredList = tableData.filter(row => {
        return searchTerms.every((term, index) => {
            const value = row[columns[index].id];
            return String(value).toLowerCase().includes(term.toLowerCase());
        });
    });

    const goIntoAdd = () => {
        history.push('/addsale')
    }

    const deleteOpen = (id) => {
        setIsDelete(true);
        setSaleId(id);
    };

    const deleteClose = () => {
        setIsDelete(false);
    };

    useEffect(() => {
        // saleBillList();
        if (tableData.length > 0) {
            localStorage.setItem('BillNo', tableData[0].count + 1);
        } else {
            localStorage.setItem('BillNo', 1);
        }

    }, [tableData, currentPage]);

    useEffect(() => {
        saleBillList();
        //     // if (tableData.length > 0) {
        //     // const count = tableData[0].count + 1;
        //     // setStartIndex(count);
        //     localStorage.setItem('BillNo', tableData[0]?.count + 1);
        //     // }
    }, [])

    const saleBillList = async (currentPage) => {
        setIsLoading(true);
        let data = new FormData();
        data.append('page', currentPage);
        try {
            const response = await axios.post("sales-list?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setTableData(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("API error:", error);
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!saleId) return;
        let data = new FormData();
        data.append("id", saleId);
        const params = {
            id: saleId
        };
        try {
            await axios.post("delete-sales?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                saleBillList();
                setIsDelete(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const AllPDFGenerate = async () => {
        let data = new FormData();
        data.append('start_date', PdfstartDate ? format(PdfstartDate, 'yyyy-MM-dd') : '');
        data.append('end_date', PdfendDate ? format(PdfendDate, 'yyyy-MM-dd') : '');

        setIsLoading(true);
        try {
            await axios.post("multiple-sale-pdf-downloads", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {

                const PDFURL = response.data.data.pdf_url;
                toast.success(response.data.meassage)
                //console.log(PDFURL, 'hh');
                setOpenAddPopUp(false)
                setIsLoading(false);
                handlePdf(PDFURL);
            });
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const pdfGenerator = async (id) => {
        let data = new FormData();
        data.append('id', id);
        setIsLoading(true);
        try {
            await axios.post("sales-pdf-downloads", data, {
                params: { id },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {

                const PDFURL = response.data.data.pdf_url;
                toast.success(response.data.meassage)
                //console.log(PDFURL, 'hh');
                setIsLoading(false);
                handlePdf(PDFURL);
            });
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handlePdf = (url) => {
        if (typeof url === 'string') {
            // Open the PDF in a new tab
            window.open(url, '_blank');
        } else {
            console.error('Invalid URL for the PDF');
        }
    };
    return (
        <>
            <div>
                <Header />
                {isLoading ? <div className="loader-container ">
                    <Loader />
                </div> :
                    <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} className="justify-between" >
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }} >Sales</span>
                            {hasPermission(permissions, "sale bill create") && (<>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '7px', color: "rgba(4, 76, 157, 1)" }} />
                                <Button variant="contained" size='small' style={{ backgroundColor: 'rgb(4, 76, 157)', fontSize: '12px' }} onClick={goIntoAdd} ><AddIcon />New  </Button>
                            </>
                            )}
                            <div className="headerList">
                                <Button
                                    variant="contained"
                                    style={{ background: "rgb(4, 76, 157)" }}
                                    onClick={() => { setOpenAddPopUp(true) }}
                                >
                                    Generate PDF
                                </Button>
                            </div>
                        </div>

                        <div className="firstrow">
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full border-collapse custom-table">
                                    <thead>
                                        <tr >
                                            <th>SR. No</th>
                                            {columns.map((column, index) => (
                                                <th key={column.id} style={{ minWidth: column.minWidth }} >
                                                    <div className='headerStyle'>
                                                        <span>{column.label}</span><SwapVertIcon style={{ cursor: 'pointer' }} onClick={() => sortByColumn(column.id)} />
                                                        <TextField
                                                            label={`Search ${column.label}`}
                                                            id="filled-basic"
                                                            size="small"
                                                            sx={{ width: '150px' }}
                                                            value={searchTerms[index]}
                                                            onChange={(e) => handleSearchChange(index, e.target.value)}
                                                        />
                                                    </div>
                                                </th>
                                            ))}
                                            <th> Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredList.length === 0 ? (
                                            <tr>
                                                <td colSpan={columns.length + 2} style={{ textAlign: 'center', color: 'gray' }}>
                                                    No data found
                                                </td>
                                            </tr>
                                        ) :
                                            (filteredList
                                                .map((row, index) => {
                                                    return (
                                                        <tr hover tabIndex={-1} key={row.code} >
                                                            <td>
                                                                {startIndex + index}
                                                            </td>
                                                            {columns.map((column) => {
                                                                const isStatus = column.id === 'status';
                                                                const value = row[column.id];
                                                                const statusClass = isStatus && value === 'due' ? 'dueStatus' : isStatus && value === 'Paid' ? 'orderStatus' : 'text-black';
                                                                return (
                                                                    <td key={column.id}
                                                                        className={`text-lg `}
                                                                        align={column.align} onClick={() => { history.push("/salebill/view/" + row.id) }}>
                                                                        <span className={`text ${isStatus && statusClass}`}>
                                                                            {column.format && typeof value === 'number'
                                                                                ? column.format(value)
                                                                                : value}
                                                                        </span>
                                                                    </td>
                                                                );
                                                            })}
                                                            <td>
                                                                <div className="flex gap-4">
                                                                    < VisibilityIcon color="primary" className='cursor-pointer view' onClick={() => { history.push(`/salebill/view/${row.id}`) }} />
                                                                    <FaFilePdf className='w-5 h-5 text-gray-700 hover:text-black'
                                                                        onClick={() => pdfGenerator(row.id)}
                                                                    />
                                                                    {/* <DeleteIcon className="delete-icon" onClick={() => deleteOpen(row.id)} /> */}
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    );
                                                }))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handlePrevious}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg_darkblue text-white'
                                        }`}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                {currentPage > 2 && (
                                    <button
                                        onClick={() => handleClick(currentPage - 2)}
                                        className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                    >
                                        {currentPage - 2}
                                    </button>
                                )}
                                {currentPage > 1 && (
                                    <button
                                        onClick={() => handleClick(currentPage - 1)}
                                        className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                    >
                                        {currentPage - 1}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleClick(currentPage)}
                                    className="mx-1 px-3 py-1 rounded bg_darkblue text-white"
                                >
                                    {currentPage}
                                </button>
                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => handleClick(currentPage + 1)}
                                        className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                    >
                                        {currentPage + 1}
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'bg_darkblue text-white'
                                        }`}
                                    disabled={filteredList.length === 0}
                                >
                                    Next
                                </button>
                            </div>
                        </div>


                        {/* <div id="modal" value={IsDelete}
                            className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                                }`}>
                            <div />
                            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                                    viewBox="0 0 24 24" onClick={() => setIsDelete(false)}>
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                                </svg>
                                <div className="my-4 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                                        <path
                                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                            data-original="#000000" />
                                        <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                            data-original="#000000" />
                                    </svg>
                                    <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
                                </div>
                                <div className="flex gap-5 justify-center">
                                    <button type="submit"
                                        className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                                        onClick={() => handleDelete(saleId)}
                                    >Delete</button>
                                    <button type="button"
                                        className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                        onClick={() => setIsDelete(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div> */}
                        <Dialog open={openAddPopUp}
                            sx={{
                                "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                        width: "50%",
                                        height: "50%",
                                        maxWidth: "500px", // Set your width here
                                        maxHeight: "80vh", // Set your height here
                                        overflowY: "auto", // Enable vertical scrolling if content overflows
                                    },
                                },
                            }}
                        >
                            <DialogTitle id="alert-dialog-title" className="sky_text">
                                Genrate PDF
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => { setOpenAddPopUp(false); }}
                                sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                                        <div className="flex gap-10">
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                                    <div className="flex flex-col md:flex-row w-full">
                                                        <div className="w-full md:w-auto">
                                                            <span className="text-gray-500 block">Start Date</span>
                                                            <div className="w-full md:w-[215px]">
                                                                <DatePicker
                                                                    className="custom-datepicker w-full"
                                                                    selected={PdfstartDate}
                                                                    onChange={(newDate) => setPdfStartDate(newDate)}
                                                                    dateFormat="dd/MM/yyyy"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-auto">
                                                            <span className="text-gray-500 block">End Date</span>
                                                            <div className="w-full md:w-[215px]">
                                                                <DatePicker
                                                                    className="custom-datepicker w-full"
                                                                    selected={PdfendDate}
                                                                    onChange={(newDate) => setPdfEndDate(newDate)}
                                                                    dateFormat="dd/MM/yyyy"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus variant="contained" className="p-5" color="success"
                                    onClick={() => { AllPDFGenerate() }}
                                >
                                    Genrate
                                </Button>
                                <Button autoFocus variant="contained" onClick={() => { setOpenAddPopUp(false) }} color="error"  >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                }
            </div>
        </>
    )
}
export default Salelist