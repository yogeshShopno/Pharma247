import "./AddPurchasebill.css";
import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Input, InputAdornment, ListItem, ListItemText, OutlinedInput, TextField } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaPlusCircle } from "react-icons/fa";
import { MenuItem, Select } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Header from "../../../Header";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel } from "@mui/material"
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const AddPurchaseBill = () => {
  const searchItemField = useRef(null);
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
  const inputRef11 = useRef();
  const inputRef12 = useRef();
  const inputRef13 = useRef();
  const [ItemPurchaseList, setItemPurchaseList] = useState({ item: [] });
  const [totalMargin, setTotalMargin] = useState(0)
  const [totalNetRate, setTotalNetRate] = useState(0)
  const [totalGst, setTotalGst] = useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [distributor, setDistributor] = useState(null);
  const [billNo, setbillNo] = useState("");
  const [dueDate, setDueDate] = useState(addDays(new Date(), 15));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [randomNumber, setRandomNumber] = useState(null);
  const [srNo, setSrNo] = useState();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [error, setError] = useState({ distributor: "", billNo: "" });
  const [expiryDate, setExpiryDate] = useState("");
  const [mrp, setMRP] = useState(null);
  const [ptr, setPTR] = useState(null);
  const [qty, setQty] = useState("");
  const [value, setValue] = useState(null);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [isOpenBox, setIsOpenBox] = useState(false);

  const [deleteAll, setDeleteAll] = useState(false);
  const [free, setFree] = useState("");
  const [loc, setLoc] = useState("");
  const [unit, setUnit] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [ItemTotalAmount, setItemTotalAmount] = useState(0);
  const [margin, setMargin] = useState("");
  const [disc, setDisc] = useState(0);
  const [base, setBase] = useState("");
  const [gst, setGst] = useState({ id: "", name: "" });
  const [batch, setBatch] = useState("");
  const [gstList, setGstList] = useState([]);
  const userId = localStorage.getItem("userId");
  const [netRate, setNetRate] = useState("");
  const [IsDelete, setIsDelete] = useState(false);
  const [ItemId, setItemId] = useState("");
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [unitEditID, setUnitEditID] = useState(null);
  const [itemEditID, setItemEditID] = useState(null);
  const [distributorList, setDistributorList] = useState([]);
  const [otherAmt, setOtherAmt] = useState(0);
  const [batchListData, setBatchListData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [header, setHeader] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseReturnPending, setPurchaseReturnPending] = useState([])
  const [finalPurchaseReturnList, setFinalPurchaseReturnList] = useState([]);
  // const [adjustCnAmount, setAdjustCnAmount] = useState("")
  const [cnTotalAmount, setCnTotalAmount] = useState({});
  const [netAmount, setNetAmount] = useState(0)
  const [finalTotalAmount, setFinalTotalAmount] = useState(0)
  const [cnAmount, setCnAmount] = useState(0)
  const [roundOffAmount, setRoundOffAmount] = useState(0)
  const [finalCnAmount, setFinalCnAmount] = useState(0)

  const paymentOptions = [
    { id: 1, label: "Cash" },
    { id: 2, label: "Credit" },
    { id: 3, label: "UPI" },
    { id: 4, label: "Cheque" },
    { id: 5, label: "Paytm" },
    { id: 6, label: "CC/DC" },
    { id: 7, label: "RTGS/NEFT" },
  ];

  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState("credit");
  const [bankData, setBankData] = useState([]);
  const [id, setId] = useState(null);
  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);

  // useEffect(() => {
  //   if (otherAmt !== '') {
  //     const x = parseFloat(finalTotalAmount) + parseFloat(otherAmt)
  //     setRoundOffAmount((x % 1).toFixed(2))
  //     roundOffAmount > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

  //   } else {
  //     const x = parseFloat(finalTotalAmount).toFixed(2)
  //     setRoundOffAmount((x % 1).toFixed(2))
  //     roundOffAmount > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

  //   }

  //   if (netAmount < 0) {
  //     setOtherAmt(0)
  //   }

  // }, [otherAmt, roundOffAmount, netAmount, finalTotalAmount,cnAmount]);

  useEffect(() => {
    if (finalCnAmount) {
      const x = parseFloat(finalTotalAmount) - parseFloat(finalCnAmount)
      setRoundOffAmount((x % 1).toFixed(2))
      roundOffAmount > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

    } else {
      const x = parseFloat(finalTotalAmount).toFixed(2)
      setRoundOffAmount((x % 1).toFixed(2))
      roundOffAmount > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

    }

  }, [otherAmt, roundOffAmount, netAmount, finalTotalAmount, cnAmount, finalCnAmount]);

  useEffect(() => {
    if (id) {
      batchList(id);
    }
    listDistributor();
    BankList();
    listOfGst();
    setSrNo(localStorage.getItem("Purchase_SrNo"));
  }, [id]);

  useEffect(() => {
    // Delete All Purchase Item
    if (localStorage.getItem("RandomNumber") !== null) {
      if (deleteAll == false) {
        handlePopState();
      }
    }
    // delete All purchase item

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // useEffect(()=>{
  //   setNetAmount(netAmount?.toFixed(2));

  // },[netAmount])

  useEffect(() => {
    const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
    setSchAmt(totalSchAmt);

    // Calculate totalBase
    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setItemTotalAmount(0);
    setBase(totalBase);

    // Calculate totalAmount
    const totalAmount = parseFloat(
      (totalBase + (totalBase * gst.name) / 100).toFixed(2)
    );
    if (totalAmount) {
      setItemTotalAmount(totalAmount);
    } else {
      setItemTotalAmount(0);
    }

    // Net Rate calculation
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    const netRate = parseFloat(
      (totalAmount / (numericQty + numericFree)).toFixed(2)
    );
    setNetRate(netRate);

    // Margin Caluculation
    const Margin = parseFloat((((mrp - netRate) / mrp) * 100).toFixed(2));
    setMargin(Margin);
    // const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
    // const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    // const totalAmount = parseFloat(
    //   (totalBase + (totalBase * gst.name) / 100).toFixed(2)
    // );
    // if(totalAmount){
    //   setItemTotalAmount(totalAmount.toFixed(2));
    // }else{
    //   setItemTotalAmount(0)
    // }

  }, [qty, ptr, disc, gst.name, free]);

  useEffect(() => {
    const total = Object.values(cnTotalAmount)
      .map(amount => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setCnAmount(total)
  }, [cnTotalAmount])

  const BankList = async () => {
    let data = new FormData();
    try {
      await axios
        .post("bank-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBankData(response.data.data);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleExpiryDateChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, "");

    if (inputValue.length > 2) {
      const month = inputValue.slice(0, 2);
      const year = inputValue.slice(2, 4);
      if (parseInt(month) > 12) {
        inputValue = "MM";
      } else if (parseInt(month) < 1) {
        inputValue = "01";
      }
      inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
    }

    setExpiryDate(inputValue);
  };

  const handlePopState = () => {
    // Call the delete API
    let data = new FormData();
    const params = {
      random_number: localStorage.getItem("RandomNumber"),
    };
    try {
      const res = axios
        .post("item-purchase-delete-all?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
          localStorage.removeItem("RandomNumber");
          //console.log(response);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 100000) + 1;
    setRandomNumber(number);
    if (localStorage.getItem("RandomNumber") == null) {
      localStorage.setItem("RandomNumber", number);
    } else {
      localStorage.setItem(
        "RandomNumber",
        localStorage.getItem("RandomNumber")
      );
      //console.log(localStorage.getItem("RandomNumber"));
    }
  };

  let listOfGst = () => {
    axios
      .get("gst-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log("API Response item Catagory:===", response);
        setGstList(response.data.data);
      })
      .catch((error) => {
        //console.log("API Error:", error);
      });
  };

  let listDistributor = () => {
    axios
      .get("list-distributer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.setItem("distributor", response.data.data.distributor);
        setDistributorList(response.data.data);
      })
      .catch((error) => {
        //console.log("API Error:", error);
      });
  };

  const handleNavigation = (path) => {
    setIsOpenBox(true);
    setNextPath(path);
  };

  const LogoutClose = () => {
    setIsOpenBox(false);
    // setPendingNavigation(null);
  };
  const handleLeavePage = async () => {
    try {
      const params = {
        start_date: localStorage.getItem('StartFilterDate'),
        end_date: localStorage.getItem('EndFilterDate'),
        distributor_id: localStorage.getItem('DistributorId'),
        type: "0"
      };

      const response = await axios.post("purches-return-iteam-histroy", {},
        {
          params: params,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setUnsavedItems(false);
        setIsOpenBox(false);

        setTimeout(() => {
          history.push(nextPath);
        }, 0);
      }
      setIsOpenBox(false);
      setUnsavedItems(false);
      history.replace(nextPath);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const itemPurchaseList = async () => {
    let data = new FormData();
    const params = {
      random_number: localStorage.getItem("RandomNumber"),
    };
    try {
      const res = await axios
        .post("item-purchase-list?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {

          setItemPurchaseList(response.data.data);
          setFinalTotalAmount(response.data.data.total_price)
          setTotalGst(response.data.data.total_gst)
          setTotalQty(response.data.data.total_qty)
          setTotalMargin(response.data.data.total_margin)
          setTotalNetRate(response.data.data.total_net_rate)
          handleCalNetAmount(response.data.data.total_price)
          // setNetAmount(response.data.data.total_price)
          //console.log(ItemPurchaseList);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const isDateDisabled = (date) => {
    const today = new Date();
    // Set time to 00:00:00 to compare only date part
    today.setHours(0, 0, 0, 0);

    // Disable dates that are greater than today
    return date > today;
  };
  const deleteOpen = (Id) => {
    setIsDelete(true);
    setItemId(Id);
    //console.log(ItemId);
  };

  const batchList = async () => {
    let data = new FormData();
    data.append("iteam_id", id);
    const params = {
      iteam_id: id,
    };
    try {
      const res = await axios
        .post("batch-list?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const batchData = response.data.data;
          setBatchListData(response.data.data);
          if (batchData.length > 0) {
            setUnit(batchData[0].unit);
            setBatch(batchData[0].batch_name);
            setExpiryDate(batchData[0].expiry_date);
            setMRP(batchData[0].mrp);
            setQty(batchData[0].purchase_qty);
            setFree(batchData[0].purchase_free_qty);
            setPTR(batchData[0].ptr);
            setDisc(batchData[0].discount);
            setLoc(batchData[0].location);
            setGst(
              gstList.find((option) => option.name === batchData[0].gst) || {}
            );
            // setUnit()
          } else {
            setUnit("");
            setBatch("");
            setExpiryDate("");
            setMRP("");
            setQty("");
            setFree("");
            setPTR("");
            setDisc("");
            setLoc("");
            setGst("");
          }
          //console.log("DATA", batchData);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleAddButtonClick = async () => {
    const newErrors = {};
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    if (numericQty === 0 && numericFree === 0) {
      toast.error("Free and Qty cannot both be 0")
      newErrors.qty = "Free and Qty cannot both be 0";
    }
    if (!unit) newErrors.unit = "Unit is required";
    if (!batch) newErrors.batch = "Batch is required";
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
      toast.error(newErrors.expiryDate);
    } else if (!expiryDateRegex.test(expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
      toast.error(newErrors.expiryDate);
    } else {
      const [expMonth, expYear] = expiryDate.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns month from 0 to 11
      const currentYear = currentDate.getFullYear() % 100; // get last two digits of year

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth <= currentMonth)
      ) {
        newErrors.expiryDate =
          "Expiry date must be in the future and cannot be the current month";
        toast.error(newErrors.expiryDate);
      }
    }
    if (!mrp) {
      newErrors.mrp = "MRP is required";
    }
    if (!ptr) {
      newErrors.ptr = "PTR is required";
    } else if (ptr && parseFloat(ptr) > parseFloat(mrp)) {
      newErrors.ptr = "PTR must be less than or equal to MRP";
      toast.error("PTR must be less than or equal to MRP");
    }

    // if (!base) newErrors.base = "Base is required";
    if (!gst.name) newErrors.gst = "GST is required";
    // if (!loc) newErrors.loc = 'Location is required';
    // if (!netRate) newErrors.netRate = "Net rate is required";
    // if (!margin) newErrors.margin = "Margin is required";
    if (!searchItem) {
      toast.error("Please Select any Item Name");
      newErrors.searchItem = "Select any Item Name";
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      await handleAddItem(); // Call handleAddItem if validation passes
    }
    return isValid;
  };
  const handleAddItem = async () => {
    setUnsavedItems(true);

    generateRandomNumber();
    let data = new FormData();
    data.append("user_id", userId);
    if (isEditMode == true) {
      data.append("item_id", itemEditID);
      data.append("unit_id", unitEditID);
    } else {
      data.append("item_id", value.id);
      data.append("unit_id", value.unit_id);
    }
    data.append("random_number", localStorage.getItem("RandomNumber"));
    data.append("weightage", unit);
    data.append("batch_number", batch);
    data.append("expiry", expiryDate);
    data.append("mrp", mrp);
    data.append("qty", qty);
    data.append("free_qty", free);
    data.append("ptr", ptr);
    data.append("discount", disc);
    data.append("scheme_account", schAmt);
    data.append("base_price", base);
    data.append("gst", gst.id);
    data.append("location", loc);
    data.append("margin", margin);
    data.append("net_rate", netRate);
    const totalAmount = isNaN(ItemTotalAmount) ? 0 : ItemTotalAmount;
    data.append("total_amount", totalAmount);
    const params = {
      id: selectedEditItemId,
    };
    try {
      const response = isEditMode
        ? await axios.post("item-purchase-update?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        : await axios.post("item-purchase", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      //console.log("response", response);
      setItemTotalAmount(0);
      setDeleteAll(true);
      itemPurchaseList();
      setUnit("");
      setBatch("");
      setExpiryDate("");
      setMRP("");
      setQty("");
      setFree("");
      setPTR("");
      setGst("");
      setDisc(0);
      setBase("");
      setNetRate("");
      setSchAmt("");
      setBatch("");
      setMargin("");
      setLoc("");

      if (ItemTotalAmount <= finalCnAmount) {
        setFinalCnAmount(0);
        setSelectedRows([]);
        setCnTotalAmount({});
      }
      // setNetAmount(totalAmount)
      // handleCalNetAmount()
      setIsEditMode(false);
      setSelectedEditItemId(null);

      searchItemField.current.focus();

      // Reset Autocomplete field
      setValue("");
      setSearchItem("");
      // setAutocompleteDisabled(false);
    } catch (e) {
      //console.log(e);
    }
  };

  const handleSearch = async () => {
    setUnsavedItems(true);

    let data = new FormData();
    data.append("search", searchItem);
    const params = {
      search: searchItem,
    };
    try {
      const res = await axios
        .post("item-search?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemList(response.data.data.data);
          //console.log(data);
          // if(id){
          //     batchList(id);
          // }
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleDeleteItem = async (ItemId) => {
    if (!ItemId) return;
    let data = new FormData();
    data.append("id", ItemId);
    const params = {
      id: ItemId,
    };
    try {
      await axios
        .post("item-purchase-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
          setIsDelete(false);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const submitPurchaseData = async () => {
    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    data.append("bill_no", billNo);
    data.append(
      "bill_date",
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    );
    data.append("due_date", dueDate ? format(dueDate, "yyyy-MM-dd") : "");
    data.append("owner_type", localStorage.getItem("UserName"));
    data.append("user_id", localStorage.getItem("userId"));
    data.append("sr_no", srNo);
    data.append("payment_type", paymentType);
    data.append("total_amount", ItemPurchaseList.total_price);
    data.append("net_amount", netAmount);
    data.append("cn_amount", cnAmount);
    data.append("total_gst", ItemPurchaseList.total_gst)
    data.append("total_margin", ItemPurchaseList.total_margin)
    data.append("cn_amount", finalCnAmount)
    data.append("round_off", roundOffAmount);
    data.append("purches_data", JSON.stringify(ItemPurchaseList.item));
    data.append("purches_return_data", JSON.stringify(finalPurchaseReturnList));

    try {
      await axios
        .post("purches-store", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          //console.log(response.data);
          localStorage.removeItem("RandomNumber");
          setItemPurchaseList("");
          //console.log("response===>", response.data);
          toast.success(response.data.message);
          setTimeout(() => {
            history.push("/purchase/purchasebill");
          }, 2000);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = () => {
    setUnsavedItems(false);

    const newErrors = {};
    if (!distributor) {
      newErrors.distributor = "Please select Distributor";
    }
    if (!billNo) {
      newErrors.billNo = "Bill No is Required";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    submitPurchaseData();
  };


  // const handleCnAmount = () => {
  //   const newErrors = {};

  //   if (selectedRows.length === 0) {
  //     newErrors.selectedRows = "Please select at least one item";
  //     toast.error('Please select at least one item');
  //   }
  //   setError(newErrors);

  //   if (Object.keys(newErrors).length > 0) {
  //     return;
  //   }

  //   selectedRows.forEach((row, index, id) => {
  //     const passenger = {
  //       purches_return_bill_id: row.id,
  //       amount: row.cnTotalAmount,
  //     };
  //   });
  // };

  const handleEditClick = (item) => {
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id);
    if (selectedEditItem) {
      setUnitEditID(selectedEditItem.unit_id);
      setItemEditID(selectedEditItem.item_id);
      setSearchItem(selectedEditItem.iteam_name);
      setUnit(selectedEditItem.weightage);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty);
      setFree(selectedEditItem.free_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.discount);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);

      setGst(
        gstList.find((option) => option.name === selectedEditItem.gst) || {}
      );
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  };

  const purchaseReturnData = async () => {
    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    try {
      await axios.post("purchase-return-pending-bills", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      ).then((response) => {
        setPurchaseReturnPending(response.data.data)
        // setCnTotalAmount(response.data.data.total_amount)
        //console.log(response.data.data, '123');
        // toast.success(response.data.message);
      })
    } catch (error) {
      // setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message)
      }
    }
  };

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    //console.log(distributor, '145');
    setHeader('Add Amount');
    purchaseReturnData();
  }

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    // setCnAmount(0);
    // setSelectedRows("")
    // setCnTotalAmount("")
    // setCnAmount(0);
  }

  const handleOtherAmount = (event) => {
    setUnsavedItems(true);

    let value = parseFloat(event.target.value) || "";
    if (value < -finalTotalAmount) {
      value = -finalTotalAmount;
    }
    setOtherAmt(value);
  };


  // const handleKeyDown = (event) => {
  //     if (event.key === 'Enter') {
  //         event.preventDefault();
  //         if (event.target === inputRef1.current) {
  //             inputRef2.current.focus();
  //         } else if (event.target === inputRef2.current) {
  //             inputRef3.current.focus();
  //         } else if (event.target === inputRef3.current) {
  //             inputRef4.current.focus();
  //         } else if (event.target === inputRef4.current) {
  //             inputRef5.current.focus();
  //         } else if (event.target === inputRef5.current) {
  //             inputRef6.current.focus();
  //         } else if (event.target === inputRef6.current) {
  //             inputRef7.current.focus();
  //         } else if (event.target === inputRef7.current) {
  //             inputRef8.current.focus();
  //         } else if (event.target === inputRef8.current) {
  //             inputRef9.current.focus();
  //         } else if (event.target === inputRef9.current) {
  //             inputRef10.current.focus();
  //         } else if (event.target === inputRef10.current) {
  //             inputRef11.current.focus();
  //         } else if (event.target === inputRef11.current) {
  //             inputRef12.current.focus();
  //         } else if (event.target === inputRef12.current) {
  //             inputRef13.current.focus();
  //         }
  //     };
  // }

  const handleDistributorChange = (event, newValue) => {
    //console.log(newValue, "dfjkngvkndfgjk");
    setDistributor(newValue);
    purchaseReturnData(id)
    setUnsavedItems(true);

  };

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue);
    handleSearch(newInputValue);
    setUnsavedItems(true);

  };

  const handleOptionChange = (event, newValue) => {
    setUnsavedItems(true);

    setValue(newValue);
    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);
    setId(newValue?.id);
    setAutocompleteDisabled(true);
    //console.log("id", newValue?.id);
    handleSearch(itemName);
  };

  const handlePTR = (e) => {
    const setptr = e.target.value;
    setPTR(setptr);
    setBase(setptr);
  };

  const handleSchAmt = (e) => {
    const inputDiscount =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    if (isNaN(inputDiscount)) {
      setDisc(0);
      setSchAmt(0);
      setBase(ptr * qty);
      return;
    }
    setDisc(inputDiscount);

    const totalSchAmt = parseFloat(
      (((ptr * inputDiscount) / 100) * qty).toFixed(2)
    );
    setSchAmt(totalSchAmt);

    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setBase(totalBase);
  };

  const removeItem = () => {
    // setAutocompleteDisabled(false);
    setUnit("");
    setBatch("");
    setExpiryDate("");
    setSearchItem("");
    setMRP("");
    setQty("");
    setFree("");
    setPTR("");
    setGst("");
    setDisc(0);
    setBase(0);
    setSchAmt(0);
    setBatch("");
    setNetRate(0);
    setMargin("");
    setLoc("");
  };
  // const handleRowSelect = (id, amount) => {
  //   const newSelectedRows = selectedRows.includes(id)
  //     ? selectedRows.filter(rowId => rowId !== id)
  //     : [...selectedRows, id];

  //   setSelectedRows(newSelectedRows);
  //   setCnTotalAmount(prevValues => ({
  //     ...prevValues,
  //     [id]: newSelectedRows.includes(id) ? (prevValues[id] || amount) : ''
  //   }));
  // };
  const handleRowSelect = (id, totalAmount) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);

    if (newSelectedRows.includes(id)) {
      setCnTotalAmount((prev) => ({ ...prev, [id]: totalAmount }));
      setCnAmount((prev) => prev + parseFloat(totalAmount));
    } else {
      setCnTotalAmount((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setCnAmount((prev) => prev - parseFloat(totalAmount));
    }
  };
  // const handleSelectAll = (event) => {
  //   if (event.target.checked) {
  //     const allIds = purchaseReturnPending.map(item => item.id);
  //     const amounts = purchaseReturnPending.reduce((acc, item) => ({
  //       ...acc,
  //       [item.id]: item.total_amount || 0
  //     }), {});

  //     setSelectedRows(allIds);
  //     setCnTotalAmount(amounts);
  //   } else {
  //     setSelectedRows([]);
  //     setCnTotalAmount({});
  //   }

  // };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(purchaseReturnPending.map((row) => row.id));
      const updatedAmounts = purchaseReturnPending.reduce((acc, row) => {
        acc[row.id] = row.total_amount;
        return acc;
      }, {});
      setCnTotalAmount(updatedAmounts);
      setCnAmount(
        purchaseReturnPending.reduce((acc, row) => acc + parseFloat(row.total_amount || 0), 0)
      );
    } else {
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
    }
  };

  const handleCnAmountChange = (id, value, totalAmount) => {
    const numericValue = parseFloat(value) || 0;

    const finalValue = Math.min(numericValue, totalAmount);

    setCnTotalAmount((prevAmounts) => ({
      ...prevAmounts,
      [id]: finalValue,
    }));

    const prevAmount = cnTotalAmount[id] || 0;

    setCnAmount((prev) => prev + finalValue - prevAmount);
  };

  const handleCalNetAmount = (total_price) => {
    const adjustedTotalAmount = total_price - cnAmount;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    let netAmountCal;
    let roundOffAmountCal;

    if (decimalPart >= 0.50) {
      netAmountCal = Math.ceil(adjustedTotalAmount);
      roundOffAmountCal = netAmountCal - adjustedTotalAmount; // calculate the round-off value
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount);
      roundOffAmountCal = netAmountCal - adjustedTotalAmount; // calculate the round-off value
    }

    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);
  };

  const handleCnAmount = () => {
    const newErrors = {};

    if (finalTotalAmount <= cnAmount) {
      newErrors.finalTotalAmount = "You cannot adjust CN more than the total invoice amount";
      toast.error('You cannot adjust CN more than the total invoice amount');
      setError(newErrors);
      return;
    }
    setFinalCnAmount(cnAmount)
    const decimalTotalAmount = finalTotalAmount - Math.floor(finalTotalAmount);
    const decimalCNAmount = cnAmount - Math.floor(cnAmount);

    setRoundOffAmount(decimalTotalAmount - decimalCNAmount);

    const adjustedTotalAmount = finalTotalAmount - cnAmount;

    let netAmountCal, roundOffAmountCal;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    if (decimalPart >= 0.50) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // Round up
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount); // Round down
    }

    roundOffAmountCal = netAmountCal - adjustedTotalAmount;

    // Update the states with the calculated values
    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);


    // handleCalNetAmount();
    const purchaseReturnList = selectedRows.map((rowId) => {
      return {
        purches_return_bill_id: rowId,
        amount: cnTotalAmount[rowId],
      };
    });
    setFinalPurchaseReturnList(purchaseReturnList);
    // Submit purchaseReturnList to the backend or handle it as needed
    //console.log("Final Purchase Return List:", purchaseReturnList);
    resetAddDialog()
    // Reset dialog after submission
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
      <div
        style={{
          backgroundColor: "rgb(233 228 228)",
          height: "calc(99vh - 55px)",
          padding: "0px 20px 0px",
        }}
      >
        <div>
          <div className="py-3" style={{ display: "flex", gap: "4px" }}>
            <div style={{ display: "flex", gap: "7px" }}>
              <span
                style={{
                  color: "rgba(12, 161, 246, 1)",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push("/purchase/purchasebill");
                }}
              >
                Purchase
              </span>
              <ArrowForwardIosIcon
                style={{
                  fontSize: "18px",
                  marginTop: "8px",
                  color: "rgba(4, 76, 157, 1)",
                }}
              />
              <span
                style={{
                  color: "rgba(4, 76, 157, 1)",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                New
              </span>
              <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
            </div>
            <div className="headerList">
              <Select
                labelId="dropdown-label"
                id="dropdown"
                value={paymentType}
                sx={{ minWidth: "150px" }}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                }}
                size="small"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
                {bankData?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.bank_name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                style={{ background: "rgb(4, 76, 157)" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
          <div>
            <div className="firstrow flex">
              <div className="detail">
                <span className="title mb-2">
                  Distributor{" "}
                  <FaPlusCircle
                    className="darkblue_text cursor-pointer"
                    onClick={() => {
                      history.push("../../more/addDistributer");
                    }}
                  />
                </span>
                <Autocomplete
                  value={distributor}
                  sx={{
                    width: "100%",
                    minWidth: "350px",
                    "@media (max-width:600px)": {
                      minWidth: "250px",
                    },
                  }}
                  size="small"
                  onChange={handleDistributorChange}
                  options={distributorList}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} />}
                />
                {error.distributor && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {error.distributor}
                  </span>
                )}
              </div>
              <div className="detail">
                <span className="title mb-2">Sr No.</span>
                <TextField
                  id="outlined-number"
                  size="small"
                  style={{ width: "200px" }}
                  value={srNo}
                  disabled
                  onChange={(e) => {
                    setSrNo(e.target.value);
                  }}
                />
              </div>
              <div className="detail">
                <span className="title mb-2">Bill No. / Order No.</span>
                <TextField
                  id="outlined-number"
                  size="small"
                  style={{ width: "250px" }}
                  value={billNo}
                  onChange={(e) => {
                    setbillNo(e.target.value);
                    setUnsavedItems(true);

                  }}
                />
                {error.billNo && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {error.billNo}
                  </span>
                )}
              </div>

              <div className="detail">
                <span className="title mb-2">Bill Date</span>
                <div>
                  <DatePicker
                    className="custom-datepicker "
                    selected={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) => !isDateDisabled(date)}
                  />
                </div>
              </div>

              <div className="detail">
                <span className="title mb-2">Due Date</span>
                <div>
                  <DatePicker
                    className="custom-datepicker "
                    selected={dueDate}
                    onChange={(newDate) => setDueDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ textTransform: 'none', marginTop: "25px" }}
                  onClick={handelAddOpen}
                  disabled={!distributor || ItemPurchaseList?.item?.length === 0}
                >
                  <AddIcon className="mr-2" />
                  CN Adjust
                </Button>

              </div>

              {isAutocompleteDisabled && (
                <Autocomplete
                  value={searchItem?.iteam_name}
                  sx={{ width: 570 }}
                  size="small"
                  onChange={handleOptionChange}
                  onInputChange={handleInputChange}
                  inputRef={searchItemField}
                  getOptionLabel={(option) => `${option.iteam_name} `}
                  options={itemList}
                  renderOption={(props, option) => (
                    <ListItem {...props}>
                      {/* <ListItemText
                        primary={`${option.iteam_name}`}
                        secondary={`Pack : ${option.pack} | MRP: ${option.mrp}  | Location: ${option.location}  | Current Stock : ${option.stock} `}
                      /> */}
                      <ListItemText
                        primary={`${option.iteam_name}`}
                        secondary={` ${option.stock === 0 ? `Unit: ${option.weightage}` : `Pack: ${option.pack}`} | 
              MRP: ${option.mrp}  | 
              Location: ${option.location}  | 
              Current Stock: ${option.stock}`}
                      />

                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Item Name"
                      inputRef={searchItemField}
                    />
                  )}
                />
              )}
              <div className="overflow-x-auto">
                <table className="customtable  w-full border-collapse custom-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Unit</th>
                      <th>Batch </th>
                      <th>Expiry </th>
                      <th>MRP </th>
                      <th>Qty. </th>
                      <th>Free </th>
                      <th>PTR </th>
                      <th>CD%</th>
                      <th>Sch. Amt</th>
                      <th>Base</th>
                      <th>GST% </th>
                      <th>Loc.</th>
                      <th>Net Rate</th>
                      <th>Margin%</th>
                      <th>Amount </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!value && ItemPurchaseList.item > 0 ? (
                      <tr>
                        <td
                          colSpan={0}
                          style={{
                            marginTop: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          No record found
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          <td style={{ width: "600px" }}>
                            <div>
                              <DeleteIcon
                                className="delete-icon"
                                onClick={removeItem}
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
                              sx={{ width: "50px" }}
                              onChange={(e) => {
                                setUnit(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              // inputRef={inputRef2}
                              // onKeyDown={handleKeyDown}
                              size="small"
                              value={batch}
                              sx={{ width: "90px" }}
                              error={!!errors.batch}
                              onChange={(e) => {
                                setBatch(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              size="small"
                              sx={{ width: "80px" }}
                              // inputRef={inputRef3}
                              // onKeyDown={handleKeyDown}
                              error={!!errors.expiryDate}
                              value={expiryDate}
                              onChange={handleExpiryDateChange}
                              placeholder="MM/YY"
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              sx={{ width: "100px" }}
                              size="small"
                              // inputRef={inputRef4}
                              error={!!errors.mrp}
                              // onKeyDown={handleKeyDown}
                              value={mrp}
                              onChange={(e) => {
                                setMRP(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              sx={{ width: "80px" }}
                              size="small"
                              // inputRef={inputRef5}

                              // onKeyDown={handleKeyDown}
                              error={!!errors.qty}
                              value={qty}
                              onChange={(e) => {
                                const value = e.target.value;
                                setQty(value === "" ? 0 : Number(value));
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              size="small"
                              type="number"
                              sx={{ width: "50px" }}
                              value={free}
                              error={!!errors.free}
                              // inputRef={inputRef6}
                              // onKeyDown={handleKeyDown}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFree(value === "" ? 0 : Number(value));
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              sx={{ width: "100px" }}
                              size="small"
                              // inputRef={inputRef7}
                              // onKeyDown={handleKeyDown}
                              value={ptr}
                              error={!!errors.ptr}
                              onChange={handlePTR}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              sx={{ width: "60px" }}
                              size="small"
                              type="number"
                              // inputRef={inputRef8}
                              // onKeyDown={handleKeyDown}
                              value={disc}
                              onChange={handleSchAmt}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              sx={{ width: "90px" }}
                              size="small"
                              // inputRef={inputRef9}
                              // onKeyDown={handleKeyDown}
                              value={schAmt}
                              disabled
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              size="small"
                              value={base}
                              // inputRef={inputRef10}
                              // onKeyDown={handleKeyDown}
                              disabled
                              sx={{ width: "100px" }}
                              onChange={(e) => {
                                setBase(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <Select
                              labelId="dropdown-label"
                              id="dropdown"
                              value={gst.name}
                              sx={{ minWidth: "80px" }}
                              onChange={(e) => {
                                const selectedOption = gstList.find(
                                  (option) => option.name === e.target.value
                                );
                                setGst(selectedOption);
                              }}
                              size="small"
                              displayEmpty
                              error={!!errors.gst}
                            >
                              {gstList?.map((option) => (
                                <MenuItem key={option.id} value={option.name}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </td>

                          <td>
                            <TextField
                              id="outlined-number"
                              // inputRef={inputRef12}
                              // onKeyDown={handleKeyDown}
                              size="small"
                              value={loc.toUpperCase()}
                              // error={!!errors.loc}
                              sx={{ width: "100px" }}
                              onChange={(e) => {
                                setLoc(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <td>
                              <TextField
                                id="outlined-number"
                                type="number"
                                disabled
                                size="small"
                                value={netRate}
                                sx={{ width: "100px" }}
                              />
                            </td>
                          </td>
                          <td>
                            <td>
                              <TextField
                                id="outlined-number"
                                type="number"
                                disabled
                                size="small"
                                value={margin}
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                  setMargin(e.target.value);
                                }}
                              />
                            </td>
                          </td>
                          <td className="total">
                            <span>{ItemTotalAmount}</span>
                          </td>
                        </tr>
                        <tr>
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
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleAddButtonClick}
                            >
                              <ControlPointIcon />
                              Add
                            </Button>
                          </td>
                        </tr>

                        {ItemPurchaseList?.item?.map((item) => (
                          <tr
                            key={item.id}
                            className="item-List "
                            onClick={() => handleEditClick(item)}
                          >
                            <td
                              style={{
                                display: "flex",
                                gap: "8px",
                              }}
                            >
                              <BorderColorIcon
                                color="primary"
                                onClick={() => handleEditClick(item)}
                              />
                              <DeleteIcon
                                className="delete-icon bg-none"
                                onClick={() => deleteOpen(item.id)}
                              />
                              {item.iteam_name}
                            </td>
                            <td>{item.weightage}</td>
                            <td>{item.batch_number}</td>
                            <td>{item.expiry}</td>
                            <td>{item.mrp}</td>
                            <td>{item.qty}</td>
                            <td>{item.free_qty}</td>
                            <td>{item.ptr}</td>
                            <td>{item.discount}</td>
                            <td>{item.scheme_account}</td>
                            <td>{item.base_price}</td>
                            <td>{item.gst}</td>
                            <td>{item.location}</td>
                            <td>{item.net_rate}</td>
                            <td>{item.margin}</td>
                            <td>{item.total_amount}</td>
                          </tr>
                        ))}
                        {/* <tr>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal">Total</td>
                                                <td className="amounttotal"></td>
                                            </tr> */}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex gap-10 justify-end mt-4">
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  flexDirection: "column",
                }}
              >
                <label className="font-bold">Total GST : </label>
                <label className="font-bold">Total Qty :</label>
                <label className="font-bold">Total Margin: </label>
              </div>

              <div class="totals mr-5" style={{
                display: "flex",
                gap: "25px",
                flexDirection: "column",
                alignItems: "end"
              }}>
                <div className="font-bold">
                  {totalGst}
                </div>

                <div className="font-bold ">
                  {totalQty}
                </div>
                <div className="font-bold ">
                  ₹ {totalNetRate} ( {totalMargin} %)
                </div>
              </div>

              <div
                className="totals"
                style={{
                  display: "flex",
                  gap: "25px",
                  flexDirection: "column",
                }}
              >
                <div>
                  <label className="font-bold">Total Amount : </label>
                </div>
                {/* <div>
                  <label className="font-bold">Other Amount: </label>
                </div> */}
                <div>
                  <label className="font-bold">CN Amount: </label>
                </div>
                {/*  <div>
                 
                </div> */}
                <div>
                  <label className="font-bold">Round off: </label>
                </div>
                <div>
                  <label className="font-bold">Net Amount: </label>
                </div>
              </div>
              <div className="totals mr-5" style={{ display: 'flex', gap: '24px', flexDirection: 'column', alignItems: "end" }}>
                {/* <div> */}
                <span
                  className=""
                  style={{
                    fontWeight: 800,
                    // fontSize: "22px",
                  }}
                >
                  {finalTotalAmount?.toFixed(2)}
                </span>
                {/* </div> */}
                {/* <div> */}
                {/* <Input
                  value={otherAmt}
                  onChange={handleOtherAmount}
                  size="small" style={{
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

                  }}
                /> */}
                {/* </div> */}
                {/* <div className="mt-2"> */}
                <span
                  style={{
                    fontWeight: 800,
                    // fontSize: "22px",
                  }}
                >
                  {- (parseFloat(finalCnAmount) || 0).toFixed(2)}
                  {/* {-finalCnAmount?.toFixed(2)} */}
                </span>
                {/*    <div className="font-bold" >
                  ₹ {totalNetRate} ( {totalMargin} %)
                </div>  */}
                {/* </div> */}
                {/* <div className="mt-3"> */}
                <span
                  className=""
                  style={{
                    fontWeight: 800,
                    // fontSize: "22px",
                  }}
                >
                  {roundOffAmount === "0.00" ? roundOffAmount : (roundOffAmount < 0.49 ? `-${roundOffAmount}` : `+${parseFloat(1 - roundOffAmount).toFixed(2)}`)}

                </span>
                {/* </div> */}
                {/* <div className="mt-2"> */}
                <span
                  className=""
                  style={{
                    fontWeight: 800,
                    fontSize: "22px",

                  }}
                >
                  {netAmount.toFixed(2)}
                </span>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* CN amount PopUp Box */}
        <Dialog open={openAddPopUp} >
          <DialogTitle id="alert-dialog-title" className="sky_text">
            {header}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>

            <CloseIcon />

          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="bg-white">
                <div className="bg-white">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === purchaseReturnPending.length && purchaseReturnPending.length > 0}
                          />
                        </th>
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Amount</th>
                        <th>Adjust CN Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseReturnPending.length === 0 ? (
                        <tr>
                          <td >
                            No data found
                          </td>
                        </tr>
                      ) : (
                        purchaseReturnPending.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                onChange={(e) => handleRowSelect(row.id, row.total_amount || 0)}
                                checked={selectedRows.includes(row.id)}
                              />
                            </td>
                            <td>{row.bill_no}</td>
                            <td>{row.bill_date}</td>
                            <td>{row.total_amount}</td>
                            <td>
                              <OutlinedInput
                                type="number"
                                value={cnTotalAmount[row.id] || ''}
                                onChange={(e) => handleCnAmountChange(row.id, e.target.value, row.total_amount)}
                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                sx={{ width: 130, m: 1 }}
                                size="small"
                                disabled={!selectedRows.includes(row.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Selected Bills Amount</td>
                        <td>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: 'black' }}>Rs.{(parseFloat(cnAmount) || 0).toFixed(2)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="success" onClick={handleCnAmount} >
              Save
            </Button>
          </DialogActions>
        </Dialog >
        {/* Delete PopUP */}
        <div
          id="modal"
          value={IsDelete}
          className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
            }`}
        >
          <div />
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
              viewBox="0 0 24 24"
              onClick={() => setIsDelete(false)}
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
            </svg>
            <div className="my-4 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                  data-original="#000000"
                />
                <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                  data-original="#000000"
                />
              </svg>
              <h4 className="text-lg font-semibold mt-6">
                Are you sure you want to delete it?
              </h4>
            </div>
            <div className="flex gap-5 justify-center">
              <button
                type="submit"
                className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                onClick={() => handleDeleteItem(ItemId)}
              >
                Delete
              </button>
              <button
                type="button"
                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
              <h4 className="text-lg font-semibold mt-6 text-center">Are you sure you want to leave this page ?</h4>
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
      </div>
    </>
  );
};

export default AddPurchaseBill;
