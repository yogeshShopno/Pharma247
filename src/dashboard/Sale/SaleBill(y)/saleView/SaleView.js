import Header from "../../../Header"
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from "../../../../componets/loader/Loader";
import Button from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import usePermissions, { hasPermission } from "../../../../componets/permission";

const SaleView = () => {
    const permissions = usePermissions();
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [saleData, setSaleData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);

    const { id } = useParams();
    const token = localStorage.getItem("token");
    const history = useHistory()

    useEffect(() => {
        saleBillList();
    }, [])


    const saleBillList = async (currentPage) => {
        setIsLoading(true);
        let data = new FormData();
        data.append('page', currentPage);
        try {
            const response = await axios.post("sales-list?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSaleData(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("API error:", error);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const index = saleData.findIndex(item => item.id == parseInt(id));
        if (index !== -1) {
            setCurrentIndex(index);
            saleBillGetByID(saleData[index].id);
        }
        //console.log('purchase', saleData);
    }, [id, saleData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                const nextIndex = (currentIndex + 1) % saleData.length;
                const nextId = saleData[nextIndex]?.id;
                if (nextId) {
                    history.push(`/salebill/view/${nextId}`);
                }

            } else if (e.key === 'ArrowLeft') {
                const prevIndex = (currentIndex - 1 + saleData.length) % saleData.length;
                const prevId = saleData[prevIndex]?.id;
                if (prevId) {
                    history.push(`/salebill/view/${prevId}`);
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    })

    // useEffect(() => {
    //     saleBillGetByID();
    // }, []);

    const saleBillGetByID = async () => {
        let data = new FormData();
        data.append("sales_id", id);
        const params = {
            sales_id: id,
        };
        setIsLoading(true);
        try {
            await axios.post("sales-view?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setTableData(response.data.data)
                setIsLoading(false);
                console.log(tableData);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    return (
        <>
            <div>
                <Header />
                {isLoading ? <div className="loader-container ">
                    <Loader />
                </div> :
                    <div style={{ backgroundColor: 'rgb(240, 240, 240)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                        <div>
                            <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                                <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', cursor: 'pointer' }} onClick={() => { history.push('/salelist') }}>Sale</span>
                                <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '9px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>View</span>
                                <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '9px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>{tableData.bill_no}</span>
                                {hasPermission(permissions, "sale bill edit") && (
                                    <div className='flex' style={{ width: '100%', justifyContent: 'end', gap: '10px' }}>
                                        <Button variant="contained" onClick={() => { history.push('/salebill/edit/' + tableData.id + '/' + tableData?.sales_item[0].random_number) }}>< BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />Edit</Button>
                                    </div>)}
                            </div>
                        </div>

                        <div>
                            <div className="firstrow flex">

                                <div className="detail">
                                    <span className="heading mb-2">Bill No</span>
                                    <span className="data">
                                        {tableData.bill_no}
                                    </span>
                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Bill Date</span>
                                    <span className="data">
                                        {tableData.bill_date}

                                    </span>

                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Customer Name</span>
                                    <span className="data">
                                        {tableData.customer_name}
                                    </span>

                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Mobile No.</span>
                                    <span className="data">
                                        {tableData.mobile_numbr}
                                    </span>
                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Doctor Name</span>
                                    <span className="data">
                                        {tableData.doctor_name}
                                    </span>
                                </div>
                                <div className="detail">
                                    <span className="heading mb-2">Address</span>
                                    <span className="data">
                                        {tableData.customer_address}

                                    </span>
                                </div>
                            </div>
                            <div className='overflow-x-auto'>
                                <table className="customtable  w-full border-collapse custom-table">
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
                                            <th >Order  </th>
                                            <th >Loc. </th>
                                            <th >Amount  </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData?.sales_item?.map((item, index) => (
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
                                                <td>{item.order}</td>
                                                <td>{item.location}</td>
                                                <td className="amount">{item.net_rate}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                            <div className="flex gap-10 justify-end mt-4 flex-wrap"  >
                                <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                    <label className="font-bold">Total Base: </label>
                                </div>
                                <div class="totals">
                                    <span style={{ fontWeight: 600 }}> {tableData?.total_base} /-</span>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <label className="font-bold">SGST : </label>
                                    <label className="font-bold">CGST: </label>
                                    <label className="font-bold">IGST: </label>
                                    <label className="font-bold">Total GST : </label>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600 }}>{tableData?.sgst}</span>
                                    <span style={{ fontWeight: 600 }}>{tableData?.cgst}</span>
                                    <span style={{ fontWeight: 600 }}>{tableData?.igst ? tableData?.igst : 0}</span>
                                    <span style={{ fontWeight: 600 }}>{tableData?.total_amount}/-</span>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <label className="font-bold">Total Amount : </label>
                                    <label className="font-bold">Discount  : </label>
                                    <label className="font-bold">Other Amount: </label>
                                    <label className="font-bold" >Net Amount % : </label>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600 }}>{tableData?.mrp_total}/-</span>
                                    <span style={{ fontWeight: 600 }}>{tableData?.total_discount}%</span>
                                    <span style={{ fontWeight: 600 }}>{tableData?.other_amount}/-</span>
                                    <span style={{ fontWeight: 800, fontSize: '22px', borderBottom: "2px solid rgb(12, 161, 246)" }}>{tableData?.total_amount}/-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div >
        </>
    )
}
export default SaleView
