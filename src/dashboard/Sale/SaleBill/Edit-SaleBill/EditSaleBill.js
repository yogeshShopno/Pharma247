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
import "../../../../App.css";
import {
  Prompt,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import HistoryIcon from "@mui/icons-material/History";
import { MenuItem, Select } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import SearchIcon from "@mui/icons-material/Search";
import ListItem from "@mui/material/ListItem";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../../../../componets/loader/Loader";
import { GoInfo } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import { VscDebugStepBack } from "react-icons/vsc";
import { FaCaretUp, FaStore } from "react-icons/fa6";
import { FaShippingFast, FaWalking } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";

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
    { id: 1, label: "Counter", icon: <FaStore /> },
    { id: 2, label: "Pickup", icon: <FaWalking /> },
    { id: 3, label: "Delivery", icon: <FaShippingFast /> },
  ];
  const location = useLocation();
  const { paymentType: initialPayment } = location.state;
  const [paymentType, setPaymentType] = useState(initialPayment || "");
  const [loyaltyVal, setLoyaltyVal] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [error, setError] = useState({ customer: "" });
  const [itemAmount, setItemAmount] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  // const tableRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [itemId, setItemId] = useState(null);
  const [batchListData, setBatchListData] = useState([]);
  const [saleItemId, setSaleItemId] = useState(null);
  const [mrp, setMRP] = useState("");
  const [totalgst, setTotalgst] = useState(0);
  const [totalBase, setTotalBase] = useState(0);
  const [dueAmount, setDueAmount] = useState(null);
  const [givenAmt, setGivenAmt] = useState(null);
  const [finalDiscount, setFinalDiscount] = useState("");
  const [netAmount, setNetAmount] = useState(0);
  const [netRateAmount, setNetRateAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tempOtherAmt, setTempOtherAmt] = useState("");
  const [otherAmt, setOtherAmt] = useState(
    localStorage.getItem("Other_Amount") || ""
  );
  const [qty, setQty] = useState("");
  const [tempQty, setTempQty] = useState("");
  const [marginNetProfit, setMarginNetProfit] = useState(0);
  const [todayLoyltyPoint, setTodayLoyaltyPoint] = useState("");
  const [previousLoyaltyPoints, setPreviousLoyaltyPoints] = useState("");
  const [maxLoyaltyPoints, setMaxLoyaltyPoints] = useState(0);

  const [order, setOrder] = useState("");
  const [gst, setGst] = useState("");
  const [batch, setBatch] = useState("");
  const [unit, setUnit] = useState("");
  const [loc, setLoc] = useState("");
  const [base, setBase] = useState("");
  const [discountAmount, setDiscountAmount] = useState();
  const [roundOff, setRoundOff] = useState(0);
  const [pickup, setPickup] = useState("");
  const [IsDelete, setIsDelete] = useState(false);
  const [ItemSaleList, setItemSaleList] = useState({ sales_item: [] });
  let defaultDate = new Date();
  const [searchItem, setSearchItem] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState([]);

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
  const [randomNum, setRandomNum] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [uniqueId, setUniqueId] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [itemEditID, setItemEditID] = useState(0);
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [billSaveDraft, setBillSaveDraft] = useState("0");

  /*<============================================================================ Input ref on keydown enter ===================================================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const tableRef = useRef(null); // Reference for table container
  const rowRefs = useRef([]); // Refs for each row

  const inputRefs = useRef([]);
  const dateRefs = useRef([]);

  const submitButtonRef = useRef(null);
  const addButtonref = useRef(null);

  /*<============================================================ disable autocomplete to focus when tableref is focused  ===================================================> */

  useEffect(() => {
    const handleTableFocus = () => {
      // No longer needed
    };
    const handleTableBlur = () => {
      // No longer needed
    };

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
      if (!saleAllData?.item_list?.length) return;

      const isInputFocused = document.activeElement.tagName === "INPUT";

      if (isInputFocused) return;

      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          Math.min(prev + 1, saleAllData.item_list.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        const selectedRow = saleAllData.item_list[selectedIndex];
        if (!selectedRow) return;
        handleEditClick(selectedRow);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [saleAllData, selectedIndex]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

  useEffect(() => {
    const discount = (totalAmount * finalDiscount) / 100;
    setDiscountAmount(discount.toFixed(2));

    let amountToUse = otherAmt ? otherAmt : tempOtherAmt;

    if (amountToUse < 0 && Math.abs(amountToUse) > totalAmount) {
      setOtherAmt(0);
      setTempOtherAmt(0);
    } else {
      let loyaltyPointsDeduction = loyaltyVal;
      let calculatedNetAmount =
        totalAmount - discount - loyaltyPointsDeduction + Number(otherAmt);

      if (calculatedNetAmount < 0) {
        setOtherAmt(-(totalAmount - discount - loyaltyPointsDeduction));
        setTempOtherAmt(-(totalAmount - discount - loyaltyPointsDeduction));
        calculatedNetAmount = 0;
      }

      const decimalPart = Number((calculatedNetAmount % 1).toFixed(2));
      const roundedDecimal = decimalPart;
      if (decimalPart < 0.5) {
        setRoundOff((-roundedDecimal).toFixed(2));
        setNetAmount(Math.floor(calculatedNetAmount));
      } else {
        setRoundOff((1 - roundedDecimal).toFixed(2));
        setNetAmount(Math.ceil(calculatedNetAmount));
      }
      const due = givenAmt - calculatedNetAmount;
      setDueAmount(due.toFixed(2));
    }
  }, [
    totalAmount,
    loyaltyVal,
    finalDiscount,
    otherAmt,
    givenAmt,
    tempOtherAmt,
  ]);

  const handleOtherAmtChange = (e) => {
    const value = e.target.value;
    localStorage.setItem("RandomNumber", randomNumber);

    const numericValue = isNaN(value) || value === "" ? "" : Number(value);

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
    setUnsavedItems(true);
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
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleBarcode();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  const saleBillGetBySaleID = async (doctorData, customerData) => {
    let data = new FormData();
    data.append("id", id || "");
    data.append("random_number", randomNumber || "");
    data.append("total_gst", totalgst || "");

    try {
      const response = await axios.post("sales-edit-details?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const record = response.data.data;
      setSaleAllData({ ...record, sales_item: [] });
      setSaleAllData(record);
      // setPreviousLoyaltyPoints(record.roylti_point);
      console.log(saleAllData);

      setAddress(record.customer_address);
      setTotalBase(record.total_base);
      setTotalgst(record.total_gst);
      setTotalAmount(record.sales_amount);
      setOtherAmt(record.other_amount);
      setTodayLoyaltyPoint(record.today_loylti_point);
      setRoundOff(record.round_off);
      if (!finalDiscount) {
        setFinalDiscount(record.total_discount);
      }
      const salesItem = response.data.data.sales_item;
      if (salesItem && salesItem.length > 0) {
        const fetchedRandomNumber = salesItem[0].random_number;
        setRandomNum(fetchedRandomNumber);
      }
      setLoyaltyVal(record.roylti_point);
      setNetAmount(record.net_amount);
      setNetRateAmount(record.total_net_rate);
      setMarginNetProfit(record.margin_net_profit);
      setMargin(record.total_margin);
      setPaymentType(record.payment_name);
      setPickup(record.pickup);
      // setPickup(pickupOptions.find(option => option.label === record.pickup));

      // setCustomer(response.data.data.customer_name)
      const foundCustomer = customerData.find(
        (option) => option.name === record.customer_name
      );
      setCustomer(foundCustomer || "");
      setPreviousLoyaltyPoints(foundCustomer.roylti_point);

      if (record.doctor_name && record.doctor_name !== "-") {
        const foundDoctor = doctorData.find(
          (option) => option.name === record.doctor_name
        );
        setDoctor(foundDoctor || "");
      } else {
        setDoctor("");
      }
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
      setCustomerDetails(response.data.data);
      // setCustomer(response.data.data[0] || '');
      setIsLoading(false);

      if (customer.length > 0) {
        const firstCustomer = customer[0];
        setCustomer(firstCustomer);
        setPreviousLoyaltyPoints(firstCustomer.roylti_point || 0);
      }
      return customerData;

      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);

      return [];
    }
  };

  const batchList = async () => {
    let data = new FormData();
    data.append("iteam_id", itemId || "");
    const params = {
      iteam_id: itemId ? itemId : "",
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

    setSelectedOption(newValue);
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
    if (isVisible && value && !batch) {
      const element = tableRef.current;
      element.focus();
    }
  };

  const handleNavigation = (path) => {
    setOpenModal(true);
    setNextPath(path);
  };

  const handleLeavePage = () => {
    let data = new FormData();
    data.append("random_number", randomNumber || "");

    setOpenModal(false);
    setUnsavedItems(false);
    localStorage.removeItem("unsavedItems");

    try {
      const response = axios
        .post("sales-history", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUnsavedItems(false);
          setOpenModal(false);
          if (nextPath) {
            history.replace(nextPath);
          }
        })
        .catch((error) => {
          console.error("Error fetching sales history:", error);
        });
    } catch (error) {
      
      if (error.response && error.response.status === 401) {
        setUnsavedItems(false);
        setOpenModal(false);
        localStorage.setItem("unsavedItems", unsavedItems.toString());
        setTimeout(() => {
            history.push(nextPath);
        }, 0);
    } else {
      console.error("Error fetching sales history:", error);
    }}
  };

  const handleEditClick = (item) => {
    const existingItem = uniqueId.find((obj) => obj.id === item.id);

    if (!existingItem) {
      setUniqueId((prevUniqueIds) => [
        ...prevUniqueIds,
        { id: item.id, qty: item.qty },
      ]);
      setTempQty(item.qty);
    } else {
      setTempQty(existingItem.qty);
    }
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id);
    setSearchItem(item.iteam_name);
    setSearchItemID(item.item_id);

    if (selectedEditItem) {
      setUnit(selectedEditItem.unit);
      setBatch(selectedEditItem.batch);
      setExpiryDate(selectedEditItem.exp);
      setMRP(selectedEditItem.mrp);
      setQty(item.qty);
      // setQty(selectedEditItem.qty);
      setBase(item.base);
      // setBase(selectedEditItem.base);
      setOrder(item.order);
      setGst(item.gst_name);
      setLoc(selectedEditItem.location);
      setItemAmount(selectedEditItem.net_rate);
    }
  };

  const handleQty = (value) => {
    const newQty = Number(value);

    if (newQty > tempQty) {
      setQty(tempQty);
      toast.error(
        `Quantity exceeds the allowed limit. Max available: ${tempQty}`
      );
    } else if (newQty < 0) {
      setQty(tempQty);
      toast.error(`Quantity should not be less than 0`);
    } else {
      setQty(newQty);
    }
  };

  const handleCustomerOption = (event, newValue) => {
    setUnsavedItems(true);
    setCustomer(newValue);

    if (newValue) {
      const points = newValue.roylti_point || 0;
      setPreviousLoyaltyPoints(points);

      // setMaxLoyaltyPoints(points);
    } else {
      setPreviousLoyaltyPoints(0);
      // setMaxLoyaltyPoints(0);
      setLoyaltyVal(0);
    }
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
    data.append("search", searchItem || "");
    const params = {
      search: searchItem ? searchItem : "",
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
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    saleBillGetBySaleID();
  }, [unsavedItems]);

  useEffect(() => {
    setUnsavedItems(false);
    setOpenModal(false);
  }, []);

  const handleDeleteItem = async (saleItemId) => {
    if (!saleItemId) return;
    try {
      await axios.post(
        "sales-item-delete?",
        { id: saleItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Item deleted successfully!");
      setUnsavedItems(true);
      localStorage.setItem("unsavedItems", "true");
      saleBillGetBySaleID();
      setIsDelete(false);
    } catch (error) {
      console.error("Error during delete:", error);
      toast.error("Failed to delete the item.");
    }
  };

  useEffect(() => {
    const unsaved = localStorage.getItem("unsavedItems");
    if (unsaved === "true") {
      setUnsavedItems(true);
    }
  }, []);

  const handleBarcode = async () => {
    if (!barcode) {
      return;
    }
    let data = new FormData();
    // data.append("barcode", barcode);

    const params = {
      random_number: localStorage.getItem("RandomNumber"),
    };
    try {
      const res = axios
        .post(
          "barcode-batch-list?",
          { barcode: barcode },
          {
            // params: params,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setUnit(response?.data?.data[0]?.batch_list[0]?.unit);
          setBatch(response?.data?.data[0]?.batch_list[0]?.batch_name);
          setExpiryDate(response?.data?.data[0]?.batch_list[0]?.expiry_date);
          setMRP(response?.data?.data[0]?.batch_list[0]?.mrp);
          setQty(response?.data?.data[0]?.batch_list[0]?.qty);
          setTempQty(response?.data?.data[0]?.batch_list[0]?.stock);
          // setFree(response?.data?.data[0]?.batch_list[0]?.purchase_free_qty)
          // setFinalDiscount(response?.data?.data[0]?.batch_list[0]?.discount)
          setBase(response?.data?.data[0]?.batch_list[0]?.base);
          setGst(response?.data?.data[0]?.batch_list[0]?.gst_name);
          setLoc(response?.data?.data[0]?.batch_list[0]?.location);
          setMargin(response?.data?.data[0]?.batch_list[0]?.margin);
          setNetRateAmount(response?.data?.data[0]?.batch_list[0]?.net_rate);
          setSearchItem(response?.data?.data[0]?.batch_list[0]?.iteam_name);

          setItemId(response?.data?.data[0]?.batch_list[0]?.item_id);

          setSelectedEditItemId(response?.data?.data[0]?.id);
          setItemEditID(response.data.data[0]?.id);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const addSaleItem = async () => {
    setUnsavedItems(true);
    let data = new FormData();
    if (isEditMode == true) {
      data.append("item_id", searchItemID ? Number(searchItemID) : "");
    } else {
      if (barcode) {
        data.append("item_id", itemId);
      } else {
        data.append("item_id", value && value.id ? Number(value.id) : "");
      }
    }

    data.append("id", selectedEditItemId ? Number(selectedEditItemId) : "");
    data.append("qty", qty || "");
    data.append("exp", expiryDate || "");
    data.append("gst", gst || "");
    data.append("mrp", mrp || "");
    data.append("unit", unit || "");
    data.append("random_number", Number(randomNumber || ""));
    data.append("batch", batch || "");
    data.append("location", loc || "");
    data.append("base", base || "");
    data.append("amt", itemAmount || "");
    data.append("net_rate", itemAmount || "");
    data.append("order", order || "");
    data.append("total_base", totalBase || "");
    data.append("total_gst", totalgst || "");

    const params = {
      id: Number(selectedEditItemId) || "",
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
      setOrder("");
      setBarcode("");
      setIsEditMode(false);
      setIsVisible(false);
      setSelectedOption(null);
    } catch (e) {}
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
    }
  };
  const handleUpdate = (draft) => {
    setUnsavedItems(false);

    const newErrors = {};
    if (!customer) {
      newErrors.customer = "Please select Customer";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    updateSaleData(draft);
  };

  const updateSaleData = async (draft) => {
    let data = new FormData();
    data.append("bill_no", saleAllData?.bill_no);
    data.append("customer_id", customer?.id);
    data.append("status", "Completed");
    data.append("bill_date", saleAllData?.bill_date);
    data.append("customer_address", address || "");
    data.append("doctor_id", doctor?.id || "");
    data.append("igst", "0");
    data.append("cgst", saleAllData?.cgst || "");
    data.append("sgst", saleAllData?.sgst || "");
    data.append("given_amount", givenAmt || 0);
    data.append("due_amount", dueAmount || 0);
    data.append("total_base", totalBase);
    data.append("pickup", pickup);
    data.append("owner_name", "0");
    data.append("payment_name", location.state.paymentType || "");
    data.append("product_list", JSON.stringify(saleAllData?.sales_item));
    data.append("net_amount", netAmount || 0);
    data.append("other_amount", tempOtherAmt || 0);
    data.append("total_discount", finalDiscount || "");
    data.append("discount_amount", discountAmount || 0);
    data.append("total_amount", totalAmount || 0);
    data.append("round_off", roundOff || 0);
    data.append("margin_net_profit", marginNetProfit || 0);
    data.append("net_rate", netRateAmount || 0);
    data.append("margin", margin || 0);
    data.append("roylti_point", loyaltyVal || 0);
    data.append("draft_save", !draft ? "1" : draft);

    const params = {
      id: id || "",
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
    data.append(
      "bill_date",
      saleAllData?.bill_date ? saleAllData?.bill_date : ""
    );
    data.append("customer_address", address || "");
    data.append("doctor_id", doctor?.id ? doctor?.id : "");
    data.append("igst", "0");
    data.append("cgst", saleAllData?.cgst ? saleAllData?.cgst : "");
    data.append("sgst", saleAllData?.sgst ? saleAllData?.sgst : "");
    data.append("given_amount", givenAmt || 0);
    data.append("due_amount", dueAmount || 0);
    data.append("total_base", totalBase);
    data.append("pickup", pickup ? pickup : "");
    data.append("owner_name", "0");
    data.append(
      "payment_name",
      location.state.paymentType ? location.state.paymentType : ""
    );
    data.append(
      "product_list",
      JSON.stringify(saleAllData?.sales_item)
        ? JSON.stringify(saleAllData?.sales_item)
        : ""
    );
    data.append("net_amount", netAmount);
    data.append("other_amount", otherAmt ? otherAmt : "");
    data.append("total_discount", finalDiscount);
    data.append("discount_amount", discountAmount ? discountAmount : "");
    data.append("total_amount", totalAmount);
    const params = {
      id: id ? id : "",
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
          toast.success(response.data.message);
          setTimeout(() => {
            history.push("/salelist");
          }, 2000);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleMouseEnter = (e) => {
    const hoveredRow = e.currentTarget;
    setHighlightedRowId(hoveredRow);
  };

  const handleTableKeyDown = (e) => {
    const rows = Array.from(
      tableRef.current?.querySelectorAll("tr.cursor-pointer") || []
    );
    let currentIndex = rows.findIndex((row) => row === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (rows.length > 0) {
        const nextIndex = currentIndex + 1 < rows.length ? currentIndex + 1 : 0;
        rows[nextIndex]?.focus();
        setHighlightedRowId(rows[nextIndex]?.dataset.id);
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (rows.length > 0) {
        const prevIndex =
          currentIndex - 1 >= 0 ? currentIndex - 1 : rows.length - 1;
        rows[prevIndex]?.focus();
        setHighlightedRowId(rows[prevIndex]?.dataset.id);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0 && rows[currentIndex]) {
        const itemId = rows[currentIndex].getAttribute("data-id");
        const item = batchListData.find(
          (item) => String(item.id) === String(itemId)
        );
        if (item) {
          handlePassData(item);
          setHighlightedRowId(itemId);
        }
      }
    }
  };

  useEffect(() => {
    if (isVisible && tableRef.current) {
      const firstRow = tableRef.current.querySelector("tr.cursor-pointer");
      if (firstRow) {
        firstRow.focus();
        setHighlightedRowId(firstRow.getAttribute("data-id"));
      }
    }
  }, [isVisible, batchListData]);

  // Focus and scroll selected row into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].focus();
      rowRefs.current[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, saleAllData?.sales_item?.length]);

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
            className="p-6"
            style={{
              // backgroundColor: "rgb(240, 240, 240)",
              height: "calc(100vh - 225px)",
              overflow: "auto",
            }}
          >
            <div>
              <div
                className="header_sale_divv"
                style={{ display: "flex", gap: "4px", alignItems: "center", marginBottom: "15px" }}
              >
                <div
                  style={{ display: "flex", gap: "7px", alignItems: "center" }}
                >
                  <span
                    style={{
                      color: "var(--color2)",
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
                  <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                </div>
                <div className="headerList">
                  <input
                    labelId="dropdown-label"
                    id="dropdown"
                    value={location.state.paymentType}
                    disabled
                    size="small"
                    className="Payment_Value payment_divv"
                    style={{ minHeight: "2.4375em" }}
                  ></input>

                  <input
                    labelId="dropdown-label"
                    id="dropdown"
                    value={pickup}
                    className="Payment_Value payment_divv"
                    disabled
                    size="small"
                    style={{ minHeight: "2.4375em" }}
                  ></input>
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      background: "var(--color1)",
                    }}
                    className="payment_btn_divv"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Update
                  </Button>
                  {isOpen && (
                    <div className="absolute right-0 top-28 w-32 bg-white shadow-lg user-icon mr-4 ">
                      <ul className="transition-all ">
                        <li
                          onClick={() => {
                            setBillSaveDraft("1");
                            handleUpdate("1");
                          }}
                          className=" border-t border-l border-r border-[var(--color1)] px-4 py-2 cursor-pointer text-base font-medium flex gap-2 hover:text-[white] hover:bg-[var(--color1)] flex  justify-around"
                        >
                          <SaveIcon />
                          Save
                        </li>
                        <li
                          onClick={() => {
                            setBillSaveDraft("0");
                            handleUpdate("0");
                          }}
                          className="border border-[var(--color1)] px-4 py-2 cursor-pointer text-base font-medium flex gap-2 hover:text-[white] hover:bg-[var(--color1)] flex  justify-around"
                        >
                          <SaveAsIcon />
                          Draft
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="row border-b px-4 border-dashed"
                style={{ borderColor: "var(--color2)" }}
              ></div>
              <div className="border-b mt-4">
                <div className="firstrow flex gap-y-4">
                  <div className="detail custommedia">
                    <span
                      className="heading mb-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "var(--color1)",
                      }}
                    >
                      Bill No
                    </span>
                    <TextField
                      id="outlined-number"
                      type="number"
                      size="small"
                      value={saleAllData.bill_no}
                      placeholder="Bill No"
                      sx={{ width: "250px" }}
                      disabled
                    />
                  </div>
                  <div className="detail custommedia">
                    <span
                      className="heading mb-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "var(--color1)",
                      }}
                    >
                      Bill Date
                    </span>
                    <TextField
                      id="outlined-number"
                      size="small"
                      value={saleAllData.bill_date || ""}
                      placeholder="Bill Date"
                      sx={{ width: "250px" }}
                      disabled
                    />
                  </div> 
                  <div
                    className="detail custommedia"
                    style={{
                      width: "100%",
                    }}
                  >
                    <span
                      className="heading mb-2 title"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "var(--color1)",
                        width: "90%",
                      }}
                    >
                      Customer Mobile / Name
                    </span>
                    <Autocomplete
                      value={customer} // Ensure `customer` is a valid object from `customerDetails`.
                      options={customerDetails}
                      onChange={handleCustomerOption}
                      getOptionLabel={(option) =>
                        option.name
                          ? `${option.name} [${option.phone_number}] [${option.roylti_point}]`
                          : option.phone_number || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      disabled
                      sx={{
                        width: "100%",
                        // minWidth: {
                        //   xs: "320px",
                        //   sm: "400px",
                        // },
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
                            primary={`${option.name}`}
                            secondary={`Mobile No: ${option.phone_number} | Loyalty Point: ${option.roylti_point}`}
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
                            style: { height: 40 },
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
                  <div className="detail custommedia" style={{ width: "100%" }}>
                    <span
                      className="heading mb-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "var(--color1)",
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
                      disabled
                      sx={{
                        width: "100%",
                        // minWidth: {
                        //   xs: "320px",
                        //   sm: "400px",
                        // },
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
                            style: { height: 40 },
                          }}
                          disabled
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
                  <div className="detail custommedia">
                    <span
                      className="heading mb-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        color: "var(--color1)",
                      }}
                    >
                      scan barcode
                    </span>
                    <TextField
                      id="outlined-number"
                      type="number"
                      size="small"
                      value={barcode}
                      placeholder="scan barcode"
                      sx={{ width: "250px" }}
                      onChange={(e) => {
                        setBarcode(e.target.value);
                        localStorage.setItem("unsavedItems", "true");
                      }}
                    />
                  </div>

                  {/* {value && */}
                  <div className="scroll-two">
                    <table className="saleTable">
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid lightgray", 
                          }}
                        >
                          <th className="w-1/4">Item Name</th>
                          <th>Unit </th>
                          <th>Batch </th>
                          <th>Expiry</th>
                          <th>MRP</th>
                          <th>Base</th>
                          <th>GST% </th>
                          <th>QTY </th>
                          <th>
                            <div
                              style={{ display: "flex", flexWrap: "nowrap" }}
                            >
                              Order
                              <Tooltip title="Please Enter only (o)" arrow>
                                <Button style={{ justifyContent: "left" }}>
                                  <GoInfo
                                    className="absolute"
                                    style={{ fontSize: "1rem" }}
                                  />
                                </Button>
                              </Tooltip>
                            </div>
                          </th>
                          <th>Loc.</th>
                          <th>Amount </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid lightgray" }}>
                          <td>
                            {/* <DeleteIcon
                              className="delete-icon"
                              onClick={resetValue}
                            />
                            {searchItem} */}
                            <div
                              className="search_fld_divv"
                              style={{ width: "100%" }}
                            >
                              <table
                                style={{ maxWidth: "100%", width: "100%" }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      flex: "1 1 auto",

                                      width: "100%",
                                      background: "#ffffff",
                                      borderRadius: "7px",
                                    }}
                                  >
                                    <Autocomplete
                                      value={selectedOption}
                                      size="small"
                                      onChange={handleOptionChange}
                                      onInputChange={handleInputChange}
                                      getOptionLabel={(option) =>
                                        `${option.iteam_name} `
                                      }
                                      options={itemList}
                                      renderOption={(props, option) => (
                                        <ListItem {...props}>
                                          <ListItemText
                                            // primary={`${option.iteam_name} - ${option.stock}`}
                                            // secondary={`weightage: ${option.weightage}`}
                                            primary={`${option.iteam_name},(${option.company})`}
                                            secondary={`Stock:${option.stock}, ₹:${option.mrp},Location:${option.location}`}
                                            // secondary={
                                            //   <>
                                            //     <span>Stock: <strong style={{ color: 'black' }}>{option.stock || 0}</strong>, </span>
                                            //     ₹: {option.mrp || 0},
                                            //     <span>Location: <strong style={{ color: 'black' }}>{option.location || 'N/A'}</strong></span>
                                            //   </>
                                            // }
                                            sx={{
                                              "& .MuiTypography-root": {
                                                fontSize: "1.1rem",
                                              },
                                            }}
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
                                            style: { height: 40 },
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <SearchIcon
                                                  sx={{
                                                    color: "var(--color1)",
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </InputAdornment>
                                            ),
                                          }}
                                          sx={{
                                            "& .MuiInputBase-input::placeholder":
                                              {
                                                fontSize: "1rem",
                                                color: "black",
                                              },
                                          }}
                                        />
                                      )}
                                    />
                                  </Box>
                                </Box>
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
                                    id="tempId"
                                  >
                                    <div
                                      className="custom-scroll-sale "
                                      style={{ width: "100%" }}
                                      tabIndex={0}
                                      onKeyDown={handleTableKeyDown}
                                      ref={tableRef}
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
                                                  className={`cursor-pointer saleTable custom-hover ${
                                                    highlightedRowId ===
                                                    String(item.id)
                                                      ? "highlighted-row"
                                                      : ""
                                                  }`}
                                                  key={item.id}
                                                  data-id={item.id}
                                                  tabIndex={0}
                                                  style={{
                                                    border:
                                                      "1px solid rgba(4, 76, 157, 0.1)",
                                                    padding: "10px",
                                                    outline: "none",
                                                  }}
                                                  onClick={() =>
                                                    handlePassData(item)
                                                  }
                                                  onMouseEnter={
                                                    handleMouseEnter
                                                  }
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
                            </div>
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              disabled
                              type="number"
                              size="small"
                              value={unit}
                              sx={{ width: "130px" }}
                              onChange={(e) => {
                                setUnit(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              sx={{ width: "130px" }}
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
                              sx={{ width: "130px" }}
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
                              sx={{ width: "130px" }}
                              size="small"
                              value={mrp}
                              onChange={(e) => {
                                setMRP(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              sx={{ width: "130px" }}
                              size="small"
                              value={base}
                              onChange={(e) => {
                                setBase(e.target.value);
                                localStorage.setItem("unsavedItems", "true");
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              type="number"
                              disabled
                              size="small"
                              sx={{ width: "130px" }}
                              value={gst}
                              onChange={(e) => {
                                setGst(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              sx={{ width: "130px" }}
                              size="small"
                              value={qty}
                              onKeyDown={(e) => {
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  e.key !== "Backspace"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                handleQty(e.target.value);
                                localStorage.setItem("unsavedItems", "true");
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: "right" } },
                                disableUnderline: true,
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              autoComplete="off"
                              id="outlined-number"
                              sx={{ width: "130px" }}
                              size="small"
                              value={order}
                              onChange={handleChange}
                              onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                  await addSaleItem();
                                }
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              id="outlined-number"
                              size="small"
                              disabled
                              sx={{ width: "130px" }}
                              value={loc}
                              onChange={(e) => {
                                setLoc(e.target.value);
                              }}
                            />
                          </td>
                          <td className="total">{itemAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                    <>
                      <table
                        className="p-30 w-full border-collapse custom-table"
                        ref={tableRef}
                        tabIndex={0}
                        style={{ background: "#F5F5F5", padding: "10px 15px" }}
                        onKeyDown={(e) => {
                          const rows = saleAllData?.sales_item || [];
                          if (!rows.length) return;
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setSelectedIndex((prev) => Math.min((prev === -1 ? 0 : prev + 1), rows.length - 1));
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setSelectedIndex((prev) => Math.max((prev === -1 ? 0 : prev - 1), 0));
                          } else if (e.key === "Enter" && selectedIndex !== -1) {
                            e.preventDefault();
                            const selectedRow = rows[selectedIndex];
                            if (selectedRow) {
                              handleEditClick(selectedRow);
                            }
                          }
                        }}
                        onBlur={() => setSelectedIndex(-1)}
                      >
                        <tbody>
                          <tr>
                            <td></td>
                          </tr>
                          {saleAllData?.sales_item?.map((item, index) => (
                            <tr
                              key={item.id}
                              ref={el => rowRefs.current[index] = el}
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => {
                                setSelectedIndex(index);
                                handleEditClick(item);
                              }}
                              className={`item-List cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`}
                              tabIndex={-1}
                              onFocus={() => setSelectedIndex(index)}
                            >
                              <td
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <BorderColorIcon
                                  style={{ color: "var(--color1)" }}
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(item);
                                  }}
                                />

                                <DeleteIcon
                                  className="delete-icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOpen(item.id);
                                  }}
                                />
                                {item.iteam_name}
                              </td>
                              <td>{item.unit}</td>
                              <td>{item.batch}</td>
                              <td>{item.exp}</td>
                              <td>{item.mrp}</td>
                              <td>{item.base}</td>
                              <td>{item.gst_name}</td>
                              <td>{item.qty}</td>
                              <td>{item.order}</td>
                              <td>{item.location}</td>
                              <td>{item.net_rate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=""
              style={{
                background: "var(--color1)",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                width: "100%",
                bottom: "0",
                left: "0",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: "0",
                  overflow: "auto",
                  padding: "20px",
                  color: "white",
                }}
              >
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total GST : </label>

                  <span style={{ fontWeight: 600 }}>₹{totalgst} </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Base : </label>
                  <span style={{ fontWeight: 600 }}> {totalBase} </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Profit : </label>
                  <span style={{ fontWeight: 600 }}>
                    ₹{marginNetProfit} ({Number(margin).toFixed(2)}%){" "}
                  </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Net Rate : </label>
                  <span style={{ fontWeight: 600 }}>₹{netRateAmount} </span>
                </div>
              </div>
              <hr
                style={{
                  opacity: 0.5,
                  position: "sticky",
                  left: "0",
                  width: "100%",
                }}
              />

              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  whiteSpace: "nowrap",
                  alignItems: "baseline",
                  overflow: "auto",
                  padding: "20px",
                }}
              >
                <div
                  className=""
                  style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                    left: "0",
                    color: "white",
                  }}
                >
                  <div
                    className="gap-2 invoice_total_fld"
                    style={{ display: "flex" }}
                  >
                    <label className="font-bold">Today Points : </label>
                    {todayLoyltyPoint || 0}
                  </div>
                  <div
                    className="gap-2 invoice_total_fld"
                    style={{ display: "flex" }}
                  >
                    <label className="font-bold">Previous Points : </label>
                    {/* {previousLoyaltyPoints || 0} */}
                    {Math.max(0, previousLoyaltyPoints - loyaltyVal) || 0}
                  </div>
                  <div
                    className="gap-2 invoice_total_fld"
                    style={{ display: "flex" }}
                  >
                    <label className="font-bold">Redeem : </label>
                    <Input
                      type="number"
                      value={loyaltyVal}
                      // onChange={(e) => { setLoyaltyVal(e.target.value) }}
                      onChange={(e) => {
                        const value = e.target.value;

                        const numericValue = Math.floor(Number(value));
                        const maxAllowedPoints = Math.min(
                          previousLoyaltyPoints,
                          totalAmount
                        );

                        if (
                          numericValue >= 0 &&
                          numericValue <= maxAllowedPoints
                        ) {
                          setLoyaltyVal(numericValue);
                        } else if (numericValue < 0) {
                          setLoyaltyVal(0);
                        }
                      }}
                      onKeyPress={(e) => {
                        const value = e.target.value;
                        const isMinusKey = e.key === "-";

                        if (!/[0-9.-]/.test(e.key) && e.key !== "Backspace") {
                          e.preventDefault();
                        }

                        if (isMinusKey && value.includes("-")) {
                          e.preventDefault();
                        }
                      }}
                      size="small"
                      style={{
                        width: "70px",
                        background: "none",
                        borderBottom: "1px solid gray",
                        justifyItems: "end",
                        outline: "none",
                        color: "white",
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "35px",
                        },
                        "& .MuiInputBase-input": { textAlign: "end" },
                      }}
                    />
                    {/* {previousLoyaltyPoints} */}
                  </div>
                </div>

                <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                  <div
                    className="gap-2 "
                    onClick={toggleModal}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "white",
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
                      {Number(netAmount).toFixed(2)}
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
                        <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                      </div>
                      <div
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="font-bold">Discount(%) : <span className="text-red-600">*</span></label>
                        <Input
                          type="number"
                          // className="mt-2"
                          value={finalDiscount}
                          onChange={(e) => {
                            let newValue = e.target.value;

                            if (newValue > 100) {
                              setFinalDiscount(100);
                            } else if (newValue >= 0) {
                              setFinalDiscount(newValue);
                            }
                            setUnsavedItems(true);
                            localStorage.setItem("RandomNumber", randomNumber);
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/[0-9.]/.test(e.key) &&
                              e.key !== "Backspace"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          size="small"
                          style={{
                            width: "70px",
                            background: "none",
                            //  borderBottom: "1px solid gray",
                            outline: "none",
                            justifyItems: "end",
                            alignItems: "center",
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                            "& .MuiInputBase-input": { textAlign: "end" },
                          }}
                        />
                      </div>
                      <div
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="font-bold">Other Amount : <span className="text-red-600">*</span></label>
                        <Input
                          type="number"
                          value={tempOtherAmt || otherAmt}
                          onChange={handleOtherAmtChange}
                          onKeyPress={(e) => {
                            const value = e.target.value;
                            const isMinusKey = e.key === "-";

                            // Allow Backspace and numeric keys
                            if (
                              !/[0-9.-]/.test(e.key) &&
                              e.key !== "Backspace"
                            ) {
                              e.preventDefault();
                            }

                            // Allow only one '-' at the beginning of the input value
                            if (isMinusKey && value.includes("-")) {
                              e.preventDefault();
                            }
                          }}
                          size="small"
                          style={{
                            width: "70px",
                            background: "none",
                            // borderBottom: "1px solid gray",
                            outline: "none",
                            justifyItems: "end",
                            alignItems: "center",
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                            "& .MuiInputBase-input": { textAlign: "end" },
                          }}
                        />
                      </div>
                      <div
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="font-bold">
                          Loyalty Points Redeem:{" "}
                        </label>
                        <span>{loyaltyVal || 0}</span>
                      </div>
                      <div
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingBottom: "5px",
                        }}
                      >
                        <label className="font-bold">Discount Amount : </label>
                        <span>
                          {discountAmount !== 0 && (
                            <span>
                              {discountAmount > 0
                                ? `-${discountAmount}`
                                : discountAmount}
                            </span>
                          )}
                        </span>
                      </div>

                      <div
                        className=""
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
                        <span>{!roundOff ? 0 : roundOff}</span>
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
                          {" "}
                          {Number(netAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
            {/* Delete PopUP */}
            <div
              id="modal"
              value={IsDelete}
              className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${
                IsDelete ? "block" : "hidden"
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
                    onClick={() => {
                      handleDeleteItem(saleItemId);
                      setUnsavedItems(true);
                    }}
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
        when={unsavedItems}
        message={(location) => {
          handleNavigation(location.pathname);
          setOpenModal(true);
          return false;
        }}
      />
      <div
        id="modal"
        value={openModal}
        style={{ zIndex: 9999 }}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${
          openModal ? "block" : "hidden"
        }`}
      >
        <div />
        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <div className="my-4 logout-icon">
            <VscDebugStepBack
              className=" h-12 w-14"
              style={{ color: "#628A2F" }}
            />
            <h4
              className="text-lg font-semibold mt-6 text-center"
              style={{ textTransform: "none" }}
            >
              Are you sure you want to leave this page ?
            </h4>
          </div>

          <div className="flex gap-5 justify-center">
            <button
              type="submit"
              className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none primary-bg hover:primary-bg active:primary-bg"
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
