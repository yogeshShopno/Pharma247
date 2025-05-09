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
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
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
  const [error, setError] = useState({searchItem: "",unit: "",weightage: "",pack: "",packaging: "",selectedCompany: "",selectedSuppliers: "",drugGroup: "",selectedCategory: "",selectedFrontFile: "",selectedMRPFile: "",selectedBackFile: "",});
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
        setLocationList(response.data.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

      });
  };

  const handleBackPhoto = (event) => {
    setSelectedBackFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    setBackImgUrl(url);
  };

  const handleFrontPhoto = (event) => {
    setSelectedFrontFile(event.target.files[0]);
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
      setUnitOptions(selectedPackaging.unit);
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
        setCompanyList(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);

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
        setCategoryList(response.data.data);
        setIsLoading(false);
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);


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
        setPackList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);


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

  const submitCategory = () => {
    let data = new FormData();
    data.append("category_name", categoryName);
    try {
      const response = axios.post("create-itemcategory", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
      }
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
    // if (packaging.length == 0) {
    //   newErrors.packaging = "Select any Packaging.";
    //   toast.error(newErrors.packaging);
    // }
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
    // if (!selectedCategory) {
    //   newErrors.selectedCategory = "Category is required.";
    //   toast.error(newErrors.selectedCategory);
    // }
    setError(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      submitItemRecord();
    }
    return isValid;
  };

  const submitItemRecord = async () => {
    let formData = new FormData();
    formData.append("item_name", searchItem ? searchItem : "");
    formData.append("packaging_id", packaging ? packaging : "");
    formData.append("old_unit", unit ? unit : "");
    formData.append("unit", weightage ? weightage : "");
    formData.append("pack", pack ? pack : "");
    formData.append("drug_group", drugGroup ? drugGroup.id : "");
    formData.append("gst", gst ? gst : "");
    formData.append("location", location ? location : "");
    formData.append("mrp", MRP ? MRP : "");
    formData.append("barcode", barcode ? barcode : "");
    formData.append("minimum", min ? min : "");
    formData.append("maximum", max ? max : "");
    formData.append("discount", disc ? disc : "");
    formData.append("margin", margin ? margin : "");
    formData.append("hsn_code", hsn_code ? hsn_code : "");
    formData.append("message", message ? message : "");
    formData.append("item_category_id", selectedCategory ? selectedCategory.id : "");
    formData.append("pahrma", selectedCompany ? selectedCompany.id : "");
    formData.append("distributer", selectedSuppliers ? selectedSuppliers.id : "");
    formData.append("front_photo", selectedFrontFile ? selectedFrontFile : "");
    formData.append("back_photo", selectedBackFile ? selectedBackFile : "");
    formData.append("mrp_photo", selectedMRPFile ? selectedMRPFile : "");
    try {
      const response = await axios.post("create-iteams", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
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
        console.error("API error:", error);

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
    
    const link = document.createElement("a");
    link.href = "/ItemSample_Data.csv";
    link.download = "ItemSample_Data.csv";
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
        <div className="content item_add_box" style={{ gap: "0px" }}>
          <div className="flex justify-between header_bx" style={{ padding: "0 20px" }}>
            <h1
              style={{
                color: "var(--color1)",
                alignItems: "center",
                fontWeight: 700,
                fontSize: "28px",

              }}
            >
              Add Item Master
            </h1>
            <Button
              variant="contained"
              style={{
                background: "var(--color1)",
                display: "flex",
                gap: "10px",
                borderRadius: "0",
              }}
              onClick={openFileUpload}
            >
              <CloudUploadIcon /> Import</Button>
          </div>
          <div
            className="mainform bg-white rounded-lg"
            style={{ padding: "20px" }}
          >
            <div className="row border-b border-dashed" style={{ borderColor: "var(--color2)" }}></div>

            <div className="pt-2">
              <h1 className="product" style={{ color: "var(--color1)", textAlign: "center" }}>
                Product Information
              </h1>
            </div>
            <div className="row border-b border-dashed pt-2" style={{ borderColor: "var(--color2)" }}></div>

            <div className="row gap-4 item_boxes">
              <div className="bg-white rounded-lg items-center mt-5 mb-5 p-5 item_inner_box" style={{
                border: '1px solid #628a2f73',
                boxShadow: 'rgb(184 202 161 / 7%) 11px 12px 20px',
                width: '50%',
                height: '100%'
              }}>
                <div className="row">
                  <div className="fields" style={{ width: "100%", flexDirection: "column", borderColor: 'var(--color1)' }}>
                    <label className="label">Item Name</label>
                    <Autocomplete
                      value={value}
                      inputValue={searchItem.toUpperCase()}
                      // sx={{ width: 350 }}
                      size="small"

                      onChange={handleOptionChange}
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
                        <TextField {...params} label="Search Item Name" autoFocus />

                      )}
                      freeSolo
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="row item_fld_rw md:pt-2">
                  <div className="fields Unit_divvv itm_divv_wid">
                    <label className="label">Unit</label>
                    <TextField
                      id="outlined-number"
                      type="number"
                      size="small"
                      // sx={{ minWidth: "150px" }}
                      value={weightage}
                      onChange={handlePack}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="fields Unit_divvv itm_divv_wid">
                    <label className="label">Pack</label>
                    <TextField
                      id="outlined-number"
                      disabled
                      // style={{ width: "160px" }}
                      size="small"
                      value={pack}
                      onChange={(e) => {
                        setPack(e.target.value);
                      }}
                    />
                    {/* {error.pack && <span style={{ color: 'red', fontSize: '14px' }}>{error.pack}</span>} */}
                  </div>
                </div>
                <div className="row item_fld_rw md:pt-2">
                  <div className="fields" style={{ width: "100%", flexDirection: "column" }}>
                    <div
                      style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                    >
                      <label className="label">Drug Group </label>
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
                        style={{ width: '100%' }}
                        onChange={(e, value) => setDrugGroup(value)}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} label="Select DrugGroup" />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0, 0, 0, 0.38) "
                            },
                            "&:hover fieldset": {
                              borderColor: "var(--color1)", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "var(--color1)", // Focused border color
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <div className="row item_fld_rw md:pt-2">
                  <div className="fields third_divv itm_divv_wid" style={{ width: '50%' }}>
                    <label className="label">Minimum</label>
                    <TextField
                      id="outlined-number"
                      // label="Min"
                      type="number"
                      // style={{ width: "232px" }}
                      size="small"
                      value={min}
                      onChange={(e) => {
                        setMin(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="fields third_divv itm_divv_wid" style={{ width: '50%' }}>
                    <label className="label">Maximum</label>
                    <TextField
                      id="outlined-number"
                      // label="Max."
                      type="number"
                      // style={{ width: "232px" }}
                      size="small"
                      value={max}
                      onChange={(e) => {
                        setMax(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="row item_fld_rw md:pt-2">
                  <div className="fields third_divv itm_divv_wid" style={{ width: '50%' }}>
                    <label className="label">Disc.%</label>
                    <TextField
                      id="outlined-number"
                      // label="Disc.%"
                      // style={{ width: "232px" }}
                      size="small"
                      type="number"
                      value={disc}
                      onChange={(e) => {
                        setDisc(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="fields third_divv itm_divv_wid" style={{ width: '50%' }}>
                    <label className="label">Margin%</label>
                    <TextField
                      id="outlined-number"
                      // label="Margin%"
                      // style={{ width: "232px" }}
                      size="small"
                      type="number"
                      value={margin}
                      onChange={(e) => {
                        setMargin(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>


              <div className="bg-white rounded-lg items-center mt-5 mb-5 p-5 item_inner_box" style={{
                border: '1px solid #628a2f73',
                boxShadow: 'rgb(184 202 161 / 7%) 11px 12px 20px',
                width: "50%",
                height: '100%'

              }}>
                <div className="row item_fld_rw">
                  <div className="fields Unit_divvv itm_divv_wid" style={{ width: "50%" }}>
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
                    <Box>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={companyList}
                        size="small"
                        value={selectedCompany}
                        onChange={(e, value) => setSelectedCompany(value)}
                        // sx={{ width: 350 }}
                        getOptionLabel={(option) => option.company_name}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Company" />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0, 0, 0, 0.38) "
                            },
                            "&:hover fieldset": {
                              borderColor: "var(--color1)", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "var(--color1)", // Focused border color
                            },
                          },
                        }}
                      />
                      {/* {error.selectedCompany && <span style={{ color: 'red', fontSize: '14px' }}>{error.selectedCompany}</span>} */}
                    </Box>
                  </div>

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
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
                    {/* <Box sx={{ minWidth: 350 }}> */}
                    <Box >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={suppliersList}
                        value={selectedSuppliers}
                        size="small"
                        // sx={{ width: 350 }}
                        onChange={(e, value) => setSelectedSuppliers(value)}
                        getOptionLabel={(option) => option.name.toUpperCase()}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Suppliers" />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0, 0, 0, 0.38) "
                            },
                            "&:hover fieldset": {
                              borderColor: "var(--color1)", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "var(--color1)", // Focused border color
                            },
                          },
                        }}
                      />
                      {error.selectedSuppliers && (
                        <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                          {error.selectedSuppliers}
                        </span>
                      )}
                    </Box>
                  </div>
                </div>
                <div className="row item_fld_rw md:pt-2">

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">GST%</label>
                    <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={gst}
                      // sx={{ minWidth: "350px" }}
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

                  {/* <div className="row border-b pb-6 " style={{ borderColor: "var(--color2)" }}> */}
                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">MRP</label>
                    <TextField
                      required
                      id="outlined-number"
                      // style={{ width: "350px" }}
                      size="small"
                      type="number"
                      value={MRP}
                      onChange={(e) => {
                        setMRP(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="row item_fld_rw md:pt-2">

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
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
                      // sx={{ width: 350 }}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                      freeSolo
                    />
                  </div>

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">Barcode</label>
                    <TextField
                      required
                      id="outlined-number"
                      // style={{ width: "350px" }}
                      size="small"
                      type="number"
                      value={barcode}
                      onChange={(e) => {
                        setBarcode(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", 
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", 
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="row item_fld_rw md:pt-2">
                  <div className="fields four_divv" style={{ width: "100%" }}>
                    <label className="label">Packaging In</label>
                     <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={packaging}
                      // sx={{ minWidth: "250px" }}
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
                </div>
                <div className="row item_fld_rw md:pt-2">
                  <div className="fields four_divv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">HSN code.</label>
                    <TextField
                      id="outlined-number"
                      // label="HSN code"
                      type="number"
                      // style={{ width: "232px" }}
                      size="small"
                      value={hsn_code}
                      onChange={(e) => {
                        sethsnCode(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="fields four_divv itm_divv_wid" style={{ width: "50%" }}>
                    <div
                      style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                    >
                      <label className="label">Category </label>
                      {/* <FaPlusCircle className='mt-1.5' onClick={() => setOpen(true)} /> */}
                    </div>
                    <Box >
                      <FormControl fullWidth>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={categoryList}
                          size="small"
                          value={selectedCategory}
                          // sx={{ width: 350 }}
                          onChange={(e, value) => setSelectedCategory(value)}
                          getOptionLabel={(option) => option.category_name}
                          renderInput={(params) => (
                            <TextField {...params} label="Select Category " />
                          )}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(0, 0, 0, 0.38) "
                              },
                              "&:hover fieldset": {
                                borderColor: "var(--color1)", // Hover border color
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "var(--color1)", // Focused border color
                              },
                            },
                          }}
                        />
                      </FormControl>
                    </Box>
                  </div>
                </div>

              </div>
            </div>

            <div className="row border-b border-dashed " style={{ borderColor: "var(--color2)" }}></div>

          
            <div >
              <div className="row pb-2"></div>
              <div>
                <h1 className="product" style={{ color: "var(--color1)", textAlign: "center" }}>
                  Product Images
                </h1>
              </div>
              <div className="row border-b border-dashed pt-2" style={{ borderColor: "var(--color2)" }}></div>

              <div className="row justify-center product_img_divv ">
                <div className="upload_bx1">
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
                      <div className="UploadClass" style={{ height: "218px", justifyContent: "center" }}>
                        <img src="./tablet.png" width="40%" height="40%" />
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
                          objectFit: "contain",
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
                        style={{ padding: "7px", background: "var(--color1)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedFrontFile && (
                    <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                      {error.selectedFrontFile}
                    </span>
                  )}
                </div>
                <div className="upload_bx2">
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
                      <div className="UploadClass" style={{ height: "218px", justifyContent: "center" }}>
                        <img src="./tablet.png" width="40%" height="40%" />
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
                          objectFit: "contain",
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
                        style={{ padding: "7px", background: "var(--color1)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedBackFile && (
                    <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                      {error.selectedBackFile}
                    </span>
                  )}
                </div>

                <div className="upload_bx3">
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
                      <div className="UploadClass" style={{ height: "218px", justifyContent: "center" }}>
                        <img src="./tablet.png" width="40%" height="40%" />
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
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <label htmlFor="mrp-photo-file" style={{ margin: "10px" }}>
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "var(--color1)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedMRPFile && (
                    <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                      {error.selectedMRPFile}
                    </span>
                  )}
                </div>
              </div>

            </div>

            <div className="row item_add_box_1">
              <div className="w-full pt-5">
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

            <div className="item_add_box_1" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                style={{ margin: "10px", marginLeft: "0px", background: "var(--color1)" }}
                onClick={handleSubmit}
              >Submit</Button>

              <Button variant="contained" style={{ margin: "10px 0 10px 0", background: "var(--color6)" }} onClick={resetData}>
                Cancel
              </Button>
            </div>
          </div>
        </div >
      )
      }
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
            style={{ background: "var(--color1)" }}


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
          <Button
            type="submit"
            variant="contained"
            onClick={submitDrugGroup}
            disabled={!drugGroupName}
            style={{ margin: "10px", background: "var(--COLOR_UI_PHARMACY)", color: "white" }}

          >
            Submit
          </Button>
          <Button style={{ background: "#F31C1C", color: "white" }} onClick={handleCloseDrugGroup}>Cancel</Button>

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

          <Button
            type="submit"
            onClick={submitCompany}
            variant="contained"
            disabled={!companyName}
            style={{ background: "var(--COLOR_UI_PHARMACY)", color: "white" }}
          >
            Submit
          </Button>
          <Button
            style={{ background: "#F31C1C", color: "white" }}

            onClick={handleCloseCompany}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/*Bulk Item Data Added  */}
      <Dialog open={openFile} className="custom-dialog">
        <DialogTitle className="primary">Import Item</DialogTitle>
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
            <div className="primary">Item File Upload</div>
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleDownload} style={{ backgroundColor: "var(--COLOR_UI_PHARMACY)", color: "white" }}  >
                  <CloudDownloadIcon className="mr-2" />
                  Download Sample File
                </Button>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <DialogActions>
        <Button
          autoFocus
          style={{ backgroundColor: "var(--color1)", color: "white" }}

          type="success"
          onClick={handleFileUpload}
        >
          Save
        </Button>
      </DialogActions>
    </div >
  );
};
export default Itemmaster;