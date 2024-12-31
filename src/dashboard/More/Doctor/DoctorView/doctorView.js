import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Header from '../../../Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../../componets/loader/Loader';
import { FaUser } from 'react-icons/fa';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TablePagination, Typography } from '@mui/material';

const saleColumns = [
    { id: 'bill_no', label: 'Bill NO', minWidth: 70, height: 100 },
    { id: 'bill_date', label: 'Bill Date', minWidth: 100 },
    { id: 'customer_name', label: 'Customer Name', minWidth: 100 },
    { id: 'phone_number', label: 'Mobile No', minWidth: 100 },
    { id: 'qty', label: 'Quantity', minWidth: 100 },
    { id: 'amt', label: 'Bill Amount', minWidth: 100 },
];
const saleReturnColumns = [
    { id: 'bill_no', label: 'Bill NO', minWidth: 70, height: 100 },
    { id: 'bill_date', label: 'Bill Date', minWidth: 100 },
    { id: 'customer_name', label: 'Customer Name', minWidth: 100 },
    { id: 'phone_number', label: 'Mobile No', minWidth: 100 },
    { id: 'qty', label: 'Quantity', minWidth: 100 },
    { id: 'amt', label: 'Amount', minWidth: 100 },

];
const DoctorView = () => {

    const { id } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const [IsDelete, setIsDelete] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [doctorDetails, setDoctorDetails] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    // const [saleAmount, setSaleAmount] = useState(0)
    // const [saleReturnAmount, setSaleReturnAmount] = useState(0)
    const DoctorViewGetbyID = async () => {
        let data = new FormData();
        data.append("id", id)
        setIsLoading(true)
        const params = {
            id: id,
            page: page + 1,
            limit: rowsPerPage
        };
        try {
            await axios.post("doctor-view", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false)
                setDoctorDetails(response.data.data)
               
            })
        } catch (error) {
            console.error("API error:", error);

        }
    }
    useEffect(() => {
        DoctorViewGetbyID()
    }, [page, rowsPerPage])

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0)
    };

    const deleteClose = () => {
        setIsDelete(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (

        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                    <div >
                        <div className='py-3' style={{ display: 'flex', gap: '5px', alignItems: "center" }} >
                            <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={(() => { history.push('/more/doctors') })} >Doctors</span>
                            <ArrowForwardIosIcon style={{ fontSize: '20px', color: "var(--color1)" }} />
                            <div className='flex'>
                                <div className='w-8 h-8 rounded-full flex items-center justify-center secondary-bg'>
                                    <FaUser className='text-white w-4 h-4' />
                                </div>
                            </div>
                            <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '18px', minWidth: '200px' }}> {doctorDetails.name}</span>

                        </div>
                    </div>

                    <div >
                        <div className="firstrow flex" style={{ background: "none" }}>
                            <div className="detail">
                                <span className="text-gray-800 font-bold mb-2">Doctor Name</span>
                                <span className="data">{doctorDetails.name ? doctorDetails.name : '____'}</span>

                            </div>

                            <div className="detail">
                                <span className="text-gray-800 font-bold mb-2">Clinic Name</span>
                                <span className="data">{doctorDetails.clinic ? doctorDetails.clinic : '____'}</span>

                            </div>
                            <div className="detail">
                                <span className="text-gray-800 font-bold mb-2">Mobile No</span>
                                <span className="data">{doctorDetails.phone_number ? doctorDetails.phone_number : '____'}</span>
                            </div>

                            <div className="detail">
                                <span className="text-gray-800 font-bold mb-2">License Number</span>
                                <span className="data">{doctorDetails.license ? doctorDetails.license : '____'}</span>
                            </div>
                            <div className="detail">
                                <span className="text-gray-800 font-bold mb-2">Address</span>
                                <span className="data">{doctorDetails.address ? doctorDetails.address : '____'}</span>
                            </div>
                        </div>
                    </div>
                    <div className='p-6' >
                        <Box sx={{ width: '100%', bgcolor: 'background.paper' }} >
                            <Tabs value={tabValue} onChange={handleChange}
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: "var(--color1)",
                                        color: "var(--color1)",
                                    },
                                }}>
                                <Tab label="Sale" sx={{
                                    mx: 2, color: tabValue === 0 ? "var(--color1)" : "var(--color1)",
                                    "&.Mui-selected": {
                                        color: "var(--color1)",
                                    },
                                }} />
                                <Tab label="Sales Return" sx={{
                                    mx: 2, color: tabValue === 0 ? "var(--color1)" : "var(--color1)",
                                    "&.Mui-selected": {
                                        color: "var(--color1)",
                                    },
                                }} />

                            </Tabs>

                            {tabValue === 0 && (
                                <div>
                                    <div className="mx-4 my-2 ">
                                        <Typography style={{ color: 'var(--color1)', fontSize: '18px', fontWeight: 800, marginLeft: '10px' }}> Total Sale Amount :- <span style={{ color: '#628A2F' }}>Rs.{doctorDetails?.sales?.length > 0 ? doctorDetails?.sales[0]?.total_amount : 0} </span></Typography>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse custom-table">
                                            <thead>
                                                <tr>
                                                    {saleColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctorDetails?.sales?.map((item, index) => (
                                                    <tr key={index}>
                                                        {saleColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 12]}
                                            component="div"
                                            count={doctorDetails?.sales?.[0]?.count}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>
                                </div>
                            )}

                            {tabValue === 1 && (
                                <div>
                                    <div className="mx-4 my-2 ">
                                        <Typography style={{ color: 'var(--color1)', fontSize: '18px', fontWeight: 800, marginLeft: '10px' }}> Total Sale Return Amount :- <span style={{ color: '#628A2F' }}>Rs.{doctorDetails?.sales_return?.length > 0 ? doctorDetails?.sales_return[0]?.total_amount : 0} </span></Typography>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse custom-table">
                                            <thead>
                                                <tr>
                                                    {saleReturnColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctorDetails?.sales_return?.map((item, index) => (
                                                    <tr key={index}>
                                                        {saleReturnColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 12]}
                                            component="div"
                                            count={doctorDetails?.sales_return?.[0]?.count}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>
                                </div>
                            )}

                        </Box>
                    </div>
                    <div id="modal" value={IsDelete}
                        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                            }`}>
                        <div />
                        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                                viewBox="0 0 24 24" onClick={deleteClose}>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                            </svg>
                            <div className="my-4 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                                    <path
                                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                        data-original="#000000" />
                                    <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                        data-original="#000000" />
                                </svg>
                                <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
                            </div>
                            <div className="flex gap-5 justify-center">
                                <button type="submit"
                                    className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                                >Delete</button>
                                <button type="button"
                                    className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                    onClick={deleteClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default DoctorView;