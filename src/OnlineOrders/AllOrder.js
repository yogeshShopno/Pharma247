import React, { useState, useEffect } from 'react';

import axios from 'axios';

const AllOrder = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [value, setValue] = useState(1)
    const token = localStorage.getItem("token");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
                const records=(response?.data?.count);
                const pages = Math.ceil(Number(records)/10);
                setTotalPages(pages);
            })
        } catch (error) {
            setIsLoading(false);
        }
    }

    
  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

    return (
        <div>
            <div className='dashbd_crd_bx gap-5  p-8 grid grid-cols-1 md:grid-cols-1  sm:grid-cols-1'>
                <div className='gap-4 flex flex-col justify-between' style={{ height: '100%' }}>
                    <div className="bg-white  px-2 py-1 rounded-lg flex flex-col justify-between" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>
                        <div className='overflow-x-auto'>
                            <table className='w-full custom-table'>
                                <thead className='primary'>
                                    <tr>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Order ID</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Patient Name</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Patient Number</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Date</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Delivery Status</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Status</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Net Amount</th>
                                        <th className='border-b border-gray-200 font-bold px-4 py-2'>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billData?.map((order, index) => (
                                        <tr key={index} className="border-b border-gray-200" style={{ textAlign: 'center' }}>
                                            <td className='px-4 py-2'>{order.order_id}</td>
                                            <td className='px-4 py-2'>{order.patient_name}</td>
                                            <td className='px-4 py-2'>{order.patient_number}</td>
                                            <td className='px-4 py-2'>{order.date}</td>
                                            <td className='px-4 py-2'>{order.delivery_status}</td>
                                            <td className='px-4 py-2'>{order.status}</td>
                                            <td className='px-4 py-2'>{order.net_amount}</td>
                                            <td className='px-4 py-2'>{order.total_amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <div
                                    className="flex justify-center mt-4"
                                    style={{
                                        marginTop: 'auto',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '1rem',
                                    }}
                                >
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
                                            ? "bg-gray-200 text-gray-700"
                                            : "secondary-bg text-white"
                                            }`}
                                        disabled={currentPage >= totalPages}
                                    >
                                        Next
                                    </button>
                                </div>


                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AllOrder;
