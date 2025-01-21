import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { toast, ToastContainer } from "react-toastify";
const HsnWiseGst = () => {
    const history = useHistory()
    const [nonMovingDate, setNonMovingDate] = useState()
    const [monthDate, setMonthDate] = useState(subMonths(new Date(), 1));

    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const rowsPerPage = 10;
    const [nonMovingItemData, setNonMovingItemData] = useState([])
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    const [errors, setErrors] = useState({})
    const [reportType, setReportType] = useState()
    const validateForm = () => {
        const newErrors = {};
        if (!reportType) {
            newErrors.reportType = 'Select any Report Type.';
            toast.error(newErrors.reportType)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlefilterData = async () => {
        if (validateForm()) {
            let data = new FormData();
            const params = {
                date: monthDate ? format(monthDate, 'MM-yyyy') : '',
                type: reportType,
            };
            try {
                const response = await axios.post('gst-hsn-report?', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setIsLoading(false);
                setNonMovingItemData(response.data.data);

                const worksheet = XLSX.utils.json_to_sheet(response.data.data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                if (reportType == 0) {
                    saveAs(blob, 'Sale-GST-HSN-Report.xlsx');
                } else if (reportType == 1) {
                    saveAs(blob, 'Sale-Return-GST-HSN-Report.xlsx');
                } else if (reportType == 2) {
                    saveAs(blob, 'Purchase-GST-HSN-Report.xlsx');
                } else if (reportType == 3) {
                    saveAs(blob, 'Purchase-Return-GST-HSN-Report.xlsx');
                }


            } catch (error) {
                console.error("API error:", error);

            }
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
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "140px" }}> HSN Wise GST Report
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
                            <div style={{ marginTop: "100px", height: "380px" }}>
                                <span className="text-lg secondary mb-4" >Bill Date:</span>
                                <div className="mb-4">
                                    <div style={{ width: "215px" }}>
                                        <DatePicker
                                            className='custom-datepicker '
                                            selected={monthDate}
                                            onChange={(newDate) => setMonthDate(newDate)}
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                        />
                                    </div>
                                </div>
                                <div style={{ width: "50%" }}>
                                    <div>
                                        <FormControl sx={{ minWidth: 300 }} size="small">
                                            <InputLabel id="demo-select-small-label">Report Type</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={reportType}
                                                onChange={(e) => setReportType(e.target.value)}
                                                label="Report Type"

                                            >
                                                <MenuItem value="" disabled>
                                                    Select Report Type
                                                </MenuItem>
                                                <MenuItem value="0">Sale</MenuItem>
                                                <MenuItem value="1">Sale Return</MenuItem>
                                                <MenuItem value="2">Purchase</MenuItem>
                                                <MenuItem value="3">Purchase Return</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </div>
                                </div>
                                <div style={{ marginTop: "25px" }}>
                                    <Button
                                        variant="contained"
                                        className="gap-7 downld_btn_csh"
                                        style={{
                                            background: "var(--color1)",
                                            color: "white",
                                            // paddingLeft: "35px",
                                            textTransform: "none",
                                            display: "flex",
                                        }}
                                        onClick={handlefilterData}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>

                                            <img src="/csv-file.png"
                                                className="report-icon absolute mr-10"
                                                alt="csv Icon" />

                                        </div>
                                        Download
                                    </Button>                                </div>
                            </div>
                        </div>

                    </div>
                </div >
            }
        </>
    )
}
export default HsnWiseGst