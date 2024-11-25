import Header from "../../../Header";
import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  Input,
  InputAdornment,
  ListItemText,
  TextField,
  Tooltip,
} from "@mui/material";
import '../Edit-SaleBill/edit.css';
import { Prompt, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import HistoryIcon from "@mui/icons-material/History";
import { MenuItem, Select } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import SearchIcon from "@mui/icons-material/Search";
import ListItem from "@mui/material/ListItem";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../../../../componets/loader/Loader";
import { GoInfo } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import { VscDebugStepBack } from "react-icons/vsc";

const EditSaleBill = () => {
  const token = localStorage.getItem("token");
  const [item, setItem] = useState("");
  const { id, randomNumber } = useParams();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const paymentOptions = [
    { id: 1, label: "Cash" },
    { id: 3, label: "UPI" },
  ];
  const [customer, setCustomer] = useState("");
  const [doctor, setDoctor] = useState("");
  const pickupOptions = [
    { id: 1, label: "Pickup" },
    { id: 2, label: "Delivery" },
  ];
  const location = useLocation();
  const { paymentType: initialPayment } = location.state
  const [paymentType, setPaymentType] = useState(initialPayment || '');

  const [error, setError] = useState({ customer: "" });
  const [itemAmount, setItemAmount] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const tableRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [itemId, setItemId] = useState(null);
  const [batchListData, setBatchListData] = useState([]);
  const [saleItemId, setSaleItemId] = useState(null);
  const [mrp, setMRP] = useState("");
  const [totalgst, setTotalgst] = useState(0);
  const [totalBase, setTotalBase] = useState(0);
  const [dueAmount, setDueAmount] = useState(null);
  const [givenAmt, setGivenAmt] = useState(null);
  const [finalDiscount, setFinalDiscount] = useState('');
  const [netAmount, setNetAmount] = useState(0);
  const [netRateAmount, setNetRateAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tempOtherAmt, setTempOtherAmt] = useState('');
  const [otherAmt, setOtherAmt] = useState(localStorage.getItem("Other_Amount") || '');
  const [qty, setQty] = useState('')
  const [tempQty, setTempQty] = useState('')
  const [marginNetProfit, setMarginNetProfit] = useState(0);

  const [order, setOrder] = useState("");
  const [gst, setGst] = useState("");
  const [batch, setBatch] = useState("");
  const [unit, setUnit] = useState("");
  const [loc, setLoc] = useState("");
  const [base, setBase] = useState("");
  const [discountAmount, setDiscountAmount] = useState();
  const [roundOff, setRoundOff] = useState(0);
  const [pickup, setPickup] = useState('');
  const [IsDelete, setIsDelete] = useState(false);
  const [ItemSaleList, setItemSaleList] = useState({ sales_item: [] });
  let defaultDate = new Date();
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [value, setValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  defaultDate.setDate(defaultDate.getDate() + 3);
  const [saleAllData, setSaleAllData] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [searchItemID, setSearchItemID] = useState(null);
  const [bankData, setBankData] = useState([]);
  const [randomNum, setRandomNum] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [uniqueId, setUniqueId] = useState([])

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

  useEffect(() => {
    const discount = (totalAmount * finalDiscount) / 100;
    setDiscountAmount(discount.toFixed(2));

    let amountToUse = otherAmt ? otherAmt : tempOtherAmt;

    if (amountToUse < 0 && Math.abs(amountToUse) > totalAmount) {
      setOtherAmt(0);
      setTempOtherAmt(0);
    } else {
      let calculatedNetAmount = totalAmount - discount + Number(tempOtherAmt);

      if (calculatedNetAmount < 0) {
        setOtherAmt(-(totalAmount - discount));
        setTempOtherAmt(-(totalAmount - discount));
        calculatedNetAmount = 0;
      }
      const decimalPart = Number((calculatedNetAmount % 1).toFixed(2));
      const roundedDecimal = decimalPart;
      if (decimalPart < 0.50) {
        setRoundOff((-roundedDecimal).toFixed(2));
        setNetAmount(Math.floor(calculatedNetAmount));
      } else {
        setRoundOff((1 - roundedDecimal).toFixed(2));
        setNetAmount(Math.ceil(calculatedNetAmount));

      }
      const due = givenAmt - calculatedNetAmount;
      setDueAmount(due.toFixed(2));
    }
  }, [totalAmount, finalDiscount, otherAmt, givenAmt, tempOtherAmt]);

  const handleOtherAmtChange = (e) => {
    const value = e.target.value;
    localStorage.setItem('RandomNumber', randomNumber)

    const numericValue = isNaN(value) || value === '' ? '' : Number(value);

    if (numericValue >= 0) {
      setTempOtherAmt(numericValue);
      setOtherAmt(numericValue);
    } else {
      const negativeLimit = -totalAmount;
      if (numericValue < negativeLimit) {
        setTempOtherAmt(negativeLimit);
        setOtherAmt(negativeLimit);

      } else {
        setTempOtherAmt(numericValue);
        setOtherAmt(numericValue);
      }
    }
    setUnsavedItems(true)

  };
  useEffect(() => {
    const initializeData = async () => {
      const doctorData = await ListOfDoctor();
      const customerData = await customerAllData();
      await saleBillGetBySaleID(doctorData, customerData);
    };
    initializeData();
    BankList();
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (itemId) {
      batchList(itemId);
    }
    const totalAmount = qty / unit;
    const total = parseFloat(base) * totalAmount;
    if (total) {
      setItemAmount(total.toFixed(2));
    } else {
      setItemAmount(0);
    }
  }, [itemId, base, qty]);

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

  const saleBillGetBySaleID = async (doctorData, customerData) => {

    let data = new FormData();
    data.append("id", id);
    data.append("payment_name", paymentType);
    const params = {
      id: id ? id : '',
      random_number: randomNumber ? randomNumber : '',
    };
    try {
      const response = await axios.post("sales-edit-details?", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const record = response.data.data;
      setSaleAllData({ ...record, sales_item: [] });
      setSaleAllData(record);
      setAddress(record.customer_address);
      setTotalBase(record.total_base);
      setTotalgst(record.total_gst);
      setTotalAmount(record.sales_amount);
      setRoundOff(record.round_off)
      if (!finalDiscount) {
        setFinalDiscount(record.total_discount);
      }
      // setOtherAmt(record.other_amount)
      const salesItem = response.data.data.sales_item;
      if (salesItem && salesItem.length > 0) {
        const fetchedRandomNumber = salesItem[0].random_number;
        setRandomNum(fetchedRandomNumber);
      }
      setNetAmount(record.net_amount);
      setNetRateAmount(record.total_net_rate);
      setMarginNetProfit(record.margin_net_profit);
      setMargin(record.total_margin);
      setPaymentType(record.payment_name)
      setPickup(record.pickup)
      const foundDoctor = doctorData.find(
        (option) => option.id == record.doctor_id
      );
      setDoctor(foundDoctor);

      const foundCustomer = customerData.find(
        (option) => option.id == record.customer_id
      );
      setCustomer(foundCustomer);
    } catch (error) {
      console.error("API error fetching purchase data:", error);
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value === "" || value === "O") {
      setOrder(value);
    }
  };
  const ListOfDoctor = async () => {
    let data = new FormData();
    setIsLoading(true);
    try {
      const response = await axios.post("doctor-list", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const doctorData = response.data.data;
      setDoctorData(doctorData);
      setIsLoading(false);
      return doctorData;
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
      return [];
    }
  };

  const customerAllData = async () => {
    let data = new FormData();
    setIsLoading(true);
    try {
      const response = await axios.post("list-customer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const customerData = response.data.data;
      setCustomerDetails(customerData);
      setIsLoading(false);
      return customerData;
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
      return [];
    }
  };

  const batchList = async () => {
    let data = new FormData();
    data.append("iteam_id", itemId);
    const params = {
      iteam_id: itemId ? itemId : '',
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
          setBatchListData(response.data.data);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setUnsavedItems(true);

    setSearchItem(newInputValue);
    handleSearch(newInputValue);
  };

  const handleOptionChange = (event, newValue) => {
    setUnsavedItems(true);

    setValue(newValue);
    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);
    setItemId(newValue?.id);
    setIsVisible(true);
    handleSearch(itemName);
    if (!itemName) {
      setExpiryDate("");
      setMRP("");
      setBase("");
      setGst("");
      setQty("");
      setLoc("");
      setUnit("");
      setBatch("");
    }
  };

  // useEffect(() => {
  //   const savedState = localStorage.getItem("unsavedItems");
  //   if (savedState === "false") {
  //     setUnsavedItems(true);
  //   }

  //   return () => {
  //     localStorage.setItem("unsavedItems", unsavedItems.toString());
  //   };
  // }, [unsavedItems]);

  // useEffect(() => {
  //   const params = {
  //     random_number: randomNumber,
  //   };
  //   const response = axios.post("sales-history", {}, {
  //     params: params,
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //   if (response.status === 200) {
  //     setUnsavedItems(false);
  //     setOpenModal(false);
  //     setTimeout(() => {
  //       history.push(nextPath);
  //     }, 0);
  //   }
  // }, [])

  useEffect(() => {
    handleLeavePage()
  }, [])

  const handleNavigation = (path) => {
    setOpenModal(true);
    setNextPath(path);
    // setUnsavedItems(true)
  };

  const handleLeavePage = () => {
    let data = new FormData();
    data.append("random_number",randomNumber)
    setOpenModal(false);
    setUnsavedItems(false);
    try {
      // const params = {
      //   random_number: randomNumber,
      // };
      const response = axios.post("sales-history", data,   {
        // params: params,
        headers: { Authorization: `Bearer ${token}` },
      })
        // if (response.status === 200) {
        //   setUnsavedItems(false);
        //   setOpenModal(false);
        //   setTimeout(() => {
        //     history.push(nextPath);
        //   }, 0);
        // }
        // setUnsavedItems(false);
        // setOpenModal(false);
        // history.replace(nextPath);
        .then((response) => {
          // setSaleAllData([]);
          setUnsavedItems(false);
          setOpenModal(false);
          if (nextPath) {
            history.replace(nextPath);
          }

        })
        .catch(error => {
          console.error("Error fetching sales history:", error);
        });

    } catch (error) {
      console.error("Error fetching sales history:", error);
    }
  }

  const handleEditClick = (item) => {
    const existingItem = uniqueId.find((obj) => obj.id === item.id);
    // console.log(existingItem, "existingItem")

    if (!existingItem) {
      // If the ID is unique, add the item to uniqueId and set tempQty
      setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }]);
      // console.log('(prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }] :>> ', (prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }]);
      setTempQty(item.qty);
      // console.log('tempQty :>> ', tempQty);
      // console.log('item.qty :>> ', item.qty);
    } else {
      setTempQty(existingItem.qty);

    }
    // Set the selected item for editing
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id);
    // setBase(item.base);

    if (selectedEditItem) {
      setSearchItem(selectedEditItem.iteam_name);
      setSearchItemID(selectedEditItem.item_id);
      setUnit(selectedEditItem.unit);
      setBatch(selectedEditItem.batch);
      setExpiryDate(selectedEditItem.exp);
      setMRP(selectedEditItem.mrp);
      setQty(item.qty);
      setBase(item.base);
      // setBase(selectedEditItem.base);
      setOrder(selectedEditItem.order);
      setGst(selectedEditItem.gst);
      setLoc(selectedEditItem.location);
      setItemAmount(selectedEditItem.net_rate);
    }
    // setSelectedEditItem({ ...item });
    // setIsEditMode(true);
    // setSelectedEditItemId(item.id);
    // setBase(item.base);
    // if (selectedEditItem) {
    //   setSearchItem(selectedEditItem.iteam_name);
    //   setUnit(item.unit);
    //   setBatch(item.batch);
    //   setExpiryDate(item.exp);
    //   setMRP(item.mrp);
    //   setQty(item.qty);
    //   setOrder(item.order);
    //   setGst(item.gst);
    //   setLoc(item.location);
    //   setItemAmount(item.net_rate);
    // }
    // setSearchItem(item.iteam_name);
  };


  const handleQty = (value) => {

    const newQty = Number(value);

    if (newQty > tempQty) {
      setQty(tempQty);
      toast.error(`Quantity exceeds the allowed limit. Max available: ${tempQty}`);
    } else if (newQty < 0) {
      setQty(tempQty);
      toast.error(`Quantity should not be less than 0`);
    } else {
      setQty(newQty)
    }

  }

  const handleCustomerOption = (event, newValue) => {
    setUnsavedItems(true);

    setCustomer(newValue);
  };

  const handleDoctorOption = (event, newValue) => {
    setUnsavedItems(true);

    setDoctor(newValue);
  };

  const handlePassData = (event) => {
    setSearchItem(event.iteam_name);
    setBatch(event.batch_number);
    setItem(event.iteam_name);
    setUnit(event.unit);
    setExpiryDate(event.expiry_date);
    setMRP(event.mrp);
    setBase(event.mrp);
    setGst(event.gst);
    setQty(event.qty);
    setLoc(event.location);
  };
  const deleteOpen = (Id) => {
    setIsDelete(true);
    setSaleItemId(Id);
  };

  const handleSearch = async () => {
    let data = new FormData();
    data.append("search", searchItem);
    const params = {
      search: searchItem ? searchItem : ''
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
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    if (!unsavedItems) {
      saleBillGetBySaleID();
    }
  }, [unsavedItems]);

  useEffect(() => {
    // Reset state when component loads
    setUnsavedItems(false);
    setOpenModal(false);
  }, []);

  const handleDeleteItem = async (saleItemId) => {
    if (!saleItemId) return;
    try {
      await axios.post("sales-item-delete?", { id: saleItemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted successfully!");
      setUnsavedItems(true);
      // setItemSaleList();
      // Fetch updated data after delete
      saleBillGetBySaleID();
      setIsDelete(false);

    } catch (error) {
      console.error("Error during delete:", error);
      toast.error("Failed to delete the item.");
    }
  };



  const addSaleItem = async () => {
    setUnsavedItems(true);
    let data = new FormData();
    if (isEditMode == true) {
      data.append("item_id", searchItemID);
    } else {
      data.append("item_id", value.id);
    }
    data.append("qty", qty);
    data.append("exp", expiryDate);
    data.append("gst", gst);
    data.append("mrp", mrp);
    data.append("unit", unit);
    data.append("random_number", randomNumber);
    data.append("batch", batch);
    data.append("location", loc);
    data.append("base", base);
    data.append("amt", itemAmount);
    data.append("net_rate", itemAmount);
    data.append("order", order);
    data.append("total_base", totalBase);
    data.append("payment_name", paymentType);


    const params = {
      id: selectedEditItemId ? selectedEditItemId : '',
    };
    try {
      const response = isEditMode
        ? await axios.post("sales-item-edit?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        : await axios.post("sales-item-add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      //console.log("response", response);
      // saleItemList();
      saleBillGetBySaleID();
      setSearchItem(null);
      setUnit("");
      setBatch("");
      setExpiryDate("");
      setMRP("");
      setQty("");
      setBase("");
      setGst("");
      setBatch("");
      setLoc("");
      setIsEditMode(false);
    } catch (e) {
      //console.log(e);
    }
  };

  const resetValue = () => {
    setUnit("");
    setBatch("");
    setSearchItem("");
    setExpiryDate("");
    setMRP("");
    setBase("");
    setGst("");
    setQty("");
    setOrder("");
    setLoc("");
    setItemAmount(0);
    if (isNaN(itemAmount)) {
      setItemAmount(0);
    }};
    
  const handleUpdate = () => {
    setUnsavedItems(false);

    const newErrors = {};
    if (!customer) {
      newErrors.customer = "Please select Customer";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    updateSaleData();
  };


  const updateSaleData = async () => {
    let data = new FormData();
    data.append("bill_no", saleAllData?.bill_no);
    data.append("customer_id", customer?.id);
    data.append("status", "Completed");
    data.append("bill_date", saleAllData?.bill_date);
    data.append("customer_address", address || "");
    data.append("doctor_id", doctor?.id);
    // data.append('total_gst', '0')
    data.append("igst", "0");
    data.append("cgst", saleAllData?.cgst);
    data.append("sgst", saleAllData?.sgst);
    data.append("given_amount", givenAmt || 0);
    data.append("due_amount", dueAmount || 0);
    data.append("total_base", totalBase);
    data.append("pickup", pickup);
    data.append("owner_name", "0");
    data.append("payment_name", location.state.paymentType);
    data.append("product_list", JSON.stringify(saleAllData?.sales_item));
    data.append("net_amount", netAmount);
    data.append("other_amount", tempOtherAmt);
    data.append("total_discount", finalDiscount);
    data.append("discount_amount", discountAmount);
    data.append("total_amount", totalAmount);
    data.append("round_off", roundOff);
    data.append("margin_net_profit", marginNetProfit);
    data.append("net_rate", netRateAmount);
    data.append("margin", margin);
    const params = {
      id: id || '',
    };
    try {
      await axios
        .post("sales-update?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          //console.log(response.data);
          //console.log("response===>", response.data);
          toast.success(response.data.message);
          setTimeout(() => {
            history.push("/salelist");
          }, 2000);
        });
    } catch (error) {
      console.error("API error:", error);
    }

  };

  const handleDraft = () => {
    const newErrors = {};
    if (!customer) {
      newErrors.customer = "Please select Customer";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    draftSaleData();
  };

  const draftSaleData = async () => {
    let data = new FormData();
    data.append("bill_no", saleAllData?.bill_no ? saleAllData?.bill_no : "");
    data.append("customer_id", customer?.id ? customer?.id : "");
    data.append("status", "Completed");
    data.append("bill_date", saleAllData?.bill_date ? saleAllData?.bill_date : "");
    data.append("customer_address", address || "");
    data.append("doctor_id", doctor?.id ? doctor?.id : '');
    // data.append('total_gst', '0')
    data.append("igst", "0");
    data.append("cgst", saleAllData?.cgst ? saleAllData?.cgst : '');
    data.append("sgst", saleAllData?.sgst ? saleAllData?.sgst : '');
    data.append("given_amount", givenAmt || 0);
    data.append("due_amount", dueAmount || 0);
    data.append("total_base", totalBase);
    data.append("pickup", pickup ? pickup : "");
    data.append("owner_name", "0");
    data.append("payment_name", location.state.paymentType ? location.state.paymentType : '');
    data.append("product_list", JSON.stringify(saleAllData?.sales_item) ? JSON.stringify(saleAllData?.sales_item) : '');
    data.append("net_amount", netAmount);
    data.append("other_amount", otherAmt ? otherAmt : '');
    data.append("total_discount", finalDiscount);
    data.append("discount_amount", discountAmount ? discountAmount : '');
    data.append("total_amount", totalAmount);
    const params = {
      id: id ? id : '',
    };
    try {
      await axios
        .post("sales-update?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          //console.log(response.data);
          //console.log("response===>", response.data);
          toast.success(response.data.message);
          setTimeout(() => {
            history.push("/salelist");
          }, 2000);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <>
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
        {isLoading ? (
          <div className="loader-container ">
            <Loader />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "rgb(240, 240, 240)",
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
                      history.push("/salelist");
                    }}
                  >
                    Sales
                  </span>
                  <ArrowForwardIosIcon
                    style={{
                      fontSize: "18px",
                      marginTop: "9px",
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
                    Edit
                  </span>
                  <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
                </div>
                <div className="headerList">
                  <input
                    labelId="dropdown-label"
                    id="dropdown"
                    value={location.state.paymentType}
                    sx={{ minWidth: "200px" }}
                    disabled  // Keeps the label disabled
                    size="small"
                    className="Payment_Value"
                  >
                    {/* {location.state.paymentType} */}
                  </input>


                  {/* <Select
                    labelId="dropdown-label"
                    id="dropdown"
                    value={pickup}
                    sx={{ minWidth: "150px" }}
                    onChange={(e) => {
                      setPickup(e.target.value);
                    }}
                    size="small"
                  >
                    {pickupOptions.map((option) => (
                      <MenuItem key={option.id} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <input
                    labelId="dropdown-label"
                    id="dropdown"
                    value={pickup}
                    sx={{ minWidth: "150px" }}
                    className="Payment_Value"
                    disabled
                    size="small"
                  >
                    {/* {pickupOptions.map((option) => (
                      <MenuItem key={option.id} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </input>
                  {/* <Button
                    variant="contained"
                    sx={{
                      gap: "5px",
                      display: "flex",
                      textTransform: "none",
                      background: "gray",
                    }}
                    onClick={handleDraft}
                  >
                    <SaveAsIcon /> Draft
                  </Button> */}

                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      background: "rgb(4, 76, 157)",
                    }}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </div>
              </div>
              <div className="border-b">
                <div className="firstrow flex">
                  <div className="detail mt-1" style={{ width: "250px" }}>
                    <div
                      className="detail  p-2 rounded-md"
                      style={{ background: "#044c9d", width: "100%" }}
                    >
                      <div
                        className="heading"
                        style={{
                          color: "white",
                          fontWeight: "500",
                          alignItems: "center",
                          marginLeft: "15px",
                        }}
                      >
                        Bill No
                        <span style={{ marginLeft: "35px" }}> Bill Date</span>
                      </div>
                      <div className="flex gap-5">
                        <div
                          style={{
                            color: "white",
                            fontWeight: "500",
                            alignItems: "center",
                            marginTop: "8px",
                            marginLeft: "15px",
                            fontWeight: "bold",
                            width: "19%",
                          }}
                        >
                          {saleAllData.bill_no}
                        </div>
                        <div
                          style={{
                            color: "white",
                            fontWeight: "500",
                            alignItems: "center",
                            marginTop: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          |
                        </div>
                        <div
                          style={{
                            color: "white",
                            fontWeight: "500",
                            alignItems: "center",
                            marginTop: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          {saleAllData.bill_date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="detail"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span
                      className="heading"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "rgba(4, 76, 157, 1)",
                      }}
                    >
                      Customer Mobile / Name
                    </span>
                    <Autocomplete
                      value={customer || {}}
                      onChange={handleCustomerOption}
                      options={customerDetails}
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      sx={{
                        width: "100%",
                        minWidth: {
                          xs: "320px",
                          sm: "400px",
                        },
                        "& .MuiInputBase-root": {
                          height: 20,
                          fontSize: "1.10rem",
                        },
                        "& .MuiAutocomplete-inputRoot": {
                          padding: "10px 14px",
                        },
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>
                          <ListItemText
                            primary={`${option.name} `}
                            secondary={`Mobile No: ${option.phone_number}`}
                          />
                        </ListItem>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Search by Mobile, Name"
                          InputProps={{
                            ...params.InputProps,
                            style: { height: 45 },
                          }}
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "1rem",
                              color: "black",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                  {/* <div className="detail">
                    <span
                      className="heading mb-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "rgba(4, 76, 157, 1)",
                      }}
                    >
                      Address
                    </span>
                    <TextField
                      id="outlined-basic"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      sx={{
                        width: 300,
                        "& .MuiInputBase-root": {
                          height: 45,
                          fontSize: "1.10rem",
                        },
                        "& .MuiAutocomplete-inputRoot": {
                          padding: "10px 14px",
                        },
                      }}
                      variant="outlined"
                    />
                  </div> */}

                  <div className="detail">
                    <span
                      className="heading mb-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "rgba(4, 76, 157, 1)",
                      }}
                    >
                      Doctor
                    </span>
                    <Autocomplete
                      value={doctor || {}}
                      onChange={handleDoctorOption}
                      options={doctorData}
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      sx={{
                        width: "100%",
                        minWidth: {
                          xs: "320px",
                          sm: "400px",
                        },
                        "& .MuiInputBase-root": {
                          height: 20,
                          fontSize: "1.10rem",
                        },
                        "& .MuiAutocomplete-inputRoot": {
                          padding: "10px 14px",
                        },
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>
                          <ListItemText
                            primary={`${option.name} `}
                            secondary={`Clinic Name: ${option.clinic} `}
                          />
                        </ListItem>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Search by DR. Name"
                          InputProps={{
                            ...params.InputProps,
                            style: { height: 45 },
                          }}
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "1rem",
                              color: "black",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                  <table>
                    <Box
                      sx={{
                        flex: "1 1 auto",
                        minWidth: {
                          xs: "350px",
                          sm: "500px",
                          md: "1000px",
                        },
                        width: "100%",
                        background: "#ceecfd",
                        borderRadius: "7px",
                      }}
                    >
                      <Autocomplete
                        value={searchItem?.iteam_name}
                        size="small"
                        onChange={handleOptionChange}
                        onInputChange={handleInputChange}
                        getOptionLabel={(option) => `${option.iteam_name} `}
                        options={itemList}
                        renderOption={(props, option) => (
                          <ListItem {...props}>
                            <ListItemText
                              primary={`${option.iteam_name} - ${option.stock}`}
                              secondary={`weightage: ${option.weightage}`}
                            />
                          </ListItem>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Search Item Name..."
                            InputProps={{
                              ...params.InputProps,
                              style: { height: 45 },
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon
                                    sx={{
                                      color: "rgba(9, 161, 246)",
                                      cursor: "pointer",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  border: "none",
                                },
                                "&:hover fieldset": {
                                  border: "none",
                                },
                                "&.Mui-focused fieldset": {
                                  border: "none",
                                },
                                borderBottom: "1px solid ",
                              },
                              "& .MuiInputBase-input::placeholder": {
                                fontSize: "1rem",
                                color: "black",
                              },
                            }}
                          />
                        )}
                      />
                    </Box>
                    {/* {customer && (
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          background: "rgb(4, 76, 157)",
                          marginTop: "15px",
                        }}
                        size="small"
                      >
                        <HistoryIcon />
                        Purchase History
                      </Button>
                    )} */}
                    {isVisible && value && !batch && (
                      <Box
                        sx={{
                          minWidth: {
                            xs: "200px",
                            sm: "500px",
                            md: "1000px",
                          },
                          backgroundColor: "white",
                          position: "absolute",
                          zIndex: 1,
                        }}
                      >
                        <div
                          className="custom-scroll-sale "
                          style={{ width: "100%" }}
                        >
                          <table
                            ref={tableRef}
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <thead>
                              <tr className="customtable">
                                <th>Item Name</th>
                                <th>Batch Number</th>
                                <th>Unit</th>
                                <th>Expiry Date</th>
                                <th>QTY</th>
                                <th>Loc</th>
                              </tr>
                            </thead>
                            <tbody>
                              {batchListData.length > 0 ? (
                                <>
                                  {batchListData?.map((item) => (
                                    <tr
                                      className="cursor-pointer saleTable custom-hover"
                                      key={item.id}
                                      style={{
                                        border:
                                          "1px solid rgba(4, 76, 157, 0.1)",
                                        padding: 55,
                                      }}
                                      onClick={() => handlePassData(item)}
                                    >
                                      <td className=" text-base font-semibold">
                                        {item.iteam_name}
                                      </td>
                                      <td className=" text-base font-semibold">
                                        {item.batch_number}
                                      </td>
                                      <td className=" text-base font-semibold">
                                        {item.unit}
                                      </td>
                                      <td className=" text-base font-semibold">
                                        {item.expiry_date}
                                      </td>
                                      <td className=" text-base font-semibold">
                                        {item.qty}
                                      </td>
                                      <td className=" text-base font-semibold">
                                        {item.location}
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ) : (
                                <tr>
                                  <td
                                    colSpan={12}
                                    style={{
                                      textAlign: "center",
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    No record found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Box>
                    )}
                  </table>

                  {/* {value && */}
                  <div className="scroll-two">
                    <table className="saleTable">
                      <thead>
                        <tr>
                          <th className="w-1/4">Item Name</th>
                          <th>Unit </th>
                          <th>Batch </th>
                          <th>Expiry</th>
                          <th>MRP</th>
                          <th>Base</th>
                          <th>GST% </th>
                          <th>QTY </th>
                          <th>Order
                            <Tooltip title="Please Enter only (o)" arrow>
                              <Button>
                                <GoInfo
                                  className="absolute"
                                  style={{ fontSize: "1rem" }}
                                />
                              </Button>
                            </Tooltip>
                          </th>
                          <th>Loc.</th>
                          <th>Amount </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <DeleteIcon
                              className="delete-icon"
                              onClick={resetValue}
                            />
                            {searchItem}
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              disabled
                              type="number"
                              size="small"
                              value={unit}
                              sx={{ width: "90px" }}
                              onChange={(e) => {
                                setUnit(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              sx={{ width: "110px" }}
                              size="small"
                              disabled
                              value={batch}
                              onChange={(e) => {
                                setBatch(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              disabled
                              size="small"
                              sx={{ width: "100px" }}
                              value={expiryDate}
                              onChange={handleExpiryDateChange}
                              placeholder="MM/YY"
                            />
                          </td>
                          <td>
                            <TextField
                              disabled
                              id="outlined-number"
                              type="number"
                              sx={{ width: "100px" }}
                              size="small"
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
                              sx={{ width: "120px" }}
                              size="small"
                              value={base}
                              onChange={(e) => {
                                setBase(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              disabled
                              size="small"
                              sx={{ width: "80px" }}
                              value={gst}
                              onChange={(e) => {
                                setGst(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              sx={{ width: "70px" }}
                              size="small"
                              value={qty}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                  e.preventDefault();
                                }
                              }}
                              // onChange={(e) => { e.target.value > tempQty ? setQty(tempQty) : setQty(e.target.value) }}
                              onChange={(e) => { handleQty(e.target.value) }}

                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } },
                                disableUnderline: true
                              }}
                            />
                          </td>
                          <td>
                            {/* <TextField
                                                            id="outlined-number"
                                                            sx={{ width: '80px' }}
                                                            size="small"
                                                            value={order}
                                                            onChange={(e) => { setOrder(e.target.value) }}
                                                        /> */}
                            <TextField
                              id="outlined-number"
                              sx={{ width: "80px" }}
                              size="small"
                              // inputRef={inputRef6}
                              // onKeyDown={handleKeyDown}
                              value={order}
                              onChange={handleChange}
                            />
                          </td>

                          <td>
                            <TextField
                              id="outlined-number"
                              size="small"
                              disabled
                              sx={{ width: "100px" }}
                              value={loc}
                              onChange={(e) => {
                                setLoc(e.target.value);
                              }}
                            />
                          </td>
                          <td className="total">{itemAmount}</td>
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
                          <td>
                            <Button
                              variant="contained"
                              color="success"
                              style={{ display: "flex", gap: "5px" }}
                              onClick={addSaleItem}
                            >
                              <BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />
                              Edit
                            </Button>
                          </td>
                        </tr>

                        {saleAllData?.sales_item?.map((item) => (
                          <tr
                            key={item.id}
                            className="item-List border-b border-gray-400"
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
                                className="cursor-pointer"
                              />
                              <DeleteIcon
                                className="delete-icon"
                                onClick={() => deleteOpen(item.id)}
                              />
                              {item.iteam_name}
                            </td>
                            <td>{item.unit}</td>
                            <td>{item.batch}</td>
                            <td>{item.exp}</td>
                            <td>{item.mrp}</td>
                            <td>{item.base}</td>
                            <td>{item.gst}</td>
                            <td>{item.qty}</td>
                            <td>{item.order}</td>
                            <td>{item.location}</td>
                            <td>{item.net_rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex gap-10 justify-end mt-4 mr-10 flex-wrap">
                <div
                >
                  <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                    <label className="font-bold">Total GST : </label>
                    <label className="font-bold">Total Base : </label>
                    <label className="font-bold">Profit : </label>
                    <label className="font-bold">Total Net Rate : </label>
                  </div>
                </div>
                <div class="totals mr-3"
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                    alignItems: "end"

                  }}>
                  <span style={{ fontWeight: 600 }}> {totalgst} </span>
                  <span style={{ fontWeight: 600 }}> {totalBase} </span>
                  <span style={{ fontWeight: 600 }}>₹ {marginNetProfit} ({Number(margin).toFixed(2)}%) </span>
                  <span style={{ fontWeight: 600 }}>₹ {netRateAmount} </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                  }}
                >
                  {/* <div>
                    <label className="font-bold">SGST : </label>
                  </div>
                  <div>
                    <label className="font-bold">CGST : </label>
                  </div>
                  <div>
                    <label className="font-bold">IGST : </label>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                    alignItems: "end"

                  }}
                >
                  <div className="font-bold">{saleAllData?.sgst}</div>
                  <div className="font-bold">{saleAllData?.cgst}</div>
                  // {/* <div className="font-bold">{saleAllData?.igst}</div> 
                  <div className="font-bold">0.0</div>*/}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <label className="font-bold">Total Amount : </label>
                  </div>
                  <div>
                    <label className="font-bold">Discount (%): </label>
                  </div>
                  <div>
                    <label className="font-bold">Other Amount : </label>
                  </div>
                  <div>
                    <label className="font-bold">Discount Amount : </label>
                  </div>
                  <div>
                    <label className="font-bold">Round Off : </label>
                  </div>
                  <div>
                    <label className="font-bold">Net Amount : </label>
                  </div>
                </div>
                <div class="totals">
                  <div className="" style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: "column",
                    alignItems: "end"
                  }}>

                    <div>
                      <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                    </div>
                    <Input
                      type="number"
                      className="mt-2"
                      value={finalDiscount}
                      onChange={(e) => {
                        let newValue = e.target.value;

                        // if (newValue >= 0 && newValue <= 100) {
                        //   setFinalDiscount(e.target.value);
                        //   setUnsavedItems(true)
                        //   localStorage.setItem('RandomNumber', randomNumber)
                        // }
                        if (newValue > 100) {
                          setFinalDiscount(100);
                        } else if (newValue >= 0) {
                          // If the value is valid (0 to 100), update the state
                          setFinalDiscount(newValue);
                        }
                        setUnsavedItems(true);
                        localStorage.setItem('RandomNumber', randomNumber);
                      }}
                      onKeyPress={(e) => {
                        // Allow numbers, backspace, and decimal point
                        if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      size="small"
                      style={{
                        width: "70px", background: "none", borderBottom: "1px solid gray", outline: "none", justifyItems: "end",

                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "35px",
                        },
                        "& .MuiInputBase-input": { textAlign: "end" }
                      }}
                    />

                    <Input
                      type="number"
                      value={tempOtherAmt || otherAmt}
                      onChange={handleOtherAmtChange}
                      onKeyPress={(e) => {
                        // Allow numbers, backspace, and decimal point
                        if (!/[0-9.-]/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      size="small"
                      style={{
                        width: "70px",
                        background: "none",
                        borderBottom: "1px solid gray",
                        outline: "none",
                        justifyItems: "end"

                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "35px",
                        },
                        "& .MuiInputBase-input": { textAlign: "end" },
                      }}

                    />
                    <div className="">
                      <span>
                        -{discountAmount}
                      </span>
                    </div>
                    <div className="">
                      <span
                        style={{
                          fontWeight: 800,
                        }}
                      >
                        <span >{!roundOff ? 0 : roundOff}</span>

                      </span>
                    </div>

                    <div className="">
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "22px"
                        }}
                      >
                        {/* {(Number(netAmount) || 0).toFixed(2)} */}

                        {Number(netAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    onClick={() => { handleDeleteItem(saleItemId); setUnsavedItems(true) }}
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
          </div>
        )}
      </div>

      <Prompt
        when={unsavedItems} // Triggers only if there are unsaved changes
        message={(location) => {
          handleNavigation(location.pathname);
          setOpenModal(true);
          return false; // Prevent automatic navigation
        }}
      />
      <div
        id="modal"
        value={openModal}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${openModal ? "block" : "hidden"}`}
      >
        <div />
        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <div className="my-4 logout-icon">
            <VscDebugStepBack className=" h-12 w-14" style={{ color: "#628A2F" }} />
            <h4 className="text-lg font-semibold mt-6 text-center" style={{ textTransform: "none" }}>Are you sure you want to leave this page ?</h4>
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
              onClick={() => setOpenModal(false)}

            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditSaleBill;
