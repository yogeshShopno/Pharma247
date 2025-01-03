import Header from "../../../Header";
import "../Add-PurchaseBill/AddPurchasebill.css";
import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, InputAdornment, ListItem, ListItemText, OutlinedInput, TextField } from "@mui/material";
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
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel } from "@mui/material"
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";

const EditPurchaseBill = () => {
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
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [isOpenBox, setIsOpenBox] = useState(false);

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
  const [value, setValue] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [free, setFree] = useState("");
  const [loc, setLoc] = useState("");
  const [unit, setUnit] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [ItemTotalAmount, setItemTotalAmount] = useState("");
  const [margin, setMargin] = useState("");
  const [disc, setDisc] = useState("");
  const [base, setBase] = useState("");
  const [gst, setGst] = useState({ id: "", name: "" });
  const [batch, setBatch] = useState("");
  const [gstList, setGstList] = useState([]);
  const [historyList, setHistoryList] = useState([])
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
  const [header, setHeader] = useState('');
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseReturnPending, setPurchaseReturnPending] = useState([])
  // const [finalPurchaseReturnList, setFinalPurchaseReturnList] = useState([]);
  const [cnTotalAmount, setCnTotalAmount] = useState({});
  const [checkboxDisabled, setCheckboxDisabled] = useState(true);
  const [cnAmount, setCnAmount] = useState(0)
  const [disabledRows, setDisabledRows] = useState({});
  const [inputDisabled, setInputDisabled] = useState(true);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [finalCnAmount, setFinalCnAmount] = useState(0)
  const [finalTotalAmount, setFinalTotalAmount] = useState(0)
  const [netAmount, setNetAmount] = useState(0)
  const [roundOffAmount, setRoundOffAmount] = useState(0)
  const [openModal, setOpenModal] = useState(false);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [barcode, setBarcode] = useState("");

  const [errors, setErrors] = useState({});
  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);

  const { id, randomNumber } = useParams();
  // const {  } = useParams();
  const [purchase, setPurchase] = useState([]);
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
      .map(amount => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setCnAmount(total)
  }, [cnTotalAmount])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleBarcode();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

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
      setNetAmount(response?.data?.data.net_amount)

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
        setSelectedDate(purchaseData?.bill_date ? purchaseData.bill_date : null);
        setDueDate(purchaseData?.due_date ? purchaseData?.due_date : null);
        // setCnAmount(purchase?.cn_amount || "")
        setFinalCnAmount(purchaseData?.cn_amount || "");
        setFinalTotalAmount(purchaseData?.total_amount || "")
        handleCalNetAmount(purchaseData?.net_amount || "")
        setRoundOffAmount(purchaseData?.round_off || "")
        // setCnTotalAmount(purchaseData?.cn_amount ? purchaseData.cn_amount : null)
      }
      setIsLoading(false);
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
      }
    } catch (error) {
      console.error("API error fetching purchase data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const defaultSelectedRows = purchase?.cn_bill_list?.map(row => row.id) || [];
    setSelectedRows(defaultSelectedRows);

    const initialDisabledRows = purchase?.cn_bill_list?.reduce((acc, row) => {
      acc[row.id] = true; // Set all rows as disabled initially
      return acc;
    }, {});
    setDisabledRows(initialDisabledRows);
  }, [purchase]);

  // useEffect(() => {
  //   // Delete All Purchase Item
  //   if (localStorage.getItem("RandomNumber") !== null) {
  //     if (deleteAll == false) {
  //       handlePopState();
  //     }
  //   }
  //   // delete All purchase item

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, []);

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

  useEffect(() => {
    if (!qty || !ptr || !disc || !gst.name || !free) {
      console.warn("One or more dependencies are undefined");
      return;
    }

    const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
    setSchAmt(totalSchAmt);
    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setItemTotalAmount(0);
    setBase(totalBase);

    const totalAmount = parseFloat(
      (totalBase + (totalBase * gst.name) / 100).toFixed(2)
    );
    setItemTotalAmount(totalAmount);
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    const netRate = parseFloat(
      (totalAmount / (numericQty + numericFree)).toFixed(2)
    );
    setNetRate(netRate);

    const margin = parseFloat((((mrp - netRate) / mrp) * 100).toFixed(2));
    setMargin(margin);
  }, [qty, ptr, disc, gst.name, free]);

  // Call the combined function when you want to initiate the data fetching
  useEffect(() => {
    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty || 0);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(
        gstList.find((option) => option.name === selectedEditItem.gst_name) ||
        {}
      );
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  }, [selectedEditItem])
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

        // toast.success(response.data.message);
        if (response.data.status === 401) {
          history.push('/');
          localStorage.clear();
        }
      })
    } catch (error) {
      // setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message)
      }
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

        setGstList(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);


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

    }
  };
  const deleteOpen = (Id) => {
    setIsDelete(true);
    setItemId(Id);
    setUnsavedItems(true)

  };

  const addPurchaseValidation = async () => {
    const newErrors = {};
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
    // if (!base) newErrors.base = "Base is required";
    if (!gst.name) newErrors.gst = "GST is required";
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
      await handleEditItem(); // Call handleEditItem if validation passes
    }
    return isValid;
  };
  const handleNavigation = (path) => {
    setOpenAddPopUp(false)
    setIsOpenBox(true);
    setNextPath(path);
  };

  const LogoutClose = () => {
    setIsOpenBox(false);
    // setPendingNavigation(null);
  };



  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("start_date", localStorage.getItem("StartFilterDate"));
    data.append("end_date", localStorage.getItem("EndFilterDate"));
    data.append("distributor_id", localStorage.getItem("DistributorId"));
    data.append("type", "1");
    try {
      const response = await axios.post("purches-histroy", data,
        {
          headers: { Authorization: `Bearer ${token}` },
        });

      if (response.status === 200) {
        setUnsavedItems(false);
        setIsOpenBox(false);
        setTimeout(() => {
          if (nextPath) {
            history.push(nextPath)
          }

        }, 0);
      }
      setIsOpenBox(false);
      setUnsavedItems(false);

      // history.replace(nextPath);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };



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
        .post("barcode-batch-list?", { "barcode": barcode }, {
          // params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // data.append("unit_id", Number(0));
          // data.append("random_number", localStorage.getItem("RandomNumber"));
          // data.append("item_id", response?.data?.data[0]?.batch_list[0]?.item_id ? response?.data?.data[0]?.batch_list[0]?.item_id : 0);
          // data.append("weightage", response?.data?.data[0]?.batch_list[0]?.unit ? Number(response?.data?.data[0]?.batch_list[0]?.unit) : 1);
          // data.append("batch_number", response?.data?.data[0]?.batch_list[0]?.batch_number ? response?.data?.data[0]?.batch_list[0]?.batch_number : 0);
          // data.append("expiry", response?.data?.data[0]?.batch_list[0]?.expiry_date);
          // data.append("mrp", response?.data?.data[0]?.batch_list[0]?.mrp ? response?.data?.data[0]?.batch_list[0]?.mrp : 0);
          // data.append("qty", response?.data?.data[0]?.batch_list[0]?.qty ? response?.data?.data[0]?.batch_list[0]?.qty : 0);
          // data.append("free_qty", 0);
          // data.append("ptr", response?.data?.data[0]?.batch_list[0]?.ptr ? response?.data?.data[0]?.batch_list[0]?.ptr : 0);
          // data.append("discount", response?.data?.data[0]?.batch_list[0]?.discount ? response?.data?.data[0]?.batch_list[0]?.discount : 0);
          // data.append("scheme_account", response?.data?.data[0]?.batch_list[0]?.scheme_account ? response?.data?.data[0]?.batch_list[0]?.scheme_account : 0);
          // data.append("base_price", response?.data?.data[0]?.batch_list[0]?.base ? response?.data?.data[0]?.batch_list[0]?.base : 0);
          // data.append("gst", response?.data?.data[0]?.batch_list[0]?.gst ? response?.data?.data[0]?.batch_list[0]?.gst : 0);
          // data.append("location", response?.data?.data[0]?.batch_list[0]?.location ? response?.data?.data[0]?.batch_list[0]?.location : 0);
          // data.append("margin", response?.data?.data[0]?.batch_list[0]?.margin ? response?.data?.data[0]?.batch_list[0]?.margin : 0);
          // data.append("net_rate", response?.data?.data[0]?.batch_list[0]?.netRate ? response?.data?.data[0]?.batch_list[0]?.netRate : 0);
          // data.append("id", response?.data?.data[0]?.batch_list[0]?.item_id ? response?.data?.data[0]?.batch_list[0]?.item_id : 0);

          // setValue (response?.data?.data[0]?.batch_list[0]?.iteam_id)
          // setValue.unit_id(response.data.data[0]?.unit)

          setUnit(response?.data?.data[0]?.batch_list[0]?.unit);
          setBatch(response?.data?.data[0]?.batch_list[0]?.batch_name);
          setExpiryDate(response?.data?.data[0]?.batch_list[0]?.expiry_date);
          setMRP(response?.data?.data[0]?.batch_list[0]?.mrp);
          setQty(response?.data?.data[0]?.batch_list[0]?.purchase_qty);
          setFree(response?.data?.data[0]?.batch_list[0]?.purchase_free_qty);
          setPTR(response?.data?.data[0]?.batch_list[0]?.ptr);
          setDisc(response?.data?.data[0]?.batch_list[0]?.discount);
          setSchAmt(response?.data?.data[0]?.batch_list[0]?.scheme_account);
          setBase(response?.data?.data[0]?.batch_list[0]?.base);
          setGst({
            id: response?.data?.data[0]?.batch_list[0]?.gst,
            name: response?.data?.data[0]?.batch_list[0]?.gst_name,
          });
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

    }
  };


  const handleEditItem = async () => {
    setUnsavedItems(true);

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
    data.append("random_number", randomNumber);
    data.append("unite", !unit ? 0 : unit);
    data.append("batch_number", !batch ? 0 : batch);
    data.append("expiry", !expiryDate ? 0 : expiryDate);
    data.append("mrp", !mrp ? 0 : mrp);
    data.append("qty", !qty ? 0 : qty);
    data.append("free_qty", !free ? 0 : free);
    data.append("ptr", !ptr ? 0 : ptr);
    data.append("discount", !disc ? 0 : disc);
    data.append("scheme_account", !schAmt ? 0 : schAmt);
    data.append("base_price", !base ? 0 : base);
    data.append("gst", !gst.id ? 0 : gst.id);
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
      setBarcode("")
      if (ItemTotalAmount <= finalCnAmount) {
        setFinalCnAmount(0);
        setSelectedRows([]);
        setCnTotalAmount({});
      }
      // handleCalNetAmount()
      setItemTotalAmount(0);
      setIsEditMode(false);
      setSelectedEditItemId(null);
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
      }
    } catch (e) {
      console.error("API error:", error);

    }
  };

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

  const updatePurchaseRecord = async () => {
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
    data.append("total_margin", purchase.total_margin)
    data.append("total_gst", purchase?.total_gst)
    data.append("round_off", roundOffAmount);
    data.append("cn_amount", finalCnAmount)
    data.append("purches_data", JSON.stringify(purchase.item_list));
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

          toast.success(response.data.message);
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

  const handleUpdateSubmit = () => {
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
    updatePurchaseRecord();
  };
  const handleEditClick = (item) => {
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id);
    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty || 0);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(
        gstList.find((option) => option.name === selectedEditItem.gst_name) ||
        {}
      );
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  };

  const handelAddOpen = () => {
    setUnsavedItems(true)

    setOpenAddPopUp(true);

    purchaseReturnData()
    setHeader('Add Amount');
  }
  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    // setCnAmount(0)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target === inputRef1.current) {
        inputRef2.current.focus();
      } else if (event.target === inputRef2.current) {
        inputRef3.current.focus();
      } else if (event.target === inputRef3.current) {
        inputRef4.current.focus();
      } else if (event.target === inputRef4.current) {
        inputRef5.current.focus();
      } else if (event.target === inputRef5.current) {
        inputRef6.current.focus();
      } else if (event.target === inputRef6.current) {
        inputRef7.current.focus();
      } else if (event.target === inputRef7.current) {
        inputRef8.current.focus();
      } else if (event.target === inputRef8.current) {
        inputRef9.current.focus();
      } else if (event.target === inputRef9.current) {
        inputRef10.current.focus();
      } else if (event.target === inputRef10.current) {
        inputRef11.current.focus();
      } else if (event.target === inputRef11.current) {
        inputRef12.current.focus();
      } else if (event.target === inputRef12.current) {
        inputRef13.current.focus();
      }
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue);
    handleSearch(newInputValue);
  };

  const handleOptionChange = (event, newValue) => {
    setValue(newValue);
    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);
    handleSearch(itemName);
  };

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
    setAutocompleteDisabled(false);
    setUnit("");
    setSearchItem("");
    setBatch("");
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
        purchase?.cn_bill_list?.reduce((acc, row) => acc + parseFloat(row.total_amount || 0), 0)
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
        purchaseReturnPending.reduce((acc, row) => acc + parseFloat(row.total_amount || 0), 0)
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

    setCnTotalAmount(prev => ({
      ...prev,
      [rowId]: 0
    }));

    setInputDisabled(false);
  };
  const handleCalNetAmount = (net_amount) => {
    const adjustedTotalAmount = net_amount - finalCnAmount;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    let netAmountCal;
    let roundOffAmountCal;

    if (decimalPart >= 0.50) {
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
      newErrors.finalTotalAmount = "You cannot adjust CN more than the total invoice amount";
      toast.error('You cannot adjust CN more than the total invoice amount');
      setError(newErrors);
      setError(newErrors);
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
      return;
    }
    setFinalCnAmount(cnAmount)
    setUnsavedItems(true)
    // setNetAmount(finalTotalAmount - cnAmount)

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
    resetAddDialog()
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
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div
          style={{

            height: "calc(99vh - 55px)",
            padding: "0px 20px",
          }}
        >
          <div>
            <div className="py-3" style={{ display: "flex", gap: "4px" }}>
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
              <div className="headerList">
                {/* <Select
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
                </Select> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateSubmit}
                  style={{ background: "var(--color1)" }}

                >
                  Update
                </Button>
              </div>
            </div>
            <div>
              <div className="firstrow flex">
                <div className="detail">
                  <span className="title mb-2">Distributor</span>
                  <Autocomplete
                    value={distributor}
                    disabled
                    sx={{
                      width: "100%",
                      minWidth: "350px",
                      "@media (max-width:600px)": {
                        minWidth: "250px",
                      },
                    }}
                    size="small"
                    onChange={(e, value) => setDistributor(value)}
                    options={distributorList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField
                      autoComplete="off" {...params} />}
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
                    autoComplete="off"
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
                    autoComplete="off"
                    id="outlined-number"
                    disabled
                    size="small"
                    style={{ width: "250px" }}
                    value={billNo.toUpperCase()}
                    // onChange={(e) => { setbillNo(e.target.value) }}
                    onChange={(e) => {
                      setbillNo(e.target.value.toUpperCase());
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
                  <div style={{ width: "215px" }}>
                    <DatePicker
                      disabled
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
                  <div style={{ width: "215px" }}>
                    <DatePicker
                      disabled
                      className="custom-datepicker "
                      selected={dueDate}
                      onChange={(newDate) => setDueDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                    />
                  </div>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  // style={{ }}
                  onClick={handelAddOpen}
                  style={{ textTransform: 'none', marginTop: "25px", background: "var(--color1)" }}

                >
                  <AddIcon className="mr-2" />
                  CN Adjust
                </Button>
                <Autocomplete
                  value={searchItem?.iteam_name}
                  sx={{ width: 570 }}
                  size="small"
                  onChange={handleOptionChange}
                  onInputChange={handleInputChange}
                  disabled={isAutocompleteDisabled}
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
                      autoComplete="off" {...params} label="Search Item Name" autoFocus />
                  )}
                />

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
                        <th>Margin</th>
                        <th>Amount </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ width: "500px" }}>
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
                            autoComplete="off"
                            id="outlined-number"
                            type="number"
                            inputRef={inputRef1}
                            size="small"
                            error={!!errors.unit}
                            value={unit}
                            sx={{ width: "50px" }}
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
                            autoComplete="off"
                            id="outlined-number"
                            inputRef={inputRef2}
                            onKeyDown={handleKeyDown}
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
                            autoComplete="off"
                            id="outlined-number"
                            size="small"
                            sx={{ width: "80px" }}
                            inputRef={inputRef3}
                            onKeyDown={(e) => {
                              if (['e', 'E'].includes(e.key)) {
                                e.preventDefault();
                              }
                              handleKeyDown(e);
                            }}
                            error={!!errors.expiryDate}
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                            placeholder="MM/YY"
                          />
                        </td>
                        <td>
                          <TextField
                            autoComplete="off"
                            id="outlined-number"
                            type="number"
                            sx={{ width: "100px" }}
                            size="small"
                            inputRef={inputRef4}
                            error={!!errors.mrp}
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
                            sx={{ width: "80px" }}
                            size="small"
                            inputRef={inputRef5}
                            value={qty}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setQty(value ? Number(value) : "");
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
                            autoComplete="off"
                            id="outlined-number"
                            size="small"
                            type="number"
                            sx={{ width: "50px" }}
                            value={free}
                            inputRef={inputRef6}
                            error={!!errors.free}
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
                            autoComplete="off"
                            id="outlined-number"
                            type="number"
                            sx={{ width: "100px" }}
                            size="small"
                            inputRef={inputRef7}
                            value={ptr}
                            onKeyDown={(e) => {
                              if (
                                ['e', 'E', '+', '-', ','].includes(e.key) ||
                                (e.key === '.' && e.target.value.includes('.'))
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={handlePTR}
                          />
                        </td>
                        <td>
                          <TextField
                            autoComplete="off"
                            id="outlined-number"
                            sx={{ width: "60px" }}
                            size="small"
                            type="number"
                            inputRef={inputRef8}
                            onKeyDown={(e) => {
                              if (
                                ['e', 'E', '+', '-', ','].includes(e.key) ||
                                (e.key === '.' && e.target.value.includes('.'))
                              ) {
                                e.preventDefault();
                              }
                            }}
                            value={disc}
                            error={!!errors.disc}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (Number(value) > 100) {
                                e.target.value = 100;
                              }
                              handleSchAmt(e);
                            }} />
                        </td>
                        <td>
                          <TextField
                            autoComplete="off"
                            id="outlined-number"
                            sx={{ width: "90px" }}
                            size="small"
                            inputRef={inputRef9}
                            onKeyDown={(e) => {
                              if (['e', 'E'].includes(e.key)) {
                                e.preventDefault();
                              }
                              handleKeyDown(e);
                            }}
                            value={schAmt}
                            disabled
                          />
                        </td>
                        <td>
                          <TextField
                            autoComplete="off"
                            id="outlined-number"
                            type="number"
                            size="small"
                            value={base}
                            inputRef={inputRef10}
                            onKeyDown={(e) => {
                              if (['e', 'E'].includes(e.key)) {
                                e.preventDefault();
                              }
                              handleKeyDown(e);
                            }} disabled
                            sx={{ width: "80px" }}
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
                            autoComplete="off"
                            id="outlined-number"
                            inputRef={inputRef12}
                            onKeyDown={handleKeyDown}
                            size="small"
                            value={loc}
                            error={!!errors.loc}
                            sx={{ width: "100px" }}
                            onChange={(e) => {
                              setLoc(e.target.value);
                            }}
                          />
                        </td>
                        <td>
                          <td>
                            <TextField
                              autoComplete="off"
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
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              disabled
                              size="small"
                              value={margin}
                              sx={{ width: "80px" }}
                              onChange={(e) => {
                                setMargin(e.target.value);
                              }}

                              onKeyDown={(e) => {
                                if (['e', 'E'].includes(e.key)) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e);
                              }}
                            />
                          </td>
                        </td>
                        <td className="total">
                          <span>{ItemTotalAmount}</span>
                        </td>
                      </tr>
                      <tr>
                        <td><TextField
                          autoComplete="off"
                          id="outlined-number"
                          type="number"
                          size="small"
                          value={barcode}
                          placeholder="scan barcode"

                          sx={{ width: "250px" }}
                          onChange={(e) => {
                            setBarcode(e.target.value)
                          }}

                        /></td>
                        <td colSpan={14}></td>

                        <td>
                          <Button
                            variant="contained"
                            color="success"
                            style={{ display: "flex", gap: "5px", background: "var(--color1)" }}
                            onClick={addPurchaseValidation}
                          >
                            <BorderColorIcon
                              className="w-7 h-6 text-white  p-1 cursor-pointer" />
                            Edit
                          </Button>
                          {/* <Button variant="contained" color="success" onClick={addPurchaseValidation}><ControlPointIcon />Edit</Button> */}
                        </td>
                      </tr>
                      {purchase?.item_list?.map((item) => (
                        <tr
                          key={item.id}
                          className="item-List"
                          onClick={() => handleEditClick(item)}
                        >
                          <td
                            style={{
                              display: "flex",
                              gap: "8px",
                              width: "300px",
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
                          <td>{item.weightage}</td>
                          <td>{item.batch_number}</td>
                          <td>{item.expiry}</td>
                          <td>{item.mrp}</td>
                          <td>{item.qty}</td>
                          <td>{item.fr_qty}</td>
                          <td>{item.ptr}</td>
                          <td>{item.disocunt}</td>
                          <td>{item.scheme_account}</td>
                          <td>{item.base_price}</td>
                          <td>{item.gst_name}</td>
                          <td>{item.location}</td>
                          <td>{item.net_rate}</td>
                          <td>{item.margin}</td>
                          <td>{item.amount}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>

                  <div className="flex gap-10 justify-end mt-5 ">
                    {/* First Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Total GST : </label>
                        <div className="font-bold">{purchase?.total_gst}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Total Qty :</label>
                        <div className="font-bold">{purchase?.total_qty}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Total Net Profit :</label>
                        <div className="font-bold">{purchase?.total_net_rate}</div>
                      </div>
                    </div>

                    {/* Second Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                      {/* Total Amount Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Total Amount : </label>
                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {(parseFloat(purchase?.total_amount) || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* CN Amount Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px", }}>
                        <label className="font-bold">CN Amount : </label>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#F31C1C"
                          }}
                        >
                          {-(parseFloat(finalCnAmount) || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Total Margin Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Profit : </label>
                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          ₹{purchase?.margin_net_profit} ({purchase?.total_margin})%
                        </span>
                      </div>

                      {/* Round Off Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Round off : </label>
                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {(parseFloat(roundOffAmount) || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Net Amount Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "25px" }}>
                        <label className="font-bold">Net Amount : </label>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "22px",
                            color: "#3f6212"

                          }}
                        >
                          {(parseFloat(netAmount) || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
              <div>


              </div>
            </div>
          </div>
          {/* Cn Adjust Edit Revert PopUp Box*/}
          <Dialog open={openAddPopUp} className="custom-dailog" >
            <DialogTitle id="alert-dialog-title" className="secondary">
              {header}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={resetAddDialog}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
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
                              checked={selectedRows.length === purchaseReturnPending.length && purchaseReturnPending.length > 0}
                            />
                          ) :
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                selectedRows.length === (purchase?.cn_bill_list?.length || 0) &&
                                (purchase?.cn_bill_list?.length > 0)
                              }
                              disabled={checkboxDisabled}
                            />
                          }
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
                              {
                                purchase?.cn_bill_list?.length === 0 ? (
                                  <input
                                    type="checkbox"
                                    onChange={(e) => handleRowSelectPending(row.id, row.total_amount || 0)}
                                    checked={selectedRows.includes(row.id)}
                                  />
                                ) :
                                  ""
                              }
                            </td>
                            <td>{row.bill_no}</td>
                            <td>{row.bill_date}</td>
                            <td>{row.total_amount}</td>
                            <td>
                              <OutlinedInput
                                type="number"
                                value={cnTotalAmount[row.id] || ''}
                                onChange={(e) =>
                                  handleCnAmountChange(row.id, e.target.value, row.total_amount)
                                }
                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
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
                                onChange={() => handleRowSelect(row.id, row.total_amount || 0)}
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
                                    : row.cn_amount || ''
                                }
                                onChange={(e) =>
                                  handleCnAmountChange(row.id, e.target.value, row.total_amount)
                                }
                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                sx={{ width: 130, m: 1 }}
                                size="small"
                                disabled={inputDisabled || !selectedRows.includes(row.id)}
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
                        {
                          purchase?.cn_bill_list?.length === 0 ? (
                            ""
                          ) : <td></td>
                        }
                        <td>Selected Bills Amount</td>
                        <td>
                          <span
                            style={{ fontSize: '14px', fontWeight: 800, color: 'black' }}
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
                <h4 className="text-lg font-semibold mt-6 text-center">
                  <span style={{ textTransform: "lowercase" }}>Are you sure you want to delete it?</span></h4>
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
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPurchaseBill;