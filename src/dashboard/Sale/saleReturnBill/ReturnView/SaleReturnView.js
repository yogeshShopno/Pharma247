import Header from "../../../Header"
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from "../../../../componets/loader/Loader";
import Button from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { BsLightbulbFill } from "react-icons/bs";
import usePermissions, { hasPermission } from "../../../../componets/permission";

const SaleReturnView = () => {
    const [tableData, setTableData] = useState([]);
    const [saleReturnData, setSaleReturnData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory()
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const permissions = usePermissions();
    const [currentIndex, setCurrentIndex] = useState(null);

    useEffect(() => {
        saleReturnBillList();
    }, []);

    useEffect(() => {
        const index = saleReturnData.findIndex(item => item.id == parseInt(id));
        if (index !== -1) {
            setCurrentIndex(index);
            saleReturnBillGetByID(saleReturnData[index].id);
        }
        //console.log('purchase', saleReturnData);
    }, [id, saleReturnData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                const nextIndex = (currentIndex + 1) % saleReturnData.length;
                const nextId = saleReturnData[nextIndex]?.id;
                if (nextId) {
                    history.push(`/SaleReturn/View/${nextId}`);
                }

            } else if (e.key === 'ArrowLeft') {
                const prevIndex = (currentIndex - 1 + saleReturnData.length) % saleReturnData.length;
                const prevId = saleReturnData[prevIndex]?.id;
                if (prevId) {
                    history.push(`/SaleReturn/View/${prevId}`);
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    })


    const saleReturnBillList = async (currentPage) => {
        setIsLoading(true);
        let data = new FormData();
        data.append('page', currentPage);
        try {
            await axios.post("sales-return-list?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setSaleReturnData(response.data.data)
                setIsLoading(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const saleReturnBillGetByID = async () => {
        let data = new FormData();
        data.append("id", id);
        const params = {
            id: id,
        };
        setIsLoading(true);
        try {
            await axios.post("sales-return-view-details?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                console.log('response :>> ', response.data.data);
                setTableData(response.data.data)
                setIsLoading(false);
                //console.log(tableData);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    return (
        <>
            <div>
                <div>
                    <Header />
                    {isLoading ? <div className="loader-container ">
                        <Loader />
                    </div> :
                        <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                            <div>
                                <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                                    <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', cursor: 'pointer', minWidth: "105px" }} onClick={() => { history.push('/saleReturn/list') }}>Sale Return</span>
                                    <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '6px', color: "rgba(4, 76, 157, 1)" }} />
                                    <span style={{ color: 'rgba(4, 76, 157, 1)', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>View</span>
                                    <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '6px', color: "rgba(4, 76, 157, 1)" }} />
                                    <span style={{ color: 'rgba(4, 76, 157, 1)', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>{tableData.bill_no}</span>
                                    <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
                                    {hasPermission(permissions, "sale return bill edit") && (
                                        <div className='flex' style={{ width: '100%', justifyContent: 'end', gap: '10px' }}>
                                            <Button variant="contained" onClick={() => { history.push('/SaleReturn/Edit/' + tableData.id) }}>< BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />Edit</Button>
                                        </div>)}
                                </div>
                            </div>
                            <div>
                                <div className="firstrow flex">

                                    <div className="detail">
                                        <span className="heading">Bill No</span>
                                        <span className="data">
                                            {tableData.bill_no}
                                        </span>
                                    </div>
                                    <div className="detail">
                                        <span className="heading">Bill Date</span>
                                        <span className="data">
                                            {tableData.bill_date}

                                        </span>

                                    </div>
                                    <div className="detail">
                                        <span className="heading">Customer </span>
                                        <span className="data">
                                            {tableData.customer_name}
                                        </span>

                                    </div>
                                    <div className="detail">
                                        <span className="heading">Mobile No.</span>
                                        <span className="data">
                                            {tableData.customer_number}
                                        </span>
                                    </div>
                                    <div className="detail">
                                        <span className="heading">Doctor </span>
                                        <span className="data">
                                            {tableData.doctor_name}
                                        </span>
                                    </div>
                                    <div className="detail">
                                        <span className="heading">Payment Mode</span>
                                        <span className="data">
                                            {tableData.payment_name}

                                        </span>
                                    </div>
                                </div>
                                <div className='overflow-x-auto'>
                                    <table className="customtable w-full border-collapse custom-table">
                                        <thead>
                                            <tr>
                                                <th >
                                                    Item Name
                                                </th>
                                                <th >Unit  </th>
                                                <th >Batch </th>
                                                <th >Expiry </ th>
                                                <th >MRP  </th>
                                                <th >Base </th>
                                                <th >GST%  </th>
                                                <th >QTY </ th>
                                                {/* <th >Order  </th> */}
                                                <th >Loc. </th>
                                                <th >Amount  </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData?.sales_retur_view?.map((item, index) => (
                                                <tr >
                                                    <td>
                                                        <div className="itemName">
                                                            {item.iteam_name}
                                                        </div>
                                                    </td>
                                                    <td>{item.unit}</td>
                                                    <td>{item.batch}</td>
                                                    <td>{item.exp}</td>
                                                    <td>{item.mrp}</td>
                                                    <td>{item.base}</td>
                                                    <td>{item.gst}</td>
                                                    <td>{item.qty}</td>
                                                    {/* <td>{item.order}</td> */}
                                                    <td>{item.location}</td>
                                                    <td className="amount">{item.net_rate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex gap-10 justify-end mt-4 flex-wrap mr-10"  >
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <label className="font-bold">Total GST : </label>
                                        <label className="font-bold">Total Base : </label>
                                        <label className="font-bold">Margin : </label>
                                    </div>
                                    <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>
                                        <span style={{ fontWeight: 600 }}> {tableData?.total_gst} </span>
                                        <span style={{ fontWeight: 600 }}> {tableData?.total_base} </span>
                                        <span style={{ fontWeight: 600 }}>  ₹ {tableData?.total_net_rate}({tableData?.total_margin} %)   </span>
                                    </div>

                                    {/* <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                        <label className="font-bold">SGST : </label>
                                        <label className="font-bold">CGST: </label>
                                        <label className="font-bold">IGST: </label>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600 }}>{tableData?.sgst}</span>
                                        <span style={{ fontWeight: 600 }}>{tableData?.cgst}</span>
                                        <span style={{ fontWeight: 600 }}>{tableData?.igst}</span>
                                    </div> */}

                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <label className="font-bold">Total Amount : </label>
                                        <label className="font-bold">Other Amount : </label>
                                        <label className="font-bold">Round Off : </label>
                                        <label className="font-bold" >Net Amount : </label>
                                    </div>
                                    <div className="mr-5" style={{ display: 'flex', gap: '24px', flexDirection: 'column', alignItems: "end" }}>
                                        <span style={{ fontWeight: 600 }}>{tableData?.mrp_total}</span>
                                        {/* <span style={{ fontWeight: 600 }}>{tableData?.total_discount}%</span> */}
                                        <span style={{ fontWeight: 600 }}>{tableData?.other_amount}</span>
                                        <span style={{ fontWeight: 600 }}>{Number(tableData?.round_off || 0).toFixed(2)}</span>
                                        <span style={{ fontWeight: 800, fontSize: '22px', color: "Green" }}>{tableData?.net_amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div >
            </div>
        </>
    )
}
export default SaleReturnView