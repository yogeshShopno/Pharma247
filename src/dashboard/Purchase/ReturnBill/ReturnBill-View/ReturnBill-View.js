import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from "../../../Header"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Loader from '../../../../componets/loader/Loader';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import usePermissions, { hasPermission } from '../../../../componets/permission';



const ReturnView = () => {
    const history = useHistory();
    const token = localStorage.getItem("token");
    const permissions = usePermissions();
    const [currentIndex, setCurrentIndex] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [tableData, setTableData] = useState([]);
    const [IsDelete, setIsDelete] = useState(false);
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [returnData, setReturnData] = useState([])
    const [roundOff, setRoundOff] = useState(0)

    useEffect(() => {
        const index = returnData.findIndex(item => item.id == parseInt(id));
        if (index !== -1) {
            setCurrentIndex(index);
            returnBillGetByID(returnData[index].id);
        }
        //console.log('purchase', returnData);
    }, [id, returnData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                const nextIndex = (currentIndex + 1) % returnData.length;
                const nextId = returnData[nextIndex]?.id;
                if (nextId) {
                    history.push(`/return/view/${nextId}`);
                }

            } else if (e.key === 'ArrowLeft') {
                const prevIndex = (currentIndex - 1 + returnData.length) % returnData.length;
                const prevId = returnData[prevIndex]?.id;
                if (prevId) {
                    history.push(`/return/view/${prevId}`);
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    })

    useEffect(() => {
        // returnBillGetByID();
        ReturnBillList();
    }, [])

    const ReturnBillList = async (currentPage) => {
        let data = new FormData();
        data.append("page", currentPage);
        const params = {
            page: currentPage
        }
        setIsLoading(true);
        try {
            await axios.post("purches-return-list?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setReturnData(response.data.data)
                setIsLoading(false);
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);
        }
    }

    const returnBillGetByID = () => {
        let data = new FormData();
        data.append("id", id);
        const params = {
            purches_return_id: id,
        };
        setIsLoading(true);
        try {
            axios.post("purches-return-details?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setTableData(response?.data?.data);
                setRoundOff(response?.data?.data?.round_off)
                setIsLoading(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const deleteOpen = (id) => {
        setIsDelete(true);
    };

    // const handleDeleteItem = async (id) => {
    //     if (!id) return;
    //     let data = new FormData();
    //     data.append("id", id);
    //     const params = {
    //         id: id
    //     };
    //     try {
    //         await axios.post("purches-return-destroy?", data, {
    //             params: params,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }
    //         ).then((response) => {
    //             setIsDelete(false);
    //             history.push('/admindashboard');
    //         })
    //     } catch (error) {
    //         console.error("API error:", error);
    //     }
    // }

    const handleLeavePage = async () => {
        let data = new FormData();
        data.append("start_date", localStorage.getItem("StartFilterDate"));
        data.append("end_date", localStorage.getItem("EndFilterDate"));
        data.append("distributor_id", localStorage.getItem("DistributorId"));
        data.append("type", "1");
        try {
            const response = await axios.post("purches-return-iteam-histroy", data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });

            if (response.status === 200) {
                // setUnsavedItems(false);
                // setIsOpenBox(false);

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

    return (
        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div style={{ height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                    <div>
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <span style={{ color: 'var(--color2)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: '170px', cursor: "pointer" }} onClick={() => history.push('/purchase/return')}>Purchase Return</span>
                            <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '9px', color: "var(--color1)" }} />
                            <span style={{ color: 'var(--color1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>View</span>
                            <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '9px', color: "var(--color1)" }} />
                            <span style={{ color: 'var(--color1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>{tableData?.bill_no}</span>
                            {hasPermission(permissions, "purchase return bill edit") && (
                                <div className='flex' style={{ width: '100%', justifyContent: 'end', gap: '10px', }}>
                                    <Button style={{ backgroundColor: 'var(--color1)', }} variant="contained" onClick={() => { history.push('/return/edit/' + tableData.id) }} >< BorderColorIcon className="w-7 h-6 text-white   p-1 cursor-pointer" />Edit</Button>
                                </div>)}
                        </div>
                    </div>
                    <div>
                        <div className="firstrow flex">
                            <div className="detail">
                                <span className="heading">Bill Creator</span>
                                <span className="data">{tableData?.user_name}</span>
                            </div>
                            <div className="detail">
                                <span className="heading">Bill No</span>
                                <span className="data">{tableData?.bill_no} </span>
                            </div>
                            <div className="detail">
                                <span className="heading">Bill Date</span>
                                <span className="data">{tableData?.bill_date} </span>
                            </div>
                            <div className="detail">
                                <span className="heading">start Date</span>
                                <span className="data">{tableData?.start_date} </span>
                            </div>
                            <div className="detail">
                                <span className="heading">end Date</span>
                                <span className="data">{tableData?.end_date} </span>
                            </div>
                            <div className="detail">
                                <span className="heading">Remark</span>
                                <span className="data">{tableData?.remark} </span>

                            </div>
                            <div className="detail">
                                <span className="heading">Distributer</span>
                                <span className="data">{tableData?.distributor_name} </span>

                            </div>

                        </div>
                        <div>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full border-collapse custom-table">
                                    <thead>
                                        <tr>
                                            <th >
                                                Item Name <SwapVertIcon />
                                            </th>
                                            <th >Unit  </th>
                                            <th >Batch </th>
                                            <th >Expiry </ th>
                                            <th >MRP  </th>
                                            <th >Qty.  </th>
                                            <th >Free  </th>

                                            <th >PTR </ th>
                                            <th >CD%  </th>
                                            <th >GST%  </th>
                                            <th >Loc </th>
                                            <th >Amount </th>
                                        </tr>
                                    </thead>
                                    {tableData.length == 0 ?
                                        <div colSpan={16} style={{ marginTop: '5px', textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>No record found</div>
                                        :
                                        <tbody>
                                            {tableData?.item_list.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="itemName">
                                                            {item?.item_name}
                                                        </div>
                                                    </td>
                                                    <td>{item?.weightage}</td>
                                                    <td>{item?.batch_number}</td>
                                                    <td>{item?.expiry}</td>
                                                    <td>{item?.mrp}</td>
                                                    <td>{item?.qty}</td>
                                                    <td>{item?.fr_qty}</td>
                                                    <td>{item?.ptr}</td>
                                                    <td>{item?.disocunt}</td>
                                                    <td>{item?.gst_name}</td>
                                                    <td>{item?.location}</td>
                                                    <td className="amount">{item?.amount}</td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    }
                                </table>
                                <div className="flex gap-10 justify-end mt-10 flex-wrap mr-10" >
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <label className="font-bold">Total GST : </label>
                                        <label className="font-bold">Total Qty : </label>
                                        {/* <label className="font-bold">Total Net Rate : </label> */}
                                    </div>
                                    <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>
                                        <span style={{ fontWeight: 600 }}>{tableData?.total_gst ? tableData?.total_gst : 0} </span>
                                        <span style={{ fontWeight: 600 }}> {tableData?.total_qty ? tableData?.total_qty : 0} </span>
                                        {/* <span style={{ fontWeight: 600 }}>{tableData?.total_net_rate}</span> */}
                                    </div>




                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <label className="font-bold">Total Amount : </label>
                                        <label className="font-bold">Other Amount : </label>
                                        <label className="font-bold">Round Off : </label>
                                        <label className="font-bold">Net Rate :  </label>


                                        <label className="font-bold" >Net Amount : </label>
                                    </div>
                                    <div className="mr-5" style={{ display: 'flex', gap: '24px', flexDirection: 'column', alignItems: "end" }}>
                                        <span style={{ fontWeight: 600 }}>{tableData?.total_amount ? tableData?.total_amount : 0}</span>
                                        <span style={{ fontWeight: 600, }}>{isNaN(Number(tableData?.other_amount))
                                            ? tableData?.other_amount || "N/A"
                                            : Number(tableData?.other_amount).toFixed(2)}</span>


                                        <span style={{ fontWeight: 600 }}>
                                            {roundOff === "0.00"
                                                ? roundOff
                                                : roundOff < 0
                                                    ? `-${Math.abs(roundOff)}`
                                                    : `+${Math.abs(roundOff)}`}
                                        </span>
                                        {/* <span style={{ fontWeight: 600 }}>₹{tableData?.total_net_rate} ({tableData?.total_margin}%)</span> */}
                                        <span style={{ fontWeight: 600 }}>{(tableData?.total_net_rate) ? (tableData?.total_net_rate) : 0} </span>


                                        <span style={{ fontWeight: 800, fontSize: '22px', color: "Green" }}>{tableData?.net_amount ? tableData?.net_amount : 0}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>


                </div>
            }

        </>
    )
}

export default ReturnView