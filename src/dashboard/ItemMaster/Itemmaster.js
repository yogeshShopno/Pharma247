import "../ItemMaster/itemMaster.css";
import Header from "../Header";
import {
  Box,
  Checkbox,
  TextField,
  Button,
  Typography,
  DialogContentText,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FaPlusCircle } from "react-icons/fa";
import tablet from "../../componets/Images/tablet.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Loader from "../../componets/loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Itemmaster = () => {
  const [item, setItem] = useState("");
  const [unit, setUnit] = useState(1);
  const [weightage, setWeightage] = useState(1);
  const [gst, setGST] = useState(null);
  const [hsn_code, sethsnCode] = useState(null);
  const [margin, setMargin] = useState(null);
  const [disc, setDisc] = useState(null);
  const [max, setMax] = useState(null);
  const [min, setMin] = useState(null);
  const [pack, setPack] = useState(`1 * ${unit}`);
  const [location, setLocation] = useState();
  const [drugGroup, setDrugGroup] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [value, setValue] = useState(null);
  const [locationvalue, setLocationValue] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);
  const [locationList, setLocationList] = useState([]);
  const generateRandomBarcode = () => {
    let barcode = "";
    for (let i = 0; i < 10; i++) {
      barcode += Math.floor(Math.random() * 12);
    }
    return barcode;
  };
  const [barcode, setBarcode] = useState(generateRandomBarcode());
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [drugGroupList, setDrugGroupList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedFrontFile, setSelectedFrontFile] = useState(null);
  const [selectedBackFile, setSelectedBackFile] = useState(null);
  const [selectedMRPFile, setSelectedMRPFile] = useState(null);
  const [gstList, setGstList] = useState([]);
  const [packList, setPackList] = useState([]);
  const [packaging, setPackaging] = useState([]);
  const [frontImgUrl, setFrontImgUrl] = useState(null);
  const [backImgUrl, setBackImgUrl] = useState(null);
  const [mrpImgUrl, setMrpImgUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [drugGroupName, setDrugGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [openDrugGroup, setOpenDrugGroup] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [scheduleChecked, setScheduleChecked] = useState(true);
  const [onlineorderChecked, setOnlineOrderChecked] = useState(true);
  const [MRP, setMRP] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxNotApplicableChecked, setTaxNotApplicableChecked] = useState(true);
  const [openFile, setOpenFile] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState({
    searchItem: "",
    unit: "",
    weightage: "",
    pack: "",
    packaging: "",
    selectedCompany: "",
    selectedSuppliers: "",
    drugGroup: "",
    selectedCategory: "",
    selectedFrontFile: "",
    selectedMRPFile: "",
    selectedBackFile: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "text/csv") {
        setFile(selectedFile);
      } else {
        toast.error("Please select an Excel or CSV file.");
      }
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      let data = new FormData();
      data.append("file", file);
      setIsLoading(true);
      try {
        await axios
          .post("item-import", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            toast.success(response.data.message);
            setOpenFile(false);
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
        console.error("API error:", error);
      }
    } else {
      toast.error("No file selected");
    }
  };
  useEffect(() => {
    listItemcatagory();
    listSuppliers();
    listOfGst();
    listOfPack();
    listDrougGroup();
    listOfCompany();
    listLocation();
  }, [1000]);

  let listLocation = () => {
    axios
      .get("item-location", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log('response :>> ', response);
        setLocationList(response.data.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        //console.log("API Error:", error);
      });
  };

  const handleBackPhoto = (event) => {
    setSelectedBackFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    setBackImgUrl(url);
  };

  const handleFrontPhoto = (event) => {
    setSelectedFrontFile(event.target.files[0]);
    //console.log(selectedFrontFile,'ml');
    const url = URL.createObjectURL(event.target.files[0]);
    setFrontImgUrl(url);
  };

  const handleMRPPhoto = (event) => {
    const file = event.target.files[0];
    setSelectedMRPFile(file);
    const url = URL.createObjectURL(file);
    setMrpImgUrl(url);
  };

  const handlePackagingChange = (e) => {
    const selectedPackagingId = e.target.value;
    setPackaging(selectedPackagingId);
    const selectedPackaging = packList.find(
      (option) => option.id === selectedPackagingId
    );
    // Update unit options based on selected packaging
    if (selectedPackaging) {
      setUnitOptions(selectedPackaging.unite);
      setUnit("");
    } else {
      setUnitOptions([]);
    }
  };

  let listOfCompany = () => {
    axios
      .get("company-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // const pharma = JSON.parse(localStorage.getItem("pharma"));
        //console.log("API Response Pharma:===", response);
        setCompanyList(response.data.data);
      })
      .catch((error) => {
        //console.log("API Error:", error);
      });
  };

  let listItemcatagory = () => {
    axios
      .get("list-itemcategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log("API Response item Catagory:===", response);
        setCategoryList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log("API Error:", error);
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
        //console.log("API Response item Catagory:===", response);
        setGstList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log("API Error:", error);
      });
  };

  let listOfPack = () => {
    axios
      .get("list-package", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log("API Response item Catagory:===", response);
        setPackList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log("API Error:", error);
      });
  };

  let listSuppliers = () => {
    axios
      .get("list-distributer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSuppliersList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log("API Error:", error);
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
        //console.log("API Error:", error);
      });
  };

  const submitCategory = () => {
    let data = new FormData();
    data.append("category_name", categoryName);
    try {
      axios.post("create-itemcategory", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      listItemcatagory();
      setOpen(false);
      setCategoryName("");
      setIsLoading(false);
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const submitDrugGroup = () => {
    let data = new FormData();
    data.append("name", drugGroupName);
    try {
      axios
        .post("drug-group-store", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenDrugGroup(false);
          setDrugGroupName("");
          setIsLoading(false);
          listDrougGroup();
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const submitCompany = async () => {
    let data = new FormData();
    data.append("company_name", companyName);
    try {
      await axios
        .post("company-store", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenCompany(false);
          setCompanyName("");
          listOfCompany();
          setIsLoading(false);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // const handle = () => {
  //   setOnlineOrderChecked(!onlineorderChecked)
  //   //console.log("onlineorderChecked", onlineorderChecked);
  // }

  const handleSubmit = () => {
    const newErrors = {};
    if (!searchItem.trim()) {
      newErrors.searchItem = "Item name is required.";
      toast.error(newErrors.searchItem);
    } else {
      const disallowedCharsRegex = /[@$]/;
      if (disallowedCharsRegex.test(searchItem)) {
        newErrors.searchItem = "Enter valid Item name.";
        toast.error("Enter valid Item name.");
      }
    }
    if (weightage == 0) {
      newErrors.weightage = "Unit is required.";
      toast.error(newErrors.weightage);
      newErrors.pack = "Enter Pack No.";
      toast.error(newErrors.pack);
    }
    if (packaging.length == 0) {
      newErrors.packaging = "Select any Packaging.";
      toast.error(newErrors.packaging);
    }
    // if (!location) {
    //   newErrors.location = 'Location is required.'
    //   toast.error(newErrors.location);
    // }
    if (!selectedCompany) {
      newErrors.selectedCompany = "Select any Company.";
      toast.error(newErrors.selectedCompany);
    }
    // if (!selectedSuppliers) {
    //   newErrors.selectedSuppliers = 'Select any Supplier.'
    // }
    if (!drugGroup) {
      newErrors.drugGroup = "Drug Group is required.";
      toast.error(newErrors.drugGroup);
    }
    if (!selectedCategory) {
      newErrors.selectedCategory = "Category is required.";
      toast.error(newErrors.selectedCategory);
    }
    setError(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      submitItemRecord();
    }
    return isValid;
  };

  const submitItemRecord = async () => {
    let formData = new FormData();
    formData.append("item_name", searchItem);
    formData.append("packaging_id", packaging);
    formData.append("unite", unit);
    formData.append("weightage", weightage);
    formData.append("pack", pack);
    formData.append("drug_group", drugGroup?.id);
    formData.append("gst", gst);
    formData.append("location", location);
    formData.append("mrp", MRP);
    formData.append("barcode", barcode);
    formData.append("minimum", min);
    formData.append("maximum", max);
    formData.append("discount", disc);
    formData.append("margin", margin);
    formData.append("hsn_code", hsn_code);
    formData.append("message", message);
    formData.append("item_category_id", selectedCategory?.id);
    formData.append("pahrma", selectedCompany?.id);
    formData.append("distributer", selectedSuppliers?.id);
    formData.append("front_photo", selectedFrontFile);
    formData.append("back_photo", selectedBackFile);
    formData.append("mrp_photo", selectedMRPFile);
    try {
      const response = await axios.post("create-iteams", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        //console.log("response===>", response.data);
        toast.success(response.data.message);
        setTimeout(() => {
          history.push("/admindashboard");
        }, 2000);
      } else if (response.data.status === 400) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Please try again later");
      }
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
          //console.log(data);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const showItemData = async (itemId) => {
    let data = new FormData();
    data.append("id", itemId);
    const params = {
      id: itemId,
    };
    try {
      const res = await axios
        .post("edit-iteam?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setPackaging(data?.package_id);
          setWeightage(data?.weightage);
          setPack(data?.packing_size);
          setMin(data?.minimum);
          setMax(data?.maximum);
          setMRP(data?.mrp);
          setGST(data?.gst);
          setBarcode(data?.barcode);
          setSelectedBackFile(data?.back_photo);
          setBackImgUrl(data?.back_photo);
          setFrontImgUrl(data?.front_photo);
          setSelectedFrontFile(data?.front_photo);
          setSelectedMRPFile(data?.mrp_photo);
          setMrpImgUrl(data?.mrp_photo);
          setMessage(data?.message);
          const category = categoryList.find(
            (cat) => cat.id == data?.category_id
          );
          setSelectedCategory(category);
          const drugGroup = drugGroupList.find(
            (cat) => cat.id == data?.drug_group_id
          );
          setDrugGroup(drugGroup);
          const company = companyList.find((cat) => cat.id == data?.company_id);
          setSelectedCompany(company);
          const supplier = suppliersList.find(
            (cat) => cat.id == data?.distributor_id
          );
          setSelectedSuppliers(supplier);

          const locationItem = locationList.find((x) => x === data?.loaction);
          //console.log("locationItem", locationItem);
          setLocationValue(locationItem);

          if (locationItem) {
            setLocationValue(locationItem);
          } else {
            setLocationValue(data?.loaction);
            console.warn(
              "Location not found in locationList, keeping the previous value:",
              data?.loaction
            );
          }

          setDisc(data?.discount);
          setMargin(data?.margin);
          sethsnCode(data?.hsn_code);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleLocationOptionChange = (event, newValue) => {
    setLocationValue(newValue);
    if (newValue) {
      setLocation(newValue);
    }
  };

  const handleOptionChange = (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      const itemName = newValue.iteam_name;
      const itemId = newValue.id; // Assuming `id` is part of the option object
      setSearchItem(itemName);
      handleSearch(itemName);
      showItemData(itemId);
    }
  };

  const handleLocationInputChange = (event, newInputValue) => {
    setLocation(newInputValue);
  };

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue);
    handleSearch(newInputValue);
    //console.log(newInputValue + "ayusf");
  };

  const handlePack = (e) => {
    setWeightage(e.target.value);
    setPack("1*" + e.target.value);
  };

  const handleClose = () => {
    setCategoryName("");
    setOpen(false);
  };

  const handleCloseDrugGroup = () => {
    setOpenDrugGroup(false);
  };

  const handleCloseCompany = () => {
    setOpenCompany(false);
  };
  const handleFileClose = () => {
    setOpenFile(false);
  };

  const handleDownload = () => {
    //console.log("Download function called");
    const link = document.createElement("a");
    link.href = "/ItemSample_Data.csv";
    link.download = "ItemSample_Data.csv";
    //console.log("Link href:", link.href);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetData = () => {
    setSearchItem("");
    setUnit(0);
    setWeightage(0);
    setGST("");
    sethsnCode("");
    setMargin("");
    setDisc("");
    setMax("");
    setMin("");
    setPack(`1 * 0`);
    setLocation("");
    setError("");
    setDrugGroup("");
    setMRP(0);
    setBarcode("");
    setPackaging("");
    setSelectedCategory(null);
    setSelectedCompany(null);
    setSelectedSuppliers(null);
    setTaxNotApplicableChecked(false);
    setScheduleChecked(false);
    setOnlineOrderChecked(false);
    setSelectedFrontFile(null);
    setSelectedBackFile(null);
    setSelectedMRPFile(null);
  };

  const openFileUpload = () => {
    setOpenFile(true);
  };
  return (
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
        <Loader />
      ) : (
        <div className="content">
          <div className="flex justify-between">
            <h1
              style={{
                color: "rgba(4,76,157)",
                alignItems: "center",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              Add Item Master
            </h1>
            <Button
              variant="contained"
              style={{
                background: "gray",
                display: "flex",
                gap: "10px",
                borderRadius: "0",
              }}
              onClick={openFileUpload}
            >
              <CloudUploadIcon /> Import
            </Button>
          </div>
          <div
            className="mainform bg-white rounded-lg"
            style={{ padding: "20px" }}
          >
            <div className="row">
              <div className="fields">
                <label className="label">Item Name</label>
                <Autocomplete
                  value={value} // The value selected from the list or entered by the user
                  inputValue={searchItem.toUpperCase()} // The current input value
                  sx={{ width: 350 }}
                  size="small"
                  onChange={handleOptionChange} // Handles option selection from the dropdown
                  onInputChange={handleInputChange} // Handles input changes while typing
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.iteam_name
                  }
                  options={itemList} // The list of available options
                  renderOption={(props, option) => (
                    <ListItem {...props}>
                      <ListItemText primary={option.iteam_name} />
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Search Item Name" />
                  )}
                  freeSolo // Allows the user to type values not in the list
                />
                {/* <TextField
                  id="outlined-number"
                  label="Item Name"
                  style={{ width: '350px' }}
                  size="small"
                  value={item}
                  onChange={(e) => { setItem(e.target.value) }}
                /> */}
                {/* {error.item && <span style={{ color: 'red', fontSize: '14px', fontSize: '14px' }}>{error.item}</span>} */}
              </div>

              <div className="fields">
                <label className="label">Packaging In</label>
                <Select
                  labelId="dropdown-label"
                  id="dropdown"
                  value={packaging}
                  sx={{ minWidth: "250px" }}
                  onChange={handlePackagingChange}
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Packaging
                  </MenuItem>
                  {packList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.packging_name}
                    </MenuItem>
                  ))}
                </Select>
                {/* {error.packaging && <span style={{ color: 'red', fontSize: '14px' }}>{error.packaging}</span>} */}
              </div>

              {/* <div className="fields">
                <label className="label">Unit</label>
                <Select
                  labelId="unit-dropdown-label"
                  id="unit-dropdown"
                  value={unit}
                  sx={{ minWidth: '250px' }}
                  onChange={(e) => setUnit(e.target.value)}
                  size="small"
                  disabled={unitOptions.length === 0}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select Unit</MenuItem>
                  {unitOptions.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>  */}

              <div className="fields">
                <label className="label">Unit</label>
                <TextField
                  id="outlined-number"
                  type="number"
                  size="small"
                  sx={{ minWidth: "150px" }}
                  value={weightage}
                  onChange={handlePack}
                />
              </div>

              <div className="fields">
                <label className="label">Pack</label>
                <TextField
                  id="outlined-number"
                  disabled
                  style={{ width: "160px" }}
                  size="small"
                  value={pack}
                  onChange={(e) => {
                    setPack(e.target.value);
                  }}
                />
                {/* {error.pack && <span style={{ color: 'red', fontSize: '14px' }}>{error.pack}</span>} */}
              </div>
            </div>

            <div className="row border-b-2 border-blue-400 pb-6">
              <div className="fields">
                <div
                  style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                >
                  <label className="label">Category </label>
                  {/* <FaPlusCircle className='mt-1.5' onClick={() => setOpen(true)} /> */}
                </div>
                <Box sx={{ minWidth: 350 }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={categoryList}
                      size="small"
                      value={selectedCategory}
                      sx={{ width: 350 }}
                      onChange={(e, value) => setSelectedCategory(value)}
                      getOptionLabel={(option) => option.category_name}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Category " />
                      )}
                    />
                  </FormControl>
                </Box>
              </div>

              <div className="fields">
                <div
                  style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                >
                  <label className="label">DrugGroup </label>
                  <FaPlusCircle
                    className="mt-1.5 cursor-pointer"
                    onClick={() => setOpenDrugGroup(true)}
                  />
                </div>
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={drugGroupList}
                    size="small"
                    value={drugGroup}
                    sx={{ width: 350 }}
                    onChange={(e, value) => setDrugGroup(value)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Select DrugGroup" />
                    )}
                  />
                </FormControl>
              </div>

              <div className="fields">
                <label className="label">Location</label>
                {/* <TextField
                  id="outlined-number"
                  label="Location"
                  style={{ width: '350px' }}
                  size="small"
                  value={location.toUpperCase()}
                  onChange={(e) => { setLocation(e.target.value) }}
                /> */}

                <Autocomplete
                  value={locationvalue}
                  inputValue={location}
                  sx={{ width: 350 }}
                  size="small"
                  onChange={handleLocationOptionChange}
                  onInputChange={handleLocationInputChange}
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
                    <TextField {...params} label="Select Location" />
                  )}
                  freeSolo
                />
              </div>
            </div>

            <div className="row ">
              <div className="fields">
                <div
                  style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                >
                  <label className="label">Company </label>
                  <FaPlusCircle
                    className="mt-1.5 cursor-pointer"
                    onClick={() => setOpenCompany(true)}
                  />
                </div>
                {/* <label className="label"></label> */}
                <Box sx={{ minWidth: 350 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={companyList}
                    size="small"
                    value={selectedCompany}
                    onChange={(e, value) => setSelectedCompany(value)}
                    sx={{ width: 350 }}
                    getOptionLabel={(option) => option.company_name}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Company" />
                    )}
                  />
                  {/* {error.selectedCompany && <span style={{ color: 'red', fontSize: '14px' }}>{error.selectedCompany}</span>} */}
                </Box>
              </div>

              <div className="fields">
                <div
                  style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                >
                  <label className="label">Suppliers </label>
                  <FaPlusCircle
                    className="mt-1.5 cursor-pointer"
                    onClick={() => history.push("/more/addDistributer")}
                  />
                </div>
                {/* <label className="label"></label> */}
                <Box sx={{ minWidth: 350 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={suppliersList}
                    value={selectedSuppliers}
                    size="small"
                    sx={{ width: 350 }}
                    onChange={(e, value) => setSelectedSuppliers(value)}
                    getOptionLabel={(option) => option.name.toUpperCase()}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Suppliers" />
                    )}
                  />
                  {error.selectedSuppliers && (
                    <span style={{ color: "red", fontSize: "14px" }}>
                      {error.selectedSuppliers}
                    </span>
                  )}
                </Box>
              </div>

              <div className="fields">
                <label className="label">GST%</label>
                <Select
                  labelId="dropdown-label"
                  id="dropdown"
                  value={gst}
                  sx={{ minWidth: "350px" }}
                  onChange={(e) => {
                    setGST(e.target.value);
                  }}
                  size="small"
                  displayEmpty
                >
                  {gstList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="row border-b-2 border-blue-400 pb-6">
              <div className="fields">
                <label className="label">MRP</label>
                <TextField
                  required
                  id="outlined-number"
                  style={{ width: "350px" }}
                  size="small"
                  type="number"
                  value={MRP}
                  onChange={(e) => {
                    setMRP(e.target.value);
                  }}
                />
              </div>
              <div className="fields">
                <label className="label">Barcode</label>
                <TextField
                  required
                  id="outlined-number"
                  style={{ width: "350px" }}
                  size="small"
                  type="number"
                  value={barcode}
                  onChange={(e) => {
                    setBarcode(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="fields">
                <label className="label">Minimum</label>
                <TextField
                  id="outlined-number"
                  // label="Min"
                  type="number"
                  style={{ width: "232px" }}
                  size="small"
                  value={min}
                  onChange={(e) => {
                    setMin(e.target.value);
                  }}
                />
              </div>
              <div className="fields">
                <label className="label">Maximum</label>
                <TextField
                  id="outlined-number"
                  // label="Max."
                  type="number"
                  style={{ width: "232px" }}
                  size="small"
                  value={max}
                  onChange={(e) => {
                    setMax(e.target.value);
                  }}
                />
              </div>
              <div className="fields">
                <label className="label">Disc.%</label>
                <TextField
                  id="outlined-number"
                  // label="Disc.%"
                  style={{ width: "232px" }}
                  size="small"
                  type="number"
                  value={disc}
                  onChange={(e) => {
                    setDisc(e.target.value);
                  }}
                />
              </div>
              <div className="fields">
                <label className="label">Margin%</label>
                <TextField
                  id="outlined-number"
                  // label="Margin%"
                  style={{ width: "232px" }}
                  size="small"
                  type="number"
                  value={margin}
                  onChange={(e) => {
                    setMargin(e.target.value);
                  }}
                />
              </div>
              <div className="fields">
                <label className="label">HSN code.</label>
                <TextField
                  id="outlined-number"
                  // label="HSN code"
                  type="number"
                  style={{ width: "232px" }}
                  size="small"
                  value={hsn_code}
                  onChange={(e) => {
                    sethsnCode(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div>
                <h1 className="product" style={{ color: "rgb(4,76,157)" }}>
                  Product Images
                </h1>
              </div>
              <div className="row justify-center">
                <div>
                  <div className="uploadBox">
                    <h1 className="text-gray-600 font-semibold text-lg md:text-xl">
                      Front Photo
                    </h1>
                  </div>
                  <div className="upload">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="front-photo-file"
                      type="file"
                      onChange={handleFrontPhoto}
                    />
                    {selectedFrontFile == null ? (
                      <div className="UploadClass">
                        <img src={tablet} width="40%" height="40%" />
                        <span>Drop your image here</span>
                      </div>
                    ) : (
                      <img
                        src={frontImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                        }}
                      />
                    )}
                    <label
                      htmlFor="front-photo-file"
                      style={{ margin: "10px" }}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "rgb(4,76,157)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedFrontFile && (
                    <span style={{ color: "red", fontSize: "14px" }}>
                      {error.selectedFrontFile}
                    </span>
                  )}
                </div>
                <div>
                  <div className="uploadBox">
                    <h1 className="text-gray-600 font-semibold text-lg md:text-xl">
                      Backside Photo
                    </h1>
                  </div>
                  <div className="upload">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="back-button-file"
                      type="file"
                      onChange={handleBackPhoto}
                    />
                    {selectedBackFile == null ? (
                      <div className="UploadClass">
                        <img src={tablet} width="40%" height="40%" />
                        <span>Drop your image here</span>
                      </div>
                    ) : (
                      <img
                        src={backImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                        }}
                      />
                    )}
                    <label
                      htmlFor="back-button-file"
                      style={{ margin: "10px" }}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "rgb(4,76,157)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedBackFile && (
                    <span style={{ color: "red", fontSize: "14px" }}>
                      {error.selectedBackFile}
                    </span>
                  )}
                </div>

                <div>
                  <div className="uploadBox">
                    <h1 className="text-gray-600 font-semibold text-lg md:text-xl">
                      MRP Photo
                    </h1>
                  </div>
                  <div className="upload">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="mrp-photo-file"
                      type="file"
                      onChange={handleMRPPhoto}
                    />
                    {selectedMRPFile == null ? (
                      <div className="UploadClass">
                        <img src={tablet} width="40%" height="40%" />
                        <span>Drop your image here</span>
                      </div>
                    ) : (
                      <img
                        src={mrpImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                        }}
                      />
                    )}
                    <label htmlFor="mrp-photo-file" style={{ margin: "10px" }}>
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "rgb(4,76,157)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedMRPFile && (
                    <span style={{ color: "red", fontSize: "14px" }}>
                      {error.selectedMRPFile}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="w-full md:w-2/3 lg:w-1/2 xl:w-full">
                <label className="label block text-sm font-medium text-gray-700 my-2">
                  Message
                </label>
                <TextField
                  id="outlined-multiline-static"
                  label="Message"
                  multiline
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  className="w-full"
                  rows={4}
                  variant="outlined"
                />
              </div>
            </div>

            <div>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px", background: "rgb(4,76,157)" }}
                onClick={handleSubmit}
              >Submit</Button>
              <Button variant="contained" color="error" onClick={resetData}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Category Dialog Box */}
      <Dialog id="modal" open={open} onClose={handleClose}>
        <DialogTitle>Create Catagory</DialogTitle>
        <DialogContent>
          <div className="dialog">
            <label className="mb-2">Catagory Name</label>
            <TextField
              id="outlined-number"
              label="Enter Catagory Name"
              type="text"
              size="small"
              style={{ width: "400px" }}
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            onClick={submitCategory}
            variant="contained"
            disabled={!categoryName}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* DrugGroup dialog Box */}
      <Dialog id="modal" open={openDrugGroup} onClose={handleCloseDrugGroup}>
        <DialogTitle>Create DrugGroup</DialogTitle>
        <DialogContent>
          <div className="dialog">
            <label className="mb-2">DrugGroup Name</label>
            <TextField
              id="outlined-number"
              label="Enter DrugGroup Name"
              type="text"
              size="small"
              style={{ width: "400px" }}
              value={drugGroupName}
              onChange={(e) => {
                setDrugGroupName(e.target.value);
              }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDrugGroup}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={submitDrugGroup}
            disabled={!drugGroupName}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Company Dialog Box */}
      <Dialog id="modal" open={openCompany} onClose={handleClose}>
        <DialogTitle>Create Company</DialogTitle>
        <DialogContent>
          <div className="dialog">
            <label className="mb-2">Company Name</label>
            <TextField
              id="outlined-number"
              label="Enter Company Name"
              type="text"
              size="small"
              style={{ width: "400px" }}
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompany}>Cancel</Button>
          <Button
            type="submit"
            onClick={submitCompany}
            variant="contained"
            disabled={!companyName}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/*Bulk Item Data Added  */}
      <Dialog open={openFile} className="custom-dialog">
        <DialogTitle id="alert-dialog-title">Import Item</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleFileClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="darkblue_text">Item File Upload</div>
            <div
              style={{ display: "flex", gap: "15px", flexDirection: "column" }}
            >
              <div>
                <input
                  className="File-upload"
                  type="file"
                  accept=".csv"
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <span className="errorFile">*select only .csv File.</span>
              </div>
              <div>
                <a onClick={handleDownload} className="downloadFile">
                  Sample File Download
                </a>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="success"
            onClick={handleFileUpload}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Itemmaster;
