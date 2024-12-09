import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";
import { saveAs } from 'file-saver';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import { toast,ToastContainer } from "react-toastify";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';

const Gstr2 = () => {
    const history = useHistory()
    const [monthDate, setMonthDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const rowsPerPage = 10;
    const [nonMovingItemData, setNonMovingItemData] = useState([])
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    const [errors, setErrors] = useState({})
    const [reportType, setReportType] = useState("");
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        if (Array.isArray(reportData) && reportData.length > 0) {
            exportToCSV(); 
        }
    }, [reportData]);

     const downloadCSV = async () => {
        if (!reportType) {
            toast.error("Please select a report type.");
            return;
        }
    
        try {
            let data = new FormData();
            data.append("date", monthDate ? format(monthDate, 'MM-yyyy') : '');
            data.append("type", reportType || 0);
    
            const response = await axios.post('gst-two-report?', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', 
            });
    
            if (response.status === 200) {
                setIsLoading(false);
    
                const text = await response.data.text();
                const parsedData = JSON.parse(text);
    
                if (parsedData?.data) {
                    setReportData([parsedData.data]);
                } else {
                    toast.error('No data available for the selected criteria.');
                }
            } else {
                toast.error('Failed to download records. Please try again.');
            }
        } catch (error) {
            console.error("API error:", error);
            toast.error('An error occurred while downloading the CSV.');
        }
    };

    const exportToCSV = () => {
        if (!Array.isArray(reportData) || reportData.length === 0) {
            toast.error('Apply filter and then after download records.');
            return;
        }

        const filteredData = reportData.map(({
            bill_amount,
            bill_date,
            bill_no,
            bill_net_rate,
            case_amount,
            cash_rate,
            cgst,
            distributor_name,
            id,
            igst,
            sgst,
            state,
            taxable_value,
        }) => ({
            BillNo: bill_no,
            BillDate: bill_date,
            BillAmount: bill_amount,
            BillNetRate: bill_net_rate,
            CaseAmount: case_amount,
            CashRate: cash_rate,
            CGST: cgst,
            DistributorName: distributor_name,
            ID: id,
            IGST: igst,
            SGST: sgst,
            State: state,
            TaxableValue: taxable_value,
        }));

        const headers = [
            'BillNo',
            'BillDate',
            'BillAmount',
            'BillNetRate',
            'CaseAmount',
            'CashRate',
            'CGST',
            'Distributor',
            'ID',
            'IGST',
            'SGST',
            'State',
            'TaxableValue',
        ];

        const csvRows = [
            headers,
            ...filteredData.map(item => headers.map(header => item[header] || '')),
        ];

        const csvString = csvRows.map(row => row.join(',')).join('\n');

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        if (reportType == 0) {
            saveAs(blob, 'gstr1Purchase.csv');
        } else if (reportType == 1) {
            saveAs(blob, 'gstr1PurchaseReturn.csv');

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
                    <div style={{ background: "rgb(0 0 0 / 10%)", height: 'calc(99vh - 55px)', padding: '10px 20px 0px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "120px" }}> GSTR-2 Report

                                </span>
                                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                            </div>
                        </div>
                        <div className="IconNonMoving flex-wrap" style={{ background: "white" }}>
                            <div style={{ width: "40%" }}>
                                <div >
                                    <div style={{ maxWidth: "500px", marginBottom: "20px" }}>
                                        <img src="../imgpsh_fullsize_anim.png" ></img>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: "100px", height: "400px" }}>
                                <div className="flex flex-col gap-2">

                                    <span className="flex  secondary text-lg">Choose Date</span>

                                    <DatePicker
                                        className='custom-datepicker '
                                        selected={monthDate}
                                        onChange={(newDate) => setMonthDate(newDate)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        sx={{ width: '200px' }}

                                    />

                                    <span className="flex mt-5 secondary text-lg" >Report Type </span>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        value={reportType} // Value can be null
                                        sx={{ width: '187px' }}
                                        onChange={(e) => setReportType(e.target.value)}
                                        size="small"
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled >
                                            Select Record
                                        </MenuItem>
                                        <MenuItem key={0} value="0">Purchase</MenuItem>
                                        <MenuItem key={1} value="1">Purchase return</MenuItem>
                                    </Select>

                                    <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px", marginBlock: "25px" }} onClick={downloadCSV}> <img src={excelIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>

                                    <div >
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div >
            }
        </>
    )
}
export default Gstr2