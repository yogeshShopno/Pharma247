import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Header from "../../Header";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TextField } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
} from "@mui/material";
import { TablePagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const LoyaltyPoint = () => {
  const token = localStorage.getItem("token");
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);

  const loyaltyPointLabel = [
    { id: "minimum", label: "Minimum Amount", minWidth: 150 },
    { id: "maximum", label: "Maximum Amount", minWidth: 150 },
    { id: "percent", label: "Percentage", minWidth: 150 },
  ];

  const [minimumAmount, setMinimumAmount] = useState("");
  const [maximumAmount, setMaximumAmount] = useState("");
  const [percentage, setPercentage] = useState("");

  const [loyaltypointData, setLoyaltyPointData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [header, setHeader] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDrugGroupId, setDeleteDrugGroupId] = useState(null);
  const [loyaltyPointID, setLoyaltyPointID] = useState(null);

  const [IsDelete, setIsDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Add Loyalty Point");
    setButtonLabel("Save");

    setTimeout(() => {
      if (inputRef1.current) {
        inputRef1.current.focus();
      }
    }, 0);
  };

  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setLoyaltyPointID(row.id);
    setMaximumAmount(row.maximum);
    setMinimumAmount(row.minimum);
    setPercentage(row.percent);
    setIsEditMode(true);
    setHeader("Edit Loyalty Point");
    setButtonLabel("Update");
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const resetAddDialog = () => {
    setMaximumAmount("");
    setMinimumAmount("");
    setPercentage("");
    setErrors({});
    setOpenAddPopUp(false);
  };

  useEffect(() => {
    LoyaltyPointList();
  }, [page, rowsPerPage]);

  const LoyaltyPointList = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
    };
    axios
      .get("loyalti-point-list", {
        params: params,
      })
      .then((response) => {
        setLoyaltyPointData(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const validData = () => {
    if (isEditMode === false) {
      const newErrors = {};

      // Check if the new minimum and maximum values fall within the already existing range
      const existingLoyaltyPoints = loyaltypointData; // Assuming this is the data already fetched
      for (let i = 0; i < existingLoyaltyPoints.length; i++) {
        const item = existingLoyaltyPoints[i];
        if (
          (Number(minimumAmount) >= Number(item.minimum) &&
            Number(minimumAmount) <= Number(item.maximum)) ||
          (Number(maximumAmount) >= Number(item.minimum) &&
            Number(maximumAmount) <= Number(item.maximum))
        ) {
          toast.error("Range overlaps. Choose different values.");
          return false; // Prevent form submission if this condition fails
        }
      }

      // Validate minimum, maximum and percentage
      if (!maximumAmount) {
        newErrors.maximumAmount = "Maximum amount is required";
        toast.error(newErrors.maximumAmount);
      }

      if (!minimumAmount) {
        newErrors.minimumAmount = "Minimum amount is required";
        toast.error(newErrors.minimumAmount);
      }
      

      if (Number(maximumAmount) <= Number(minimumAmount)) {
        newErrors.amountMismatch ="Maximum amount must be greater than minimum amount";
        toast.error(newErrors.amountMismatch);
      }

       if (!percentage) {
        newErrors.percentage ="Percentage is required";
        toast.error(newErrors.percentage);
      }

      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddLoyaltyPoint();
      }
      return isValid;
    } else {
      // Similar validation logic for Edit Mode, if needed
      const newErrors = {};
      if (!maximumAmount) {
        newErrors.maximumAmount = "Maximum amount is required";
        toast.error(newErrors.maximumAmount);
      }
      if (!minimumAmount) {
        newErrors.minimumAmount = "Minimum amount is required";
        toast.error(newErrors.minimumAmount);
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditLoyaltyPoint();
      }
      return isValid;
    }
  };

  const AddLoyaltyPoint = async () => {
    let data = new FormData();
    data.append("minimum", minimumAmount);
    data.append("maximum", maximumAmount);
    data.append("percent", percentage);

    try {
      await axios
        .post("loyalti-point-add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenAddPopUp(false);
          LoyaltyPointList();
          setMinimumAmount("");
          setMaximumAmount("");
          setPercentage("");
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  const EditLoyaltyPoint = async () => {
    let data = new FormData();
    data.append("id", loyaltyPointID);
    data.append("maximum", maximumAmount);
    data.append("minimum", minimumAmount);
    data.append("percent", percentage);

    try {
      await axios
        .post("loyalti-point-update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          LoyaltyPointList();
          setOpenAddPopUp(false);
          toast.success(response.data.message);
          setMaximumAmount("");
          setMinimumAmount("");
          setPercentage("");
          setIsEditMode(false);
        });
    } catch (error) {
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      }
      console.error("API error:", error);
    }
  };

  const loyaltyPointDelete = async (id) => {
    let data = new FormData();
    data.append("id", id); // Use 'id' directly instead of loyaltyPointID

    try {
      const response = await axios.post("loyalti-point-delete", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(true);
      LoyaltyPointList(); // Refresh the list
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting item:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      }
    }
  };
  const deleteOpen = (loyaltyPointID) => {
    setDeleteDrugGroupId(loyaltyPointID);
    setIsDelete(true);
  };

  const deleteClose = () => {
    setIsDelete(false);
  };

  const handleDelete = async () => {
    if (!deleteDrugGroupId) return;
    await loyaltyPointDelete(deleteDrugGroupId);
    setIsDelete(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target === inputRef1.current && inputRef2.current) {
        inputRef2.current.focus();
      } else if (event.target === inputRef2.current && inputRef3.current) {
        inputRef3.current.focus();
      }
    }
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
          <div className="p-6">
            <div
              className="mb-4 lyl_main_header_txt"
              style={{ display: "flex", gap: "4px" }}
            >
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <span
                  className="primary"
                  style={{
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    // width: "130px",
                    whiteSpace: "nowrap",
                  }}
                >
                  loyalty point
                </span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
              </div>
              <div className="headerList">
                <Button
                  style={{
                    backgroundColor: "var(--COLOR_UI_PHARMACY)",
                    color: "white",
                  }}
                  className="add_lyl_btn"
                  variant="contained"
                  size="small"
                  onClick={handelAddOpen}
                >
                  <AddIcon />
                  Add Loyalty point
                </Button>
              </div>
            </div>
            <div
              className="row border-b border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
            <div className="firstrow mt-4">
              {/* <div className="bg-white"> */}
              {/* <div className="flex flex-col gap-2 lg:flex-row lg:gap-2">
                                <div className="detail" >
                                    <Autocomplete
                                        value={drugGroupFilter}
                                        sx={{
                                            width: '100%',
                                            minWidth: '400px',
                                            '@media (max-width:600px)': {
                                                minWidth: '300px',
                                            },
                                        }}
                                        size='small'
                                        onChange={handleLoyaltyPointList}
                                        options={drugGroupData}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField
                 autoComplete="off" autoComplete="off"{...params} label="Search Drug Name" />}
                                    />
                                </div>
                                <div>
                                    <Button style={{ backgroundColor: "var(--COLOR_UI_PHARMACY)", color: "white" }} variant="contained" onClick={openBillDetails}>Search</Button>
                                </div>
                            </div> */}
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
                      <th>SR No.</th>
                      {loyaltyPointLabel.map((column) => (
                        <th
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                                        {loyaltypointData ? (
                                            <tr>
                                                <td colSpan={loyaltyPointLabel.length + 2} style={{ textAlign: 'center', color: 'gray' }}>
                                                    No data found
                                                </td>
                                            </tr>
                                        ) :
                                            (loyaltypointData?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {startIndex + index}
                                                    </td>
                                                    {loyaltyPointLabel.map((column) => (
                                                        <td key={column.id}>
                                                            {item[column.id]}
                                                        </td>
                                                    ))}

                                                    <td>
                                                        <div className="px-2">
                                                            < BorderColorIcon style={{ color: "var(--color1)" }} onClick={() => handleEditOpen(item)} />
                                                            <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )))
                                        }
                                    </tbody> */}

                  <tbody style={{ backgroundColor: "#3f621217" }}>
                    {loyaltypointData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={loyaltyPointLabel.length + 2}
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
                      loyaltypointData?.map((item, index) => (
                        <tr key={index}>
                          <td style={{ borderRadius: "10px 0 0 10px" }}>
                            {startIndex + index}
                          </td>
                          {loyaltyPointLabel.map((column) => (
                            <td key={column.id}>{item[column.id]}</td>
                          ))}
                          <td style={{ borderRadius: "0 10px 10px 0" }}>
                            <div className="flex gap-2 px-2 justify-center">
                              <BorderColorIcon
                                style={{ color: "var(--color1)" }}
                                onClick={() => handleEditOpen(item)}
                              />
                              <DeleteIcon
                                className="delete-icon"
                                onClick={() => deleteOpen(item.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 12]}
                component="div"
                count={loyaltypointData?.[0]?.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        )}
        <Dialog
          open={openAddPopUp}
          className="order_list_ml custom-dialog"
          // sx={{
          //     "& .MuiDialog-container": {
          //         "& .MuiPaper-root": {
          //             width: "50%",
          //             maxWidth: "500px",  // Set your width here
          //         },
          //     },
          // }}
        >
          <DialogTitle id="alert-dialog-title" className="secondary">
            {header}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
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
                    <div
                      style={{ display: "flex", gap: "2%" }}
                      className="both_fld_loylty"
                    >
                      <FormControl
                        variant="outlined data-mdb-input-init"
                        sx={{ width: "100% " }}
                      >
                        <TextField
                          autoComplete="off"
                          type="number"
                          inputRef={inputRef1}
                          onKeyDown={handleKeyDown}
                          value={minimumAmount}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setMinimumAmount(e.target.value);
                          }}
                          label="Minimum"
                          variant="outlined"
                          size="medium"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "var(--COLOR_UI_PHARMACY)",
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl
                        className="max_fld_ly"
                        variant="outlined data-mdb-input-init"
                        sx={{ width: "100%" }}
                      >
                        <TextField
                          autoComplete="off"
                          type="number"
                          inputRef={inputRef2}
                          onKeyDown={handleKeyDown}
                          value={maximumAmount}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setMaximumAmount(e.target.value);
                          }}
                          label="Maximum"
                          variant="outlined"
                          size="medium"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "var(--COLOR_UI_PHARMACY)",
                            },
                          }}
                        />
                      </FormControl>
                    </div>
                    <div className="mt-5">
                      <FormControl
                        variant="outlined data-mdb-input-init"
                        sx={{ width: "100%" }}
                      >
                        <TextField
                          autoComplete="off"
                          type="number"
                          inputRef={inputRef3}
                          onKeyDown={(e) => {
                            handleKeyDown(e);

                            if (e.key === "Enter") {
                              validData();
                            }
                          }}
                          value={percentage}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setPercentage(e.target.value);
                          }}
                          id="percentage-input"
                          label="Percentage %"
                          size="medium"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "var(--COLOR_UI_PHARMACY)",
                            },
                          }}
                        />
                      </FormControl>
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
              style={{ backgroundColor: "#F31C1C", color: "white" }}
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
export default LoyaltyPoint;
