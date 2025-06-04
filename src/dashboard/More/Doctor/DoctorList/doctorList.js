import Header from "../../../Header";
import Loader from "../../../../componets/loader/Loader";
import React, { useEffect, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { BsLightbulbFill } from "react-icons/bs";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  InputAdornment,
  ListItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const DoctorList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [mobileNo, setMobileNo] = useState("");
  const [licence, setLicence] = useState("");
  const [clinic, setClinic] = useState();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [emailId, setEmailId] = useState("");
  const history = useHistory();
  const rowsPerPage = 10;
  const permissions = usePermissions();
  // const [searchDoctor, setSearchDoctor] = useState('')

  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [buttonLabel, setButtonLabel] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [header, setHeader] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";

  const columns = [
    { id: "name", label: "Doctor Name", minWidth: 150 },
    { id: "phone_number", label: "Mobile No", minWidth: 150 },
    { id: "email", label: "Email ID", minWidth: 150 },
    { id: "clinic", label: "Clinic Name", minWidth: 150 },
  ];
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const handlePrint = () => {
    window.print("/return/add");
  };
  const goIntoAdd = () => {
    history.push("/return/add");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setMobileNo(value);
    }
  };

  const resetAddDialog = () => {
    setDoctor("");
    setMobileNo("");
    setEmailId("");
    setAddress("");
    setLicence("");
    setClinic("");
    setCity("");
    setErrors({});
    setOpenAddPopUp(false);
  };

  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setIsEditMode(true);
    setHeader("Edit Doctor");
    setButtonLabel("Update");
    setDoctorId(row.id);
    setDoctor(row.name);
    setEmailId(row.email);
    setMobileNo(row.phone_number);
    setLicence(row.license);
    setClinic(row.clinic);
    setAddress(row.address);
  };

  const exportToCSV = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", currentPage);
    data.append("iss_value", "download");
    const params = {
      page: currentPage,
    };
    try {
      await axios
        .post("doctor-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const csvData = response.data.data;
          if (csvData) {
            const csvString = convertToCSV(csvData);
            const blob = new Blob([csvString], {
              type: "text/csv;charset=utf-8;",
            });
            saveAs(blob, "doctors.csv");
          }

          setTableData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
    }
  };

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Add Doctor");
    setButtonLabel("Save");
  };

  const AddDoctor = () => {
    if (isEditMode == false) {
      //  Add Doctor
      const newErrors = {};
      if (!doctor) newErrors.Doctor = "Doctor is required";
      // if (!mobileNo) {
      //     newErrors.mobileNo = 'Mobile No is required';
      // } else
      // if (!/^\d{10}$/.test(mobileNo)) {
      //     newErrors.mobileNo = 'Mobile number must be 10 digits';
      // }
      // if (!clinic) newErrors.clinic = 'Clinic is required';

      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddDoctorRecord();
      }
      return isValid;
    } else {
      const newErrors = {};
      if (!doctor) newErrors.Doctor = "Doctor is required";
      // if (!mobileNo) {
      //     newErrors.mobileNo = 'Mobile No is required';
      // } else if (!/^\d{10}$/.test(mobileNo)) {
      //     newErrors.mobileNo = 'Mobile number must be 10 digits';
      // }
      // if (!clinic) newErrors.clinic = 'Clinic is required';

      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditDoctorRecord();
      }
      return isValid;
    }
  };

  const AddDoctorRecord = async () => {
    let data = new FormData();
    data.append("name", doctor);
    data.append("email", emailId);
    data.append("mobile", mobileNo);
    data.append("license", licence);
    data.append("address", address);
    data.append("clinic", clinic);
    try {
      await axios
        .post("doctor-create", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          ListOfDoctor();
          setOpenAddPopUp(false);
          setDoctor("");
          setEmailId("");
          setMobileNo("");
          setLicence("");
          setClinic("");
          setAddress("");
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      }
      // console.error("API error:", error);
    }
  };

  const EditDoctorRecord = async () => {
    let data = new FormData();
    data.append("id", doctorId);
    data.append("name", doctor);
    data.append("email", emailId);
    data.append("mobile", mobileNo);
    data.append("license", licence);
    data.append("address", address);
    data.append("clinic", clinic);
    try {
      await axios
        .post("doctor-update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          ListOfDoctor();
          setOpenAddPopUp(false);
          setDoctor("");
          setEmailId("");
          setMobileNo("");
          setLicence("");
          setClinic("");
          setAddress("");
          setIsEditMode(false);
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      toast.success(error.message);
    }
  };

  // const handleOptionChange = (event, newValue) => {
  //     setDoctor(newValue);
  // };
  const handleOptionChange = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setDoctor(newValue.name);
    } else {
      setDoctor(newValue);
    }
  };
  const handleInputChange = (event, newInputValue) => {
    setDoctor(newInputValue);
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      ListOfDoctor(newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    ListOfDoctor(newPage);
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    ListOfDoctor(pageNum);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType === "application/vnd.ms-excel" ||
        fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "text/csv"
      ) {
        setFile(selectedFile);
      } else {
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Doctor_Sample_Data.csv";
    link.download = "Doctor_Sample_Data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFilePopUP = () => {
    setOpenUpload(true);
  };

  const filteredList = paginatedData.filter((row) => {
    return searchTerms.every((term, index) => {
      const value = row[columns[index].id];
      return String(value).toLowerCase().includes(term.toLowerCase());
    });
  });

  const sortByColumn = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setTableData(sortedData);
  };

  const handleSearchChange = (index, event) => {
    if (event.key === "Enter") {
      const newSearchTerms = [...searchTerms];
      newSearchTerms[index] = event.target.value;
      setSearchTerms(newSearchTerms);
    }
  };

  useEffect(() => {
    ListOfDoctor();
  }, []);

  const convertToCSV = (data) => {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
  };

  const ListOfDoctor = async (currentPage) => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", currentPage);
    const params = {
      page: currentPage,
    };
    try {
      await axios
        .post("doctor-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
    }
  };

  const uploadDoctorFile = async () => {
    let data = new FormData();
    data.append("file", file);
    try {
      await axios
        .post("doctor-import", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          ListOfDoctor();
          setOpenUpload(false);
          toast.success(response.data.message);
        });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Please Select file");
      }
      console.error("API error:", error);
    }
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
        <div>
          <div className="p-6">
            <div
              className="mb-4 cust_list_main_hdr_bg"
              style={{ display: "flex", gap: "4px", marginBottom: "13px" }}
            >
              <div
                style={{ display: "flex", gap: "7px", alignItems: "center" }}
                className="mt-2"
              >
                <span
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  Doctors
                </span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
              </div>
              <div className="headerList cust_hdr_mn_bg mt-2">
                {hasPermission(permissions, "doctor import") && (
                  <Button
                    variant="contained"
                    className="gap-2"
                    style={{ background: "var(--color1)", display: "flex" }}
                    onClick={openFilePopUP}
                  >
                    <CloudUploadIcon /> Import
                  </Button>
                )}
                {hasPermission(permissions, "doctor create") && (
                  <Button
                    variant="contained"
                    className="gap-2"
                    style={{ background: "var(--color1)", display: "flex" }}
                    onClick={handelAddOpen}
                  >
                    <AddIcon /> Add Doctor
                  </Button>
                )}
                {hasPermission(permissions, "doctor download") && (
                  <Button
                    variant="contained"
                    className="gap-7"
                    style={{
                      background: "var(--color1)",
                      color: "white",
                      // paddingLeft: "35px",
                      textTransform: "none",
                      display: "flex",
                    }}
                    onClick={exportToCSV}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src="/csv-file.png"
                        className="report-icon absolute mr-10"
                        alt="csv Icon"
                      />
                    </div>
                    Download
                  </Button>
                )}
              </div>
            </div>
            <div
              className="row border-b border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
            <div className="mt-4">
              <div className="overflow-x-auto mt-4">
                <table
                  className="w-full border-collapse custom-table"
                  style={{
                    whiteSpace: "nowrap",
                    borderCollapse: "separate",
                    borderSpacing: "0 6px",
                  }}
                >
                  <thead className="">
                    <tr>
                      <th>SR. No</th>
                      {columns.map((column, index) => (
                        <th
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          <div className="headerStyle">
                            <span onClick={() => sortByColumn(column.id)}>
                              {column.label}
                            </span>
                            <SwapVertIcon />
                            <TextField
                              autoComplete="off"
                              label={`Search ${column.label}`}
                              id="filled-basic"
                              size="small"
                              sx={{ minWidth: "150px" }}
                              defaultvalue={searchTerms[index]}
                              onKeyDown={(e) => handleSearchChange(index, e)}
                            />
                          </div>
                        </th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#3f621217" }}>
                    {filteredList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length + 2}
                          style={{
                            textAlign: "center",
                            color: "gray",
                            borderRadius: "10px 10px 10px 10px",
                          }}
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((row, index) => {
                        return (
                          <tr
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            <td style={{ borderRadius: "10px 0 0 10px" }}>
                              {startIndex + index}
                            </td>
                            {columns.map((column) => {
                              let value = row[column.id];
                              if (column.id === "email") {
                                if (
                                  value &&
                                  value[0] !== value[0].toLowerCase()
                                ) {
                                  value = value.toLowerCase();
                                }
                              }
                              return (
                                <td
                                  key={column.id}
                                  align={column.align}
                                  onClick={() => {
                                    history.push(`/more/doctor/${row.id}`);
                                  }}
                                  style={
                                    column.id === "email"
                                      ? { textTransform: "none" }
                                      : {}
                                  }
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </td>
                              );
                            })}
                            <td style={{ borderRadius: "0 10px 10px 0" }}>
                              <div
                                style={{
                                  fontSize: "15px",
                                  display: "flex",
                                  gap: "5px",
                                  color: "gray",
                                  cursor: "pointer",
                                }}
                              >
                                <VisibilityIcon
                                  style={{ color: "var(--color1)" }}
                                  onClick={() => {
                                    history.push(`/more/doctor/${row.id}`);
                                  }}
                                />
                                {hasPermission(permissions, "doctor edit") && (
                                  <BorderColorIcon
                                    style={{ color: "var(--color1)" }}
                                    onClick={() => handleEditOpen(row)}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div
                className="mt-4 space-x-1"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <button
                  onClick={handlePrevious}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === 1
                    ? "bg-gray-200 text-gray-700"
                    : "secondary-bg text-white"
                    }`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {currentPage > 2 && (
                  <button
                    onClick={() => handleClick(currentPage - 2)}
                    className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                  >
                    {currentPage - 2}
                  </button>
                )}
                {currentPage > 1 && (
                  <button
                    onClick={() => handleClick(currentPage - 1)}
                    className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                  >
                    {currentPage - 1}
                  </button>
                )}
                <button
                  onClick={() => handleClick(currentPage)}
                  className="mx-1 px-3 py-1 rounded secondary-bg text-white"
                >
                  {currentPage}
                </button>
                {currentPage < totalPages && (
                  <button
                    onClick={() => handleClick(currentPage + 1)}
                    className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                  >
                    {currentPage + 1}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`mx-1 px-3 py-1 rounded ${currentPage >= totalPages
                    ? "bg-gray-200 text-gray-700 "
                    : "secondary-bg text-white"
                    }`}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            {/* File Upload Popup */}
            <Dialog open={openUpload} className="custom-dialog">
              <DialogTitle id="alert-dialog-title" className="primary">
                Import Doctor
              </DialogTitle>
              <div className="">
                <Alert severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  Please Make Sure Repeated Email ID record is not accepted.
                </Alert>
              </div>
              <IconButton
                aria-label="close"
                onClick={() => setOpenUpload(false)}
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
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "column",
                    }}
                  >
                    <div className="mt-2">
                      <input
                        className="File-upload"
                        type="file"
                        accept=".csv"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                      <span className="errorFile" style={{ fontSize: "small" }}>
                        *select only .csv, File.
                      </span>
                    </div>
                    <div className="mt-2">
                      <Button
                        onClick={handleDownload}
                        style={{
                          backgroundColor: "var(--COLOR_UI_PHARMACY)",
                          color: "white",
                        }}
                        className="downloadFile"
                      >
                        <CloudDownloadIcon className="mr-2" />
                        Download Sample File
                      </Button>
                    </div>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions style={{ padding: "0 24px 24px" }}>
                <Button
                  autoFocus
                  variant="contained"
                  style={{
                    backgroundColor: "var(--COLOR_UI_PHARMACY)",
                    color: "white",
                  }}
                  onClick={uploadDoctorFile}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openAddPopUp} className="custom-dialog modal_991">
              <DialogTitle id="alert-dialog-title" className="primary">
                {header}
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={resetAddDialog}
                className="text-gray-500"
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
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                      <div className="flex flex-col " style={{ width: "100%" }}>
                        <div className="mb-1">
                          <span className="label primary mb-4">
                            Doctor Name
                          </span>
                          <span className="text-red-600 ml-1">*</span>
                        </div>
                        <Autocomplete
                          value={doctor}
                          // inputValue={searchItem.toUpperCase()}
                          style={{ width: " 100%" }}
                          size="small"
                          onChange={handleOptionChange}
                          onInputChange={handleInputChange}
                          startAdornment={
                            <InputAdornment position="start">
                              Dr.
                            </InputAdornment>
                          }
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.name
                          }
                          options={tableData}
                          renderOption={(props, option) => (
                            <ListItem {...props}>
                              <ListItemText primary={option.name} />
                            </ListItem>
                          )}
                          renderInput={(params) => (
                            <TextField autoComplete="off" {...params} />
                          )}
                          freeSolo
                        />
                        {errors.Doctor && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.Doctor}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col " style={{ width: "100%" }}>
                        <div className="mb-1">
                          <span className="label primary">Clinic Name</span>
                          {/* <span className="text-red-600 ml-1">*</span> */}
                        </div>
                        <TextField
                          autoComplete="off"
                          id="outlined-multiline-static"
                          size="small"
                          value={clinic}
                          onChange={(e) => {
                            setClinic(e.target.value);
                          }}
                          className="w-full"
                          variant="outlined"
                        />
                        {errors.clinic && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.clinic}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col " style={{ width: "100%" }}>
                        <span className="label primary">Email ID</span>
                        <TextField
                          autoComplete="off"
                          id="outlined-multiline-static"
                          size="small"
                          value={emailId}
                          onChange={(e) => {
                            setEmailId(e.target.value);
                          }}
                          className="w-full"
                          variant="outlined"
                        />
                      </div>
                      <div className="flex flex-col " style={{ width: "100%" }}>
                        <div className="mb-1">
                          <span className="label primary">Mobile No</span>
                          {/* <span className="text-red-600 ml-1">*</span> */}
                        </div>
                        <OutlinedInput
                          type="number"
                          value={mobileNo}
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">
                              +91
                            </InputAdornment>
                          }
                          className="w-full"
                          size="small"
                        />
                        {errors.mobileNo && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.mobileNo}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col " style={{ width: "100%" }}>
                        <span className="label primary">Licence No.</span>
                        <OutlinedInput
                          type="number"
                          value={licence}
                          onChange={(e) => {
                            setLicence(e.target.value);
                          }}
                          className="w-full"
                          size="small"
                        />
                      </div>
                      <div className="flex flex-col " style={{ width: "100%" }}>
                        <span className="label primary">Address</span>
                        <TextField
                          autoComplete="off"
                          id="outlined-multiline-static"
                          size="small"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                          className="w-full"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions style={{ padding: "20px 24px" }}>
                <Button
                  autoFocus
                  variant="contained"
                  style={{
                    backgroundColor: "var(--COLOR_UI_PHARMACY)",
                    color: "white",
                  }}
                  onClick={AddDoctor}
                >
                  {buttonLabel}
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  color="error"
                  onClick={resetAddDialog}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      )}
      {/* } */}
    </>
  );
};
export default DoctorList;
