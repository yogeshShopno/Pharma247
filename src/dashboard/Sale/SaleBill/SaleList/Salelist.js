import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Header from "../../../Header";
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import { FaFilePdf } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";

import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { toast } from "react-toastify";
import { format, subDays } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import { WhatsApp } from "@mui/icons-material";

const columns = [
  { id: "bill_no", label: "Bill No", minWidth: 150, height: 100 },
  { id: "bill_date", label: "Bill Date", minWidth: 150 },
  // { id: 'name', label: 'Customer Name', minWidth: 100 },
  // { id: 'mobile_numbr', label: 'Mobile No. ', minWidth: 100 },
  { id: "customer_info", label: "Customer Info", minWidth: 150 },
  { id: "payment_name", label: "Payment Mode", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 150 },
  { id: "net_amt", label: "Bill Amount", minWidth: 150 },
];
const Salelist = () => {
  const permissions = usePermissions();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [tableData, setTableData] = useState([]);
  const rowsPerPage = 10;
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15));
  const [PdfendDate, setPdfEndDate] = useState(new Date());
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [PDFURL, setPDFURL] = useState("");
  
  // First filter all data, then calculate pagination
  const filteredData = tableData.filter((row) => {
    const billNo = row.bill_no ? row.bill_no.toLowerCase() : "";
    const billDate = row.bill_date ? row.bill_date.toLowerCase() : "";
    const customerName = row.name ? row.name.toLowerCase() : "";
    const mobileNumber = String(row.mobile_numbr).toLowerCase();
    const paymentName = row.payment_name ? row.payment_name.toLowerCase() : "";
    const status = row.status ? row.status.toLowerCase() : "";
    const netAmt = String(row.net_amt).toLowerCase();

    const billNoSearchTerm = searchTerms[0]
      ? String(searchTerms[0]).toLowerCase()
      : "";
    const billDateSearchTerm = searchTerms[1]
      ? String(searchTerms[1]).toLowerCase()
      : "";
    const customerSearchTerm = searchTerms[2].toLowerCase();
    const paymentSearchTerm = searchTerms[3]
      ? searchTerms[3].toLowerCase()
      : "";
    const statusSearchTerm = searchTerms[4] ? searchTerms[4].toLowerCase() : "";
    const netAmtSearchTerm = searchTerms[5]
      ? String(searchTerms[5]).toLowerCase()
      : "";
    return (
      (billNo.includes(billNoSearchTerm) || billNoSearchTerm === "") &&
      (billDate.includes(billDateSearchTerm) || billDateSearchTerm === "") &&
      (customerName.includes(customerSearchTerm) ||
        mobileNumber.includes(customerSearchTerm)) &&
      (paymentName.includes(paymentSearchTerm) || paymentSearchTerm === "") &&
      (status.includes(statusSearchTerm) || statusSearchTerm === "") &&
      (netAmt.includes(netAmtSearchTerm) || netAmtSearchTerm === "")
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  
  // Now paginate the filtered data
  const filteredList = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  const goIntoAdd = () => {
    history.push("/addsale");
  };

  // const deleteOpen = (id) => {
  //   setIsDelete(true);
  //   setSaleId(id);
  // };

  // const deleteClose = () => {
  //   setIsDelete(false);
  // };

  useEffect(() => {
    // saleBillList();
    if (tableData.length > 0) {
      localStorage.setItem("BillNo", tableData[0].count + 1);
    } else {
      localStorage.setItem("BillNo", 1);
    }
  }, [tableData, currentPage]);

  useEffect(() => {
    saleBillList();
    localStorage.removeItem("RandomNumber");
  }, []);

  const saleBillList = async () => {
    setIsLoading(true);
    let data = new FormData();
    data.append("page", 1); // Always fetch from page 1 to get all data
    try {
      const response = await axios.post("sales-list?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTableData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("API error:", error);

      setIsLoading(false);
    }
  };

  // const handleDelete = async () => {
  //   if (!saleId) return;
  //   let data = new FormData();
  //   data.append("id", saleId);
  //   const params = {
  //     id: saleId,
  //   };
  //   try {
  //     await axios
  //       .post("delete-sales?", data, {
  //         params: params,
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         saleBillList();
  //         setIsDelete(false);
  //       });
  //   } catch (error) {
  //     console.error("API error:", error);
  //   }
  // };

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
        .post("multiple-sale-pdf-downloads", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.success(response.data.meassage);

          setOpenAddPopUp(false);
          setIsLoading(false);
          handlePdf(PDFURL);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    try {
      await axios
        .post("sales-pdf-downloads", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.success(response.data.meassage);
          setPDFURL(PDFURL);
          setIsLoading(false);
          handlePdf(PDFURL);
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

  const handleWhatsAppmsg = async (bill) => {
    if (!bill || !bill.mobile_numbr || bill.mobile_numbr.length !== 10) {
      console.error("Invalid mobile number");
      return;
    }

    let data = new FormData();
    data.append("id", bill.id);
    setIsLoading(true);

    try {
      const response = await axios.post("sales-pdf-downloads", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data?.pdf_url) {
        const PDFURL = response.data.data.pdf_url;
        setIsLoading(false);
        setPDFURL(PDFURL);

        const message = `Dear ${bill.name},\n\nYour invoice for ₹${bill.net_amt
          } is ready.\n\nClick the link below to download:\n${PDFURL}\n\nFor any queries, contact us: ${localStorage.getItem(
            "contact"
          )}\n\nThank you,\n${localStorage.getItem("UserName")}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/91${bill.mobile_numbr}?text=${encodedMessage}`;

        window.open(whatsappURL, "_blank");
      } else {
        console.error("PDF URL not found in response");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <Header />
        {isLoading ? (
          <div className="loader-container ">
            <Loader />
          </div>
        ) : (
          <div
            style={{
              alignItems: "center",
            }}
            className="p-6"
          >
            <div
              className="sales_hdr_mn "
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
                  >
                    Sales
                  </span>
                  <div>
                    <ArrowForwardIosIcon
                      style={{ fontSize: "18px", color: "var(--color1)" }}
                    />
                  </div>
                </div>
                {hasPermission(permissions, "sale bill create") && (
                  <>
                    <Button
                      variant="contained"
                      className="sale_add_btn gap-2"
                      size="small"
                      style={{
                        backgroundColor: "var(--color1)",
                        fontSize: "12px",
                      }}
                      onClick={goIntoAdd}
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
                  style={{ background: "var(--color1)", color: "white" }}
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
            <div className="firstrow">
              <div className="overflow-x-auto mt-2 scroll-two">
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
                        <th
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          <div className="headerStyle">
                            <span>{column.label}</span>
                            <SwapVertIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => sortByColumn(column.id)}
                            />
                            <TextField
                              autoComplete="off"
                              // label={`Search ${column.label}`}
                              label="Type Here"
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
                      <th> Action</th>
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
                          <tr key={row.id}>
                            <td style={{ borderRadius: "10px 0 0 10px" }}>
                              {startIndex + index}
                            </td>
                            {columns.map((column) => {
                              if (column.id === "customer_info") {
                                const name = row.name ? row.name : "";
                                const mobileNumber = row.mobile_numbr
                                  ? row.mobile_numbr
                                  : "";
                                return (
                                  <td
                                    key={column.id}
                                    onClick={() => {
                                      history.push("/salebill/view/" + row.id);
                                    }}
                                  >
                                    {name && mobileNumber
                                      ? `${name} / ${mobileNumber}`
                                      : name || mobileNumber || "-"}
                                  </td>
                                );
                              } else {
                                return (
                                  <td
                                    key={column.id}
                                    onClick={() => {
                                      history.push("/salebill/view/" + row.id);
                                    }}
                                  >
                                    {row[column.id]}
                                  </td>
                                );
                              }
                            })}
                            <td style={{ borderRadius: "0 10px 10px 0" }}>
                              <div className="flex gap-4">
                                <VisibilityIcon
                                  className="cursor-pointer primary hover:secondary"
                                  onClick={() => {
                                    history.push(`/salebill/view/${row.id}`);
                                  }}
                                />
                                <FaFilePdf
                                  className="w-5 h-5 primary hover:text-secondary cursor-pointer"
                                  onClick={() => pdfGenerator(row.id)}
                                />
                                <IoLogoWhatsapp
                                  className="w-5 h-5 primary hover:text-secondary cursor-pointer"
                                  onClick={() => handleWhatsAppmsg(row)}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="flex flex-col md:flex-row w-full gap-2">
                            <div style={{ width: "100%" }}>
                              <span className="primary block">Start Date</span>
                              <div style={{ width: "100%" }}>
                                <DatePicker
                                  className="custom-datepicker_mn"
                                  selected={PdfstartDate}
                                  onChange={(newDate) =>
                                    setPdfStartDate(newDate)
                                  }
                                  dateFormat="dd/MM/yyyy"
                                />
                              </div>
                            </div>
                            <div style={{ width: "100%" }}>
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
                  style={{
                    background: "var(--COLOR_UI_PHARMACY)",
                    color: "white",
                  }}
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
      </div>
    </>
  );
};
export default Salelist;
