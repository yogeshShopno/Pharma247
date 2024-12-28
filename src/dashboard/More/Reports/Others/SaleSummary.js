import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Checkbox, FormControlLabel, ListItemText } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { CheckBox } from "@mui/icons-material";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { toast, ToastContainer } from "react-toastify";

const SaleSummary = () => {
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [paymentMode, setPaymentMode] = useState([])
    const [selectData, setSelectData] = useState()
    const [bankData, setBankData] = useState([]);
    const [saleSummaryData, setSaleSummaryData] = useState([]);
    const [totalSale, setTotalSale] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const allOptions = [
        'all',
        'cash',
        'credit',
        ...bankData.map(bank => bank.id),
        'loyaltyPoints'
    ];

    useEffect(() => {
        BankList();
    }, []);


    const BankList = async () => {
        let data = new FormData()
        try {
            await axios.post('bank-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setBankData(response.data.data)
                if(response.data.status === 401){ 
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    const validateForm = () => {
        const newErrors = {};
        if (!paymentMode) {
            newErrors.paymentMode = 'Select any Payment Mode Type.';
            toast.error(newErrors.paymentMode)
        }
        if (!selectData) {
            newErrors.selectData = 'Select any Report Type.';
            toast.error(newErrors.selectData)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handlefilterData = async () => {
        if (validateForm()) {
            let data = new FormData()
            setIsLoading(true);
            const params = {
                start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
                end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
                payment_mode: paymentMode.join(','),
                select_data: selectData
            }
            try {
                await axios.post('sales-summary', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                ).then((response) => {
                    setIsLoading(false);
                    setSaleSummaryData(response.data.data)
                    setTotalSale(response.data.data.total_amount)
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
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleChange = (event) => {
        const { value } = event.target;

        if (value.includes('all')) {
            if (paymentMode.length === allOptions.length) {
                // Deselect all options
                setPaymentMode([]);
            } else {
                // Select all options
                setPaymentMode(allOptions);
            }
        } else {
            setPaymentMode(value);
        }

        // setPaymentMode(event.target.value);
    };

    const bankIdToNameMap = bankData.reduce((map, bank) => {
        map[bank.id] = bank.bank_name;
        return map;
    }, {});

    // Custom renderValue function
    const renderValue = (selected) => {
        return selected.map((value) => {
            // if (value === 'all') return 'All';
            if (value === 'cash') return 'Cash';
            if (value === 'credit') return 'Credit';
            if (value === 'loyaltyPoints') return 'Loyalty Points';
            return bankIdToNameMap[value] || value; // Return bank name or value if not found
        }).join(', ');
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
                                    <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "120px" }}>  Sales Summary
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
                                        >
                                        <img src="/csv-file.png"
                                            className="report-icon absolute mr-10"
                                            alt="csv Icon" />

                                        Download
                                    </Button> </div>
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
                                            <FormControl sx={{ minWidth: 240 }} size="small">
                                                <InputLabel id="demo-select-small-label">All Payment Mode</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    multiple
                                                    value={paymentMode}
                                                    onChange={handleChange}
                                                    renderValue={renderValue}
                                                    label="All Payment Mode"
                                                >
                                                    <MenuItem value="" disabled>
                                                        All Payment Mode
                                                    </MenuItem>
                                                    {/* <MenuItem value="">
                                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.length === allOptions.length} />
                                                        <ListItemText primary="All" />
                                                    </MenuItem> */}
                                                    <MenuItem value="cash">
                                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf('cash') > -1} />
                                                        <ListItemText primary="Cash" />
                                                    </MenuItem>
                                                    <MenuItem value="credit">
                                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf('credit') > -1} />
                                                        <ListItemText primary="Credit" />
                                                    </MenuItem>
                                                    {bankData?.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf(option.id) > -1} />
                                                            <ListItemText primary={option.bank_name} />
                                                        </MenuItem>
                                                    ))}
                                                    <MenuItem value="loyaltyPoints">
                                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf('loyaltyPoints') > -1} />
                                                        <ListItemText primary="Loyalty Points" />
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="mt-6">
                                            <FormControl sx={{ minWidth: 240 }} size="small">
                                                <InputLabel id="demo-select-small-label">Select Data</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={selectData}
                                                    onChange={(e) => setSelectData(e.target.value)}
                                                    label="Select Data"

                                                >
                                                    <MenuItem value="" disabled>
                                                        Select Data
                                                    </MenuItem>
                                                    <MenuItem value="total_sales" selected>Total Sales</MenuItem>
                                                    <MenuItem value="total_margin">Total Margin(Rs.)</MenuItem>
                                                    <MenuItem value="avrage_margin"> Average Margin (%) </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div className="mt-6">
                                            <Button style={{
                                                background: "var(--color1)",
                                            }}  variant="contained" onClick={handlefilterData}>
                                                Go
                                            </Button>
                                        </div>

                                    </div>
                                    <div>
                                        <div className="flex gap-5 ml-auto p-2 rounded-md" style={{ background: "rgba(4, 76, 157, 0.1)" }}>
                                            <span className="primary text-xl">Total</span>
                                            <p className="secondary text-xl">Rs.639.75</p>
                                        </div>

                                    </div>
                                </div>
                                {saleSummaryData?.sales?.length > 0 ?
                                    <div>
                                        <div className="overflow-x-auto mt-4">
                                            <table className="saleRegisterTotal-table w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        {saleSummaryData.sales?.length > 0 &&
                                                            Object.keys(saleSummaryData.sales[0]).map((column) => (
                                                                <th key={column}>
                                                                    {column === 'total_sales' ? 'Total Sale' : capitalizeFirstLetter(column)}
                                                                </th>
                                                            ))
                                                        }
                                                    </tr>
                                                    {/* <tr>
                                                      
                                                        {saleSummaryData.sales?.length > 0 &&
                                                            Object.keys(saleSummaryData.sales[0]).map((column) => (
                                                                <th key={column}>
                                                                    {column === 'total_sales' ? 'Total Sale' : capitalizeFirstLetter(column)}
                                                                </th>
                                                            ))
                                                        }
                                                    </tr> */}
                                                </thead>
                                                <tbody>
                                                    {saleSummaryData.sales?.map((item, index) => (
                                                        <tr key={index}>
                                                            {Object.keys(item).map((key) => (
                                                                <td key={key}>
                                                                    {item[key]}
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
export default SaleSummary