import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Header from "../../Header";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { FaEdit, FaSlack, FaTrash } from "react-icons/fa";
import Loader from "../../../componets/loader/Loader";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { toast, ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Button,
  InputAdornment,
  ListItem,
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
import { TablePagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Company = () => {
  const history = useHistory();

  const token = localStorage.getItem("token");
  const companyColumns = [
    { id: "company_name", label: "Company Name", minWidth: 100 },
  ];
  const [companyData, setCompanyData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [header, setHeader] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyID, setCompanyID] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Add Company");
    setButtonLabel("Save");
  };

  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setCompanyID(row.id);
    setCompanyName(row.company_name);
    setIsEditMode(true);
    setHeader("Edit Company");
    setButtonLabel("Update");
    // setCompanyName(row.category_name);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const resetAddDialog = () => {
    setCompanyName("");
    setErrors({});
    setOpenAddPopUp(false);
  };

  useEffect(() => {
    companyList();
  }, [page, rowsPerPage]);

  const companyList = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
    };
    axios
      .get("company-list", {
        params: params,
      })
      .then((response) => {
        setCompanyData(response.data.data);
        setIsLoading(false);
        if (response.data.status === 401) {
          history.push("/");
          localStorage.clear();
        }
      })
      .catch((error) => {
        console.error("API error:", error);

        setIsLoading(false);
      });
  };

  const validData = () => {
    if (isEditMode == false) {
      //  Add Package
      const newErrors = {};
      if (!companyName) {
        newErrors.companyName = "Company Name is required";
        toast.error(newErrors.companyName);
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddCompany();
      }
      return isValid;
    } else {
      // Edit Package
      const newErrors = {};
      if (!companyName) {
        newErrors.companyName = "Company Name is required";
        toast.error(newErrors.companyName);
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditCompany();
      }
      return isValid;
    }
  };
  const AddCompany = async () => {
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
          companyList();
          setOpenAddPopUp(false);
          setCompanyName("");
          companyList();
          toast.success(response.data.message);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      }
    }
  };
  const EditCompany = async () => {
    let data = new FormData();
    data.append("id", companyID);
    data.append("company_name", companyName);
    try {
      await axios
        .post("company-update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          companyList();
          setOpenAddPopUp(false);
          toast.success(response.data.message);
          setCompanyName("");
          setIsEditMode(false);

          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      }
      console.error("API error:", error);
    }
  };
  // const handleOptionChange = (event, newValue) => {
  //     setCompanyName(newValue);

  // };
  const handleOptionChange = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setCompanyName(newValue.company_name);
    } else {
      setCompanyName(newValue);
    }
    //(newValue, "145214");
  };

  const handleInputChange = (event, newInputValue) => {
    setCompanyName(newInputValue);
  };
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);
  const [IsDelete, setIsDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;

  const companyDelete = async (id) => {
    let data = new FormData();
    data.append("id", id);
    try {
      await axios
        .post("company-delete", data, {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setIsLoading(true);
          companyList();
          toast.success(response.data.message);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      // alert("404 error");
      console.error("Error deleting item:", error);
    }
  };

  const deleteOpen = (companyID) => {
    setDeleteCompanyId(companyID);
    setIsDelete(true);
  };

  const deleteClose = () => {
    setIsDelete(false);
  };

  const handleDelete = async () => {
    if (!deleteCompanyId) return;
    await companyDelete(deleteCompanyId);
    setIsDelete(false);
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
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div
            style={{
              background: "rgba(153, 153, 153, 0.1)",
             height: "calc(100vh - 225px)",
              padding: "0px 20px 0px",
            }}
          >
            <div className="py-3 add_company_hdr" style={{ display: "flex", gap: "4px" }}>
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <span
                  className="primary"
                  style={{
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    width: "90px",
                  }}
                >
                  Company
                </span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
              </div>
              <div className="headerList">
                <Button
                  variant="contained"
                  className="order_list_btn"
                  style={{ background: "var(--color1)" }}
                  size="small"
                  onClick={handelAddOpen}
                >
                  {" "}
                  <AddIcon />
                  Add Company
                </Button>
              </div>
            </div>
            <div
              className="bg-white overflow-x-auto mt-4"
              style={{ paddingInline: "25px", paddingBlock: "15px" }}
            >
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
                    <th>SR No.</th>
                    {companyColumns.map((column) => (
                      <th key={column.id} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#3f621217" }}>
                  {companyData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={companyColumns.length + 2}
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
                    companyData?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ borderRadius: "10px 0 0 10px" }}>
                          {startIndex + index}
                        </td>
                        {companyColumns.map((column) => (
                          <td key={column.id}>{item[column.id]}</td>
                        ))}

                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                          <div className="px-2 flex gap-1 justify-center">
                            <BorderColorIcon
                              style={{ color: "var(--color1)" }}
                              onClick={() => handleEditOpen(item)}
                            />
                            <DeleteIcon
                              style={{ color: "var(--color6)" }}
                              onClick={() => deleteOpen(item.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 12]}
                component="div"
                count={companyData?.[0]?.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        )}
        <Dialog
          className="order_list_ml"
          open={openAddPopUp}
          //   sx={{
          //     "& .MuiDialog-container": {
          //       "& .MuiPaper-root": {
          //         width: "50%",
          //         maxWidth: "500px", // Set your width here
          //       },
          //     },
          //   }}
        >
          <DialogTitle id="alert-dialog-title" style={{ color: "var(--COLOR_UI_PHARMACY)" ,fontWeight:700}}>
            {header}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
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
                className="flex flex-col gap-5"
                style={{ flexDirection: "column",width:'100%' }}
              >
                <FormControl size="small" style={{ width: "100%" }}>
                  <span className="label primary">Company Name</span>
                  {/* <TextField
                 autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            placeholder="Company Name"
                                            value={companyName}
                                            onChange={(e) => { setCompanyName(e.target.value) }}
                                            style={{ minWidth: 450 }}
                                            variant="outlined"
                                        /> */}
                  <Autocomplete
                    value={companyName}
                    // inputValue={searchItem.toUpperCase()}
                    sx={{ width: "100%" }}
                    size="small"
                    onChange={handleOptionChange}
                    onInputChange={handleInputChange}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.company_name
                    }
                    // getOptionLabel={(option) => option.company_name}
                    options={companyData}
                    renderOption={(props, option) => (
                      <ListItem {...props}>
                        <ListItemText primary={option.company_name} />
                      </ListItem>
                    )}
                    renderInput={(params) => (
                      <TextField autoComplete="off" {...params} />
                    )}
                    freeSolo
                  />
                </FormControl>
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
              onClick={validData}
            >
              {buttonLabel}
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={resetAddDialog}
              color="error"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Delete PopUp */}
      <div
        id="modal"
        value={IsDelete}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${
          IsDelete ? "block" : "hidden"
        }`}
      >
        <div />
        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
            viewBox="0 0 24 24"
            onClick={deleteClose}
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
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
              onClick={deleteClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Company;
