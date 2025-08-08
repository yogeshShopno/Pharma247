import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select, InputAdornment, Input, colors } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, TextField } from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { BsLightbulbFill } from "react-icons/bs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from "axios";
import DatePicker from 'react-datepicker';
import { addDays, format, parse, subDays } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Header from '../../../Header';
import Loader from '../../../../componets/loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { VscDebugStepBack } from "react-icons/vsc";
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { IoMdClose } from 'react-icons/io';
import { Modal } from 'flowbite-react';
import { FaCaretUp } from 'react-icons/fa6';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import IconButton from '@mui/material/IconButton';

const EditReturnBill = () => {
    const history = useHistory();
    const unblockRef = useRef(null);
    const token = localStorage.getItem("token");
    const [tableData, setTableData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [endDate, setEndDate] = useState();
    const [startDate, setStartDate] = useState();
    const [mrp, setMRP] = useState()
    const [ptr, setPTR] = useState()
    const [billNo, setBillNo] = useState()
    const [gst, setGst] = useState();
    const [selectedEditItemId, setSelectedEditItemId] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(1);
    const [returnType, setReturnType] = useState(null);
    const [ItemId, setItemId] = useState('')
    const [IsDelete, setIsDelete] = useState(false);
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    const inputRef3 = useRef();
    const inputRef4 = useRef();
    const inputRef5 = useRef();
    const inputRef6 = useRef();
    const inputRef7 = useRef();
    const inputRef8 = useRef();
    const inputRef9 = useRef();
    const inputRef10 = useRef();
    const inputRef12 = useRef();
    const [itemPurchaseId, setItemPurchaseId] = useState('');
    const [isDeleteAll, setIsDeleteAll] = useState(false);
    const [unit, setUnit] = useState('');
    const [schAmt, setSchAmt] = useState('');
    const [disc, setDisc] = useState('');
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [errors, setErrors] = useState({});
    const [gstList, setGstList] = useState([]);
    const [loc, setLoc] = useState('');
    const [distributorList, setDistributorList] = useState([]);
    const [returnItemList, setReturnItemList] = useState([])
    const [batchList, setBatchList] = useState([]);
    const [distributor, setDistributor] = useState(null);
    const [remark, setRemark] = useState()
    const [expiryDate, setExpiryDate] = useState('');
    const [intialQty, setIntialQty] = useState(0)
    const [qty, setQty] = useState(0)
    const [tempQty, setTempQty] = useState(0)
    const [free, setFree] = useState('')
    const [error, setError] = useState({ distributor: '', returnType: '', billNo: '', startDate: '', endDate: '' });
    const staffOptions = [{ value: 'Owner', id: 1 }, { value: localStorage.getItem('UserName'), id: 2 },]
    const returnTypeOptions = [{ value: 'With GST(Purchase Return)', id: 1 }, { value: 'Without GST (Credit Note)', id: 2 },]
    const [item, setItem] = useState('')
    const [batch, setBatch] = useState('')
    const [searchItem, setSearchItem] = useState('')
    const [itemList, setItemList] = useState([])
    const [value, setValue] = useState('')
    const { id } = useParams();
    const [paymentType, setPaymentType] = useState('cash');
    const [bankData, setBankData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0)
    const [netAmount, setNetAmount] = useState(0);
    const [roundOff, setRoundOff] = useState(0.00)
    const [roundOffRender, setRoundOffRender] = useState(0)
    const [otherAmount, setOtherAmount] = useState(0)
    const [finalAmount, setFinalAmount] = useState(0)
    const [saveValue, setSaveValue] = useState(false);
    const [isOpenBox, setIsOpenBox] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const [ItemTotalAmount, setItemTotalAmount] = useState()
    const [unsavedItems, setUnsavedItems] = useState(true);
    const [nextPath, setNextPath] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [totalGST, setTotalGST] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [totalNetRate, setTotalNetRate] = useState(0)
    const [totalMargin, setTotalMargin] = useState(0)
    const [margin, setMargin] = useState(0)
    const [initialTotalStock, setInitialTotalStock] = useState(0);
    const [uniqueId, setUniqueId] = useState([])
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [billSaveDraft, setBillSaveDraft] = useState('0');
    const handleClose = () => {
        setIsDelete(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            const distributors = await listDistributor();
            await returnBillEditID(distributors);
            setIsLoading(false);
        };

        initializeData();
        batchListAPI();
        if (isDeleteAll) {
            // restoreData();
        }
        listOfGst();
        BankList();
    }, [id, isDeleteAll]); // Add only necessary dependencies



    /*<============================================================================ Input ref on keydown enter ===================================================================> */

    const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
    const tableRef = useRef(null); // Reference for table container
    const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);

    const inputRefs = useRef([]);
    const dateRefs = useRef([]);

    const submitButtonRef = useRef(null);
    const addButtonref = useRef(null);

    const handleKeyDown = (e, index) => {
        console.log("index", index);
        if (e.key === "Enter") {
            console.log("enter", index);
            e.preventDefault();
            const nextElement = inputRefs.current[index + 1];

            console.log("Next element:", nextElement);
            console.log("All refs:", inputRefs.current);

            if (!nextElement) {
                // If no next element, focus the first element or submit
                console.log("No next element, focusing first element");
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
                return;
            }

            // Handle different input types
            if (nextElement.focus) {
                // Standard input elements
                console.log("Focusing standard input");
                nextElement.focus();
            } else if (nextElement.querySelector) {
                // For DatePicker or complex components, find the input inside
                const input = nextElement.querySelector('input');
                if (input) {
                    console.log("Focusing input inside component");
                    input.focus();
                }
            } else if (nextElement.setFocus) {
                // For components with custom focus methods
                console.log("Using setFocus method");
                nextElement.setFocus();
            }

            console.log("Next element focused:", index + 1);
        }
    };

    /*<============================================================ disable autocomplete to focus when tableref is focused  ===================================================> */


    useEffect(() => {
        const handleTableFocus = () => setAutocompleteDisabled(false);
        const handleTableBlur = () => setAutocompleteDisabled(true);

        if (tableRef.current) {
            tableRef.current.addEventListener("focus", handleTableFocus);
            tableRef.current.addEventListener("blur", handleTableBlur);
        }

        return () => {
            if (tableRef.current) {
                tableRef.current.removeEventListener("focus", handleTableFocus);
                tableRef.current.removeEventListener("blur", handleTableBlur);
            }
        };
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!tableData?.item_list?.length) return;
            
            if (e.key === "ArrowDown") {
                setSelectedIndex((prev) => Math.min(prev + 1, tableData.item_list.length - 1));
            } else if (e.key === "ArrowUp") {
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter" && selectedIndex !== -1) {
                const selectedRow = tableData.item_list[selectedIndex];
                if (!selectedRow) return;
                handleEditClick(selectedRow);
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [tableData, selectedIndex]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!event.altKey) return; // Exit early if Alt is not pressed

            event.preventDefault(); // Prevent default browser behavior

            if (event.key.toLowerCase() === "s") {
                // Only allow submission if data is loaded and not currently loading
                if (!isLoading && distributor && distributor.id && billNo && billNo.trim() !== '' && tableData) {
                    // Add a small delay to ensure state updates are complete
                    setTimeout(() => {
                        handleReturnUpdate();
                    }, 100);
                } else {
                    toast.error("Please wait for data to load completely");
                }

            } else if (event.key.toLowerCase() === "m") {
                inputRefs.current[2]?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLoading, distributor, billNo, tableData]);


    useEffect(() => {

        if (otherAmount !== '') {
            const x = parseFloat(totalAmount) + parseFloat(otherAmount)
            setRoundOff((x % 1).toFixed(2))
            roundOff > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

        } else {
            const x = parseFloat(totalAmount).toFixed(2)
            setRoundOff((x % 1).toFixed(2))
            roundOff > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))
        }

        if (netAmount < 0) {
            setOtherAmount(0)
        }


    }, [otherAmount, totalAmount, roundOff, netAmount, finalAmount]);

    useEffect(() => {
        if (selectedEditItem) {
            setSearchItem(selectedEditItem.item_name)
            setUnit(selectedEditItem.weightage);
            setBatch(selectedEditItem.batch_number);
            setExpiryDate(selectedEditItem.expiry);
            setMRP(selectedEditItem.mrp);
            setQty(selectedEditItem.qty);
            setFree(selectedEditItem.fr_qty);
            setPTR(selectedEditItem.ptr);
            setDisc(selectedEditItem.disocunt);
            setGst(selectedEditItem.gst_name);
            setLoc(selectedEditItem.location);
            setItemTotalAmount(selectedEditItem.amount)
        }
    }, [selectedEditItem])

    useEffect(() => {
        const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
        const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
        const totalAmount = parseFloat((totalBase + (totalBase * gst / 100)).toFixed(2));
        if (totalAmount) {
            setItemTotalAmount(totalAmount);
        } else {
            setItemTotalAmount(0)
        }
        if (isDeleteAll == false) {
            // restoreData();
        }
    }, [ptr, qty, disc, gst, tempQty])

    const LogoutClose = () => {
        setIsOpenBox(false);
        setPendingNavigation(null);
    };

    const handleLeavePage = async () => {
        let data = new FormData();
        data.append("start_date", localStorage.getItem("StartFilterDate"));
        data.append("end_date", localStorage.getItem("EndFilterDate"));
        data.append("distributor_id", localStorage.getItem("DistributorId"));
        data.append("type", "1");

        try {
            const response = await axios.post("purches-return-iteam-histroy", data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                setUnsavedItems(false);
                setIsOpenBox(false);

                setTimeout(() => {
                    if (nextPath) {
                        history.push(nextPath);
                    }
                }, 0);
            }
            setIsOpenBox(false);
            setUnsavedItems(false);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                setUnsavedItems(false);
                setIsOpenBox(false);
                localStorage.setItem("unsavedItems", unsavedItems.toString());
                setTimeout(() => {
                    history.push(nextPath);
                }, 0);
            } else {
                console.error("Error deleting items:", error);
            }
        }
    };

    const handleNavigation = (path) => {
        setIsOpenBox(true);
        setNextPath(path);
    };
    const handleLogout = async () => {
        await restoreData();

        if (pendingNavigation) {
            if (unblockRef.current) {
                unblockRef.current();
            }
            history.push(pendingNavigation.pathname);
        }
        setIsOpenBox(false);

    };

    // useEffect(() => {
    //     const initializeData = async () => {
    //         setIsLoading(true);
    //         const distributors = await listDistributor();
    //         await returnBillEditID(distributors);
    //         setIsLoading(false);

    //     };
    //     batchListAPI();
    //     initializeData();
    //     if (isDeleteAll == true) {
    //         // restoreData();
    //     }
    //     listOfGst();
    //     BankList();
    // }, [])


    const listDistributor = async () => {
        try {
            const response = await axios.get("list-distributer", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const distributors = response.data.data;
            localStorage.setItem("distributor", JSON.stringify(distributors));
            setDistributorList(distributors);
            if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }
            return distributors;
        } catch (error) {
            console.error("API Error fetching distributors:", error);
            return [];
        }
    };

    const batchListAPI = async () => {
        let data = new FormData();
        data.append("distributor_id", distributor?.id);
        const params = {
            distributor_id: distributor?.id
        }
        try {
            await axios.post("distributor-batch?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setBatchList(response.data.data)

            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    const restoreData = () => {
        // handleLeavePage()
        let data = new FormData();
        data.append("start_date", localStorage.getItem("StartFilterDate"));
        data.append("end_date", localStorage.getItem("EndFilterDate"));
        data.append("distributor_id", localStorage.getItem("DistributorId"));
        data.append("type", "1");

        try {
            const response = axios.post("purches-return-iteam-histroy?", data, {
                // params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                // localStorage.removeItem('StartFilterDate')
                // localStorage.removeItem('EndFilterDate')
                // localStorage.removeItem('DistributorId')

            })
        } catch (error) {
            console.error("API error:", error);

        }
    }


    const BankList = async () => {
        let data = new FormData()
        try {
            await axios.post('bank-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setBankData(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    let listOfGst = () => {
        axios.get("gst-list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setGstList(response.data.data);

            })
            .catch((error) => {
                console.error("API error:", error);

            });
    }
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const distributors = await listDistributor();
        await returnBillEditID(distributors, value);
    };
    let isFetching = false;

    const returnBillEditID = async (distributors, value) => {
        if (isFetching) return; // Prevent multiple calls
        isFetching = true;

        try {
            let data = new FormData();
            data.append("purches_return_id", id == null ? id : id);
            data.append("search", value ? value : "");

            const response = await axios.post("purches-return-edit-data?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = response.data.data;

            setTableData(responseData);
            setSelectedDate(responseData?.bill_date);
            setFinalAmount(responseData?.final_amount);
            setTotalAmount(responseData?.total_amount);
            setNetAmount(parseFloat(responseData?.total_amount) + parseFloat(responseData?.other_amount || 0));
            setTotalGST(responseData?.total_gst);
            setTotalQty(responseData?.total_qty);
            setTotalNetRate(responseData?.total_net_rate);
            setTotalMargin(responseData?.total_margin);
            setMargin(responseData?.total_margin);
            setStartDate(responseData?.start_date);
            setEndDate(responseData?.end_date);


            const foundDistributor = distributors?.find(option => option.id == responseData.distributor_id);

            if (foundDistributor) {
                setDistributor(foundDistributor);
            }

            setBillNo(responseData.bill_no || '');
            setRemark(responseData?.remark);
            if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }
        } catch (error) {
            console.error("API error:", error);

        } finally {
            isFetching = false;
        }
    };



    const handleSchAmt = (e) => {
        // Get the input value as a string
        const inputString = e.target.value;
        // Remove invalid characters from the string
        const sanitizedInput = inputString.replace(/[eE]/g, '');
        // Convert the sanitized string to a float
        const inputDiscount = parseFloat(sanitizedInput) || 0;
        setDisc(inputDiscount);
        // Calculate total scheme amount
        const totalSchAmt = parseFloat((((ptr * inputDiscount) / 100) * qty).toFixed(2));
        setSchAmt(totalSchAmt);
        // Calculate total base
        const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
        // setBase(totalBase); // Uncomment if needed
    };


    const removeItem = () => {
        setUnit('')
        setBatch('')
        setSearchItem('');
        setExpiryDate('');
        setMRP('')
        setQty(0)
        setFree('')
        setPTR('')
        setDisc('')
        setGst('')
        setLoc('')
        setItemTotalAmount(0)
    }

    const handleEditClick = (item) => {

        const existingItem = uniqueId.find((obj) => obj.id === item.id);

        if (!existingItem) {
            // If the ID is unique, add the item to uniqueId and set tempQty
            setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }]);
            setTempQty(item.qty);
        } else {
            setTempQty(existingItem.qty);

        }

        setSelectedEditItem(item);
        setItemPurchaseId(item.item_id);
        setSelectedEditItemId(item.id);
        setQty(item.qty)
        setInitialTotalStock(item.total_stock);
        setIsEditMode(true);

        // Focus the unit field after the next render
        setTimeout(() => {
            if (inputRefs.current[3]) {
                inputRefs.current[3].focus();
            }
        }, 100);


    };

    const handleQtyChange = (value) => {
        // const inputQty = Number(e.target.value);
        // setQty(inputQty);

        const availableStockForEdit = initialTotalStock - free;

        if (value <= availableStockForEdit && value >= 0) {
            setQty(value);
        } else if (value > availableStockForEdit) {
            setQty(availableStockForEdit);
            toast.error(`Quantity exceeds the allowed limit. Max available: ${availableStockForEdit}`);
        }
    };
    const handlePTR = (value) => {

        const newPTR = Number(value);

        if (newPTR > mrp) {
            setPTR(mrp);
            toast.error(`PTR should not greater than MRP: ${mrp}`);
        } else if (mrp < 0) {
            setPTR(mrp);
            toast.error(`PTR should not less than MRP: 0`);
        } else {
            setPTR(newPTR)
        }

    }


    const EditReturnItem = async () => {
        setIsEditMode(false);
        setUnsavedItems(true)

        const newErrors = {};
        if (!unit) newErrors.unit = 'Unit is required';
        if (!batch) newErrors.batch = 'Batch is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!mrp) newErrors.mrp = 'MRP is required';
        if (!qty) newErrors.qty = 'Quantity is required';
        // if (Number(tempQty) < Number(qty)) {
        //     newErrors.greatqty = 'Quantity should not be greater than purchase quantity ';
        //     toast.error('Quantity should not be greater than purchase quantity ')
        //     return
        // }
        // if (!free) newErrors.free = 'Free quantity is required';
        if (!ptr) newErrors.ptr = 'PTR is required';

        if (!disc) newErrors.disc = 'Discount is required';

        if (!gst) newErrors.gst = 'GST is required';
        // if (!loc) newErrors.loc = 'Location is required';
        if (gst != 12 && gst != 18 && gst != 5 && gst != 28) {
            newErrors.gst = "Enter valid GST";
            toast.error("Enter valid GST")
        };

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            setUnsavedItems(true)

            await handleEditItem(); // Call handleEditItem if validation passes
        }
        return isValid;

    }

    const handleEditItem = async () => {
        const gstMapping = {
            28: 6,
            18: 4,
            12: 3,
            5: 2,
            0: 1
        };
        let data = new FormData();
        data.append('purches_return_id', selectedEditItemId == null ? "0" : selectedEditItemId)
        data.append('iteam_id', itemPurchaseId == null ? "0" : itemPurchaseId)
        data.append("batch", batch == null ? "0" : batch)
        data.append("exp_dt", expiryDate == null ? "0" : expiryDate)
        data.append("mrp", mrp == null ? "0" : mrp)
        data.append("ptr", ptr == null ? "0" : ptr)
        data.append("fr_qty", free == null ? "0" : free)
        data.append("qty", qty == null ? "0" : qty)
        data.append("disocunt", disc == null ? "0" : disc)
        data.append("gst", gstMapping[gst] ?? gst);

        data.append('location', loc == null ? "0" : loc)
        data.append('amount', ItemTotalAmount == null ? "0" : ItemTotalAmount)
        data.append("weightage", unit == null ? "0" : unit)
        data.append("unit", unit == null ? "0" : unit)
        const params = {
            purches_return_id: selectedEditItemId
        };
        try {
            const response = await axios.post("purches-return-iteam-update?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                ;
            setUnsavedItems(true);

            setIsDeleteAll(true);

            returnBillEditID();
            setSearchItem('');
            setUnit('')
            setBatch('')
            setExpiryDate('');
            setMRP('')
            setQty('')
            setFree('')
            setPTR('')
            setGst('')
            setDisc('')
            setBatch('')
            setLoc('')
            setItemTotalAmount(0);
            // setTableData(response.data.data);
            if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }
        }
        catch (e) {
            console.error("API error:", error);

        }
    }
    const deleteOpen = (Id) => {
        setIsDelete(true);
        setUnsavedItems(true)
        setItemId(Id);
    };
    const handleReturnUpdate = () => {

        const newErrors = {};

        // Check if data is loaded and distributor exists
        if (!distributor || !distributor.id) {
            newErrors.distributor = 'Please select Distributor';
        }

        // Check if billNo exists and is not empty
        if (!billNo || billNo.trim() === '') {
            newErrors.billNo = 'Bill No is Required';
        }

        // if(checkedItems.length===0){
        //     newErrors.checkedItems = 'Item is not selected';
        //     toast.error("Item is not selected");

        // }
        setError(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        updatePurchaseRecord();
        setIsOpenBox(false)
        setPendingNavigation(null);
        setUnsavedItems(false)
    }

    const updatePurchaseRecord = async () => {
        let data = new FormData();
        data.append("distributor_id", distributor?.id);
        data.append("bill_no", billNo == null ? "0" : billNo);
        data.append("bill_date", selectedDate == null ? "0" : selectedDate)
        data.append('remark', remark == null ? "0" : remark)
        data.append("discount", 0);
        // data.append('start_date', startDate ? format(startDate, 'MM-yyyy') : '');
        // data.append('end_date', endDate ? format(endDate, 'MM-yyyy') : '');
        data.append('start_date', startDate ? format(startDate, 'MM/yy') : '');
        data.append('end_date', endDate ? format(endDate, 'MM/yy') : '');
        data.append('total_gst', totalGST ? totalGST : '' || 0);
        //    data.append('final_amount', tableData?.net_amount)
        data.append('other_amount', otherAmount == null ? "0" : otherAmount)
        data.append('net_amount', netAmount == null ? "0" : netAmount)
        data.append('total_amount', totalAmount == null ? "0" : totalAmount)
        data.append("purches_return", JSON.stringify(tableData?.item_list));
        data.append('id', id == null ? "0" : id)
        data.append('round_off', roundOff == null ? "0" : roundOff)
        data.append("draft_save", "1");

        const params = {
            id: id,
        };
        try {
            await axios.post("purches-return-edit?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setUnsavedItems(false)
                setSaveValue(true)
                history.push('/purchase/return');

            })
        } catch (error) {
            console.error("API error:", error);

        }
    }



    const handleDeleteItem = async (ItemId) => {
        setUnsavedItems(true)

        if (!ItemId) return;
        let data = new FormData();
        data.append("purches_return_id", ItemId);
        const params = {
            purches_return_id: ItemId ? ItemId : '',
            type: 1
        };
        try {
            await axios.post("purches-return-iteam-delete?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                returnBillEditID()
                setIsDelete(false);
                setUnsavedItems(true)


            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    const handleChecked = async (ItemId, event) => {
        setUnsavedItems(true)

        setSelectedItem(
            (prevSelected) => prevSelected.includes(ItemId) ? prevSelected.filter(id => id !== ItemId)
                : [...prevSelected, ItemId]);


        let data = new FormData();
        data.append("id", ItemId);
        data.append("type", 1);
        // setIsLoading(true)
        // setCheckedItems((prevCheckedItems) => {
        //     if (prevCheckedItems.includes(ItemId)) {
        //         // If it exists, remove it (uncheck)
        //         return prevCheckedItems.filter((id) => id !== ItemId);
        //     } else {
        //         // If it doesn't exist, add it (check)
        //         return [...prevCheckedItems, ItemId];
        //     }

        // });


        // setCheckedItems((prevCheckedItems) => [...prevCheckedItems, ItemId]);

        try {
            const response = await axios.post("purchase-return-iteam-select", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(() => {
                returnBillEditID()

            }
            );

        } catch (error) {
            console.error("API error:", error);

        }
    };

    const handleOtherAmount = (event) => {
        let value = parseFloat(event.target.value) || "";

        if (value < -totalAmount) {
            value = -totalAmount;
        }
        setUnsavedItems(true)
        setOtherAmount(value);

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
            {isLoading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                <div className="p-6">
                    <div
                        style={{
                            height: "calc(-125px + 100vh)",
                            overflow: "auto",
                        }}
                    >
                        {/* Header Section */}
                        <div className="mb-4" style={{ display: "flex", gap: "4px" }}>
                            <div style={{ display: "flex", gap: "7px" }}>
                                <span
                                    style={{
                                        color: "var(--color2)",
                                        alignItems: "center",
                                        fontWeight: 700,
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                    onClick={() => history.push("/purchase/return")}
                                >
                                    Purchase Return
                                </span>
                                <ArrowForwardIosIcon
                                    style={{
                                        fontSize: "18px",
                                        marginTop: "8px",
                                        color: "var(--color1)",
                                    }}
                                />
                                <span
                                    style={{
                                        color: "var(--color1)",
                                        alignItems: "center",
                                        fontWeight: 700,
                                        fontSize: "20px",
                                    }}
                                >
                                    Edit
                                </span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList" style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                                <Button
                                    variant="contained"
                                    style={{ background: "var(--color1)", padding: "10px 24px", height: "40px" }}
                                    onClick={() => handleReturnUpdate()}
                                >
                                    Update
                                </Button>
                            </div>
                        </div>

                        <div
                            className="row border-b border-dashed"
                            style={{ borderColor: "var(--color2)" }}
                        ></div>

                        {/* Continue with table and other sections... */}
                        <div className="mt-4">
                            <div className="firstrow flex gap-4" >
                                <div className="flex flex-row gap-4 overflow-x-auto w-full ">

                                    <div className="detail custommedia" style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <span className="heading mb-2">Distributor</span>
                                        <Autocomplete
                                            disabled
                                            value={distributor}
                                            sx={{ width: '350px' }}
                                            size='small'
                                            onChange={(e, value) => setDistributor(value)}
                                            options={distributorList}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField
                                                autoComplete="off" {...params} />}
                                        />
                                        {error.distributor && <span style={{ color: 'red', fontSize: '12px' }}>{error.distributor}</span>}
                                    </div>
                                    <div className="detail custommedia" style={{
                                        display: "flex",
                                        flexDirection: "column",

                                    }}>
                                        <span className="heading mb-2 ">Bill Date</span>
                                        <div >
                                            <DatePicker
                                                className='custom-datepicker_mn '
                                                selected={selectedDate}
                                                onChange={(newDate) => setSelectedDate(newDate)}
                                                dateFormat="dd/MM/yyyy"
                                                disabled

                                                sx={{
                                                    width: '350px', colors: "#BDBDBD"

                                                }}
                                                style={{
                                                    color: '#BDBDBD',
                                                    backgroundColor: '#F0F0F0',
                                                    border: '1px solid #BDBDBD',
                                                    cursor: 'not-allowed',
                                                    width: '350px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="detail custommedia" style={{
                                        display: "flex",
                                        flexDirection: "column",

                                    }}>
                                        <span className="heading mb-2">Bill No</span>
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-number"
                                            size="small"

                                            value={billNo}
                                            disabled
                                            onChange={(e) => { setBillNo(e.target.value) }}
                                        />
                                        {error.billNo && <span style={{ color: 'red', fontSize: '12px' }}>{error.billNo}</span>}

                                    </div>
                                    <div className="detail custommedia" style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <span className="heading mb-2">Start Date</span>
                                        <div >
                                            <TextField
                                                autoComplete="off"

                                                disabled
                                                id="outlined-number"
                                                size="small"
                                                value={startDate}
                                            />

                                        </div>
                                    </div>
                                    <div className="detail custommedia" style={{
                                        display: "flex",
                                        flexDirection: "column",

                                    }}>
                                        <span className="heading mb-2">End Date <span className="text-red-600">*</span></span>
                                        <div>

                                            <TextField
                                                autoComplete="off"

                                                disabled
                                                id="outlined-number"
                                                size="small"

                                                value={endDate}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* Table Section */}
                            <div className="table-container">

                                <table className="w-full border-collapse item-table" ref={tableRef} tabIndex={0}>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="flex justify-center items-center gap-2">
                                                    Search Item Name <span className="text-red-600">*</span>
                                                </div>
                                            </th>
                                            <th>Unit <span className="text-red-600">*</span></th>
                                            <th>Batch <span className="text-red-600">*</span></th>
                                            <th>Expiry <span className="text-red-600">*</span></th>
                                            <th>MRP <span className="text-red-600">*</span></th>
                                            <th>Qty.</th>
                                            <th>Free</th>
                                            <th>PTR <span className="text-red-600">*</span></th>
                                            <th>CD%</th>
                                            <th>GST% <span className="text-red-600">*</span></th>
                                            <th>Loc.</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="input-row">
                                            <td className="p-0">
                                                {!isEditMode ? (
                                                    <div style={{ minWidth: 366, padding: 0 }}>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-basic"
                                                            size="small"
                                                            autoFocus
                                                            sx={{ width: "366px" }}
                                                            value={searchQuery}
                                                            onChange={handleInputChange}
                                                            variant="outlined"
                                                            placeholder="Please search any items.."
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <svg width="20" height="20" fill="gray">
                                                                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                                                        </svg>
                                                                    </InputAdornment>
                                                                ),
                                                                type: "search",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: 15, fontWeight: 600, minWidth: 366, padding: 0, display: 'flex', alignItems: 'left' }}>
                                                        <DeleteIcon className="delete-icon mr-2" onClick={removeItem} />
                                                        {searchItem?.slice(0, 30)}{searchItem?.length > 30 ? '...' : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    type="number"
                                                    size="small"
                                                    sx={{ width: "100px" }}
                                                    error={!!errors.unit}
                                                    helperText={errors.unit}
                                                    value={unit}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        setUnit(value ? Number(value) : "");
                                                    }}
                                                    inputRef={(el) => (inputRefs.current[3] = el)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            if (unit && unit !== 0) {
                                                                handleKeyDown(e, 3);
                                                            } else {
                                                                toast.error("Please enter unit");
                                                                e.preventDefault();
                                                            }
                                                        }
                                                        if (['e', 'E', '.', '+', '-', ','].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    size="small"
                                                    sx={{ width: '100px' }}
                                                    disabled

                                                    // inputRef={inputRef3}
                                                    // onKeyDown={handleKeyDown}
                                                    error={!!errors.expiryDate}
                                                    value={batch}
                                                    // onChange={handleExpiryDateChange}
                                                    placeholder="MM/YY"

                                                />

                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    size="small"
                                                    sx={{ width: '100px' }}
                                                    disabled

                                                    // inputRef={inputRef3}
                                                    // onKeyDown={handleKeyDown}
                                                    error={!!errors.expiryDate}
                                                    value={expiryDate}
                                                    // onChange={handleExpiryDateChange}
                                                    placeholder="MM/YY"

                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    type="number"
                                                    sx={{ width: '100px' }}
                                                    size="small"
                                                    disabled
                                                    // inputRef={inputRef4}
                                                    // error={!!errors.mrp}
                                                    // onKeyDown={handleKeyDown}
                                                    value={mrp}

                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                            setMRP(value ? Number(value) : "");
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {

                                                        if (
                                                            ['e', 'E', '+', '-', ','].includes(e.key) ||
                                                            (e.key === '.' && e.target.value.includes('.'))
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    type="number"
                                                    sx={{ width: '100px' }}
                                                    size="small"
                                                    // inputRef={inputRef5}
                                                    // onKeyDown={handleKeyDown}
                                                    error={!!errors.qty}
                                                    value={qty}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        handleQtyChange(value ? Number(value) : "");
                                                    }}

                                                    inputRef={(el) => (inputRefs.current[4] = el)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            if (qty && qty !== 0) {
                                                                handleKeyDown(e, 4);
                                                            } else {
                                                                toast.error("Please enter quantity");
                                                                e.preventDefault();
                                                            }
                                                        }
                                                        if (
                                                            ['e', 'E', '.', '+', '-', ','].includes(e.key)
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}


                                                // onChange={(e) => { e.target.value > tempQty ? setQty(tempQty) : setQty(e.target.value) }}
                                                />

                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    size="small"
                                                    type="number"
                                                    sx={{ width: '100px' }}
                                                    value={free}
                                                    // inputRef={inputRef6}
                                                    // error={!!errors.free}
                                                    // onKeyDown={handleKeyDown}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        setFree(value ? Number(value) : "");
                                                    }}
                                                    inputRef={(el) => (inputRefs.current[5] = el)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            if (free !== "") {
                                                                handleKeyDown(e, 5);
                                                            } else {
                                                                toast.error("Please enter free quantity");
                                                                e.preventDefault();
                                                            }
                                                        }
                                                        if (
                                                            ['e', 'E', '.', '+', '-', ','].includes(e.key)
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />

                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    type="number"
                                                    sx={{ width: '100px' }}
                                                    size="small"
                                                    // inputRef={inputRef7}
                                                    // onKeyDown={handleKeyDown}
                                                    value={ptr}
                                                    error={!!errors.ptr}
                                                    inputRef={(el) => (inputRefs.current[6] = el)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            if (ptr && ptr !== 0) {
                                                                handleKeyDown(e, 6);
                                                            } else {
                                                                toast.error("Please enter PTR");
                                                                e.preventDefault();
                                                            }
                                                        }
                                                        if (
                                                            ['e', 'E', '+', '-', ','].includes(e.key) ||
                                                            (e.key === '.' && e.target.value.includes('.'))
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                            handlePTR(value ? Number(value) : "");
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    sx={{ width: '100px' }}
                                                    size="small"
                                                    type="number"
                                                    // inputRef={inputRef8}
                                                    // onKeyDown={handleKeyDown}
                                                    value={disc}
                                                    error={!!errors.disc}

                                                    inputRef={(el) => (inputRefs.current[7] = el)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            if (disc !== "") {
                                                                handleKeyDown(e, 7);
                                                            } else {
                                                                toast.error("Please enter CD");
                                                                e.preventDefault();
                                                            }
                                                        }
                                                        if (
                                                            ['e', 'E', '+', '-', ','].includes(e.key) ||
                                                            (e.key === '.' && e.target.value.includes('.'))
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (Number(value) > 100) {
                                                            e.target.value = 100;
                                                        }
                                                        handleSchAmt(e);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    labelId="dropdown-label"
                                                    id="dropdown"
                                                    value={gst}
                                                    sx={{ width: '100px' }}
                                                    inputRef={(el) => (inputRefs.current[8] = el)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            if (gst && gst !== "") {
                                                                handleKeyDown(e, 8);
                                                            } else {
                                                                toast.error("Please enter GST");
                                                                e.preventDefault();
                                                            }
                                                        }
                                                        if (
                                                            ['e', 'E', '+', '-', ','].includes(e.key) ||
                                                            (e.key === '.' && e.target.value.includes('.'))
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => setGst(e.target.value)}

                                                    size="small"
                                                    displayEmpty
                                                    error={!!errors.gst}
                                                >

                                                </TextField>
                                            </td>
                                            <td>
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    // inputRef={inputRef12}
                                                    // onKeyDown={handleKeyDown}
                                                    size="small"
                                                    value={loc}
                                                    // error={!!errors.loc}
                                                    sx={{ width: '100px' }}
                                                    onChange={(e) => { setLoc(e.target.value) }}
                                                    inputRef={(el) => (inputRefs.current[9] = el)}
                                                    onKeyDown={async (e) => {
                                                        if (e.key === 'Enter') {
                                                            await EditReturnItem();
                                                            // After edit, focus back to the first field
                                                            if (inputRefs.current[0]) {
                                                                inputRefs.current[0].focus();
                                                            }
                                                        }
                                                    }}
                                                />
                                            </td>
                                            {/* <td className="total"><span>{ItemTotalAmount}</span></td> */}

                                            <td className="total"><span>{ItemTotalAmount}</span></td>
                                        </tr>
                                        {tableData?.item_list?.map((item, index) => (
                                            <tr key={item.id} onClick={() => {
                                                setSelectedIndex(index)
                                                handleEditClick(item)
                                            }}
                                                className={`cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`}
                                            >
                                                <td style={{ whiteSpace: 'nowrap', width: '400px', textAlign: 'left' }}>
                                                    <Checkbox
                                                        sx={{
                                                            color: "var(--color2)", // Color for unchecked checkboxes
                                                            '&.Mui-checked': {
                                                                color: "var(--color1)", // Color for checked checkboxes
                                                            },
                                                        }}
                                                        checked={item.iss_check}
                                                        onClick={(event) => event.stopPropagation()}
                                                        onChange={(event) => handleChecked(item.id, event.target.checked)}
                                                    />
                                                    <BorderColorIcon
                                                        style={{ color: "var(--color1)" }} onClick={() => handleEditClick(item)} />
                                                    <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} />
                                                    {item.item_name}
                                                </td>
                                                <td>{item.weightage}</td>
                                                <td>{item.batch_number}</td>
                                                <td>{item.expiry}</td>
                                                <td>{item.mrp}</td>
                                                <td>{item.qty}</td>
                                                <td>{item.fr_qty}</td>
                                                <td>{item.ptr}</td>
                                                <td>{item.disocunt}</td>
                                                <td>{item.gst_name}</td>
                                                <td>{item.location}</td>
                                                <td>{item.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div >

                    {/* modal here  */}
                    <div className="" style={{ background: 'var(--color1)', color: 'white', display: "flex", justifyContent: 'space-between', position: 'fixed', width: '100%', bottom: '0', left: '0', overflow: 'auto' }}>
                        <div className="" style={{ display: 'flex', whiteSpace: 'nowrap', left: '0', padding: '20px' }}>
                            <div
                                className="gap-2 invoice_total_fld"
                                style={{ display: "flex" }}
                            >
                                <label className="font-bold">Total GST : </label>

                                <span style={{ fontWeight: 600 }}>{totalGST} </span>
                            </div>
                            <div
                                className="gap-2 invoice_total_fld"
                                style={{ display: "flex" }}
                            >
                                <label className="font-bold">Total Qty : </label>
                                <span style={{ fontWeight: 600 }}>  {totalQty}
                                </span>
                            </div>

                        </div>

                        <div
                            style={{
                                display: "flex",
                                padding: "0 20px",
                                whiteSpace: "noWrap",
                            }}
                        >
                            <div
                                className="gap-2 "
                                onClick={toggleModal}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <label className="font-bold">Net Amount : </label>
                                <span
                                    className="gap-1"
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "22px",
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {!netAmount ? 0 : netAmount}
                                    <FaCaretUp />
                                </span>
                            </div>

                            <Modal
                                show={isModalOpen}
                                onClose={toggleModal}
                                size="lg"
                                position="bottom-center"
                                className="modal_amount"
                            // style={{ width: "50%" }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                                        color: "white",
                                        padding: "20px",
                                        fontSize: "larger",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <h2 style={{ textTransform: "uppercase" }}>
                                        invoice total
                                    </h2>
                                    <IoMdClose
                                        onClick={toggleModal}
                                        cursor={"pointer"}
                                        size={30}
                                    />
                                </div>
                                <div
                                    style={{
                                        background: "white",
                                        padding: "20px",
                                        width: "100%",
                                        maxWidth: "600px",
                                        margin: "0 auto",
                                        lineHeight: "2.5rem",
                                    }}
                                >
                                    <div
                                        className=""
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <label className="font-bold">Total Amount : </label>
                                        <span style={{ fontWeight: 600 }}>
                                            {totalAmount ? totalAmount : 0}
                                        </span>
                                    </div>
                                    <div
                                        className=""
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <label className="font-bold">Other Amount : </label>
                                        <div>
                                            <Input
                                                type="number"
                                                value={otherAmount}
                                                onChange={handleOtherAmount}
                                                size="small"
                                                style={{
                                                    width: "70px",
                                                    background: "none",
                                                    justifyItems: "end",
                                                    outline: "none",
                                                }} sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: '35px',
                                                    },
                                                    "& .MuiInputBase-input": { textAlign: "end" }

                                                }} />
                                        </div>
                                    </div>

                                    <div
                                        className=""
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            paddingBottom: "5px",
                                        }}
                                    >
                                        <label className="font-bold">Total Net Rate : </label>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: "#F31C1C",
                                            }}
                                        >
                                            {totalNetRate}
                                        </span>
                                    </div>

                                    <div
                                        className="font-bold"
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            paddingBottom: "5px",
                                            borderTop:
                                                "1px solid var(--toastify-spinner-color-empty-area)",
                                            paddingTop: "5px",
                                        }}
                                    >
                                        <label className="font-bold">Round Off : </label>
                                        <span>{roundOff === "0.00" ? roundOff : (roundOff < 0.49 ? `- ${roundOff}` : `${parseFloat(1 - roundOff).toFixed(2)}`)}</span>
                                    </div>

                                    <div
                                        className=""
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            justifyContent: "space-between",
                                            borderTop: "2px solid var(--COLOR_UI_PHARMACY)",
                                            paddingTop: "5px",
                                        }}
                                    >
                                        <label className="font-bold">Net Amount: </label>
                                        <span
                                            style={{
                                                fontWeight: 800,
                                                fontSize: "22px",
                                                color: "var(--COLOR_UI_PHARMACY)",
                                            }}
                                        >
                                            {!netAmount ? 0 : netAmount}
                                        </span>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                    {/* Delete Confirmation Dialog */}
                    <Dialog open={IsDelete} className="custom-dialog">
                        <DialogTitle className="primary">Delete Confirmation</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={() => setIsDelete(false)}
                            sx={{ position: "absolute", right: 8, top: 8, color: "#ffffff" }}
                        >
                            <IoMdClose />
                        </IconButton>
                        <DialogContent>
                            <div className="my-4 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                                    <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                                    <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                                </svg>
                                <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
                            </div>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteItem(ItemId)}
                                sx={{ minWidth: 120 }}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => setIsDelete(false)}
                                sx={{ minWidth: 120 }}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Leave Page Dialog */}
                    <Dialog open={isOpenBox} className="custom-dialog">
                        <DialogTitle className="primary">Leave Page</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={LogoutClose}
                            sx={{ position: "absolute", right: 8, top: 8, color: "#ffffff" }}
                        >
                            <IoMdClose />
                        </IconButton>
                        <DialogContent>
                            <div className="my-4 logout-icon text-center">
                                <VscDebugStepBack className="h-12 w-14" style={{ color: "#628A2F" }} />
                                <h4 className="text-lg font-semibold mt-6">Are you sure you want to leave this page?</h4>
                            </div>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLeavePage}
                                sx={{ minWidth: 120 }}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={LogoutClose}
                                sx={{ minWidth: 120 }}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Prompt
                        when={unsavedItems}
                        message={(location) => {
                            handleNavigation(location.pathname);
                            return false;
                        }}
                    />


                </div >
            )}
        </>
    );
};

export default EditReturnBill;
