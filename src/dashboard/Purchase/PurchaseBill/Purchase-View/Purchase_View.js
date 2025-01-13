import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Purchase_View.css";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Header from "../../../Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";

const PurchaseView = () => {
  const { id } = useParams();
  const history = useHistory();
  const permissions = usePermissions();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [header, setHeader] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [roundOffAmount, setRoundOffAmount] = useState("");

  useEffect(() => {
    purchaseBillList();
  }, []);

  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("start_date", localStorage.getItem("StartFilterDate"));
    data.append("end_date", localStorage.getItem("EndFilterDate"));
    data.append("distributor_id", localStorage.getItem("DistributorId"));
    data.append("type", "1");
    try {
      const response = await axios.post("purches-histroy", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // setUnsavedItems(false);
        // setIsOpenBox(false);
        history.push(
          "/purchase/edit/" + data.id + "/" + data?.item_list[0].random_number
        );
        // setTimeout(() => {
        //   if (nextPath) {
        //     history.push(nextPath)
        //   }

        // }, 0);
      }
      //   setIsOpenBox(false);
      //   setUnsavedItems(false);

      // history.replace(nextPath);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };
  const purchaseBillList = async (currentPage) => {
    let data = new FormData();
    setIsLoading(true);
    try {
      await axios
        .post("purches-list?", data, {
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

  useEffect(() => {
    const index = tableData.findIndex((item) => item.id == parseInt(id));
    if (index !== -1) {
      setCurrentIndex(index);
      purchaseBillGetByID(tableData[index].id);
    }
  }, [id, tableData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "PageDown") {
        const nextIndex = (currentIndex + 1) % tableData.length;
        const nextId = tableData[nextIndex]?.id;
        if (nextId) {
          history.push(`/purchase/view/${nextId}`);
        }
      } else if (e.key === "PageUp") {
        const prevIndex =
          (currentIndex - 1 + tableData.length) % tableData.length;
        const prevId = tableData[prevIndex]?.id;
        if (prevId) {
          history.push(`/purchase/view/${prevId}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Cn Amount List");
  };
  const resetAddDialog = () => {
    setOpenAddPopUp(false);
  };
  const purchaseBillGetByID = async () => {
    let data = new FormData();
    data.append("id", id);
    const params = {
      id: id,
    };
    setIsLoading(true);
    try {
      await axios
        .post("purches-details?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.data);
          setRoundOffAmount(response.data.data.round_off);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("API error:", error);
    }
  };
  return (
    <>
      <Header />
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div style={{ height: "calc(99vh - 55px)", padding: "0px 20px 0px" }}>
          <div>
            <div className="py-3" style={{ display: "flex", gap: "4px" }}>
              <span
                style={{
                  color: "var(--color2)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push("/purchase/purchasebill");
                }}
              >
                Purchase
              </span>
              <ArrowForwardIosIcon
                style={{
                  fontSize: "20px",
                  marginTop: "9px",
                  color: "var(--color1)",
                }}
              />
              <span
                style={{
                  color: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                View
              </span>
              <ArrowForwardIosIcon
                style={{
                  fontSize: "20px",
                  marginTop: "9px",
                  color: "var(--color1)",
                }}
              />
              <span
                style={{
                  color: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                  minWidth: "150px",
                }}
              >
                {data.bill_no}
              </span>
              {/* {permissions.some(permission => permission["purchase bill edit"]) && ( */}

              {hasPermission(permissions, "purchase bill edit") && (
                <div
                  className="flex"
                  style={{ width: "100%", justifyContent: "end", gap: "10px" }}
                >
                  {data?.cn_bill_list?.length !== 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ textTransform: "none" }}
                      onClick={handelAddOpen}
                    >
                      <AddIcon className="mr-2" />
                      CN View
                    </Button>
                  )}
                  <Button
                    style={{ background: "var(--color1)" }}
                    variant="contained"
                    onClick={() => {
                      history.push(
                        "/purchase/edit/" +
                          data.id +
                          "/" +
                          data?.item_list[0].random_number
                      );
                    }}
                  >
                    <BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer " />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="firstrow flex">
              <div className="detail">
                <span className="title mb-2">SR No.</span>
                <span className="data">{data.sr_no}</span>
              </div>
              <div className="detail">
                <span className="title mb-2 ">Bill Creator</span>
                {/* <span className="data">2 | Owner</span> */}
                <span className="data capitalize">{data.user_name}</span>
              </div>
              <div className="detail">
                <span className="title mb-2">Bill No.</span>
                <span className="data">{data.bill_no}</span>
              </div>

              <div className="detail">
                <span className="title mb-2">Bill Date</span>
                <span className="data">{data.bill_date}</span>
              </div>
              <div className="detail">
                <span className="title mb-2">Due Date</span>
                <span className="data">{data.due_date}</span>
              </div>
              <div className="detail">
                <span className="title mb-2">Distributer</span>
                <span className="data">{data.distributor_name}</span>
              </div>
              <div className="detail">
                <span className="title mb-2">Payment Type</span>
                <span className="data">{data.payment_type}</span>
              </div>
              <div className="detail">
                <span className="title mb-2">Entery By</span>
                <span className="data">{localStorage.getItem("UserName")}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="customtable  w-full border-collapse custom-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit </th>
                    <th>HSN</th>
                    <th>Batch </th>
                    <th>Expiry </th>
                    <th>MRP </th>
                    <th>Qty. </th>
                    <th>Free </th>
                    <th>PTR </th>
                    <th>CD% </th>
                    <th>Sch.Amt </th>
                    <th>Base </th>
                    <th>GST% </th>
                    <th>Loc. </th>
                    <th>Margin </th>
                    <th>Net Rate </th>
                    <th>Amount </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.item_list?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div>{item.item_name}</div>
                      </td>
                      <td>{item.weightage}</td>
                      <td>{item.hsn_code}</td>
                      <td>{item.batch_number}</td>
                      <td>{item.expiry}</td>
                      <td>{item.mrp}</td>
                      <td>{item.qty}</td>
                      <td>{item.fr_qty}</td>
                      <td>{item.ptr}</td>
                      <td>{item.disocunt}</td>
                      <td>{item.scheme_account}</td>
                      <td>{item.base_price}</td>
                      <td>{item.gst_name}</td>
                      <td>{item.location}</td>
                      <td>{item.margin}</td>
                      <td>{item.net_rate}</td>
                      <td className="amount">{item.amount} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-10 justify-end mt-10 flex-wrap mr-10">
                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                  }}
                >
                  <label className="font-bold">Total GST : </label>
                  <label className="font-bold">Total Qty : </label>
                  <label className="font-bold">Total Net Rate : </label>
                  <label className="font-bold">Total Base : </label>
                </div>
                <div
                  class="totals mr-5"
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                    alignItems: "end",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {data?.total_gst ? data?.total_gst : 0}{" "}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {" "}
                    {data?.total_qty ? data?.total_qty : 0} {"+"}&nbsp;
                    <span className="primary">
                      {data?.total_free_qty ? data?.total_free_qty : 0} Free{" "}
                    </span>{" "}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {data?.total_net_rate}
                  </span>
                  <span style={{ fontWeight: 600 }}>{data?.total_base}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexDirection: "column",
                  }}
                >
                  <label className="font-bold">Total Amount : </label>
                  <label className="font-bold">CN Amount : </label>
                  <label className="font-bold">Round Of : </label>
                  {/* <label className="font-bold">Profit : </label> */}
                  <label className="font-bold">Net Amount : </label>
                </div>
                <div
                  className="mr-5"
                  style={{
                    display: "flex",
                    gap: "24px",
                    flexDirection: "column",
                    alignItems: "end",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {data?.total_amount ? data?.total_amount : 0}
                  </span>
                  <span style={{ fontWeight: 600, color: "red" }}>
                    {-(parseFloat(data?.cn_amount) || 0).toFixed(2)}
                  </span>

                  <span style={{ fontWeight: 600 }}>
                    {roundOffAmount === "0.00"
                      ? roundOffAmount
                      : roundOffAmount < 0
                      ? `-${Math.abs(roundOffAmount)}`
                      : `+${Math.abs(roundOffAmount)}`}
                  </span>
                  {/* <span style={{ fontWeight: 600 }}>₹{data?.margin_net_profit} &nbsp; (₹{data?.total_margin})</span> */}

                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "22px",
                      color: "var(--color1)",
                    }}
                  >
                    {data?.net_amount ? data?.net_amount : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CN List PopUp Box */}
          <Dialog open={openAddPopUp}>
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
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div className="bg-white">
                  <div className="bg-white">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Bill No</th>
                          <th>Bill Date</th>
                          <th>Amount</th>
                          <th>Adjust CN Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.cn_bill_list?.length === 0 ? (
                          <tr>
                            <td>No data found</td>
                          </tr>
                        ) : (
                          data?.cn_bill_list?.map((row, index) => (
                            <tr key={index}>
                              <td>{row.bill_no}</td>
                              <td>{row.bill_date}</td>
                              <td>{row.total_amount}</td>
                              <td>{row.cn_amount}</td>
                            </tr>
                          ))
                        )}
                        {/* <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>Total Bills Amount</td>
                                                    <td>
                                                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'black' }}>Rs.{data?.cn_bill_list?.total_amount}</span>
                                                    </td>
                                                </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
          <div
            className="flex justify-between"
            style={{ width: "98%", position: "absolute", bottom: "20px" }}
          >
            <Button
              style={{ background: "var(--color1)" }}
              variant="contained"
              onClick={() => {
                const prevIndex =
                  (currentIndex - 1 + tableData.length) % tableData.length;
                const prevId = tableData[prevIndex]?.id;
                if (prevId) {
                  history.push(`/purchase/view/${prevId}`);
                }
              }}
            >
              <IoArrowBackCircleOutline size={25} cursor="pointer" />
              Previous Bill
            </Button>
            <Button
              style={{ background: "var(--color1)" }}
              variant="contained"
              onClick={() => {
                const nextIndex = (currentIndex + 1) % tableData.length;
                const nextId = tableData[nextIndex]?.id;
                if (nextId) {
                  history.push(`/purchase/view/${nextId}`);
                }
              }}
            >
              <IoArrowForwardCircleOutline size={25} cursor="pointer" />
              Next Bill
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default PurchaseView;