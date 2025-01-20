import React, { useEffect, useRef, useState } from "react";
import Header from "../../Header";
import { saveAs } from "file-saver";
import AssignmentIcon from "@mui/icons-material/Assignment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DatePicker from "react-datepicker";
import {
  Box,
  ListItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  TableContainer,
  TablePagination,
  Paper,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Autocomplete,
  Menu,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { BsLightbulbFill } from "react-icons/bs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import tablet from "../../../componets/Images/tablet.png";
import SearchIcon from "@mui/icons-material/Search";
import { toast, ToastContainer } from "react-toastify";
import { format, subDays } from "date-fns";
const InventoryList = () => {
  const csvIcon = process.env.PUBLIC_URL + "/csv-file.png";
  const [searchItem, setSearchItem] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionExpiry, setSelectedOptionEpiry] = useState([]);
  const [selectedOptionStock, setSelectedOptionStock] = useState("");
  const [manufacturer, setManufacturer] = useState(null);
  const [marginStart, setMarginStart] = useState("");
  const [marginEnd, setMarginEnd] = useState("");
  const [ptrStart, setPTRStart] = useState("");
  const [ptrEnd, setPTREnd] = useState("");
  const [mrpStart, setMRPStart] = useState("");
  const [mrpEnd, setMRPEnd] = useState("");
  const [location, setLocation] = useState(null);
  const [drugGroup, setDrugGroup] = useState(null);
  const [hsnCode, setHsnCode] = useState("");
  const token = localStorage.getItem("token");
  const defaultList = "../../pharmalogo.webp";
  const history = useHistory();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [packgingTypeList, setPackgingTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [selectedPackgingIds, setSelectedPackgingIds] = useState([]);
  const [gstList, setGstList] = useState([]);
  const [selectedGstIds, setSelectedGstIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemBatchData, setItemBatchData] = useState();
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPrintQR, setOpenPrintQR] = useState(false);
  const [stock, setStock] = useState("");
  const [adjustStockListData, setAdjustStockListData] = useState([]);
  const [unit, setUnit] = useState("");
  const [remainingStock, setRemainingStock] = useState("");
  const [batchListData, setBatchListData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [mrp, setMrp] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [batch, setBatch] = useState();
  const [stockAdjust, setStockAdjust] = useState("");
  const [adjustmentDate, setAdjustDate] = useState(new Date());
  const [purchaseItemData, setpurchaseItemData] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [errors, setErrors] = useState({});
  const [locationBulk, setLocationBulk] = useState();
  const [drugGroupList, setDrugGroupList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkOrder, setBulkOrder] = useState(false);
  const [barcode, setBarcode] = useState();
  const [selectedIndex, setSelectedIndex] = useState(-1); // -1 means no row is selected
  const [isAutocompleteFocused, setIsAutocompleteFocused] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAutocompleteFocused) {
        if (e.key === "ArrowDown") {
          setSelectedIndex((prevIndex) =>
            prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex
          );
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          setSelectedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
          e.preventDefault();
        } else if (e.key === "Enter" && selectedIndex !== -1) {
          history.push(`/inventoryView/${data[selectedIndex].id}`);
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedIndex, history, isAutocompleteFocused]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBulkOrder = () => {
    setBulkOrder(true);
    handleClose();
  };

  const handleBulkEdit = () => {
    setOpenEdit(true);
    setBarcode();
    handleClose();
  };
  const handleCheckbox = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );

  };
  let listOfCompany = () => {
    axios
      .get("company-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCompanyList(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    listItemcatagory();
    listPackgingtype();
    listOfGst();
    listOfCompany();
    listDrougGroup();
    listLocation();
  }, []);

  useEffect(() => {
    const x = parseFloat(stock) + parseFloat(stockAdjust);
    setRemainingStock(x);
  }, [stockAdjust]);

  useEffect(() => {
    handleSearch();
  }, [page, rowsPerPage]);

  let listItemcatagory = () => {
    axios
      .get("list-itemcategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategoryList(response.data.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
  };
  let listDrougGroup = () => {
    axios
      .post("drug-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDrugGroupList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
  };

  let listLocation = () => {
    axios
      .get("item-location", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLocationList(response.data.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
  };

  let listPackgingtype = () => {
    axios
      .get("list-package", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPackgingTypeList(response.data.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
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
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
  };
  const handleCheckboxChange = (event, categoryId) => {
    setSelectedCategoryIds((prevSelectedIds) => {
      if (event.target.checked) {
        // Add the category ID if the checkbox is checked
        return [...prevSelectedIds, categoryId];
      } else {
        // Remove the category ID if the checkbox is unchecked
        return prevSelectedIds.filter((id) => id !== categoryId);
      }
    });
  };

  const handleExpiryChange = (event) => {
    const { value } = event.target;
    setSelectedOptionEpiry((prevSelectedOptions) =>
      prevSelectedOptions.includes(value)
        ? prevSelectedOptions.filter((option) => option !== value)
        : [...prevSelectedOptions, value]
    );
  };

  const handleCheckboxPackging = (event, PackgingId) => {
    setSelectedPackgingIds((prevSelectedIds) => {
      if (event.target.checked) {
        // Add the category ID if the checkbox is checked
        return [...prevSelectedIds, PackgingId];
      } else {
        // Remove the category ID if the checkbox is unchecked
        return prevSelectedIds.filter((id) => id !== PackgingId);
      }
    });
  };

  const handleCheckboxChangeGst = (event, gstId) => {
    setSelectedGstIds((prevSelectedIds) => {
      if (event.target.checked) {
        // Add the category ID if the checkbox is checked
        return [...prevSelectedIds, gstId];
      } else {
        // Remove the category ID if the checkbox is unchecked
        return prevSelectedIds.filter((id) => id !== gstId);
      }
    });
  };
  // useEffect(() => {
  //     // listOfCompany()
  //     // adjustStockList();
  //     purchaseItemList()
  // }, [])

  const ItemvisebatchList = async (itemId) => {
    let data = new FormData();
    data.append("iteam_id", itemId);
    const params = {
      iteam_id: itemId,
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

  const handleSearch = async () => {
    let data = new FormData();
    data.append("search", searchItem);
    data.append("item", selectedOption);
    data.append("category", selectedCategoryIds.join(","));
    data.append("package", selectedPackgingIds.join(","));
    data.append("stock", selectedOptionStock);
    data.append("manufacturer", manufacturer == null ? "" : manufacturer?.id);
    data.append("drug_group", drugGroup == null ? "" : drugGroup?.id);
    data.append("gst", selectedGstIds.join(","));
    data.append("location", location == null ? "" : location);
    data.append("hsn_code", hsnCode);
    data.append("margin_end", marginEnd);
    data.append("margin_start", marginStart);
    data.append("mrp_end", mrpEnd);
    data.append("mrp_start", mrpStart);
    data.append("ptr_start", ptrStart);
    data.append("ptr_end", ptrEnd);
    data.append("expired", selectedOptionExpiry.join(","));
    // data.append("drug", drugGroup);
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search: searchItem,
      item: selectedOption,
      category: selectedCategoryIds.join(","),
      package: selectedPackgingIds.join(","),
      stock: selectedOptionStock,
      manufacturer: manufacturer == null ? "" : manufacturer?.id,
      drug_group: drugGroup == null ? "" : drugGroup?.id,
      gst: selectedGstIds.join(","),
      location: location,
      hsn_code: hsnCode,
      margin_end: marginEnd,
      margin_start: marginStart,
      mrp_start: mrpStart,
      mrp_end: mrpEnd,
      ptr_start: ptrStart,
      ptr_end: ptrEnd,
      expired: selectedOptionExpiry.join(","),
    };
    setIsLoading(true);
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
          setData(response.data.data.data);
          if (response.data.data.data.length == 0) {
            toast.error("No Record Found");
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.error("API error:", error);

    }
  };

  const sortByColumn = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      //     // Convert values to numbers if they are numeric
      if (
        key === "minimum" ||
        key === "maximum" ||
        key === "stock" ||
        key === "discount" ||
        key === "barcode"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const handleOptionChange = (event, newValue) => {
    const itemName = newValue ? newValue.iteam_name : "";
    setSelectedItem(itemName);
    setItemId(newValue?.id);
  };

  const handleBatchData = (event, newValue) => {
    const batch = newValue ? newValue.batch_name : "";
    setBatch(batch);
    setUnit(newValue?.unit);
    setExpiry(newValue?.expiry_date);
    setMrp(newValue?.mrp);
    setStock(newValue?.qty);
    setSelectedCompany(newValue?.company_name)
  };

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setBatch();
    setSelectedCompany();
    setSelectedItem();
    setUnit("");
    setExpiry("");
    setMrp("");
    setStock("");
    setStockAdjust("");
    setRemainingStock("");
    setAdjustDate(new Date());
  };

  const resetbulkDialog = () => {
    setOpenEdit(false);
    setBarcode("");
    setLocationBulk("");
  };

  const validateBulkOrder = async () => {
    const newErrors = {};
    if (selectedItems.length == 0) {
      newErrors.selectedItems = "Please First Select any Item.";
      toast.error(newErrors.selectedItems);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      bulkOrderData();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setLocationBulk(newInputValue);
    // handleSearch(newInputValue);
  };

  const bulkOrderData = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("item_id", selectedItems.join(","));
    // data.append('location', locationBulk);
    // data.append('barcode', barcode);

    try {
      await axios
        .post("online-bulck-order", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.success(response.data.message);
          handleSearch();
          setBulkOrder(false);

          // setLocationBulk('');
          // setBarcode('');
        });
    } catch (error) {
      console.error("API error:", error);

    }
  };

  const validateBulkForm = async () => {
    const newErrors = {};
    if (selectedItems.length == 0) {
      newErrors.selectedItems = "Please First Select any Item.";
      toast.error(newErrors.selectedItems);
    } else if (!barcode && !locationBulk) {
      newErrors.locationBulk = "Please add Location or Barcode.";
      toast.error(newErrors.locationBulk);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      bulkEdit();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const bulkEdit = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("item_id", selectedItems.join(","));
    data.append("location", locationBulk);
    data.append("barcode", barcode);

    try {
      await axios
        .post("bulk-edit", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.success(response.data.message);
          handleSearch();
          setOpenEdit(false);
          setLocationBulk("");
          listLocation();
          setBarcode("");
        });
    } catch (error) {
      console.error("API error:", error);

    }
  };

  const validateForm = async () => {
    const newErrors = {};

    if (!selectedItem) {
      newErrors.selectedItem = "select any Item Name.";
      toast.error(newErrors.selectedItem);
    } else if (!batch) {
      newErrors.batch = "Batch Number is required";
      toast.error(newErrors.batch);
    } else if (!selectedCompany) {
      newErrors.selectedCompany = "select any Company Name";
      toast.error(newErrors.selectedCompany);
    } else if (!stockAdjust) {
      newErrors.stockAdjust = "please Enter any Adjust Stock Number";
      toast.error(newErrors.stockAdjust);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      adjustStockAddData();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const adjustStockAddData = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append(
      "adjustment_date",
      adjustmentDate ? format(adjustmentDate, "yyyy-MM-dd") : ""
    );
    data.append("item_name", selectedItem?.id);
    data.append("batch", batch);
    data.append("company", selectedCompany?.id);
    data.append("unite", unit);
    data.append("expiry", expiry);
    data.append("mrp", mrp);
    data.append("stock", stock);
    data.append("stock_adjust", stockAdjust);
    data.append("remaining_stock", remainingStock);

    try {
      await axios
        .post("adjust-stock", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.success(response.data.message);
          setOpenAddPopUp(false);
          setBatch();
          setSelectedCompany();
          // adjustStockList();
          setSelectedItem();
          setUnit("");
          setExpiry("");
          setMrp("");
          setStock("");
          setStockAdjust("");
          setRemainingStock("");
          setAdjustDate(new Date());
        });
    } catch (error) {
      console.error("API error:", error);

    }
  };

  const handelAddOpen = (item) => {
    setOpenAddPopUp(true);
    setSelectedItem(item);
    const company = companyList.find((x) => x.id == item?.company_id);
    setSelectedCompany(company);
    ItemvisebatchList(item?.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterData = async () => {
    let data = new FormData();
    setIsLoading(true);
    try {
      await axios
        .post("item-batch-imports", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setItemBatchData(response.data.data);
          exportToCSV(response.data.data);
        });
    } catch (error) {
      console.error("API error:", error);

    }
  };

  const exportToCSV = (data) => {
    // Define the CSV headers
    // const headers = [
    //     "Item Name", "Batch", "Qty", "Exp Date", "MRP", "PTR",
    //     "Disc", "Loc", "Margin", "Total By MRP", "Total By PTR"
    // ];

    // Create a string for the CSV header
    // const csvHeader = headers.join(',') + '\n';

    // Map over the data and create a string for each row
    const csvRows = data
      .map((row) => {
        return Object.values(row)
          .map((value) => {
            const escaped = ("" + value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",");
      })
      .join("\n");

    // Combine the header and rows
    const csvString = csvRows;

    // Create a Blob object for the CSV and trigger the download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "item_batch_data.csv");
  };
  const handleReset = () => {
    setSearchItem("");
    setSelectedOption("");
    setHsnCode("");
    setSelectedCategoryIds([]);
    setSelectedPackgingIds([]);
    setSelectedOptionStock([]);
    setSelectedOptionEpiry([]);
    setManufacturer(null);
    setDrugGroup(null);
    setSelectedGstIds([]);
    setLocation("");
    setMarginStart("");
    setMarginEnd("");
    setMRPStart("");
    setMRPEnd("");
    setPTREnd("");
    setPTRStart("");
    handleSearch();
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
      {isLoading && (
        <div className="loader-container ">
          <Loader />
        </div>
      )}
      <Box className="flex flex-wrap md:flex-nowrap  ">
        <Box>
          <Box
            className="custom-scroll"
            sx={{
              width: {
                xs: "100%",
                sm: 300,
              },
              height: {
                xs: "calc(100vh - 100px)",
                sm: 800,
              },
              overflowY: "auto",
              padding: {
                xs: "10px",
                sm: "15px",
              },
            }}
            role="presentation"
            onClick={() => toggleDrawer(false)}
          >
            <Box>
              <h1
                className="text-2xl flex items-center justify-start p-2"
                style={{ color: "var(--color1)" }}
              >
                Inventory
                <BsLightbulbFill className="ml-4 var(--color1)" />
              </h1>
            </Box>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }} sx={{ my: 0 }}>
                  Items
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="items"
                      name="radio-buttons-group"
                      value={selectedOption}
                      sx={{
                        color: "var(--color1)", // Apply color to labels
                        '& .MuiRadio-root': {
                          color: "var(--color2)", // Unchecked radio button color
                        },
                        '& .Mui-checked': {
                          color: "var(--color1)", // Checked radio button color
                        },
                      }}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <FormControlLabel
                        value="all_Items"
                        control={<Radio />}
                        label="All Items"
                      />
                      <FormControlLabel
                        value="only_Newly_Added_Items"
                        control={<Radio />}
                        label="Only Newly Added Items"
                      />
                      <FormControlLabel
                        value="discontinued_items"
                        control={<Radio />}
                        label="Discontinued Items"
                      />
                      <FormControlLabel
                        value="only_Not_Set_HSN_Code"
                        control={<Radio />}
                        label="Only Not Set HSN Code"
                      />
                      <FormControlLabel
                        value="only_Not_Set_Categories"
                        control={<Radio />}
                        label="Only Not Set Categories"
                      />
                    </RadioGroup>
                  </FormControl>
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Category</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <FormGroup>
                    {categoryList.map((category) => (
                      <FormControlLabel
                        key={category.id}
                        control={
                          <Checkbox
                            sx={{
                              color: "var(--color2)", // Color for unchecked checkboxes
                              '&.Mui-checked': {
                                color: "var(--color1)", // Color for checked checkboxes
                              },
                            }}

                            checked={selectedCategoryIds.includes(category.id)}
                            onChange={(event) =>
                              handleCheckboxChange(event, category.id)
                            }
                            name={category.name}
                          />
                        }
                        label={category.category_name}
                      />
                    ))}
                  </FormGroup>
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>
                  Packging Type
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <FormGroup>
                    {packgingTypeList.map((packging) => (
                      <FormControlLabel
                        key={packging.id}
                        control={
                          <Checkbox
                            sx={{
                              color: "var(--color2)", // Color for unchecked checkboxes
                              '&.Mui-checked': {
                                color: "var(--color1)", // Color for checked checkboxes
                              },
                            }}
                            checked={selectedPackgingIds.includes(packging.id)}
                            onChange={(event) =>
                              handleCheckboxPackging(event, packging.id)
                            }
                            name={packging.name}
                          />
                        }
                        label={packging.packging_name}
                      />
                    ))}
                  </FormGroup>
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Expiry</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <AccordionDetails>
                    <ListItem disablePadding>
                      <FormGroup
                        value={selectedOptionExpiry}
                        onChange={handleExpiryChange}
                      // onChange={(e) => setSelectedOptionEpiry(e.target.value)}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                '&.Mui-checked': {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedOptionExpiry.includes("expired")}
                              value="expired"

                            />
                          }
                          label="Expired"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                '&.Mui-checked': {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedOptionExpiry.includes(
                                "next_month"
                              )}
                              value="next_month"
                            />
                          }
                          label="Next Month"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                '&.Mui-checked': {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedOptionExpiry.includes(
                                "next_two_month"
                              )}
                              value="next_two_month"
                            />
                          }
                          label="Next 2 Month"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                '&.Mui-checked': {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedOptionExpiry.includes(
                                "next_three_month"
                              )}
                              value="next_three_month"
                            />
                          }
                          label="Next 3 Month"
                        />
                      </FormGroup>
                    </ListItem>
                  </AccordionDetails>
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Stock</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="items"
                      name="radio-buttons-group"
                      sx={{
                        color: "var(--color1)", // Apply color to labels
                        '& .MuiRadio-root': {
                          color: "var(--color2)", // Unchecked radio button color
                        },
                        '& .Mui-checked': {
                          color: "var(--color1)", // Checked radio button color
                        },
                      }}
                      value={selectedOptionStock}
                      onChange={(e) => setSelectedOptionStock(e.target.value)}
                    >
                      <FormControlLabel
                        value="0_15"
                        control={<Radio />}
                        label="0 to 15"
                      />
                      <FormControlLabel
                        value="15_30"
                        control={<Radio />}
                        label="15 to 30"
                      />
                      <FormControlLabel
                        value="above_30"
                        control={<Radio />}
                        label="Above 30"
                      />
                      <FormControlLabel
                        value="minus_one"
                        control={<Radio />}
                        label="Minus Stock"
                      />
                    </RadioGroup>
                  </FormControl>
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Company</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={companyList}
                    size="small"
                    value={manufacturer}
                    onChange={(e, value) => {
                      setManufacturer(value);
                      if (e.type === "keydown" && e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    sx={{ width: 350 }}
                    getOptionLabel={(option) => option.company_name}
                    renderInput={(params) => (
                      <TextField
                 autoComplete="off"
                        {...params}
                        label="Select Company"
                        onFocus={() => setIsAutocompleteFocused(true)}
                        onBlur={() => setIsAutocompleteFocused(false)}
                      />
                    )}
                    ref={autocompleteRef}
                  />
                  {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type Company" variant="standard" size="small" value={manufacturer} onChange={(e) => { setManufacturer(e.target.value) }} /> */}
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Drug Group</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={drugGroupList}
                    size="small"
                    value={drugGroup}
                    sx={{ width: 350 }}
                    onChange={(e, value) => {
                      setDrugGroup(value);
                      if (e.type === "keydown" && e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                 autoComplete="off"
                        {...params}
                        label="Select DrugGroup"
                        onFocus={() => setIsAutocompleteFocused(true)}
                        onBlur={() => setIsAutocompleteFocused(false)}
                      />
                    )}
                    ref={autocompleteRef}
                  />
                  {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type DrugGroup" variant="standard" size="small" value={drugGroup} onChange={(e) => { setDrugGroup(e.target.value) }} /> */}
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>GST</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <FormGroup>
                    {gstList.map((gst) => (
                      <FormControlLabel
                        key={gst.id}
                        control={
                          <Checkbox
                            sx={{
                              color: "var(--color2)", // Color for unchecked checkboxes
                              '&.Mui-checked': {
                                color: "var(--color1)", // Color for checked checkboxes
                              },
                            }}
                            checked={selectedGstIds.includes(gst.id)}
                            onChange={(event) =>
                              handleCheckboxChangeGst(event, gst.id)
                            }
                            name={gst.name}
                          />
                        }
                        label={gst.name}
                      />
                    ))}
                  </FormGroup>
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Location</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={locationList}
                    size="small"
                    value={location}
                    sx={{ width: 350 }}
                    onChange={(e, value) => {
                      setLocation(value);
                      if (e.type === "keydown" && e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                 autoComplete="off"
                        {...params}
                        label="Select Location"
                        onFocus={() => setIsAutocompleteFocused(true)}
                        onBlur={() => setIsAutocompleteFocused(false)}
                      />
                    )}
                    ref={autocompleteRef}
                  />

                  {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type Location" variant="standard" size="small" value={location} onChange={((e) => { setLocation(e.target.value) })} /> */}
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>HSN Code</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    label="Type HSN Code"
                    variant="standard"
                    size="small"
                    value={hsnCode}
                    onChange={(e) => {
                      setHsnCode(e.target.value);
                    }}
                  />
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>Margin%</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    variant="standard"
                    size="small"
                    placeholder="10"
                    value={marginStart}
                    onChange={(e) => {
                      setMarginStart(e.target.value);
                    }}
                    sx={{ mx: 1 }}
                  />
                  to
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    variant="standard"
                    size="small"
                    placeholder="25"
                    value={marginEnd}
                    onChange={(e) => {
                      setMarginEnd(e.target.value);
                    }}
                    sx={{ mx: 1 }}
                  />
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>MRP</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    variant="standard"
                    size="small"
                    value={mrpStart}
                    onChange={(e) => {
                      setMRPStart(e.target.value);
                    }}
                    placeholder="1"
                    sx={{ mx: 1 }}
                  />
                  to
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    variant="standard"
                    size="small"
                    value={mrpEnd}
                    onChange={(e) => {
                      setMRPEnd(e.target.value);
                    }}
                    placeholder="100"
                    sx={{ mx: 1 }}
                  />
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography style={{ color: "var(--color1)" }}>PTR</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem disablePadding>
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    variant="standard"
                    size="small"
                    value={ptrStart}
                    onChange={(e) => {
                      setPTRStart(e.target.value);
                    }}
                    placeholder="1"
                    sx={{ mx: 1 }}
                  />
                  to
                  <TextField
                 autoComplete="off"
                    id="outlined-basic"
                    variant="standard"
                    size="small"
                    value={ptrEnd}
                    onChange={(e) => {
                      setPTREnd(e.target.value);
                    }}
                    placeholder="100"
                    sx={{ mx: 1 }}
                  />
                </ListItem>
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Box>
          <Box className="flex justify-around mt-8">
            <Button
              variant="contained"
              style={{
                background: "var(--color6)",
                outline: "none",
                boxShadow: "none",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "none")}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              style={{
                background: "var(--color1)",

                color: "white",
                size: "large",
              }}
              onClick={handleSearch}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
        <Box className="p-5 " sx={{ width: "100%" }}>
          <div className="flex flex-wrap  justify-between mb-4 relative">
            <TextField
                 autoComplete="off"

              id="outlined-basic"
              value={searchItem}
              size="small"
              autoFocus
              sx={{ width: "75%", marginTop: "5px" }}
              onChange={(e) => setSearchItem(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="standard"
              placeholder="Please search any items.."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                type: "search",
              }}
            />

            <div className="flex gap-2">
              <Button
                variant="contained"
                className="mt-4 absolute"
                style={{
                  backgroundColor: "var(--color1)",
                  color: "white",
                  textTransform: "none",
                  size: "small",
                }}
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button
                variant="contained"
                style={{
                  background: "var(--color1)",
                  color: "white",
                  textTransform: "none",
                  paddingLeft: "35px",
                }}
                onClick={handleFilterData}
              >
                <img src="/csv-file.png"
                  className="report-icon absolute mr-10"
                  alt="csv Icon"
                />

                Download
              </Button>

              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ background: "var(--color1)", textTransform: "none" }}
                variant="contained"
              >
                More <KeyboardArrowDownIcon />
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleBulkEdit}>Bulk Edit</MenuItem>
                <MenuItem onClick={handleBulkOrder}>Bulk Order</MenuItem>
                {/* <MenuItem onClick={handleBulkOrder}>Bulk Print QR</MenuItem> */}
              </Menu>
            </div>
          </div>
          {data.length > 0 ? (
            <TableContainer component={Paper} style={{ width: "100%", paddingInline: "25px", paddingBlock: "15px" }}>
              <table className="custom-table custom-table-invantory  cusror-pointer">
                <thead >
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={() => {
                          if (selectedItems.length === data.length) {
                            setSelectedItems([]);
                          } else {
                            setSelectedItems(data.map((item) => item.id));
                          }
                        }}
                        checked={selectedItems.length === data.length}
                      />
                    </th>
                    <th>
                      Item Name
                      <SwapVertIcon
                        className="cursor-pointer"
                        onClick={() => sortByColumn("iteam_name")}
                      />
                    </th>
                    <th>
                      Min
                      <SwapVertIcon
                        className="cursor-pointer" re
                        onClick={() => sortByColumn("minimum")}
                      />
                    </th>
                    <th>
                      Max
                      <SwapVertIcon
                        className="cursor-pointer"
                        onClick={() => sortByColumn("maximum")}
                      />
                    </th>
                    <th>
                      Stock
                      <SwapVertIcon
                        className="cursor-pointer"
                        onClick={() => sortByColumn("stock")}
                      />
                    </th>
                    <th>
                      Loc
                      <SwapVertIcon
                        className="cursor-pointer"
                        onClick={() => sortByColumn("location")}
                      />
                    </th>
                    <th>
                      Disc
                      <SwapVertIcon
                        className="cursor-pointer"
                        onClick={() => sortByColumn("discount")}
                      />
                    </th>
                    <th>
                      Barcode No
                      <SwapVertIcon
                        className="cursor-pointer"
                        onClick={() => sortByColumn("barcode")}
                      />
                    </th>


                    {/* <th onClick={() => sortByColumn("totalptr")}>Total PTR <SwapVertIcon /></th> */}
                  </tr>
                </thead>
                <tbody >
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          selectedIndex === index ? "#ceecfd" : "transparent",
                        color: selectedIndex === index ? "black" : "inherit",
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleCheckbox(item.id)}
                        />
                      </td>
                      <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        <div className="itemContainer flex items-center">
                          <div className="image-container flex mr-5">
                            <img
                              src={item.front_photo ? item.front_photo : "./tablet.png"}
                              alt={item.front_photo ? "Pharma" : "Tablet"}
                              className="w-10 h-10 ml-2 object-cover cursor-pointer"
                            />
                          </div>
                          <div
                            className="itemName flex-1"
                            style={{ fontSize: "15px" }}
                          >
                            {item?.iteam_name?.toUpperCase()}
                            <div className="text-gray-400 font-normal">
                              <span style={{ fontSize: "14px" }}>
                                Pack | 1*{item.weightage + " " + item.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.minimum == "null" ? "-" : item.minimum}
                      </td>
                      <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.maximum == "null" ? "-" : item.maximum}
                      </td>
                      <Tooltip
                        title="Stock Adjusted"
                        placement="top-start"
                        arrow>
                        <td
                        // onClick={() => {
                        //   history.push(`/inventoryView/${item.id}`);
                        // }}
                        >
                          <span>
                            <img
                              src="./approve.png"
                              className="report-icon inline mr-2"
                              alt="csv Icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handelAddOpen(item);
                              }}
                            />

                            {item.stock == "null" ? "-" : item.stock}
                          </span>

                        </td>
                      </Tooltip>
                      {/* <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.stock == "null" ? "-" : item.stock}
                      </td> */}
                      <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.loaction == "null" ? "-" : item.location}
                      </td>
                      <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.discount == "null" ? "-" : item.discount}
                      </td>
                      <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.barcode == "null" ? "-" : item.barcode}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={data?.[0].count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <div>
              <div className="vector-image">
                <div className="inventory-gif">
                  <img src="../inventory_screen.png"></img>
                </div>
                <span className="text-gray-500 font-medium mt-5">
                  Apply filters and explore your inventory
                </span>
              </div>
            </div>
          )}
        </Box>
      </Box>
      <Dialog open={openAddPopUp}>
        <DialogTitle id="alert-dialog-title" className="primary">
          Stock Adjustment
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={resetAddDialog}
          sx={{
            position: "absolute",
            right: 12,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div
              className="flex"
              style={{ flexDirection: "column", gap: "19px" }}
            >
              <div className="flex gap-4">
                <div>
                  <span className="title primary mb-2">Adjustment Date</span>
                  <DatePicker
                    className="custom-datepicker "
                    selected={adjustmentDate}
                    onChange={(newDate) => setAdjustDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                    minDate={subDays(new Date(), 15)} //
                  />
                </div>
                <div>
                  <span className="title mb-2">Item Name</span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={purchaseItemData}
                    size="small"
                    value={selectedItem}
                    onChange={handleOptionChange}
                    disabled
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.iteam_name}
                    renderInput={(params) => (
                      <TextField
                 autoComplete="off"
                        {...params}
                      // label="Select Item"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="title mb-2">Batch</span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={batchListData}
                    size="small"
                    value={batch}
                    onChange={handleBatchData}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.batch_number}
                    renderInput={(params) => (
                      <TextField
                 autoComplete="off" {...params} label="Select Batch" />
                    )}
                  />
                </div>

                <div>
                  <span className="title mb-2">Company</span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={companyList}
                    size="small"
                    disabled
                    value={selectedCompany}
                    // onChange={(e, value) => setSelectedCompany(value)}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.company_name}
                    renderInput={(params) => (
                      <TextField
                 autoComplete="off"
                        {...params}
                      // label="Select Company"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="title mb-2">Unit</span>
                  <TextField
                 autoComplete="off"
                    disabled
                    required
                    id="outlined-number"
                    sx={{ width: "130px" }}
                    size="small"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
                <div>
                  <span className="title mb-2">Expiry</span>
                  <TextField
                 autoComplete="off"
                    id="outlined-number"
                    sx={{ width: "130px" }}
                    size="small"
                    disabled
                    value={expiry}
                    onChange={(e) => {
                      setExpiry(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <span className="title mb-2">MRP</span>
                  <TextField
                 autoComplete="off"
                    id="outlined-number"
                    type="number"
                    sx={{ width: "130px" }}
                    size="small"
                    disabled
                    value={mrp}
                    onChange={(e) => {
                      setMrp(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="title mb-2">Stock </span>
                  <TextField
                 autoComplete="off"
                    id="outlined-number"
                    type="number"
                    sx={{ width: "130px" }}
                    size="small"
                    disabled
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <span className="title mb-2">Stock Adjusted </span>
                  {/* <TextField
                 autoComplete="off"
                                        id="outlined-number"
                                        type="number"
                                        sx={{ width: '130px' }}
                                        size="small"
                                        value={stockAdjust}
                                        onChange={(e) => { setStockAdjust(e.target.value) }}
                                    /> */}
                  <TextField
                 autoComplete="off"
                    id="outlined-number"
                    type="number"
                    sx={{ width: "130px" }}
                    size="small"
                    value={stockAdjust}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setStockAdjust(value > 0 ? -value : value);
                    }}
                  />
                </div>
                <div>
                  <span className="title mb-2">Remaining Stock </span>
                  <TextField
                 autoComplete="off"
                    disabled
                    id="outlined-number"
                    type="number"
                    sx={{ width: "130px" }}
                    size="small"
                    value={remainingStock}
                  />
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-4 mr-4 pb-4">
            <Button
              autoFocus
              variant="contained"
              className="p-5"
              onClick={validateForm}
              style={{
                color: "white",
                background: "#3f6212",
                outline: "none",
                boxShadow: "none",
              }}
            >
              Save
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={resetAddDialog}
              color="error"
              style={{
                color: "white",
                background: "#F31C1C",
                outline: "none",
                boxShadow: "none",
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Bulk Edit */}
      <Dialog open={openEdit}>
        <DialogTitle id="alert-dialog-title" className="primary">
          Bulk Edit
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={resetbulkDialog}
          sx={{
            position: "absolute",
            right: 12,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}> */}
            <div className="flex gap-4">
              <div>
                <span className="title mb-2">Location</span>

                <Autocomplete
                  value={locationBulk}
                  inputValue={locationBulk}
                  sx={{ width: 200 }}
                  size="small"
                  onChange={handleOptionChange}
                  onInputChange={handleInputChange}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option
                  }
                  options={locationList}
                  renderOption={(props, option) => (
                    <ListItem {...props}>
                      <ListItemText primary={option} />
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                 autoComplete="off" {...params} label="Select Location" />
                  )}
                  freeSolo
                />
              </div>
              <div>
                <span className="title mb-2">Barcode</span>
                <TextField
                 autoComplete="off"
                  id="outlined-number"
                  sx={{ width: "200px" }}
                  size="small"
                  value={barcode}
                  onChange={(e) => {
                    setBarcode(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* </div> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-4 mr-4 pb-4">
            <Button
              autoFocus
              variant="contained"
              className="p-5"
              color="success"
              onClick={validateBulkForm}
            >
              Saved
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={resetbulkDialog}
              color="error"
            >
              Cancel
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Bulk Order */}
      <Dialog open={bulkOrder}>
        <DialogTitle>
          <WarningAmberRoundedIcon
            sx={{ color: "#F31C1C", marginBottom: "5px", fontSize: "2.5rem" }}
          />
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Place Order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="primary-bg"
            style={{ backgroundColor: "#3f6212" }}

            autoFocus variant="contained" onClick={validateBulkOrder}>
            Yes
          </Button>
          <Button
            style={{ backgroundColor: "#F31C1C", color: "white" }}
            autoFocus

            variant="standard"
            onClick={() => setBulkOrder(false)}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Print QR */}
      {/* <Dialog open={openEdit} >
                <DialogTitle id="alert-dialog-title" className="secondary">
                    Bulk Edit
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={resetbulkDialog}
                    sx={{ position: 'absolute', right: 12, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="flex gap-4">
                            <div>
                                <span className="title mb-2">Location</span>
                                <TextField
                 autoComplete="off"
                                    // disabled
                                    required
                                    id="outlined-number"
                                    sx={{ width: '200px' }}
                                    size="small"
                                    value={locationBulk}
                                    onChange={(e) => setLocationBulk(e.target.value)}
                                />
                            </div>
                            <div>
                                <span className="title mb-2">Barcode</span>
                                <TextField
                 autoComplete="off"
                                    id="outlined-number"
                                    sx={{ width: '200px' }}
                                    size="small"
                                    value={barcode}
                                    onChange={(e) => { setBarcode(e.target.value) }}
                                />
                            </div>
                        </div>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className="flex gap-4 mr-4 pb-4">

                        <Button autoFocus variant="contained" className="p-5" color="success" onClick={validateBulkForm}>
                            Save
                        </Button>
                        <Button autoFocus variant="contained" onClick={resetbulkDialog} color="error"  >
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Dialog> */}
    </>
  );
};

export default InventoryList;
