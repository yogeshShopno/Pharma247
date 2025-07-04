import Header from "../../../Header";
import { Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import React, { useEffect, useState } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { toast, ToastContainer } from "react-toastify";
import { FaFilePdf } from "react-icons/fa6";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import CloseIcon from "@mui/icons-material/Close";
const ReturnList = () => {
  const history = useHistory();
  const rowsPerPage = 1;
  const token = localStorage.getItem("token");
  const permissions = usePermissions();

  const columns = [
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "user_name", label: "Entry By", minWidth: 150 },
    { id: "distributor_name", label: "Distributor", minWidth: 150 },
    { id: "total_amount", label: "Amount", minWidth: 150 },
    { id: "due_amount", label: "Due Amount", minWidth: 150 },
  ];
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  
  // Filter data first, then calculate pagination
  const filteredData = tableData.filter((row) => {
    return searchTerms.every((term, index) => {
      const value = row[columns[index].id];
      return String(value).toLowerCase().includes(term.toLowerCase());
    });
  });
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [IsDelete, setIsDelete] = useState(false);
  const [returnId, setReturnId] = useState(null);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);

  const [openCNPopUp, setOpenCNPopUp] = useState(false);

  const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15));
  const [PdfendDate, setPdfEndDate] = useState(new Date());

  const [cnBillData, setCnBillData] = useState([]); // for current row
  const [dueAmount, setDueAmount] = useState([]); // for current row


  const goIntoAdd = () => {
    history.push("/return/add");
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
    }
  };

  const deleteOpen = (Id) => {
    setIsDelete(true);
    setReturnId(Id);
  };
  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    try {
      await axios
        .post("purches-return-pdf", data, {
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
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handlePdf = (url) => {
    if (typeof url === "string") {
      window.open(url, "_blank");
    } else {
      console.error("Invalid URL for the PDF");
    }
  };

  useEffect(() => {
    // saleBillList();
    if (tableData.length > 0) {
      localStorage.setItem("Purchase_Return_BillNo", tableData[0].count + 1);
    } else {
      localStorage.setItem("Purchase_Return_BillNo", 1);
    }
  }, [tableData, currentPage]);

  const handleDeleteItem = async (returnId) => {
    if (!returnId) return;
    let data = new FormData();
    data.append("returnId", returnId);
    const params = {
      id: returnId,
    };
    try {
      await axios
        .post("purches-return-destroy?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsDelete(false);
          ReturnBillList();
        });
    } catch (error) {
      console.error("API error:", error);
    }
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

  const handleSearchChange = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    ReturnBillList();
  }, []);

  const ReturnBillList = async (currentPage) => {
    let data = new FormData();
    data.append("page", currentPage);
    const params = {
      page: currentPage,
    };
    setIsLoading(true);
    try {
      await axios
        .post("purches-return-list?", data, {
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
        .post("multiple-purches-return-pdf-downloads", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.success(response.data.meassage);

          setIsLoading(false);
          handlePdf(PDFURL);
        });
    } catch (error) {
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
        <div
          className="p-6"
          style={{
            overflow: "auto",
          }}
        >
          <div className="mb-4">
            <div
              className=" purchs_hdr_mn"
              style={{ display: "flex", gap: "4px" }}
            >
              <div
                className="flex flex-row sale_list_pgd"
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
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      history.push("/purchase/purchasebill");
                    }}
                  >
                    Purchase Return
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
                {hasPermission(permissions, "purchase return bill create") && (
                  <Button
                    variant="contained"
                    size="small"
                    className="sale_add_btn gap-2"
                    style={{ background: "var(--color1)", fontSize: "12px" }}
                    onClick={goIntoAdd}
                  >
                    <AddIcon />
                    New
                  </Button>
                )}
              </div>
              <div className="headerList">
                <Button
                  variant="contained"
                  className="sale_add_pdf"
                  style={{ background: "var(--color1) " }}
                  onClick={() => {
                    setOpenAddPopUp(true);
                  }}
                >
                  Generate PDF
                </Button>
              </div>
            </div>
          </div>
          <div
            className="row border-b border-dashed my-4"
            style={{ borderColor: "var(--color2)" }}
          ></div>
          <div className="firstrow">
            <div className="scroll-two" style={{ overflowX: "auto" }}>
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
                    <th>SR. No</th>
                    {columns.map((column, index) => (
                      <th key={column.id} style={{ width: column.minWidth }}>
                        <div className="headerStyle">
                          <span>{column.label}</span>
                          <SwapVertIcon
                            className="cursor-pointer"
                            onClick={() => sortByColumn(column.id)}
                          />
                          <TextField
                            autoComplete="off"
                            label={`Type Here`}
                            id="filled-basic"
                            size="small"
                            style={{ width: "150px" }}
                            value={searchTerms[index]}
                            onChange={(e) =>
                              handleSearchChange(index, e.target.value)
                            }
                          />
                        </div>
                      </th>
                    ))}
                    <th></th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#3f621217" }}>
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
                        <tr hover role="checkbox" tabIndex={-1} key={row.code}>
                          <td style={{ borderRadius: "10px 0 0 10px" }}>
                            {startIndex + index}
                          </td>

                          {columns.map((column) => {
                            const value = row[column.id];
                            const isDueAmount = column.id === "total_amount";
                            const isStatus = column.id === "status";

                            const statusClass =
                              isStatus && value === "Paid"
                                ? "text-black"
                                : isStatus && value === "Due"
                                  ? "text-red-500"
                                  : "text-black";

                            const dueAmountClass =
                              isDueAmount && row.status === "Paid"
                                ? "text-black"
                                : isDueAmount && value > 0
                                  ? "text-red-500"
                                  : "text-black";

                            return (
                              <td
                                key={column.id}
                                align={column.align}
                                onClick={() => {
                                  history.push(`/return/view/${row.id}`);
                                }}
                                className="text-lg"
                              >
                                <span
                                  className={`text ${isStatus ? statusClass : ""
                                    } ${isDueAmount ? dueAmountClass : ""}`}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </span>
                              </td>
                            );
                          })}

                          <td>
                            {row.cn_amount_bills &&
                              row.cn_amount_bills.length > 0 ? (
                              <ul>
                                <Button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    background: "rgb(4, 76, 157)",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                  }}
                                  onClick={() => {
                                    setCnBillData(row.cn_amount_bills || []);
                                    setDueAmount(row.due_amount);
                                    setOpenCNPopUp(true);
                                  }}
                                >
                                  View CN
                                </Button>


                              </ul>
                            ) : (
                              <ul>
                                {/* {/ <Button variant="contained" size='small' color="error" style={{ background: "rgb(170, 30, 31)", fontSize: '12px', textWrap:'nowrap' }} onClick={() => setOpenCNPopUp(true)}>No CN</Button> /} */}
                              </ul>
                            )}
                          </td>

                          <td style={{ borderRadius: "0 10px 10px 0" }}>
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                fontSize: "15px",
                                color: "gray",
                                cursor: "pointer",
                                alignItems: "center",
                              }}
                            >
                              <VisibilityIcon
                                className="cursor-pointer cursor-pointer primary hover:secondary"
                                onClick={() => {
                                  history.push(`/return/view/${row.id}`);
                                }}
                              />
                              <FaFilePdf
                                className="primary hover:secondary"
                                onClick={() => pdfGenerator(row.id)}
                              />
                              {hasPermission(
                                permissions,
                                "purchase return bill delete"
                              ) && (
                                  <DeleteIcon
                                    style={{ color: "#F31C1C" }}
                                    className="delete-icon"
                                    onClick={() => deleteOpen(row.id)}
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
              <Dialog
                open={openCNPopUp}
                onClose={() => setOpenCNPopUp(false)}
                className="order_list_ml custom-dialog"
                sx={{
                  "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                      width: "50%",
                      maxWidth: "500px",
                    },
                  },
                }}
              >
                <DialogTitle
                  className="alert-dialog-title"
                  style={{ fontWeight: 700 }}
                >
                  CN Bill
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={() => setOpenCNPopUp(false)}
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
                  <DialogContentText id="alert-dialog-description ">
                    <table className="w-full border-collapse custom-table">
                      <thead>
                        <tr>
                          <th style={{ padding: "0.5rem 1rem" }}>Sr No</th>
                          <th style={{ padding: "0.5rem 1rem" }}>
                            Bill Number
                          </th>
                          <th style={{ padding: "0.5rem 1rem" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cnBillData.map((cn_bill, cnIndex) => (
                          <tr key={cnIndex}>
                            <td className="text-lg text-black px-4 py-2">
                              {cnIndex + 1}
                            </td>
                            <td className="text-lg text-black px-4 py-2">
                              {cn_bill.bill_number}
                            </td>
                            <td className="text-lg text-black px-4 py-2">
                              {cn_bill.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: "#000",
                        }}
                      >
                        Due Amount: {dueAmount}
                      </span>
                    </div>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </div>
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
                className={`mx-1 px-3 py-1 rounded ${currentPage >= totalPages
                  ? "bg-gray-200 text-gray-700 "
                  : "secondary-bg  text-white"
                  }`}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>

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
                    onClick={() => handleDeleteItem(returnId)}
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
          <Dialog
            open={openAddPopUp}
            className="order_list_ml custom-dialog"
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "50%",
                  height: "50%",
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                },
              },
            }}
          >
            <DialogTitle id="alert-dialog-title" style={{ fontWeight: 700 }}>
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
                color: "#ffffff",
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
                      <div className="flex flex-col md:flex-row w-full gap-4">
                        <div className="w-full">
                          <span className="primary block">Start Date</span>
                          <DatePicker
                            className="custom-datepicker_mn w-full"
                            selected={PdfstartDate}
                            onChange={(newDate) => setPdfStartDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        <div className="w-full">
                          <span className="primary block">End Date</span>
                          <DatePicker
                            className="custom-datepicker_mn w-full"
                            selected={PdfendDate}
                            onChange={(newDate) => setPdfEndDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                          />
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
export default ReturnList;
