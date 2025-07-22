import React, { useState, useEffect } from 'react';

import axios from 'axios';

const AllOrder = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [value, setValue] = useState(1)
    const token = localStorage.getItem("token");

    const types = [{ id: 1, value: 'sales' }, { id: 0, value: 'purchase' },]

    const [billData, setBilldata] = useState([])

    useEffect(() => {
        // dashboardData();
        orderdata()

    }, [value])
    const orderdata = async () => {

        let data = new FormData();
        // data.append("order_status", 0)
        // data.append("start_date", "2025-03-10")
        // data.append("end_date", "2025-03-31")
        // data.append("patient_name", "shailesh")

        try {
            await axios.post("chemist-order-list?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false)
                setBilldata(response.data.data);
            })

        } catch (error) {
            setIsLoading(false);
        }
    }
    return (
        <div>
            <div className='dashbd_crd_bx gap-5  p-8 grid grid-cols-1 md:grid-cols-1  sm:grid-cols-1'>
                <div className='gap-4'>
                    <div className="bg-white flex flex-col px-2 py-1 rounded-lg " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Patient Name</th>
                                    <th>Patient Number</th>
                                    <th>Date</th>
                                    <th>Delivery Status</th>
                                    <th>Status</th>
                                    <th>Round Off</th>
                                    <th>Net Amount</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billData?.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order.order_id}</td>
                                        <td>{order.patient_name}</td>
                                        <td>{order.patient_number}</td>
                                        <td>{order.date}</td>
                                        <td>{order.delivery_status}</td>
                                        <td>{order.status}</td>
                                        <td>{order.round_off}</td>
                                        <td>{order.net_amount}</td>
                                        <td>{order.total_amount}</td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}
export default AllOrder;
