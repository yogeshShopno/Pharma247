import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";
import { saveAs } from 'file-saver';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';

const Gstr1 = () => {
    const history = useHistory()
    const [monthDate, setMonthDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const rowsPerPage = 10;
    const [nonMovingItemData, setNonMovingItemData] = useState([])
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    const [errors, setErrors] = useState({})
    const [reportType, setReportType] = useState()


    const downloadPDF = async () => {
        let data = new FormData()
        data.append("date", monthDate ? format(monthDate, 'MM-yyyy') : '');
        data.append("type", reportType ? reportType : '');

        const params = {
            month_year: monthDate ? format(monthDate, 'MM-yyyy') : '',
        }
        try {
            const response = await axios.post('gst-one?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
            });

            // Create a Blob from the PDF Stream
            const file = new Blob([response.data], { type: 'application/pdf' });

            // Create a URL for the Blob
            const fileURL = URL.createObjectURL(file);

            // Open the URL in a new window
            window.open(fileURL);
        } catch (error) {
            console.error("API error:", error);
        }
    }

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
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "120px" }}> GSTR-1 Report

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

                                    <span className="flex  sky_text text-lg">Choose Date</span>

                                    <DatePicker
                                        className='custom-datepicker '
                                        selected={monthDate}
                                        onChange={(newDate) => setMonthDate(newDate)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        sx={{ width: '200px' }}

                                    />

                                    <span className="flex mt-5 sky_text text-lg" >Report Type </span>

                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        value={reportType}
                                        sx={{ width: '187px' }}
                                        onChange={(e) => setReportType(e.target.value)}
                                        size="small"
                                        displayEmpty
                                    >
                                        <MenuItem key={0} value="0">sale</MenuItem>
                                        <MenuItem key={1} value="1">sale return</MenuItem>
                                    </Select>



                                    <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px", marginBlock: "25px" }} onClick={downloadPDF}> <img src={excelIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>

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
export default Gstr1