import Header from "../../../Header";
import "../Add-PurchaseBill/AddPurchasebill.css";
import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {
  Button,
  InputAdornment,
  ListItem,
  ListItemText,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";
import { Modal } from "flowbite-react";
import { FaCaretUp } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const EditPurchaseBill = () => {
  const [ItemPurchaseList, setItemPurchaseList] = useState({ item: [] });
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [distributor, setDistributor] = useState(null);
  const [billNo, setbillNo] = useState("");
  // const [dueDate, setDueDate] = useState(dayjs().add(15, 'day'));
  // const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dueDate, setDueDate] = useState(addDays(new Date(), 15));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(1);
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [error, setError] = useState({ distributor: "", billNo: "" });
  const [expiryDate, setExpiryDate] = useState("");
  const [mrp, setMRP] = useState(null);
  const [ptr, setPTR] = useState(null);
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [deleteAll, setDeleteAll] = useState(false);
  const [free, setFree] = useState("");
  const [loc, setLoc] = useState("");
  const [unit, setUnit] = useState("");
  const [HSN, setHSN] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [ItemTotalAmount, setItemTotalAmount] = useState("");
  const [margin, setMargin] = useState("");
  const [disc, setDisc] = useState("");
  const [base, setBase] = useState("");
  const [gst, setGst] = useState();
  const [batch, setBatch] = useState("");
  const [gstList, setGstList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const userId = localStorage.getItem("userId");
  const [netRate, setNetRate] = useState("");
  const [IsDelete, setIsDelete] = useState(false);
  const [srNo, setSrNo] = useState("");
  const [ItemId, setItemId] = useState("");
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [itemEditID, setItemEditID] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [distributorList, setDistributorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("credit");
  const [bankData, setBankData] = useState([]);
  const [header, setHeader] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseReturnPending, setPurchaseReturnPending] = useState([]);
  // const [finalPurchaseReturnList, setFinalPurchaseReturnList] = useState([]);
  const [cnTotalAmount, setCnTotalAmount] = useState({});
  const [checkboxDisabled, setCheckboxDisabled] = useState(true);
  const [cnAmount, setCnAmount] = useState(0);
  const [disabledRows, setDisabledRows] = useState({});
  const [inputDisabled, setInputDisabled] = useState(true);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [finalCnAmount, setFinalCnAmount] = useState(0);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [roundOffAmount, setRoundOffAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [barcode, setBarcode] = useState("");
  const [batchListData, setBatchListData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [purchase, setPurchase] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  let debounceTimeout;

  /*<=============================================================================== Input ref on keydown enter ======================================================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const tableRef = useRef(null); // Reference for table container

  const inputRefs = useRef([]);
  const submitButtonRef = useRef(null);
  const addButtonref = useRef(null);

  /*<================================================================ disable autocomplete to focus when tableref is focused  =======================================================> */

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

  /*<================================================================ disable autocomplete to focus when tableref is focused  =======================================================> */

  useEffect(() => {
    const handleKeyPress = (e) => {
      const activeList = purchase?.item_list ?? [];

      if (!activeList.length) return;

      const key = e.key;

      // Prevent keyboard control if any input is focused
      const isInputFocused = inputRefs.current.some(
        (input) => input && document.activeElement === input
      );
      if (isInputFocused) return;

      if (key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < activeList.length - 1 ? prev + 1 : prev
        );

      } else if (key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (key === "Enter" && selectedIndex !== -1) {
        e.preventDefault();
        const selectedRow = activeList[selectedIndex];
        if (!selectedRow) return;

        setSelectedEditItemId(selectedRow.id);
        handleEditClick(selectedRow);

        setTimeout(() => {
          if (inputRefs.current[1]) {
            inputRefs.current[1].focus(); // Focus item name
          }
        }, 150);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedIndex, purchase?.item_list]);

  /*<================================================================================== handle shortcut  =========================================================================> */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.altKey) return; // Exit early if Alt is not pressed

      event.preventDefault(); // Prevent default browser behavior

      if (event.key.toLowerCase() === "s") {
        handleSubmit("1");
      } else if (event.key.toLowerCase() === "g") {

        handleSubmit("0");
      } else if (event.key.toLowerCase() === "m") {

        removeItem();
        setIsEditMode(false);
        setSelectedIndex(-1);
        setSearchItem("");
        setValue(null);
        setSelectedOption(null);
        // clear Autocomplete selected option
        setAutocompleteKey(prevKey => prevKey + 1);

        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 50);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [distributor, billNo, ItemPurchaseList]); // Dependencies only affect Alt+S

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus(); // Move to next input
      }
    }
  };

  const [errors, setErrors] = useState({});
  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);

  const { id, randomNumber } = useParams();
  // const {  } = useParams();

  useEffect(() => {
    const initialize = async () => {
      try {
        await handleLeavePage();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const total = Object.values(cnTotalAmount)
      .map((amount) => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setCnAmount(total);
  }, [cnTotalAmount]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleBarcode();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [barcode]);
  /*<===================================================================================== get distributor list ===========================================================================> */

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

      return distributors;
    } catch (error) {
      console.error("API Error fetching distributors:", error);
      return [];
    }
  };

  /*<===================================================================================== get Bank list ===========================================================================> */

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
  /*<============================================================================== get purchase bill by ID ====================================================================> */

  const purchaseBillGetByID = async (distributors) => {
    setPurchase("");
    let data = new FormData();
    data.append("id", id);
    data.append("random_number", randomNumber);
    data.append("net_amount", netAmount);

    const params = {
      id: id,
      random_number: randomNumber,
    };
    setIsLoading(true);
    try {
      const response = await axios.post("purches-edit-data?", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const purchaseData = response?.data?.data;

      setPurchase(purchaseData);
      setNetAmount(response?.data?.data.net_amount);

      if (purchaseData) {
        // const foundDistributor = distributors.find(option => option.id === purchaseData.distributor_id);
        const foundDistributor = distributors.find((option) => {
          return option.id == purchaseData.distributor_id;
        });

        if (foundDistributor) {
          setDistributor(foundDistributor);
        } else {
          console.warn(
            "Distributor not found for ID: ",
            purchaseData.distributor_id
          );
        }
        setbillNo(purchaseData?.bill_no || "");
        setSrNo(purchaseData?.sr_no || "");
        setSelectedDate(
          purchaseData?.bill_date ? purchaseData.bill_date : null
        );
        setDueDate(purchaseData?.due_date ? purchaseData?.due_date : null);
        // setCnAmount(purchase?.cn_amount || "")
        setFinalCnAmount(purchaseData?.cn_amount || "");
        setFinalTotalAmount(purchaseData?.total_amount || "");
        handleCalNetAmount(purchaseData?.net_amount || "");
        setRoundOffAmount(purchaseData?.round_off || "");
        // setCnTotalAmount(purchaseData?.cn_amount ? purchaseData.cn_amount : null)
      }
      setIsLoading(false);
    } catch (error) {
      console.error("API error fetching purchase data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const defaultSelectedRows =
      purchase?.cn_bill_list?.map((row) => row.id) || [];
    setSelectedRows(defaultSelectedRows);

    const initialDisabledRows = purchase?.cn_bill_list?.reduce((acc, row) => {
      acc[row.id] = true; // Set all rows as disabled initially
      return acc;
    }, {});
    setDisabledRows(initialDisabledRows);
  }, [purchase]);

  useEffect(() => {
    // Call API initially when the component mounts
    // handlePopState();

    // Listen to route changes
    const unlisten = history.listen((location, action) => {
      // Call API when route changes
      handlePopState();
    });

    // Clean up the listener on component unmount
    return () => {
      unlisten();
    };
  }, [history]); // Dependencies: history object
  /*<======================================================================== get essntial details intially  ==============================================================> */

  useEffect(() => {
    const initializeData = async () => {
      const distributors = await listDistributor();
      await purchaseBillGetByID(distributors);
    };
    BankList();
    initializeData();
    listOfGst();
    // listOfHistory()
  }, [id]);
  /*<=============================================================================== caculation =======================================================================> */

  useEffect(() => {
    if (!qty || !ptr || !disc || !gst || !free) {
      console.warn("One or more dependencies are undefined");
      return;
    }
    /*<===================================================================== Calculate discount ==========================================================================> */

    const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
    setSchAmt(totalSchAmt);

    /*<===================================================================== Calculate totalBase ==========================================================================> */

    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setItemTotalAmount(0);
    setBase(totalBase);

    /*<====================================================================== Calculate totalAmount =======================================================================> */
    const totalAmount = parseFloat(
      (totalBase + (totalBase * gst) / 100).toFixed(2)
    );
    if (totalAmount) {
      setItemTotalAmount(totalAmount);
    } else {
      setItemTotalAmount(0);
    }

    /*<================================================================================= Net Rate calculation ==============================================================> */

    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    const netRate = parseFloat(
      (totalAmount / (numericQty + numericFree)).toFixed(2)
    );
    setNetRate(netRate);

    /*<============================================================================= Margin calculation =====================================================================> */

    const margin = parseFloat((((mrp - netRate) / mrp) * 100).toFixed(2));
    setMargin(margin);
  }, [qty, ptr, disc, gst, free, ItemTotalAmount]);

  // Call the combined function when you want to initiate the data fetching
  useEffect(() => {
    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);

      setHSN(selectedEditItem.hsn_code);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty || 0);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(selectedEditItem.gst_name);
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  }, [selectedEditItem]);

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

  /*<====================================================================== get essntial details intially  ============================================================> */

  const handlePopState = () => {
    // Call the delete API
    let data = new FormData();
    const params = {
      random_number: randomNumber,
    };
    try {
      const res = axios
        .post("purches-histroy?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  /*<======================================================================== get essntial details intially  ==============================================================> */

  const purchaseReturnData = async () => {
    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    try {
      await axios
        .post("purchase-return-pending-bills", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseReturnPending(response.data.data);
          // setCnTotalAmount(response.data.data.total_amount)

          // toast.success(response.data.message);
        });
    } catch (error) {
      // setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  /*<=============================================================================== get list of gst  =====================================================================> */

  let listOfGst = () => {
    axios
      .get("gst-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGstList(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
        setUnsavedItems(false);
      });
  };
  // let listOfHistory = () => {
  //   axios
  //     .post("purches-histroy", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setHistoryList(response.data.data);
  //     })
  //     .catch((error) => {

  //     });
  // };

  /*<============================================================================== get list of gst  ====================================================================> */

  const itemPurchaseList = async () => {
    let data = new FormData();
    const params = {
      random_number: randomNumber,
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
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };
  const deleteOpen = (Id) => {
    setIsDelete(true);
    setItemId(Id);
    setUnsavedItems(true);
  };
  /*<================================================================= get batch list to select item while add  ============================================================> */

  const batchList = async (id) => {
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
            setHSN(batchData[0].HSN);
            setExpiryDate(batchData[0].expiry_date);
            setMRP(batchData[0].mrp);
            setQty(batchData[0].purchase_qty);
            setFree(batchData[0].purchase_free_qty);
            setPTR(batchData[0].ptr);
            setDisc(batchData[0].discount);
            setLoc(batchData[0].location);
            setGst(batchData[0].gst_name);
            // setUnit()
          } else {
            setUnit("");
            setBatch("");
            setHSN("");
            setExpiryDate("");
            setMRP("");
            setQty("");
            setFree("");
            setPTR("");
            setDisc("");
            setLoc("");
            setGst("");
          }
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };


  /*<================================================================= update purchase item  ============================================================> */

  const addPurchaseValidation = async () => {
    const newErrors = {};
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    if (numericQty === 0 && numericFree === 0) {
      toast.error("Free and Qty cannot both be 0");
      newErrors.qty = "Free and Qty cannot both be 0";
    }
    if (!unit) {
      newErrors.unit = "Unit is required";
      toast.error(newErrors.unit);
    }

    if (!batch) {
      newErrors.batch = "Batch is required";
      toast.error(newErrors.batch);
    }

    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
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
    if (!mrp) newErrors.mrp = "MRP is required";
    if (!ptr) {
      newErrors.ptr = "PTR is required";
    } else if (ptr && parseFloat(ptr) > parseFloat(mrp)) {
      newErrors.ptr = "PTR must be less than or equal to MRP";
      toast.error("PTR must be less than or equal to MRP");
    }

    if (!gst) {
      newErrors.gst = "GST is required";
      toast.error(newErrors.gst);
    }
    if (!searchItem) {
      toast.error("Please Select any Item Name");
      newErrors.searchItem = "Select any Item Name";
    }
    if (!ItemTotalAmount) {
      toast.error("Total amount is not available");
      newErrors.searchItem = "Total amount is not available";
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
    if (isSubmitting) return; // ⛔ Block if already submitting
      else{
      await handleEditItem(); // Call handleEditItem if validation passes

      }
    }
    return isValid;
  };
  const handleNavigation = (path) => {
    setOpenAddPopUp(false);
    setIsOpenBox(true);
    setNextPath(path);
  };
  const handleEditItem = async () => {
    if (isSubmitting) return false; // Prevent double submissions
    setIsSubmitting(true); // Lock

    setUnsavedItems(true);

    const gstMapping = {
      28: 6,
      18: 4,
      12: 3,
      5: 2,
      0: 1,
    };

    let data = new FormData();
    data.append("user_id", userId);
    if (isEditMode == true) {
      data.append("item_id", selectedEditItemId);
      // data.append("unit_id", value?.unit_id);
    } else {
      if (barcode) {
        data.append("item_id", ItemId);
        data.append("unit_id", Number(0));
      } else {
        data.append("item_id", value?.id);
        data.append("unit_id", value?.unit_id);
      }
    }
    data.append("unit_id", unit);
    data.append("hsn_code", HSN);
    data.append("random_number", randomNumber);
    data.append("unit", !unit ? 0 : unit);
    data.append("batch_number", !batch ? 0 : batch);
    data.append("expiry", !expiryDate ? 0 : expiryDate);
    data.append("mrp", !mrp ? 0 : mrp);
    data.append("qty", !qty ? 0 : qty);
    data.append("free_qty", !free ? 0 : free);
    data.append("ptr", !ptr ? 0 : ptr);
    data.append("discount", !disc ? 0 : disc);
    data.append("scheme_account", !schAmt ? 0 : schAmt);
    data.append("base_price", !base ? 0 : base);
    data.append("gst", gstMapping[gst] ?? gst);
    data.append("location", !loc ? 0 : loc);
    data.append("margin", !margin ? 0 : margin);
    data.append("net_amount", !netAmount ? 0 : netAmount);
    data.append("cn_amount", !finalCnAmount ? 0 : finalCnAmount);
    data.append("net_rate", !netRate ? 0 : netRate);
    data.append("total_amount", !ItemTotalAmount ? 0 : ItemTotalAmount);
    data.append("weightage", !unit ? 0 : unit);
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
        : // Add record
        await axios.post("item-purchase", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setDeleteAll(true);
      itemPurchaseList();
      purchaseBillGetByID();
      setSearchItem("");
      setAutocompleteDisabled(false);
      setUnit("");
      setHSN("");
      setBatch("");
      setExpiryDate("");
      setMRP("");
      setQty("");
      setFree("");
      setPTR("");
      setGst("");
      setDisc("");
      setBase("");
      setNetRate("");
      setSchAmt("");
      setBatch("");
      setMargin("");
      setLoc("");
      setBarcode("");
      if (ItemTotalAmount <= finalCnAmount) {
        setFinalCnAmount(0);
        setSelectedRows([]);
        setCnTotalAmount({});
      }
      // handleCalNetAmount()
      setItemTotalAmount(0);
      setIsEditMode(false);
      setSelectedEditItemId(null);
      setIsSubmitting(false);

    } catch (e) {
      console.error("API error:", error);
      setUnsavedItems(false);
      setIsSubmitting(false);

    }
  };

  const LogoutClose = () => {
    setIsOpenBox(false);
    // setPendingNavigation(null);
  };
  /*<============================================================================= leave page =====================================================================> */

  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("start_date", localStorage.getItem("StartFilterDate"));
    data.append("end_date", localStorage.getItem("EndFilterDate"));
    data.append("distributor_id", localStorage.getItem("DistributorId"));
    data.append("type", "1");
    try {
      const response = await axios.post("purches-histroy", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      // history.replace(nextPath);
    } catch (error) {
      console.error("Error deleting items:", error);
      setUnsavedItems(false);
    }
  };
  /*<============================================================================= barcode =====================================================================> */

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
          setHSN(response?.data?.data[0]?.batch_list[0]?.hsn_code);
          setBatch(response?.data?.data[0]?.batch_list[0]?.batch_name);
          setExpiryDate(response?.data?.data[0]?.batch_list[0]?.expiry_date);
          setMRP(response?.data?.data[0]?.batch_list[0]?.mrp);
          setQty(response?.data?.data[0]?.batch_list[0]?.purchase_qty);
          setFree(response?.data?.data[0]?.batch_list[0]?.purchase_free_qty);
          setPTR(response?.data?.data[0]?.batch_list[0]?.ptr);
          setDisc(response?.data?.data[0]?.batch_list[0]?.discount);
          setSchAmt(response?.data?.data[0]?.batch_list[0]?.scheme_account);
          setBase(response?.data?.data[0]?.batch_list[0]?.base);
          setGst(response?.data?.data[0]?.batch_list[0]?.gst_name);
          setLoc(response?.data?.data[0]?.batch_list[0]?.location);
          setMargin(response?.data?.data[0]?.batch_list[0]?.margin);
          setNetRate(response?.data?.data[0]?.batch_list[0]?.net_rate);
          setSearchItem(response?.data?.data[0]?.batch_list[0]?.iteam_name);

          setItemId(response?.data?.data[0]?.batch_list[0]?.item_id);

          setSelectedEditItemId(response?.data?.data[0]?.id);
          setItemEditID(response.data.data[0]?.id);

          // setIsEditMode(true)

          // handleAddBarcodeItem(data)
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };
  /*<============================================================================ expiry date validation =========================================================================> */

  const handleExpiryDate = (event) => {
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
  /*<================================================================= search  ============================================================> */

  const handleSearch = async () => {
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
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  /*<================================================================= delete item   ============================================================> */

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
          setUnsavedItems(true);

          itemPurchaseList();
          purchaseBillGetByID();
          setIsDelete(false);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  /*<================================================================= submit purchase bill   ============================================================> */
  const handleSubmit = (draft) => {
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
    updatePurchaseRecord(draft);
  };
  const updatePurchaseRecord = async (draft) => {
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
    data.append("payment_type", paymentType);
    data.append("total_amount", purchase.total_amount);
    data.append("net_amount", netAmount);
    data.append("total_margin", purchase.total_margin);
    data.append("total_gst", purchase?.total_gst);
    data.append("round_off", roundOffAmount);
    data.append("cn_amount", finalCnAmount);
    data.append("purches_data", JSON.stringify(purchase.item_list));
    data.append("draft_save", !draft ? "1" : draft);

    const params = {
      id: id,
    };
    try {
      await axios
        .post("purches-update", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("response", response?.data?.message);
          toast.success(response?.data?.message);
          setTimeout(() => {
            history.push("/purchase/purchasebill");
          }, 2000);
        });
    } catch (error) {
      toast.error(error.data.message);
      console.error("API error:", error);
    }
  };
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  /*<================================================================= update state    ============================================================> */

  const handleEditClick = (item) => {
    setAutocompleteKey((prevKey) => prevKey + 1);
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id);

    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);
      setHSN(selectedEditItem.HSN);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty || 0);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(selectedEditItem.gst_name);
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  };

  const handelAddOpen = () => {
    setUnsavedItems(true);

    setOpenAddPopUp(true);

    purchaseReturnData();
    setHeader("Add Amount");
  };
  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    // setCnAmount(0)
  };

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue);
    handleSearch(newInputValue);
    console.log(newInputValue, newInputValue, "itemName");

  };

  const handleOptionChange = (event, newValue) => {
    setValue(newValue);
    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);


    handleSearch(itemName);
  };

  useEffect(() => {
    if (value?.id) {
      batchList(value?.id);
    }
  }, [value]);

  const handlePTR = (e) => {
    const setptr = e.target.value;
    setPTR(setptr);
    setBase(setptr);
  };
  const isDateDisabled = (date) => {
    const today = new Date();
    // Set time to 00:00:00 to compare only date part
    today.setHours(0, 0, 0, 0);

    // Disable dates that are greater than today
    return date > today;
  };
  const handleSchAmt = (e) => {
    const inputDiscount =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    if (isNaN(inputDiscount)) {
      setDisc(0);
      setSchAmt(0);
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
    setValue("");
    setUnit("");
    setSearchItem("");
    setBatch("");
    setHSN("");
    setExpiryDate("");
    setMRP("");
    setQty("");
    setFree("");
    setPTR("");
    setGst("");
    setDisc("");
    setBase(0);
    setSchAmt(0);
    setIsEditMode(false);
    setBatch("");
    setNetRate(0);
    setMargin("");
    setLoc("");
    setItemTotalAmount("");
  };

  const handleRowSelect = (id, totalAmount) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);

    if (newSelectedRows.includes(id)) {
      // Enable the input field for the selected row
      setDisabledRows((prev) => ({ ...prev, [id]: false }));
      setCnTotalAmount((prev) => ({ ...prev, [id]: totalAmount }));
      setCnAmount((prev) => prev + parseFloat(totalAmount));
    } else {
      setCnTotalAmount((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setCnAmount(0);

      // Disable the input field for the deselected row
      setDisabledRows((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(purchase?.cn_bill_list?.map((row) => row.id));
      const updatedAmounts = purchase?.cn_bill_list?.reduce((acc, row) => {
        acc[row.id] = row.total_amount;
        return acc;
      }, {});
      setCnTotalAmount(updatedAmounts);
      setCnAmount(
        purchase?.cn_bill_list?.reduce(
          (acc, row) => acc + parseFloat(row.total_amount || 0),
          0
        )
      );
    } else {
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
    }
  };

  const handleSelectAllPending = (e) => {
    if (e.target.checked) {
      setSelectedRows(purchaseReturnPending.map((row) => row.id));
      const updatedAmounts = purchaseReturnPending.reduce((acc, row) => {
        acc[row.id] = row.total_amount;
        return acc;
      }, {});
      setCnTotalAmount(updatedAmounts);
      setCnAmount(
        purchaseReturnPending.reduce(
          (acc, row) => acc + parseFloat(row.total_amount || 0),
          0
        )
      );
    } else {
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
    }
  };

  const handleRowSelectPending = (id, totalAmount) => {
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

  const handleRevert = (rowId) => {
    // Clear selected rows
    setSelectedRows([]);

    setCheckboxDisabled(false);

    // Reset final CN amount
    setCnAmount(0);

    setCnTotalAmount((prev) => ({
      ...prev,
      [rowId]: 0,
    }));

    setInputDisabled(false);
  };
  const handleCalNetAmount = (net_amount) => {
    const adjustedTotalAmount = net_amount - finalCnAmount;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    let netAmountCal;
    let roundOffAmountCal;

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // round off
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
      newErrors.finalTotalAmount =
        "You cannot adjust CN more than the total invoice amount";
      toast.error("You cannot adjust CN more than the total invoice amount");
      setError(newErrors);
      setError(newErrors);
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
      return;
    }
    setFinalCnAmount(cnAmount);
    setUnsavedItems(true);
    // setNetAmount(finalTotalAmount - cnAmount)

    const decimalTotalAmount = finalTotalAmount - Math.floor(finalTotalAmount);
    const decimalCNAmount = cnAmount - Math.floor(cnAmount);

    setRoundOffAmount(decimalTotalAmount - decimalCNAmount);

    const adjustedTotalAmount = finalTotalAmount - cnAmount;

    let netAmountCal, roundOffAmountCal;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // Round up
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount); // Round down
    }

    roundOffAmountCal = netAmountCal - adjustedTotalAmount;

    // Update the states with the calculated values
    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);
    resetAddDialog();
  };
  /*<================================================================= ui   ============================================================> */

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
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div
          className="p-6"
          style={{
            height: "calc(-125px + 100vh)",
            overflow: "auto",
          }}
        >
          <div>
            <div
              className=" edit_purchs_pg pb-3"
              style={{ display: "flex", gap: "4px" }}
            >
              <div style={{ display: "flex", gap: "7px" }}>
                <span
                  style={{
                    color: "var(--color2)",
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
              <div className="headerList edt_purchase_fled">
                <Button
                  variant="contained"
                  color="primary"
                  className="cn_fls"
                  onClick={handelAddOpen}
                  style={{
                    textTransform: "none",
                    background: "var(--color1)",
                  }}
                >
                  <AddIcon className="mr-2" />
                  CN Adjust
                </Button>
                <Button
                  variant="contained"
                  className="cn_fls"
                  color="primary"
                  onClick={() => handleSubmit("1")}
                  style={{ background: "var(--color1)" }}
                >
                  Update
                </Button>
             
                
              </div>
            </div>
            <div
              className="row border-b border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
            <div className="border-b mt-4">
              <div className="firstrow flex">
                <div
                  className="detail custommedia"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span className="heading  mb-2">Distributor</span>
                  <Autocomplete
                    value={distributor}
                    disabled
                    sx={{
                      width: "350px",
                      minWidth: "350px",
                      "@media (max-width:600px)": {
                        minWidth: "250px",
                      },
                    }}
                    size="small"
                    onChange={(e, value) => setDistributor(value)}
                    options={distributorList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        {...params}
                        inputRef={(el) => (inputRefs.current[0] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 0)}
                      />
                    )}
                  />
                  {error.distributor && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {error.distributor}
                    </span>
                  )}
                </div>

                <div
                  className="detail custommedia"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                  }}
                >
                  <span className="heading  mb-2">Bill Date</span>
                  <DatePicker
                    sx={{
                      width: "250px",
                    }}
                    variant="outlined"
                    disabled
                    className="custom-datepicker_mn "
                    selected={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) => !isDateDisabled(date)}
                  />
                </div>

                <div
                  className="detail  custommedia"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                  }}
                >
                  <span className="heading  mb-2">Due Date</span>
                  <DatePicker
                    disabled
                    className="custom-datepicker_mn "
                    selected={dueDate}
                    onChange={(newDate) => setDueDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>
                <div
                  className="detail custommedia "
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                  }}
                >
                  <span className="heading  mb-2">Scan Barcode</span>

                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    id="outlined-number"
                    type="number"
                    size="small"
                    value={barcode}
                    placeholder="scan barcode"
                    sx={{ width: "100%" }}
                    onChange={(e) => {
                      setBarcode(e.target.value);
                    }}
                  />
                </div>

                <div className="overflow-x-auto w-full scroll-two">
                  <table className="customtable  w-full  border-collapse custom-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="flex justify-center items-center gap-2">
                            Search Item Name{" "}
                            <span className="text-red-600 ">*</span>
                            {/* <FaPlusCircle
                              className="primary cursor-pointer"
                              onClick={() => {
                                setOpenAddItemPopUp(true);
                              }}
                            /> */}
                          </div>
                        </th>
                        <th>
                          Unit <span className="text-red-600 ">*</span>
                        </th>
                        {/* <th>HSN</th> */}
                        <th>
                          Batch <span className="text-red-600 ">*</span>{" "}
                        </th>
                        <th>
                          Expiry <span className="text-red-600 ">*</span>
                        </th>
                        <th>
                          MRP <span className="text-red-600 ">*</span>
                        </th>
                        <th>Qty. </th>
                        <th>Free</th>
                        <th>
                          PTR <span className="text-red-600 ">*</span>
                        </th>
                        <th>CD%</th>
                        {/* <th>Sch. Amt</th> */}
                        <th>Base</th>
                        <th>
                          GST% <span className="text-red-600 ">*</span>
                        </th>
                        <th>Loc.</th>
                        <th>Net Rate</th>
                        <th>Margin%</th>
                        <th>Amount</th>
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
                            {isEditMode ? (
                              <td className="p-0">
                                <div style={{ width: 350, padding: 10 }}>
                                  {/* <BorderColorIcon
                                                    style={{ color: "var(--color1)" }}
                                                    onClick={() => setIsEditMode(false)}
                                                  /> */}
                                  <DeleteIcon
                                    className="delete-icon mr-2"
                                    onClick={() => {
                                      removeItem();
                                      setIsEditMode(false);
                                    }}
                                  />
                                  {searchItem}
                                </div>
                                {error.item && (
                                  <span
                                    style={{ color: "red", fontSize: "12px" }}
                                  >
                                    {error.item}
                                  </span>
                                )}
                              </td>
                            ) : (

                              <td>
                                <Autocomplete
                                  value={searchItem?.iteam_name}
                                  sx={{ width: 350, padding: 0 }}
                                  size="small"
                                  key={autocompleteKey}
                                  onChange={handleOptionChange}
                                  open={autoCompleteOpen}
                                  onOpen={() => setAutoCompleteOpen(true)}
                                  onClose={() => setAutoCompleteOpen(false)}
                                  onInputChange={handleInputChange}
                                  disabled={isAutocompleteDisabled}
                                  getOptionLabel={(option) =>
                                    `${option.iteam_name} `
                                  }
                                  options={itemList}
                                  renderOption={(props, option) => (
                                    <ListItem {...props}>
                                      {/* <ListItemText
                      primary={`${option.iteam_name}`}
                      secondary={`Pack : ${option.pack} | MRP: ${option.mrp}  | Location: ${option.location}  | Current Stock : ${option.stock} `}
                    /> */}
                                      <ListItemText
                                        primary={`${option.iteam_name}`}
                                        secondary={` ${option.stock === 0
                                          ? `Unit: ${option.weightage}`
                                          : `Pack: ${option.pack}`
                                          } | MRP: ${option.mrp} 
                                            | Location: ${option.location}
                                            | Current Stock: ${option.stock}`}
                                      />
                                    </ListItem>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      variant="outlined"
                                      autoComplete="off"
                                      {...params}
                                      // label="Search Item Name"
                                      autoFocus
                                      inputRef={(el) => (inputRefs.current[0] = el)}
                                      onKeyDown={(e) => {
                                        const { key } = e;
                                        const isNavKey = ["Enter", "Tab", "ArrowDown", "ArrowUp"].includes(key);

                                        if (!searchItem) {
                                          if (isNavKey) {
                                            e.preventDefault();


                                            if (key === "ArrowDown" || key === "ArrowUp") {
                                              if (!searchItem) {
                                                tableRef.current.focus();
                                                setTimeout(() => document.activeElement.blur(), 0);
                                              }
                                            }
                                          }
                                        } else {
                                          if (key === "Enter" || key === "Tab") {
                                            console.log(searchItem, "Enter or Tab pressed");
                                            handleKeyDown(e, 2);
                                          }
                                        }
                                      }}

                                    />
                                  )}
                                />
                              </td>
                            )}

                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="text"
                                size="small"
                                error={!!error.unit}
                                value={unit}
                                sx={{ width: "80px" }}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  setUnit(value ? Number(value) : "");
                                }}
                                onKeyDown={(e) => {
                                  const isInvalidKey = [
                                    "e",
                                    "E",
                                    ".",
                                    "+",
                                    "-",
                                    ",",
                                  ].includes(e.key);
                                  const isTab = e.key === "Tab";
                                  const isShiftTab = isTab && e.shiftKey;
                                  const isEnter = e.key === "Enter";

                                  if (isInvalidKey) {
                                    e.preventDefault();
                                    return;
                                  }

                                  // Allow Shift+Tab to move backward regardless of unit
                                  if (isShiftTab) return;

                                  if (unit) {
                                    handleKeyDown(e, 3);
                                  } else if (isTab || isEnter) {
                                    e.preventDefault();
                                    toast.error("Unit is Required");
                                  }
                                }}
                                inputRef={(el) => (inputRefs.current[3] = el)}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                size="small"
                                error={!!error.batch}
                                value={batch}
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                  setBatch(e.target.value.toUpperCase());
                                }}
                                inputRef={(el) => (inputRefs.current[4] = el)}
                                onKeyDown={(e) => {
                                  if (batch) {
                                    handleKeyDown(e, 4);
                                  } else if (
                                    e.key === "Tab" ||
                                    e.key === "Enter"
                                  ) {
                                    e.preventDefault();
                                    toast.error("Batch is Required");
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                size="small"
                                sx={{ width: "100px" }}
                                error={!!error.expiryDate}
                                value={expiryDate}
                                onChange={handleExpiryDate}
                                placeholder="MM/YY"
                                inputRef={(el) => (inputRefs.current[5] = el)}
                                onKeyDown={(e) => {
                                  const isTab = e.key === "Tab";
                                  const isEnter = e.key === "Enter";
                                  const isShiftTab = isTab && e.shiftKey;
                                  const expiryDateRegex =
                                    /^(0[1-9]|1[0-2])\/\d{2}$/;

                                  // Allow Shift+Tab to move backward
                                  if (isShiftTab) return;

                                  if (isTab || isEnter) {
                                    if (!expiryDate) {
                                      e.preventDefault();
                                      toast.error("Expiry is required");
                                      return;
                                    }

                                    if (!expiryDateRegex.test(expiryDate)) {
                                      e.preventDefault();
                                      toast.error(
                                        "Expiry must be in MM/YY format"
                                      );
                                      return;
                                    }

                                    const [month, year] = expiryDate
                                      .split("/")
                                      .map(Number);
                                    const expiry = new Date(
                                      `20${year}`,
                                      month - 1,
                                      1
                                    );
                                    const now = new Date();
                                    const sixMonthsLater = new Date();
                                    sixMonthsLater.setMonth(now.getMonth() + 6);

                                    if (expiry < now) {
                                      e.preventDefault();
                                      toast.error("Product has expired");
                                    } else if (expiry < sixMonthsLater) {
                                      e.preventDefault();
                                      toast.warning(
                                        "Product will expire within 6 months"
                                      );
                                      handleKeyDown(e, 5);
                                    } else {
                                      handleKeyDown(e, 5);
                                    }
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="number"
                                sx={{ width: "90px" }}
                                size="small"
                                error={!!error.mrp}
                                value={mrp}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*\.?\d*$/.test(value)) {
                                    setMRP(value ? Number(value) : "");
                                  }
                                }}
                                onKeyDown={(e) => {
                                  const isTab = e.key === "Tab";
                                  const isShiftTab = isTab && e.shiftKey;

                                  // Allow Shift+Tab to navigate backward without validation
                                  if (isShiftTab) return;

                                  // Prevent invalid characters and multiple decimals
                                  if (
                                    ["e", "E", "+", "-", ","].includes(e.key) ||
                                    (e.key === "." &&
                                      e.target.value.includes("."))
                                  ) {
                                    e.preventDefault();
                                  }

                                  // Validate MRP on Enter or Tab if not provided or equals 0
                                  if (
                                    (e.key === "Enter" || e.key === "Tab") &&
                                    (!mrp || mrp === 0)
                                  ) {
                                    e.preventDefault();
                                    toast.error(
                                      "MRP is required and must be greater than 0"
                                    );
                                    return;
                                  }

                                  // Proceed with further handling
                                  handleKeyDown(e, 6);
                                }}
                                inputRef={(el) => (inputRefs.current[6] = el)}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="number"
                                sx={{ width: "80px" }}
                                size="small"
                                error={!!error.qty}
                                value={qty}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  setQty(value ? Number(value) : "");
                                }}
                                inputRef={(el) => (inputRefs.current[7] = el)}
                                onKeyDown={(e) => {
                                  const invalidKeys = [
                                    "e",
                                    "E",
                                    ".",
                                    "+",
                                    "-",
                                    ",",
                                  ];
                                  const isEnter = e.key === "Enter";

                                  if (invalidKeys.includes(e.key)) {
                                    e.preventDefault();
                                    return;
                                  }

                                  if (isEnter) {
                                    e.preventDefault();
                                    handleKeyDown(e, 7);
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                size="small"
                                type="number"
                                sx={{ width: "60px" }}
                                value={free}
                                error={!!error.free}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g);
                                  setFree(value ? Number(value) : "");
                                }}
                                onKeyDown={(e) => {
                                  const invalidKeys = [
                                    "e",
                                    "E",
                                    ".",
                                    "+",
                                    "-",
                                    ",",
                                  ];
                                  if (invalidKeys.includes(e.key)) {
                                    e.preventDefault();
                                    return;
                                  }

                                  if (e.key === "Enter") {
                                    e.preventDefault();

                                    const isQtyEmptyOrZero =
                                      !qty || Number(qty) === 0;
                                    const isFreeEmptyOrZero =
                                      !free || Number(free) === 0;

                                    if (isQtyEmptyOrZero && isFreeEmptyOrZero) {
                                      toast.error(
                                        "Quantity and free quantity both can't be empty or zero"
                                      );
                                      return;
                                    }

                                    handleKeyDown(e, 8);
                                  }
                                }}
                                inputRef={(el) => (inputRefs.current[8] = el)}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="number"
                                sx={{ width: "90px" }}
                                size="small"
                                value={ptr}
                                error={!!error.ptr}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*\.?\d*$/.test(value)) {
                                    setPTR(value ? Number(value) : "");
                                  }
                                }}
                                onKeyDown={(e) => {
                                  const isTab = e.key === "Tab";
                                  const isEnter = e.key === "Enter";
                                  const isShiftTab = isTab && e.shiftKey;
                                  const invalidKeys = ["e", "E", "+", "-", ","];

                                  // Prevent invalid characters and multiple decimals
                                  if (
                                    invalidKeys.includes(e.key) ||
                                    (e.key === "." &&
                                      e.target.value.includes("."))
                                  ) {
                                    e.preventDefault();
                                    return;
                                  }

                                  // Allow Shift+Tab to move backward
                                  if (isShiftTab) return;

                                  if (isEnter || isTab) {
                                    if (!ptr || ptr === 0) {
                                      e.preventDefault();
                                      toast.error(
                                        "PTR is required and must be greater than 0"
                                      );
                                      return;
                                    }

                                    if (
                                      Number(mrp) &&
                                      Number(ptr) >= Number(mrp)
                                    ) {
                                      e.preventDefault();
                                      toast.error("PTR must be less than MRP");
                                      return;
                                    }
                                  }

                                  // Proceed with the next field
                                  handleKeyDown(e, 9);
                                }}
                                inputRef={(el) => (inputRefs.current[9] = el)}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                sx={{ width: "65px" }}
                                size="small"
                                type="number"
                                value={disc}
                                onKeyDown={(e) => {
                                  const invalidKeys = ["e", "E", "+", "-", ","];
                                  if (
                                    invalidKeys.includes(e.key) ||
                                    (e.key === "." &&
                                      e.target.value.includes("."))
                                  ) {
                                    e.preventDefault();
                                  }

                                  handleKeyDown(e, 10);
                                }}
                                onChange={(e) => {
                                  let value = Number(e.target.value);
                                  if (value > 99) {
                                    value = 99;
                                  }
                                  // Convert number to string before calling handleSchAmt
                                  handleSchAmt({
                                    ...e,
                                    target: { ...e.target, value: String(value) },
                                  });
                                }}
                                inputRef={(el) => (inputRefs.current[10] = el)}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="number"
                                size="small"
                                value={base === 0 ? "" : base}
                                disabled
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                  setBase(e.target.value);
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={gst}
                                sx={{ width: "65px" }}
                                error={!!error.gst}
                                inputRef={(el) => (inputRefs.current[11] = el)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    setGst(value ? Number(value) : "");
                                  }
                                }}
                                onKeyDown={(e) => {
                                  const isTab = e.key === "Tab";
                                  const isEnter = e.key === "Enter";
                                  const isShiftTab = isTab && e.shiftKey;

                                  if (isShiftTab) return;

                                  if (isEnter || isTab) {
                                    const allowedGST = [0, 5, 12, 18, 28];

                                    if (
                                      gst === "" ||
                                      gst === null ||
                                      gst === undefined
                                    ) {
                                      e.preventDefault();
                                      toast.error("GST is required");
                                      return;
                                    }

                                    if (!allowedGST.includes(Number(gst))) {
                                      e.preventDefault();
                                      toast.error(
                                        "Only 5%, 12%, 18%, or 28% GST is allowed"
                                      );
                                      return;
                                    }
                                  }

                                  handleKeyDown(e, 11);
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                // inputRef={inputRef12}
                                // onKeyDown={handleKeyDown}
                                size="small"
                                value={loc?.toUpperCase()}
                                // error={!!error.loc}
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                  setLoc(e.target.value);
                                }}
                                inputRef={(el) => (inputRefs.current[12] = el)}
                                onKeyDown={async (e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addPurchaseValidation()

                                  }
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="number"
                                disabled
                                size="small"
                                value={netRate === 0 ? "" : netRate}
                                sx={{ width: "100px" }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                autoComplete="off"
                                id="outlined-number"
                                type="number"
                                disabled
                                size="small"
                                value={margin === 0 ? "" : margin}
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                  setMargin(e.target.value);
                                }}
                              />
                            </td>
                            <td className="total">
                              <span className="font-bold">
                                {ItemTotalAmount}
                              </span>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                  <>
                    <table
                      className="customtable  w-full  border-collapse custom-table"
                      ref={tableRef}
                      tabIndex={0}
                    >
                      <tbody>
                        {purchase?.item_list?.map((item, index) => (
                          <tr
                            key={item.id}
                            onClick={() => {
                              setSelectedIndex(index); // Ensure clicking sets the selected index
                              handleEditClick(item);
                            }}
                            className={` item-List  flex justify-between  cursor-pointer  ${index === selectedIndex ? "highlighted-row" : ""
                              }`}
                          >
                            <td
                              style={{
                                display: "flex",
                                gap: "8px",
                                width: "335px",
                              }}
                            >
                              <BorderColorIcon
                                style={{ color: "var(--color1)" }}
                                onClick={() => handleEditClick(item)}
                              />
                              <DeleteIcon
                                className="delete-icon"
                                onClick={() => deleteOpen(item.id)}
                              />
                              {item.item_name}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "85px" }}>
                              {item.weightage}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "105px" }}>
                              {item.batch_number}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "95px" }}>
                              {item.expiry}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "95px" }}>
                              {item.mrp}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "85px" }}>
                              {item.qty}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "60px" }}>
                              {item.fr_qty}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "95px" }}>
                              {item.ptr}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "70px" }}>
                              {item.disocunt}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "95px" }}>
                              {item.base_price}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "70px" }}>
                              {item.gst_name}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "95px" }}>
                              {item.location}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "95px" }}>
                              {item.net_rate}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "108px" }}>
                              {item.margin}
                            </td>
                            <td style={{ paddingLeft: "22px", width: "102px" }}>
                              {item.amount}
                            </td>
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
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              overflow: "auto",
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
                gap: "40px",
                whiteSpace: "nowrap",
                left: "0",
                padding: "20px",
              }}
            >
              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Total GST : </label>

                <span style={{ fontWeight: 600 }}>{purchase?.total_gst} </span>
              </div>
              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Total Qty : </label>
                <span style={{ fontWeight: 600 }}>
                  {purchase?.total_qty} +
                  <span className="">
                    {purchase?.total_free_qty ? purchase?.total_free_qty : 0}
                    Free
                  </span>
                </span>
              </div>
              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Total Base : </label>
                <span style={{ fontWeight: 600 }}>{purchase?.total_base}</span>
              </div>
              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Total Net Profit : </label>
                <span style={{ fontWeight: 600 }}>
                  ₹ {purchase?.total_net_rate}
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
                onClick={() => {
                  setIsModalOpen(!isModalOpen);
                }}
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
                  {parseFloat(netAmount)}
                  <FaCaretUp />
                </span>
              </div>

              <Modal
                show={isModalOpen}
                onClose={() => {
                  setIsModalOpen(!isModalOpen);
                }}
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
                  <h2 style={{ textTransform: "uppercase" }}>invoice total</h2>
                  <IoMdClose
                    onClick={() => {
                      setIsModalOpen(!isModalOpen);
                    }}
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
                      {(parseFloat(purchase?.total_amount) || 0).toFixed(2)}
                    </span>
                  </div>

                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "5px",
                    }}
                  >
                    <label className="font-bold">CN Amount : </label>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#F31C1C",
                      }}
                    >
                      {-(parseFloat(finalCnAmount) || 0).toFixed(2)}
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
                    <span>{(parseFloat(roundOffAmount) || 0).toFixed(2)}</span>
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
                      {(parseFloat(netAmount) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          {/* Cn Adjust Edit Revert PopUp Box*/}
          <Dialog open={openAddPopUp} className="custom-dialog modal_991 ">
            <DialogTitle id="alert-dialog-title" className="secondary">
              {header}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={resetAddDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#ffffff",
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div className="bg-white">

                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>
                          {purchase?.cn_bill_list?.length === 0 ? (
                            <input
                              type="checkbox"
                              onChange={handleSelectAllPending}
                              checked={
                                selectedRows.length ===
                                purchaseReturnPending.length &&
                                purchaseReturnPending.length > 0
                              }
                            />
                          ) : (
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                selectedRows.length ===
                                (purchase?.cn_bill_list?.length || 0) &&
                                purchase?.cn_bill_list?.length > 0
                              }
                              disabled={checkboxDisabled}
                            />
                          )}
                        </th>
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Amount</th>
                        <th>Adjust CN Amount</th>
                        {purchase?.cn_bill_list?.length > 0 && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {purchase?.cn_bill_list?.length === 0
                        ? purchaseReturnPending.map((row, index) => (
                          <tr key={index}>
                            <td>
                              {purchase?.cn_bill_list?.length === 0 ? (
                                <input
                                  type="checkbox"
                                  onChange={(e) =>
                                    handleRowSelectPending(
                                      row.id,
                                      row.total_amount || 0
                                    )
                                  }
                                  checked={selectedRows.includes(row.id)}
                                />
                              ) : (
                                ""
                              )}
                            </td>
                            <td>{row.bill_no}</td>
                            <td>{row.bill_date}</td>
                            <td>{row.total_amount}</td>
                            <td>
                              <OutlinedInput
                                type="number"
                                value={cnTotalAmount[row.id] || ""}
                                onChange={(e) =>
                                  handleCnAmountChange(
                                    row.id,
                                    e.target.value,
                                    row.total_amount
                                  )
                                }
                                startAdornment={
                                  <InputAdornment position="start">
                                    Rs.
                                  </InputAdornment>
                                }
                                sx={{ width: 130, m: 1 }}
                                size="small"
                                disabled={!selectedRows.includes(row.id)}
                              />
                            </td>
                          </tr>
                        ))
                        : purchase?.cn_bill_list?.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleRowSelect(
                                    row.id,
                                    row.total_amount || 0
                                  )
                                }
                                checked={selectedRows.includes(row.id)}
                                disabled={checkboxDisabled}
                              />
                            </td>
                            <td>{row?.bill_no}</td>
                            <td>{row?.bill_date}</td>
                            <td>{row?.total_amount}</td>
                            <td>
                              <OutlinedInput
                                type="number"
                                value={
                                  cnTotalAmount[row.id] !== undefined
                                    ? cnTotalAmount[row.id]
                                    : row.cn_amount || ""
                                }
                                onChange={(e) =>
                                  handleCnAmountChange(
                                    row.id,
                                    e.target.value,
                                    row.total_amount
                                  )
                                }
                                startAdornment={
                                  <InputAdornment position="start">
                                    Rs.
                                  </InputAdornment>
                                }
                                sx={{ width: 130, m: 1 }}
                                size="small"
                                disabled={
                                  inputDisabled ||
                                  !selectedRows.includes(row.id)
                                }
                              />
                            </td>
                            <td>
                              <Button
                                onClick={() => handleRevert(row.id)}
                                variant="contained"
                                color="primary"
                              >
                                Revert
                              </Button>
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan={3}></td>
                        {purchase?.cn_bill_list?.length === 0 ? "" : <td></td>}
                        <td>Selected Bills Amount</td>
                        <td>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 800,
                              color: "black",
                            }}
                          >
                            Rs.{(parseFloat(cnAmount) || 0).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                variant="contained"
                color="success"
                onClick={handleCnAmount}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
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
            className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${isOpenBox ? "block" : "hidden"
              }`}
          >
            <div />
            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
              <div className="my-4 logout-icon">
                <VscDebugStepBack
                  className=" h-12 w-14"
                  style={{ color: "#628A2F" }}
                />
                <h4 className="text-lg font-semibold mt-6 text-center">
                  <span style={{ textTransform: "lowercase" }}>
                    Are you sure you want to delete it?
                  </span>
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
                  onClick={LogoutClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPurchaseBill;
