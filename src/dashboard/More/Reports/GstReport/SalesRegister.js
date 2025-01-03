// import Header from "../../../Header"
// import { BsLightbulbFill } from "react-icons/bs"
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import { Button } from "@mui/material";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import { useEffect, useState } from "react";
// import dayjs from 'dayjs';
// import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
// import SearchIcon from '@mui/icons-material/Search';
// import { FaSearch } from "react-icons/fa";
// import axios from "axios";
// import PopUpRed from '../../../../componets/popupBox/PopUpRed';
// import Loader from "../../../../componets/loader/Loader";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// const SalesRegister = () => {
//     const token = localStorage.getItem("token");
//     const history = useHistory()
//     const [startDate, setStartDate] = useState(dayjs().add(-2, 'day'));
//     const [endDate, setEndDate] = useState(dayjs())
//     const [reportType, setReportType] = useState()
//     const [paymentMode, setPaymentMode] = useState()
//     const [isLoading, setIsLoading] = useState(false);
//     const [searchItem, setSearchItem] = useState('')
//     const [total, setTotal] = useState(0)
//     const [sgst, setSGST] = useState('')
//     const [cgst, setCGST] = useState('')
//     const [igst, setIGST] = useState('')
//     const [discount, setDiscount] = useState('')
//     const [grossTotal, setGrossTotal] = useState('')
//     const csvIcon = process.env.PUBLIC_URL + '/csv.png';
//     const [saleData, setSaleData] = useState([])
//     const GstSaleRegisterColumns = [
//         { id: "bill_no", label: "Bill No", minWidth: 100 },
//         { id: "bill_date", label: "Bill Date", minWidth: 100 },
//         { id: 'name', label: "Customer Name", minWidth: 100 },
//         { id: 'phone_number', label: 'Mobile', minWidth: 100 },
//         { id: "gross", label: "Gross.", minWidth: 100 },
//         { id: 'disocunt', label: 'Disc.', minWidth: 100 },
//         { id: 'cgst', label: 'CGST', minWidth: 100 },
//         { id: 'sgst', label: 'SGST', minWidth: 100 },
//         { id: 'igst', label: "IGST", minWidth: 100 },
//         { id: 'net_amt', label: 'Total', minWidth: 100 },
//     ];
//     const [errors, setErrors] = useState({})
//     const [bankData, setBankData] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [popupMessage, setPopupMessage] = useState('');
//     const [popupType, setPopupType] = useState('');

//     const togglePopup = (message, type) => {
//         setPopupMessage(message);
//         setPopupType(type);
//         setShowPopup(true);
//     };
//     useEffect(() => {
//         BankList()
//     }, [])

//     const BankList = async () => {
//         let data = new FormData()
//         try {
//             await axios.post('bank-list', data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             }
//             ).then((response) => {
//                 setBankData(response.data.data)
//             })
//         } catch (error) {
//             console.error("API error:", error);

//         }
//     }

//     const validateForm = () => {
//         const newErrors = {}
//         if (!reportType) {
//             newErrors.reportType = 'Select Any Report Type'
//             togglePopup(newErrors.reportType, 'red')
//         }
//         else if (!paymentMode) {
//             newErrors.paymentMode = 'Select Any Payment Mode'
//             togglePopup(newErrors.paymentMode, 'red')
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     }
//     const handleFilterData = async () => {
//         if (validateForm()) {
//             let data = new FormData()
//             let x = '';
//             if (paymentMode !== 'All') {
//                 let x = paymentMode;
//             }
//             setIsLoading(true);
//             const params = {
//                 start_date: startDate.format('YYYY-MM-DD'),
//                 end_date: endDate.format('YYYY-MM-DD'),
//                 payment_name: paymentMode === 'All' ? x : paymentMode,
//                 type: reportType,
//                 search: searchItem
//             }
//             setIsLoading(true);
//             try {
//                 await axios.post('gst-sales-register', data, {
//                     params: params,
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 }
//                 ).then((response) => {
//                     setIsLoading(false);
//                     setSaleData(response.data.data)
//                     setDiscount(response.data.data.discount)
//                     setIGST(response.data.data.igst)
//                     setCGST(response.data.data.cgst)
//                     setSGST(response.data.data.sgst)
//                     setTotal(response.data.data.net_amount)
//                     setGrossTotal(response.data.data.gross_total)
//                 })
//             } catch (error) {
//                 console.error("API error:", error);

//             }
//         }
//     }

//     const exportToCSV = () => {
//         if (saleData.length == 0) {
//             togglePopup('Apply filter and then after download records.', 'red')

//         } else {
//             const cgst = saleData.cgst;
//             const discount = saleData.discount;
//             const gross_total = saleData.gross_total;
//             const igst = saleData.igst;
//             const net_amount = saleData.net_amount;
//             const sgst = saleData.sgst;

//             const filteredData = saleData?.sales_registere?.map(({ bill_no, bill_date, name, phone_number, net_amt, igst, cgst, sgst, total, disocunt, gross, }) => ({
//                 BillNo: bill_no,
//                 BillDate: bill_date,
//                 CustomerName: name,
//                 MobileNo: phone_number,
//                 Gross: gross,
//                 Discount: disocunt,
//                 CGST: cgst,
//                 SGST: sgst,
//                 IGST: igst,
//                 Total: net_amt,

//             }));

//             // Custom data rows
//             const customDataRows = [
//                 ['Total Gross.', gross_total],
//                 ['Total Discount', discount],
//                 ['Total SGST', sgst],
//                 ['Total CGST', cgst],
//                 ['Total IGST', igst],
//                 ['Total Amount', net_amount],
//                 [],
//             ];

//             // Headers for filtered data
//             const headers = ['BillNo', 'BillDate', 'CustomerName', 'MobileNo', 'Gross', 'Discount', 'CGST', 'SGST', 'IGST', 'Total'];


//             // Convert filteredData to an array of arrays
//             const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

//             // Combine custom data, headers, and filtered data rows
//             const combinedData = [...customDataRows, headers, ...filteredDataRows];

//             // Convert combined data to CSV format
//             const csv = combinedData.map(row => row.join(',')).join('\n');

//             // Convert the CSV string to a Blob
//             const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

//             // Save the file using file-saver
//             saveAs(blob, 'GST_Sale_Register_Report.csv');
//         }
//     };

//     return (
//         <>
//             {showPopup && <PopUpRed message={popupMessage} onClose={() => setShowPopup(false)} type={popupType} />}
//             <div>
//                 <Header />
//                 {isLoading ? <div className="loader-container ">
//                     <Loader />
//                 </div> :
//                     <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '20px 20px 0px' }}>
//                         <div style={{ display: 'flex', gap: '4px' }}>
//                             <div style={{ display: 'flex', gap: '7px', alignItems: 'center', }}>
//                                 <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
//                                 </span>
//                                 <ArrowForwardIosIcon style={{ fontSize: '17px', color: "var(--color1)" }} />
//                                 <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "160px" }}>  GST Sales Register
//                                 </span>
//                                 <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
//                             </div>
//                             <div className="headerList" style={{ marginBottom: "10px" }}>
//                                 <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
//                             </div>
//                         </div>
//                         <div className="bg-white ">
//                             <div className="manageExpenseRow" style={{
//                                 padding: ' 20px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
//                             }}>
//                                 <div className="flex gap-5" >
//                                     <div >
//                                         {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                             <DatePicker
//                                                 views={['month', 'year']}
//                                                 sx={{ maxWidth: "150px" }}
//                                                 value={startDate}
//                                                 onChange={(newDate) => setStartDate(newDate)}
//                                                 renderInput={(params) => <textField autoComplete="off"{...params} />}
//                                             />
//                                         </LocalizationProvider> */}
//                                         <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                             <DatePicker
//                                                 value={startDate}
//                                                 label='Start Date'
//                                                 onChange={(newDate) => setStartDate(newDate)}
//                                                 format="DD/MM/YYYY"
//                                             />
//                                         </LocalizationProvider>
//                                     </div>
//                                     <div>
//                                         <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                             <DatePicker
//                                                 label='End Date'
//                                                 value={endDate}
//                                                 onChange={(newDate) => setEndDate(newDate)}
//                                                 format="DD/MM/YYYY"
//                                             />
//                                         </LocalizationProvider>
//                                     </div>

//                                     <div>
//                                         <FormControl sx={{ minWidth: 200 }} size="small">
//                                             <InputLabel id="demo-select-small-label">Report Type</InputLabel>
//                                             <Select
//                                                 labelId="demo-select-small-label"
//                                                 id="demo-select-small"
//                                                 value={reportType}
//                                                 onChange={(e) => setReportType(e.target.value)}
//                                                 label="Report Type"

//                                             >
//                                                 <MenuItem value="" disabled>
//                                                     Select Report Type
//                                                 </MenuItem>
//                                                 <MenuItem value="0">Sales</MenuItem>
//                                                 <MenuItem value="1">Sales Return</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </div>
//                                     <div>
//                                         <FormControl sx={{ minWidth: 200 }} size="small">
//                                             <InputLabel id="demo-select-small-label">Payment Mode</InputLabel>
//                                             <Select
//                                                 labelId="demo-select-small-label"
//                                                 id="demo-select-small"
//                                                 value={paymentMode}
//                                                 onChange={(e) => setPaymentMode(e.target.value)}
//                                                 label="Payment Mode"

//                                             >
//                                                 <MenuItem value="" disabled>
//                                                     Select Payment Mode
//                                                 </MenuItem>
//                                                 <MenuItem value="All">All</MenuItem>
//                                                 <MenuItem value="cash">Cash</MenuItem>
//                                                 {bankData?.map(option => (
//                                                     <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </div>
//                                     <div>
//                                         <div className="detail" >
//                                             <TextField
//                                                 id="outlined-basic"
//                                                 value={searchItem}
//                                                 sx={{ minWidth: '300px' }}
//                                                 size="small"
//                                                 onChange={(e) => setSearchItem(e.target.value)}
//                                                 variant="standard"
//                                                 placeholder="Search by Customer Name"
//                                                 InputProps={{
//                                                     endAdornment: (
//                                                         <InputAdornment position="end" >
//                                                             <SearchIcon />
//                                                         </InputAdornment>
//                                                     ),
//                                                     type: 'search'
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <Button variant="contained" onClick={handleFilterData}>
//                                             Go
//                                         </Button>
//                                     </div>

//                                 </div>
//                                 <div>
//                                     <div className="flex gap-5 ml-auto p-2 rounded-md" style={{ background: "rgba(4, 76, 157, 0.1)" }}>
//                                         <span className="primary text-xl">Total</span>
//                                         <p className="secondary text-xl">Rs. {total}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             {saleData?.sales_registere?.length > 0 ?
//                                 <div>
//                                     <div>
//                                         <table className="saleRegisterTotal-table  mt-5" style={{ borderTop: 'none' }}>
//                                             <thead>
//                                                 <tr>
//                                                     {GstSaleRegisterColumns.map((column) => (
//                                                         <th key={column.id} style={{ minWidth: column.minWidth }}>
//                                                             {column.label}
//                                                         </th>
//                                                     ))}
//                                                 </tr>
//                                                 <tr>
//                                                     {GstSaleRegisterColumns.map((column) => (
//                                                         <th key={column.id} style={{ minWidth: column.minWidth }}>
//                                                             {column.id === 'gross' ? grossTotal : ''}
//                                                             {column.id === 'disocunt' ? discount : ''}
//                                                             {column.id === 'igst' ? igst : ''}
//                                                             {column.id === 'cgst' ? cgst : ''}
//                                                             {column.id === 'sgst' ? sgst : ''}
//                                                         </th>
//                                                     ))}
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {saleData.sales_registere?.map((item, index) => (
//                                                     <tr key={index} >
//                                                         {GstSaleRegisterColumns.map((column) => (
//                                                             <td key={column.id}>
//                                                                 {item[column.id]}
//                                                             </td>
//                                                         ))}

//                                                     </tr>
//                                                 ))}

//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                                 :
//                                 <div>
//                                     <div className="SearchIcon">
//                                         <div>
//                                             <FaSearch className="IconSize" />
//                                         </div>
//                                         <p className="text-gray-500 font-semibold">Apply filter to get records.</p>
//                                     </div>
//                                 </div>

//                             }
//                         </div>

//                     </div>
//                 }
//             </div>
//         </>
//     )
// }
// export default SalesRegister