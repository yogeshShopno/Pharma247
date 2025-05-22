import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Header from "../../../Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import "./PurchaseList";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaFilePdf } from "react-icons/fa6";
import { PDFDocument, rgb } from "pdf-lib";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { toast, ToastContainer } from "react-toastify";
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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const columns = [
  { id: "sr_no", label: "Sr No.", minWidth: 150 },
  { id: "bill_no", label: "Bill No.", minWidth: 150 },
  { id: "bill_date", label: "Bill Date", minWidth: 150 },
  { id: "distributor_name", label: "Distributor", minWidth: 150 },
  { id: "total_amount", label: "Bill Amount", minWidth: 150 },
];

const Purchasebill = () => {
  const token = localStorage.getItem("token");
  // const { id } = useParams();
  const permissions = usePermissions();

  const history = useHistory();
  const [purchaseData, setPurchaseData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [id, setId] = useState(null);
  const rowsPerPage = 10;
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(subDays(new Date(), 15));
  const [endDate, setEndDate] = useState(new Date());
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const [IsDelete, setIsDelete] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("");

  const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15));
  const [PdfendDate, setPdfEndDate] = useState(new Date());

  {
    /*<=========================================================================== get required data  ===========================================================================> */
  }

  useEffect(() => {
    if (tableData.length > 0) {
      localStorage.setItem("Purchase_SrNo", tableData[0].count + 1);
    } else {
      localStorage.setItem("Purchase_SrNo", 1);
    }
  }, [tableData, currentPage]);

  useEffect(() => {
    purchaseBillList(currentPage);
  }, [currentPage, startDate, endDate]);

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    purchaseBillList(pageNum);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      purchaseBillList(newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    purchaseBillList(newPage);
  };

  const deleteOpen = (id) => {
    setIsDelete(true);
    setId(id);
  };

  {
    /*<=============================================================================== table sort  ===============================================================================> */
  }

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

  {
    /*<=========================================================================== table search  ===========================================================================> */
  }

  const handleSearchChange = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);
  };

  const filteredList = tableData.filter((row) => {
    const srNo = row.sr_no ? row.sr_no.toLowerCase() : "";
    const billNo = row.bill_no ? row.bill_no.toLowerCase() : "";
    const billDate = row.bill_date ? row.bill_date.toLowerCase() : "";
    const distributor = row.distributor_name
      ? row.distributor_name.toLowerCase()
      : "";
    const bilAmount = row.total_amount ? row.total_amount.toLowerCase() : "";

    const srNoSearchTerm = searchTerms[0]
      ? String(searchTerms[0]).toLowerCase()
      : "";
    const billNoSearchTerm = searchTerms[1]
      ? String(searchTerms[1]).toLowerCase()
      : "";
    const billDateSearchTerm = searchTerms[2]
      ? String(searchTerms[2]).toLowerCase()
      : "";
    const distributorSearchTerm = searchTerms[3].toLowerCase();
    const billAmountSearchTerm = searchTerms[4]
      ? String(searchTerms[4]).toLowerCase()
      : "";

    return (
      (srNo.includes(srNoSearchTerm) || srNoSearchTerm === "") &&
      (billNo.includes(billNoSearchTerm) || billNoSearchTerm === "") &&
      (billDate.includes(billDateSearchTerm) || billDateSearchTerm === "") &&
      (distributor.includes(distributorSearchTerm) ||
        distributorSearchTerm === "") &&
      (bilAmount.includes(billAmountSearchTerm) || billAmountSearchTerm === "")
    );
  });

  {
    /*<======================================================================= Purchase bill list  =======================================================================> */
  }

  const purchaseBillList = async (currentPage) => {
    if (!currentPage) return;

    let data = new FormData();

    data.append("start_date", startDate ? format(startDate, "yyyy-MM-dd") : "");
    data.append("from_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
    data.append("page", currentPage);
    const params = {
      start_date: startDate,
      from_date: endDate,
      page: currentPage,
    };
    setIsLoading(true);
    try {
      await axios
        .post("purches-list?", data, {
          // params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data.data);
          setIsLoading(false);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  {
    /*<============================================================================== Delete Bill  ==============================================================================> */
  }

  const handleDeleteItem = async (id) => {
    if (!id) return;
    let data = new FormData();
    data.append("id", id);
    const params = {
      purches_id: id,
    };
    try {
      await axios
        .post("purches-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsDelete(false);
          purchaseBillList();
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  {
    /*<============================================================================== Download PDF  ==============================================================================> */
  }

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    try {
      await axios
        .post("purches-pdf-downloads", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.success(response.data.meassage);

          setIsLoading(false);
          handlePdf(PDFURL);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handlePdf = (url) => {
    if (typeof url === "string") {
      // Open the PDF in a new tab
      window.open(url, "_blank");
    } else {
      console.error("Invalid URL for the PDF");
    }
  };

  const AllPDFGenerate = async () => {
    let data = new FormData();
    data.append(
      "start_date",
      PdfstartDate ? format(PdfstartDate, "yyyy-MM-dd") : ""
    );
    data.append("end_date", PdfendDate ? format(PdfendDate, "yyyy-MM-dd") : "");

    setIsLoading(true);
    try {
      await axios
        .post("multiple-purches-pdf-downloads", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.success(response.data.meassage);
          setIsLoading(false);
          handlePdf(PDFURL);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  {
    /*<=========================================================================== UI ===========================================================================> */
  }

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
            overflow: "auto",
          }}
          className="paddin12-8"
        >
          <div className="px-4 py-3 ">
            <div
              className="sales_hdr_mn"
              style={{ display: "flex", gap: "4px", marginBottom: "15px" }}
            >
              <div
                className="flex flex-row sale_list_pg"
                style={{ display: "flex", gap: "4px", alignItems: "center" }}
              >
                <div
                  className="flex flex-row gap-2 sale_lt_txt"
                  style={{ alignItems: "center" }}
                >
                  <span
                    style={{
                      color: "var(--color2)",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: "20px",
                    }}
                    onClick={() => {
                      history.push("/purchase/purchasebill");
                    }}
                  >
                    Purchase
                  </span>
                  <div>
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "20px",
                        color: "var(--color1)",
                      }}
                    />
                  </div>
                </div>
                {hasPermission(permissions, "purchase bill create") && (
                  <>
                    <Button
                      variant="contained"
                      className="sale_add_btn gap-2"
                      size="small"
                      style={{ background: "var(--color1)", fontSize: "12px" }}
                      onClick={() => {
                        history.push("/purchase/addPurchaseBill");
                      }}
                    >
                      <AddIcon />
                      New
                    </Button>
                  </>
                )}
              </div>
              <div className="headerList">
                <Button
                  variant="contained"
                  className="sale_add_pdf"
                  style={{ background: "var(--color1)" }}
                  onClick={() => {
                    setOpenAddPopUp(true);
                  }}
                >
                  Generate PDF
                </Button>
              </div>
            </div>
            <div
              className="row border-b px-4 border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
          </div>

          <div className="firstrow px-4">
            <div className="oreder_list_fld flex flex-col gap-2 md:flex-row lg:flex-row ">
              <div className="detail flex flex-col">
                <span className="text-gray-500 block">Start Date</span>
                <div className="" style={{ width: "100%" }}>
                  <DatePicker
                    className="custom-datepicker_mn"
                    selected={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="detail flex flex-col">
                <span className="text-gray-500 block">End Date</span>
                <div className="" style={{ width: "100%" }}>
                  <DatePicker
                    className="custom-datepicker_mn"
                    selected={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div
                className=""
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  className=""
                  size="small"
                  style={{
                    minHeight: "38px",
                    alignItems: "center",
                    // marginTop: "24px",
                    background: "var(--color1)",
                  }}
                  onClick={() => purchaseBillList(currentPage)}
                >
                  <FilterAltIcon
                    size="large"
                    style={{ color: "white", fontSize: "20px" }}
                  />
                  Filter
                </Button>
              </div>
            </div>

            {/*<====================================================================================== Table ======================================================================================> */}

            <div className="overflow-x-auto mt-4" style={{ overflowX: "auto" }}>
              <table
                className="w-full border-collapse custom-table"
                style={{
                  whiteSpace: "nowrap",
                  borderCollapse: "separate",
                  borderSpacing: "0 6px",
                }}
              >
                <thead>
                  <tr>
                    {/* <th>SR. No</th> */}
                    {/* <th></th> */}
                    {columns.map((column, index) => (
                      <th
                        key={column.id}
                        className="text-left"
                        style={{ minWidth: column.minWidth }}
                      >
                        <div className="headerStyle gap-2">
                          <span>{column.label}</span>
                          <SwapVertIcon
                            className="cursor-pointer"
                            onClick={() => sortByColumn(column.id)}
                          />
                          <TextField
                            className="textfield-z0"
                            autoComplete="off"
                            label={`Type Here`}
                            size="small"
                            sx={{
                              minWidth: 150,
                              '& .MuiInputBase-root': {
                                zIndex:0,
                                position: 'relative',
                              },
                            }}
                            style={{ minWidth: 150,zIndex:0 }}
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
                  {filteredList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="text-center text-gray-500"
                        style={{ borderRadius: "10px 10px 10px 10px" }}
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((row, index) => (
                      <tr
                        className="cursor-pointer hover:bg-gray-100"
                        key={row.code}
                      >
                        {/* <td>{startIndex + index}</td> */}

                        {columns.map((column, colIndex) => {
                          const value = row[column.id];
                          return (
                            <td
                              style={
                                colIndex === 0
                                  ? { borderRadius: "10px 0 0 10px" }
                                  : colIndex === columns.length
                                    ? { borderRadius: "0 10px 10px 0" }
                                    : {}
                              }
                              key={column.id}
                              className="capitalize"
                              onClick={() =>
                                history.push(`/purchase/view/${row.id}`)
                              }
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </td>
                          );
                        })}
                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                          <div className="flex gap-2 items-center">
                            <VisibilityIcon
                              className="cursor-pointer primary hover:secondary"
                              onClick={() =>
                                history.push(`/purchase/view/${row.id}`)
                              }
                            />
                            <FaFilePdf
                              className=" primary hover:secondary"
                              onClick={() => pdfGenerator(row.id)}
                            />
                            {hasPermission(
                              permissions,
                              "purchase bill delete"
                            ) && (
                                <DeleteIcon
                                  style={{ color: "#F31C1C" }}
                                  className="cursor-pointer "
                                  onClick={() => deleteOpen(row.id)}
                                />
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/*<================================================================================= pagination =================================================================================> */}

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
          {/*<=================================================================================== Delete Popup ===================================================================================> */}

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
                  onClick={() => handleDeleteItem(id)}
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
          {/*<=================================================================================== Generate PDF ===================================================================================> */}

          <Dialog open={openAddPopUp} className="order_list_ml custom-dialog">
            <DialogTitle
              id="alert-dialog-title"
              style={{ fontWeight: 700 }}
            >
              Generate PDF
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenAddPopUp(false);
              }}
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
                <div
                  className="flex"
                  style={{ flexDirection: "column", gap: "19px" }}
                >
                  <div className="flex gap-10">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex flex-col md:flex-row w-full h-full gap-2">
                          <div style={{ width: "100%", height: "325px" }}>
                            <span className="primary block">Start Date</span>
                            <div style={{ width: "100%" }}>
                              <DatePicker
                                className="custom-datepicker_mn"
                                selected={PdfstartDate}
                                onChange={(newDate) => setPdfStartDate(newDate)}
                                dateFormat="dd/MM/yyyy"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="" style={{ width: "100%" }}>
                            <span className="primary block">End Date</span>
                            <div style={{ width: "100%" }}>
                              <DatePicker
                                className="custom-datepicker_mn"
                                selected={PdfendDate}
                                onChange={(newDate) => setPdfEndDate(newDate)}
                                dateFormat="dd/MM/yyyy"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ padding: "20px 24px" }}>
              <Button
                autoFocus
                variant="contained"
                className="p-5"
                color="success"
                onClick={() => {
                  AllPDFGenerate();
                }}
              >
                Genrate
              </Button>
              <Button
                autoFocus
                variant="contained"
                onClick={() => {
                  setOpenAddPopUp(false);
                }}
                color="error"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Purchasebill;
