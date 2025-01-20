import {
  Alert,
  AlertTitle,
  Button,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Header from "../../../Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { BsLightbulbFill } from "react-icons/bs";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import TextField from "@mui/material/TextField";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
const columns = [
  { id: "name", label: "Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "gst", label: "GST", minWidth: 150 },
  { id: "phone_number", label: "Phone Number", minWidth: 150 },
];
const DistributerList = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const permissions = usePermissions();
  const [header, setHeader] = useState("");
  const [tableData, setTableData] = useState([]);
  const rowsPerPage = 10;
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const [isLoading, setIsLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [gstNumber, setGstnumber] = useState("");
  const [distributerName, setDistributerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [licenceNo, setLicenceNo] = useState("");
  const [distributorDrugLicenseNo, setDistributorDrugLicenseNo] = useState("");
  const [creditDuedays, setCreditDuedays] = useState("");
  const [distributerId, setDistributerId] = useState(null);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const [errors, setErrors] = useState({});
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";
  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      DistList(newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    DistList(newPage);
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    DistList(pageNum);
  };
  const resetAddDialog = () => {
    setOpenEdit(false);
  };
  const handleEditOpen = (row) => {
    setHeader("Edit Distributor");
    setDistributerId(row.id);
    setOpenEdit(true);
    setGstnumber(row.gst);
    setDistributerName(row.name);
    setEmail(row.email);
    setMobileNo(row.phone_number);
    setWhatsApp(row.whatsapp_number);
    setAddress(row.address);
    setArea(row.area);
    setPincode(row.pincode);
    setState(row.state);

    setBankName(row.bank_name);
    setAccountNo(row.account_no);
    setIfscCode(row.ifsc_code);
    setLicenceNo(row.food_licence_number);
    setDistributorDrugLicenseNo(row.distributer_drug_licence_no);
    setCreditDuedays(row.payment_drug_days);
  };

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

  const handleSearchChange = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);
  };

  const filteredList = paginatedData.filter((row) => {
    return searchTerms.every((term, index) => {
      const value = row[columns[index].id];
      return String(value).toLowerCase().includes(term.toLowerCase());
    });
  });
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setMobileNo(value);
    }
  };
  useEffect(() => {
    DistList();
  }, []);

  const editDistributor = async () => {
    let data = new FormData();

    data.append("id", distributerId);
    data.append("gst_number", gstNumber);
    data.append("distributor_name", distributerName);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("mobile_no", mobileNo);
    data.append("address", address);
    data.append("area", area);
    data.append("pincode", pincode);
    data.append("state", state);
    data.append("bank_name", bankName);
    data.append("account_no", accountNo);
    data.append("ifsc_code", ifscCode);
    data.append("distributor_durg_distributor", distributorDrugLicenseNo);
    data.append("payment_due_days", creditDuedays);
    const params = {
      id: distributerId,
    };
    try {
      await axios
        .post("update-distributer?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          DistList();
          setOpenEdit(false);
          setGstnumber("");
          setDistributerName("");
          setEmail("");
          setMobileNo("");
          setPhoneNo("");
          setWhatsApp("");
          setAddress("");
          setArea("");
          setState("");
          setPincode("");
          setBankName("");
          setAccountNo("");
          setIfscCode("");
          setLicenceNo("");
          setDistributorDrugLicenseNo("");
          setCreditDuedays("");
          // setIsEditMode(false)
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/distributor.csv";
    link.download = "distributor.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadDistributorFile = async () => {
    let data = new FormData();
    data.append("file", file);
    try {
      await axios
        .post("import-distributer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          DistList();
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

  const DistList = async (currentPage) => {
    let data = new FormData();
    data.append("page", currentPage);
    const params = {
      page: currentPage,
    };
    setIsLoading(true);
    try {
      await axios
        .post("list-distributer?", data, {
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
      console.error("API error:", error);
    }
  };

  // const exportToExcel = () => {
  //     // const filteredData = tableData.map(({ name, phone_number, email, gst, clinic, address }) => ({
  //     //     DistributerName: name,
  //     //     Clinic_Name: clinic,
  //     //     License_No: license,
  //     //     MobileNo: phone_number,
  //     //     Email: email,
  //     //     Gst: gst
  //     // }));

  //     // // Create a new workbook and a worksheet
  //     // const workbook = XLSX.utils.book_new();

  //     // const worksheet = XLSX.utils.json_to_sheet(filteredData);

  //     // // Append the worksheet to the workbook
  //     // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  //     // // Write the workbook to a binary string
  //     // const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

  //     // // Convert the binary string to an array buffer
  //     // const s2ab = (s) => {
  //     //     const buf = new ArrayBuffer(s.length);
  //     //     const view = new Uint8Array(buf);
  //     //     for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  //     //     return buf;
  //     // };

  //     // // Save the file using file-saver
  //     // saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Doctor_List.xlsx');
  // };

  const exportToExcel = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", currentPage);
    data.append("iss_value", "download");
    const params = {
      page: currentPage,
    };
    try {
      await axios
        .post("list-distributer?", data, {
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
            saveAs(blob, "Distributor.csv");
          }

          setTableData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
    }
  };

  const convertToCSV = (data) => {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
  };
  const openFilePopUP = () => {
    setOpenUpload(true);
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
            backgroundColor: "rgba(153, 153, 153, 0.1)",
           height: "calc(100vh - 225px)",
            padding: "0px 20px 0px",
          }}
        >
          <div>
            <div className="py-3 cust_list_main_hdr_bg" style={{ display: "flex", gap: "4px", marginBottom: "13px" }}>
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
                    width: "136px",
                  }}
                >
                  Distributor List
                </span>
                <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow align-center" />
              </div>
              <div className="headerList cust_hdr_mn_bg mt-2">
                {hasPermission(permissions, "distributor import") && (
                  <Button
                    variant="contained"
                    style={{
                      background: "var(--color1)",
                      display: "flex",
                    }}
                    className="gap-2"
                    onClick={openFilePopUP}
                  >
                    <CloudUploadIcon /> Import
                  </Button>
                )}
                {hasPermission(permissions, "distributor create") && (
                  <Button
                    variant="contained"
                    style={{ background: "var(--color1)", display: "flex", }}
                    onClick={() => {
                      history.push("/more/addDistributer");
                    }}
                    className="gap-2"
                  >
                    {" "}
                    <AddIcon className="" />
                    Add Distributor
                  </Button>
                )}
                {hasPermission(permissions, "distributor download") && (
                  <Button
                    className="gap-7"
                    variant="contained"
                    style={{
                      background: "var(--color1)",
                      color: "white",
                      // paddingLeft: "35px",
                      textTransform: "none",
                      display: "flex",
                    }}
                    onClick={exportToExcel}
                  >
                    {" "}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src="/csv-file.png"
                        className="report-icon absolute"
                        alt="csv Icon"
                      />
                    </div>
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto firstrow">
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
                    <th key={column.id} style={{ minWidth: column.minWidth }}>
                      <div className="headerStyle">
                        <span>{column.label}</span>
                        <SwapVertIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => sortByColumn(column.id)}
                        />
                        <TextField
                          variant="outlined"
                          autoComplete="off"
                          label={`Search ${column.label}`}
                          id="filled-basic"
                          size="small"
                          sx={{ width: "150px" }}
                          value={searchTerms[index]}
                          onChange={(e) =>
                            handleSearchChange(index, e.target.value)
                          }
                        />
                      </div>
                    </th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: "#3f621217" }}>
                {tableData.length === 0 ? (
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
                  tableData.map((row, index) => {
                    return (
                      <tr hover tabIndex={-1} key={row.code}>
                        <td style={{ borderRadius: "10px 0 0 10px" }}>
                          {startIndex + index}
                        </td>

                        {columns.map((column) => {
                          let value = row[column.id];
                          if (column.id === "email") {
                            if (value && value[0] !== value[0].toLowerCase()) {
                              value = value.toLowerCase();
                            }
                          }
                          return (
                            <td
                              key={column.id}
                              align={column.align}
                              onClick={() => {
                                history.push(`/DistributerView/${row.id}`);
                              }}
                              style={
                                column.id === "email"
                                  ? { textTransform: "none" }
                                  : { textTransform: "uppercase" }
                              }
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </td>
                          );
                        })}
                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                          <div className="px-2 flex gap-1 justify-center">
                            <VisibilityIcon
                              style={{ color: "var(--color1)" }}
                              onClick={() => {
                                history.push(`/DistributerView/${row.id}`);
                              }}
                            />
                            {hasPermission(permissions, "distributor edit") && (
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
            <div className="flex justify-center mt-4">
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
                className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage
                  ? "bg-gray-200 text-gray-700"
                  : "secondary-bg text-white"
                  }`}
                disabled={filteredList.length === 0}
              >
                Next
              </button>
            </div>
          </div>

          <Dialog open={openEdit}>
            <div className="flex justify-center items-center h-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                <div className="flex justify-between items-center">
                  <DialogTitle
                    id="alert-dialog-title"
                    style={{
                      color: "var(--COLOR_UI_PHARMACY)",
                      fontWeight: 700,
                    }}
                  >
                    {header}
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={resetAddDialog}
                    className="text-gray-500"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <div className="mb-1">
                            <span className="label primary">GST/IN Number</span>
                            <span className="text-red-600 ml-1">*</span>
                          </div>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="text"
                            value={gstNumber}
                            onChange={(e) => {
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, "");
                              setGstnumber(value);
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.Doctor && (
                            <span className="text-red-600 text-xs">
                              {errors.Doctor}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <div className="mb-1">
                            <span className="label primary">
                              Distributor Name
                            </span>
                            <span className="text-red-600 ml-1">*</span>
                          </div>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="text"
                            value={distributerName}
                            onChange={(e) => {
                              setDistributerName(e.target.value.toUpperCase());
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.clinic && (
                            <span className="text-red-600 text-xs">
                              {errors.clinic}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Email ID</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <div className="mb-1">
                            <span className="label primary">Mobile No</span>
                            <span className="text-red-600 ml-1">*</span>
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
                            <span className="text-red-600 text-xs">
                              {errors.mobileNo}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Whatsapp No.</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="number"
                            value={whatsapp}
                            onChange={(e) => setWhatsApp(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary"> Address</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Area</span>
                          <TextField
                            autoComplete="off"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full"
                            size="small"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Pincode</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="number"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">State</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={state}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z]/g,
                                ""
                              ); // Remove non-alphabetic characters
                              const formattedValue =
                                value.charAt(0).toUpperCase() +
                                value.slice(1).toLowerCase();
                              setState(formattedValue);
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>

                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Credit Due Days</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={creditDuedays}
                            onChange={(e) =>
                              setCreditDuedays(Number(e.target.value))
                            }
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">
                            {" "}
                            Distributor Drug License No.
                          </span>
                          <OutlinedInput
                            type="text"
                            value={distributorDrugLicenseNo}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase(); // Convert to uppercase for uniformity
                              setDistributorDrugLicenseNo(value);
                            }}
                            className="w-full"
                            size="small"
                          />
                        </div>

                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">
                            Food Licence No.
                          </span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={licenceNo}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase(); // Convert to uppercase for uniformity
                              setLicenceNo(value);
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Bank Name</span>
                          <TextField
                            autoComplete="off"
                            value={bankName}
                            onChange={(e) => {
                              const uppercasedValue = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z]/g, "");
                              setBankName(uppercasedValue);
                            }}
                            className="w-full"
                            size="small"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">IFSC Code</span>
                          <TextField
                            autoComplete="off"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            // type="text"
                            // onChange={(e) => {
                            //     const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            //     setIfscCode(value);
                            // }}
                            className="w-full"
                            size="small"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full ">
                          <span className="label primary">Account No.</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="number"
                            value={accountNo}
                            onChange={(e) => setAccountNo(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                    </div>
                  </DialogContentText>
                </DialogContent>
                <DialogActions style={{ padding: "16px 24px" }}>
                  <Button
                    autoFocus
                    variant="contained"
                    style={{
                      backgroundColor: "var(--COLOR_UI_PHARMACY)",
                      color: "white",
                    }}
                    onClick={editDistributor}
                  >
                    Update
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
              </div>
            </div>
          </Dialog>

          <Dialog open={openUpload} className="custom-dialog">
            <DialogTitle id="alert-dialog-title " className="primary">
              Import Distributor
            </DialogTitle>
            <div className="px-6 ">
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
                <div className="secondary">Item File Upload</div>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <input
                      className="File-upload"
                      type="file"
                      accept=".csv"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <span className="errorFile">*select only .csv File</span>
                  </div>
                  <div>
                    <Button
                      onClick={handleDownload}
                      style={{
                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                        color: "white",
                      }}
                    >
                      <CloudDownloadIcon className="mr-2" />
                      Download Sample File
                    </Button>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                }}
                variant="contained"
                onClick={uploadDistributorFile}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* <Dialog open={openEdit}
                        sx={{
                            "& .MuiDialog-container": {
                                "& .MuiPaper-root": {
                                    width: "30%",
                                    maxWidth: "1500px",  // Set your width here
                                },
                            },
                        }}
                    >
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
                                <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div className="mb-1" >
                                                <span className="label primary mb-4" >Distributor GST/IN Number</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={gstNumber}
                                                onChange={(e) => { setGstnumber(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                            {errors.Doctor && <span style={{ color: 'red', fontSize: '12px' }}>{errors.Doctor}</span>}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div className="mb-1" >
                                                <span className="label primary" >Distributor Name</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={distributerName}
                                                onChange={(e) => { setDistributerName(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                            {errors.clinic && <span style={{ color: 'red', fontSize: '12px' }}>{errors.clinic}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label primary">Email ID</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                        <div style={{ display: 'flex ', flexDirection: 'column' }}>
                                            <div className="mb-1" >
                                                <span className="label primary" >Mobile No</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <OutlinedInput
                                                type="number"
                                                value={mobileNo}
                                                onChange={handleChange}
                                                startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                                                style={{ minWidth: 250 }}
                                                size="small"
                                            />
                                            {errors.mobileNo && <span style={{ color: 'red', fontSize: '12px' }}>{errors.mobileNo}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label primary">Whatsapp No.</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={whatsapp}
                                                onChange={(e) => { setWhatsApp(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                        <div style={{ display: 'flex ', flexDirection: 'column' }}>
                                            <span className="label primary"> Address</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={address}
                                                onChange={(e) => { setAddress(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex ', flexDirection: 'column' }}>
                                            <span className="label primary">Area
                                            </span>
                                            <TextField
                 autoComplete="off"
                                                value={area}
                                                onChange={(e) => { setArea(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                size="small"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label primary">Pincode</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={pincode}
                                                onChange={(e) => { setPincode(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex ', flexDirection: 'column' }}>
                                            <span className="label primary">
                                                Bank Name</span>
                                            <TextField
                 autoComplete="off"
                                                value={bankName}
                                                onChange={(e) => { setBankName(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                size="small"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label primary">Account No.</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={accountNo}
                                                onChange={(e) => { setAccountNo(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex ', flexDirection: 'column' }}>
                                            <span className="label primary">
                                                IFSC Code</span>
                                            <TextField
                 autoComplete="off"
                                                value={ifscCode}
                                                onChange={(e) => { setIfscCode(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                size="small"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label primary">Food Licence No.</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={licenceNo}
                                                onChange={(e) => { setLicenceNo(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div style={{ display: 'flex ', flexDirection: 'column' }}>
                                            <span className="label primary">
                                                Distributor Drug License No.</span>
                                            <OutlinedInput
                                                type="number"
                                                value={distributorDrugLicenseNo}
                                                onChange={(e) => { setDistributorDrugLicenseNo(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                size="small"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label primary">Credit Due Days</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={creditDuedays}
                                                onChange={(e) => { setCreditDuedays(e.target.value) }}
                                                style={{ minWidth: 250 }}
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus variant="contained" color="success" onClick={editDistributor}>
                                Update
                            </Button>
                            <Button autoFocus variant="contained" color="error" onClick={resetAddDialog} >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog> */}
        </div>
      )}
    </>
  );
};

export default DistributerList;
