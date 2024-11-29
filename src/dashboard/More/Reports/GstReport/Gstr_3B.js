import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";
import PopUpRed from '../../../../componets/popupBox/PopUpRed';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';

const Gstr_3B = () => {
    const history = useHistory()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [nonMovingItemData, setNonMovingItemData] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    const [reportType, setReportType] = useState("");
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        if (Array.isArray(reportData) && reportData.length > 0) {
            exportToCSV();
        }
    }, [reportData]);

    const downloadCSV = async () => {
        try {
            let data = new FormData();
            data.append("start_date", startDate ? format(startDate, 'yyyy-MM-dd') : '');
            data.append("end_date", endDate ? format(endDate, 'yyyy-MM-dd') : '');

            const response = await axios.post('gst-three-report?', data, {
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
        if (!reportData || typeof reportData !== "object" || !reportData.data) {
            toast.error("No data available for download.");
            return;
        }
    
        const { invoice_details, summary, gst_liability } = reportData.data;
    
        const formattedData = [
            {
                Category: "Sales",
                Total: invoice_details.sales.total,
                CGST: invoice_details.sales.cgst,
                SGST: invoice_details.sales.sgst,
                IGST: invoice_details.sales.igst,
            },
            {
                Category: "Sales Returns",
                Total: invoice_details.sales_returns.total,
                CGST: invoice_details.sales_returns.cgst,
                SGST: invoice_details.sales_returns.sgst,
                IGST: invoice_details.sales_returns.igst,
            },
            {
                Category: "Purchases",
                Total: invoice_details.purchases.total,
                CGST: invoice_details.purchases.cgst,
                SGST: invoice_details.purchases.sgst,
                IGST: invoice_details.purchases.igst,
            },
            {
                Category: "Purchase Returns",
                Total: invoice_details.purchase_returns.total,
                CGST: invoice_details.purchase_returns.cgst,
                SGST: invoice_details.purchase_returns.sgst,
                IGST: invoice_details.purchase_returns.igst,
            },
            {
                Category: "Net Sales",
                Total: summary.net_sales.taxable_amount,
                CGST: summary.net_sales.cgst,
                SGST: summary.net_sales.sgst,
                IGST: summary.net_sales.igst,
            },
            {
                Category: "Net Purchases",
                Total: summary.net_purchases.taxable_amount,
                CGST: summary.net_purchases.cgst,
                SGST: summary.net_purchases.sgst,
                IGST: summary.net_purchases.igst,
            },
            {
                Category: "GST Liability",
                Total: gst_liability.total,
                CGST: gst_liability.cgst,
                SGST: gst_liability.sgst,
                IGST: gst_liability.igst,
            },
        ];
    
        const headers = ["Category", "Total", "CGST", "SGST", "IGST"];
    
        const csvRows = [
            headers.join(","), 
            ...formattedData.map(item => 
                headers.map(header => item[header] || "").join(",")
            ),
        ];
    
        const csvString = csvRows.join("\n");
    
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "GSTR3B_Report.csv");
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
                                <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "120px" }}> GSTR-3B Report

                                </span>
                                <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
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

                                    <span className="flex  sky_text text-lg">Start Date</span>

                                    <DatePicker
                                        className='custom-datepicker'
                                        selected={startDate}
                                        onChange={(newDate) => setStartDate(newDate)}
                                        dateFormat="yyyy-MM-dd"
                                        showMonthYearPicker
                                        sx={{ width: '200px' }} />
                                    <span className="flex  sky_text text-lg">End Date</span>

                                    <DatePicker
                                        className='custom-datepicker'
                                        selected={endDate}
                                        onChange={(newDate) => setEndDate(newDate)}
                                        dateFormat="yyyy-MM-dd"
                                        showMonthYearPicker
                                        sx={{ width: '200px' }}
                                    ></DatePicker>

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
export default Gstr_3B