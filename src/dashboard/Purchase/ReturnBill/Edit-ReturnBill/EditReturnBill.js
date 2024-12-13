
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
    const [gst, setGst] = useState({ id: '', name: '' });
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
    const [initialTotalStock, setInitialTotalStock] = useState(0); // or use null if you want
    const [uniqueId, setUniqueId] = useState([])

    const handleClose = () => {
        setIsDelete(false);
    };

    // useEffect(() => {
    //     if (saveValue === false) {
    //         unblockRef.current = history.block((location) => {
    //             if (!isOpenBox) {
    //                 setPendingNavigation(location);
    //                 setIsOpenBox(true);
    //                 setSaveValue(false);
    //                 return false;
    //             }
    //         });
    //         return () => {
    //             if (unblockRef.current) {
    //                 unblockRef.current();
    //             }
    //         };
    //     }
    // }, [saveValue, history, isOpenBox]);
    // useEffect(() => {

    //     const initialize = async () => {
    //         try {
    //             await handleLeavePage();
    //         } catch (error) {
    //             console.error("Error during initialization:", error);
    //         }
    //     };

    //     initialize();
    // }, []);
    
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
            setGst(gstList.find(option => option.name === selectedEditItem.gst_name) || {});
            setLoc(selectedEditItem.location);
            setItemTotalAmount(selectedEditItem.amount)
        }
    }, [selectedEditItem])
   
    useEffect(() => {
        const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
        const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
        const totalAmount = parseFloat((totalBase + (totalBase * gst.name / 100)).toFixed(2));
        if (totalAmount) {
            setItemTotalAmount(totalAmount);
        } else {
            setItemTotalAmount(0)
        }
        if (isDeleteAll == false) {
            // restoreData();
        }
    }, [ptr, qty, disc, gst.name, tempQty])

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
            console.error("Error deleting items:", error);
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
        window.location.reload();
    };

    // useEffect(() => {
    //     const initializeData = async () => {
    //         setIsLoading(true);
    //         const distributors = await listDistributor();
    //         await returnBillEditID(distributors);
    //         setIsLoading(false);
    //         ////console.log(distributors, "1234");

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
            ////console.log("Distributors fetched: ", distributors);
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
                ////console.log(batchList);
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
                ////console.log(response);
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
                setBankData(response.data.data)
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
                ////console.log("API Response item Catagory:===", response);
                setGstList(response.data.data);
            })
            .catch((error) => {
                ////console.log("API Error:", error);
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
        } catch (error) {
            console.error("API error:", error);
        } finally {
            isFetching = false;
        }
    };

    // const returnBillEditID = async (distributors, value) => {
    //     let data = new FormData();
    //     data.append("purches_return_id", id == null ? id : id);
    //     data.append("search", value ? value : "");

    //     const params = {
    //         purches_return_id: id,
    //     };
    //     try {
    //         await axios.post("purches-return-edit-data?", data, {
    //             // params: params,
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }
    //         ).then((response) => {
    //             const data = response.data.data;
    //             setTableData(data);
    //             setSelectedDate(data?.bill_date)
    //             setFinalAmount(response.data.data?.final_amount)
    //             setTotalAmount(response.data.data?.total_amount)
    //             otherAmount ? setOtherAmount(otherAmount) : setOtherAmount(response.data.data?.other_amount)
    //             setNetAmount(parseFloat(response.data.data?.total_amount) + parseFloat(response.data.data?.other_amount))
    //             setTotalGST(response.data.data?.total_gst)
    //             setTotalQty(response.data.data?.total_qty)
    //             setTotalNetRate(response.data.data?.total_net_rate)
    //             setTotalMargin(response.data.data?.total_margin)
    //             setMargin(response.data.data?.total_margin)
    //             setStartDate(response.data.data?.start_date);
    //             setEndDate(response.data.data?.end_date)

    //             if (!distributors || !Array.isArray(distributors)) {
    //                 console.error("Distributors is not an array or undefined");
    //                 return;
    //             }
    //             const foundDistributor = distributors.find(option => option.id == data.distributor_id);

    //             // const foundDistributor = distributors.find(option => {
    //             //     return option.id == data.distributor_id;
    //             // });

    //             ////console.log(foundDistributor, "mh");
    //             setBillNo(data.bill_no || '');
    //             // const parsedDate = parse(data.start_date , 'MM-yyyy', new Date());
    //             // const formattedDate = format(parsedDate, 'MM-yyyy');

    //             setRemark(data?.remark)
    //             ////console.log(tableData, 'tableData')

    //             if (foundDistributor) {
    //                 setDistributor(foundDistributor);
    //             }
    //         })
    //     } catch (error) {
    //         console.error("API error:", error);
    //         setIsLoading(false);
    //     }
    // }

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
        console.log(existingItem, "existingItem")

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
console.log(initialTotalStock,"initialTotalStock")

    };
    // const handleQty = (value) => {

    //     const newQty = Number(value);

    //     if (newQty > tempQty) {
    //         setQty(tempQty);
    //         toast.error(`Quantity exceeds the allowed limit. Max available: ${tempQty}`);
    //     } else if (newQty < 0) {
    //         setQty(tempQty);
    //         toast.error(`Quantity should not be less than 0`);
    //     } else {
    //         setQty(newQty)
    //     }

    // }
    const handleQtyChange = (value) => {
        // const inputQty = Number(e.target.value);
        // setQty(inputQty);

        const availableStockForEdit = initialTotalStock-free ;

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
        setUnsavedItems(true)

        const newErrors = {};
        if (!unit) newErrors.unit = 'Unit is required';
        if (!batch) newErrors.batch = 'Batch is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!mrp) newErrors.mrp = 'MRP is required';
        if (!qty) newErrors.qty = 'Quantity is required';
        // if (Number(tempQty) < Number(qty)) {
        //     console.log(tempQty, qty, "")
        //     newErrors.greatqty = 'Quantity should not be greater than purchase quantity ';
        //     toast.error('Quantity should not be greater than purchase quantity ')
        //     return
        // }
        // if (!free) newErrors.free = 'Free quantity is required';
        if (!ptr) newErrors.ptr = 'PTR is required';
      
        if (!disc) newErrors.disc = 'Discount is required';

        if (!gst.name) newErrors.gst = 'GST is required';
        // if (!loc) newErrors.loc = 'Location is required';

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            setUnsavedItems(true)

            await handleEditItem(); // Call handleEditItem if validation passes
        }
        return isValid;

    }

    const handleEditItem = async () => {
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
        data.append('gst', gst.id == null ? "0" : gst.id)
        data.append('location', loc == null ? "0"  :loc )
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
            ////console.log("response", response);
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
        }
        catch (e) {
            ////console.log(e)
        }
    }
    const deleteOpen = (Id) => {
        setIsDelete(true);
        setUnsavedItems(true)
        setItemId(Id);
    };
    const handleReturnUpdate = (checkedItems) => {

        const newErrors = {};
        if (!distributor) {
            newErrors.distributor = 'Please select Distributor';
        }
        if (!billNo) {
            newErrors.billNo = 'Bill No is Required';
        }
        // if(checkedItems.length===0){
        //     newErrors.checkedItems = 'Item is not selected';
        //     toast.error("Item is not selected");

        // }
        setError(newErrors);

        if (Object.keys(newErrors).length > 0) {
            //console.log(newErrors, 'newErrors')
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
                ////console.log(response.data);
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
        // //console.log(checkedItems,"checkedItems");

        // setCheckedItems((prevCheckedItems) => [...prevCheckedItems, ItemId]);

        ////console.log(checkedItems,"checkedItems");
        try {
            const response = await axios.post("purchase-return-iteam-select", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(() => {
                returnBillEditID()
            }
            );
            ////console.log(response)
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
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :

                <div style={{ height: 'calc(99vh - 75px)', padding: "0px 20px 0px" }} >
                    <ToastContainer />
                    <div>
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px', gap: '7px', alignItems: "center" }}>
                                <span style={{ color: 'var(--color2)', alignItems: 'center', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={() => history.push('/purchase/return')}>Purchase Return</span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                <span style={{ color: '#044c9d', fontWeight: 600, fontSize: '18px' }}>Edit </span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList">
                                {/* <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    value={paymentType}
                                    sx={{ minWidth: '200px' }}
                                    onChange={(e) => { setPaymentType(e.target.value) }}
                                    size="small"
                                >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="credit">Credit</MenuItem>
                                    {bankData?.map(option => (
                                        <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                    ))}
                                </Select> */}
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleReturnUpdate(checkedItems)}  >
                                    Update
                                </Button>

                            </div>
                        </div>
                        <div>
                            <div className="firstrow flex" >
                                <div className="detail">
                                    <span className="title mb-2">Distributor</span>
                                    <Autocomplete
                                        disabled
                                        value={distributor}
                                        sx={{
                                            width: '100%',
                                            minWidth: '550px',
                                            '@media (max-width:600px)': {
                                                minWidth: '300px',
                                            },
                                        }}
                                        size='small'
                                        onChange={(e, value) => setDistributor(value)}
                                        options={distributorList}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    {error.distributor && <span style={{ color: 'red', fontSize: '12px' }}>{error.distributor}</span>}
                                </div>
                                <div className="detail">
                                    <span className="heading mb-2 ">Bill Date</span>
                                    <DatePicker
                                        className='custom-datepicker '
                                        selected={selectedDate}
                                        onChange={(newDate) => setSelectedDate(newDate)}
                                        dateFormat="dd/MM/yyyy"
                                        disabled
                                        sx={colors = "#BDBDBD"}
                                        style={{
                                            color: '#BDBDBD',
                                            backgroundColor: '#F0F0F0',
                                            border: '1px solid #BDBDBD',
                                            cursor: 'not-allowed',
                                        }}
                                    />
                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Bill No</span>
                                    <TextField
                                        id="outlined-number"
                                        size="small"
                                        sx={{ width: '250px' }}
                                        value={billNo}
                                        disabled
                                        onChange={(e) => { setBillNo(e.target.value) }}
                                    />
                                    {error.billNo && <span style={{ color: 'red', fontSize: '12px' }}>{error.billNo}</span>}

                                </div>
                                <div className="detail">
                                    <span className="title mb-2">Start Date</span>
                                    <div style={{ width: "215px" }}>
                                        <TextField

                                            disabled
                                            id="outlined-number"
                                            size="small"
                                            sx={{ width: '200px' }}
                                            value={startDate}
                                        />
                                        {/* <DatePicker
                                            className='custom-datepicker '
                                            selected={startDate}
                                            onChange={(newDate) => setStartDate(newDate)}
                                            dateFormat="dd/MM/yyyy"
                                            disabled
                                            minDate={new Date()}
                                        /> */}
                                        {/* <DatePicker
                                            className='custom-datepicker '
                                            selected={startDate}
                                            onChange={(newDate) => setStartDate(newDate)}
                                            dateFormat="MM/yy"
                                            showMonthYearPicker
                                        /> */}
                                    </div>
                                </div>
                                <div className="detail">
                                    <span className="title mb-2">End Date</span>
                                    <div style={{ width: "215px" }}>
                                        {/* <DatePicker
                                            className='custom-datepicker '
                                            selected={endDate}
                                            disabled
                                            onChange={(newDate) => setEndDate(newDate)}
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                        /> */}
                                        {/* <DatePicker
                                            className='custom-datepicker '
                                           selected={endDate}
                                            onChange={(newDate) => setEndDate(newDate)}
                                            dateFormat="MM/yy"
                                            showMonthYearPicker
                                        /> */}
                                        <TextField

                                            disabled
                                            id="outlined-number"
                                            size="small"
                                            sx={{ width: '200px' }}
                                            value={endDate}
                                        />
                                    </div>
                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Remark</span>
                                    <TextField
                                        id="outlined-number"
                                        size="small"
                                        sx={{
                                            width: '100%',
                                            minWidth: '550px',
                                            '@media (max-width:600px)': {
                                                minWidth: '300px',
                                            },
                                        }}

                                        value={remark}
                                        onChange={(e) => { setRemark(e.target.value) }}
                                    />
                                </div>
                                <div>
                                </div>
                                <div className='overflow-x-auto w-full'>
                                    <table className="customtable  w-full border-collapse custom-table">
                                        <thead>
                                            <tr>
                                                <th >Item Name</th>
                                                <th >Unit</th>
                                                <th >Batch  </th>
                                                <th >Expiry </ th>
                                                <th >MRP  </th>
                                                <th >Qty. </th>
                                                <th >Free </th>
                                                <th >PTR </ th>
                                                <th >CD%</th>
                                                <th >GST%  </th>
                                                <th >Loc.</th>
                                                <th >Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '500px' }}>
                                                    <div >
                                                        <DeleteIcon className='delete-icon' onClick={removeItem}
                                                        />
                                                        {searchItem}
                                                    </div>
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        type="number"
                                                        // inputRef={inputRef1}
                                                        // onKeyDown={handleKeyDown}
                                                        size="small"
                                                        error={!!errors.unit}
                                                        value={unit}
                                                        sx={{ width: '80px' }}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                                            setUnit(value ? Number(value) : "");
                                                        }}
                                                        onKeyDown={(e) => {

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

                                                        onKeyDown={(e) => {

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
                                                        onKeyDown={(e) => {

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
                                                        id="outlined-number"
                                                        type="number"
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                        // inputRef={inputRef7}
                                                        // onKeyDown={handleKeyDown}
                                                        value={ptr}
                                                        error={!!errors.ptr}
                                                        onKeyDown={(e) => {
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
                                                        id="outlined-number"
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                        type="number"
                                                        // inputRef={inputRef8}
                                                        // onKeyDown={handleKeyDown}
                                                        value={disc}
                                                        error={!!errors.disc}

                                                        onKeyDown={(e) => {
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
                                                    <Select
                                                        labelId="dropdown-label"
                                                        id="dropdown"
                                                        value={gst.name}
                                                        sx={{ minWidth: '80px' }}
                                                        onChange={(e) => {
                                                            const selectedOption = gstList.find(option => option.name === e.target.value);
                                                            setGst(selectedOption);
                                                        }}
                                                        size="small"
                                                        displayEmpty
                                                        error={!!errors.gst}
                                                    >
                                                        {gstList.map(option => (
                                                            <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                                                        ))}
                                                    </Select>

                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        // inputRef={inputRef12}
                                                        // onKeyDown={handleKeyDown}
                                                        size="small"
                                                        value={loc}
                                                        // error={!!errors.loc}
                                                        sx={{ width: '100px' }}
                                                        onChange={(e) => { setLoc(e.target.value) }}
                                                    />
                                                </td>
                                                {/* <td className="total"><span>{ItemTotalAmount}</span></td> */}

                                                <td className="total"><span>{ItemTotalAmount}</span></td>
                                            </tr>
                                            <tr >
                                                <td>
                                                    <TextField
                                                        id="outlined-basic"
                                                        size="small"
                                                        autoFocus
                                                        sx={{ width: "75%", marginTop: "5px" }}
                                                        value={searchQuery}
                                                        onChange={handleInputChange}
                                                        variant="outlined"
                                                        placeholder="Please search any items.."
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                            ),
                                                            type: "search",
                                                        }}
                                                    />
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td >
                                                    <Button variant="contained" color="success"
                                                        style={{ display: 'flex', gap: '5px' }}
                                                        onClick={EditReturnItem}
                                                    ><EditIcon sx={{ fontSize: 18 }} />Edit</Button>
                                                </td>
                                            </tr>



                                            {tableData?.item_list?.map((item) => (
                                                <tr key={item.id} className="item-List" onClick={() => handleEditClick(item)}>
                                                    <td>
                                                        <Checkbox
                                                            checked={item.iss_check}
                                                            onClick={(event) => event.stopPropagation()}
                                                            onChange={(event) => handleChecked(item.id, event.target.checked)}
                                                        />
                                                        <BorderColorIcon color="primary" onClick={() => handleEditClick(item)} />
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
                                    <div className="flex gap-10 justify-end mt-5 flex-wrap "  >
                                        <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                            <div>
                                                <label className="font-bold">Total GST : </label>
                                            </div>
                                            <div>
                                                <label className="font-bold">Total Qty : </label>
                                            </div>
                                            {/* <div>
                                                <label className="font-bold">Net Rate : </label>
                                            </div> */}
                                        </div>
                                        <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>

                                            <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>
                                                <span style={{ fontWeight: 600 }}>{totalGST}</span>
                                                <span style={{ fontWeight: 600 }}>{totalQty}</span>
                                                {/* <span style={{ fontWeight: 600 }}>{totalNetRate}</span> */}

                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                            <div>
                                                <label className="font-bold">Total Amount : </label>
                                            </div>

                                            <div>
                                                <label className="font-bold">Other Amount: </label>
                                            </div>
                                            {/* <div>
                                                <label className="font-bold">Profit : </label>
                                            </div> */}

                                            <div>
                                                <label className="font-bold">Net Rate : </label>
                                            </div>
                                            <div>
                                                <label className="font-bold">Round Off : </label>
                                            </div>
                                            <div>
                                                <label className="font-bold" >Net Amount : </label>
                                            </div>
                                        </div>
                                        <div class="totals mr-5" style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: "end" }}>

                                            <div>
                                                <span style={{ fontWeight: 600 }}>{totalAmount ? totalAmount : 0}</span>
                                            </div>
                                            {/* <div>
                                            <TextField value={finalDiscount} onChange={(e) => { setFinalDiscount(e.target.value) }} size="small" style={{ width: '105px' }} sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '35px'
                                                },
                                            }} />
                                        </div> */}

                                            <div>
                                                <Input
                                                    type="number"
                                                    value={otherAmount}
                                                    onChange={handleOtherAmount}
                                                    size="small"
                                                    style={{
                                                        width: "70px",
                                                        background: "none",
                                                        borderBottom: "1px solid gray",
                                                        justifyItems: "end",
                                                        outline: "none",
                                                    }} sx={{
                                                        '& .MuiInputBase-root': {
                                                            height: '35px',
                                                        },
                                                        "& .MuiInputBase-input": { textAlign: "end" }

                                                    }} />
                                            </div>
                                            {/* <div className='mt-2'>
                                                <span style={{ fontWeight: 600, }}>₹{!margin ? 0 : margin} &nbsp;({!totalMargin ? 0 : totalMargin})%</span>
                                            </div> */}
                                            <div className='mt-2'>
                                                <span style={{ fontWeight: 600, }}>{totalNetRate}</span>
                                            </div>
                                            <div className='mt-1'>
                                                <span >{roundOff === "0.00" ? roundOff : (roundOff < 0.49 ? `- ${roundOff}` : `${parseFloat(1 - roundOff).toFixed(2)}`)}</span>
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 800, fontSize: '22px' }}>{!netAmount ? 0 : netAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div >

                    {/* Delete PopUP */}
                    <div id="modal" value={IsDelete}
                        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                            }`}>
                        <div />
                        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                                viewBox="0 0 24 24" onClick={handleClose}>
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
                                    onClick={() => handleDeleteItem(ItemId)}
                                >Delete</button>
                                <button type="button"
                                    className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* popup for history api call */}
                    <Prompt
                        when={unsavedItems}
                        message={(location) => {
                            handleNavigation(location.pathname);
                            return false;
                        }}
                    />
                    <div
                        id="modal"
                        value={isOpenBox}
                        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${isOpenBox ? "block" : "hidden"}`}
                    >
                        <div />
                        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                            <div className="my-4 logout-icon">
                                <VscDebugStepBack className=" h-12 w-14" style={{ color: "#628A2F" }} />
                                <h4 className="text-lg font-semibold mt-6 text-center"> <span style={{ textTransform: "uppercase" }}>A</span>
                                    <span style={{ textTransform: "lowercase" }}>re you sure you want to leave this page?</span></h4>
                            </div>
                            <div className="flex gap-5 justify-center">
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-blue-600 hover:bg-blue-600 active:bg-blue-500"
                                    onClick={handleLeavePage}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
                                    onClick={LogoutClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>



                </div >
            }
        </>
    )
}
export default EditReturnBill
