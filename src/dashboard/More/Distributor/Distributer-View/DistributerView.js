import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useEffect, useState, useRef } from 'react';
import Header from "../../../Header";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import { TablePagination, Button } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";

const DistributerView = () => {
    const { id } = useParams();
    const history = useHistory();
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const PaymentHistory = [
        { id: "bill_no", label: "Bill No" },
        { id: "payment_date", label: "Payment Date" },
        { id: "payment_mode", label: "Payment Mode" },
        { id: "bill_amount", label: "Bill Amount" },
        { id: "paid_amount", label: "Paid Amount" },
        { id: "due_amount", label: "Due Amount" }
    ]
    /*<======================================================================= get distributor details  =======================================================================> */

    useEffect(() => {
        distributerDetail(id);
    }, [page, rowsPerPage])

    const distributerDetail = (id) => {
        let data = new FormData();
        data.append("id", id);
        const params = {
            id: id,
            page: page + 1,
            limit: rowsPerPage
        };
        setIsLoading(true)
        try {
            axios.post("view-distributer?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setTableData(response.data.data)
                setIsLoading(false);


            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    /*<============================================================================== pagination  ==============================================================================> */

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    /*<========================================================================== get list of company  ==========================================================================> */

    const handleGetCompanyList = async () => {
        console.log('Fetching Company List for ID:', id);

        let data = new FormData();
        data.append('id', id);

        try {
            // Fetch data from the API
            const response = await axios.post(
                'distributer-company-list',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const distributorData = response.data.data;
            console.log('Fetched Distributor Data:', distributorData);

            // Pass the fetched data to generate the PDF
            downloadPDF(distributorData);
        } catch (error) {
            console.error('Error fetching distributor data:', error);
        }
    };

    /*<============================================================================ download pdf  ============================================================================> */

    const downloadPDF = (distributorData) => {
        const { name, company_list } = distributorData;

        const content = `
          <html>
            <head>
              <title>Company List</title>
              <style>
                body { font-family: Arial, sans-serif; }
                h1 { font-size: 20px; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; font-weight: bold; }
              </style>
            </head>
            <body>
              <h1>Distributor: ${name}</h1>
              <table>
                <thead>
                  <tr>
                    <th>sr no</th>
                    <th>Company Name</th>
                  </tr>
                </thead>
                <tbody>
                  ${company_list
                .map(
                    (company, index) =>
                        `<tr>
                          <td>${index + 1}</td>
                          <td>${company}</td>
                        </tr>`
                )
                .join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;

        // Open a new tab and write the content to it
        const printWindow = window.open('', '_blank', 'width=1000,height=800');
        printWindow.document.write(content);
        printWindow.document.close();

        // Trigger print dialog
        printWindow.print();
    };

    /*<============================================================================== UI  ==============================================================================> */

    return (
        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                    <div className="flex justify-between items-center">
                        <div className='py-3' style={{ display: 'flex', gap: '4px', }}>

                            <span style={{ color: 'var(--color2)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }} onClick={() => { history.push('/more/DistributorList') }} className="cursor-pointer" >Distributor</span>
                            <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow align-center" />

                            <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '6px', color: "var(--color1)" }} />
                            <span style={{ color: 'var(--color1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>View </span>
                            <ArrowForwardIosIcon style={{ fontSize: '20px', marginTop: '6px', color: "var(--color1)" }} />
                            <span style={{ color: 'var(--color1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>{tableData.name}</span>
                        </div>
                        <Button onClick={() => handleGetCompanyList()} variant="contained" style={{ background: 'var(--color1)', color: 'white', textTransform: 'none', paddingLeft: "35px", }}>    <img src="/csv-file.png"
                            className=" report-icon absolute mr-10 "
                            alt="csv Icon" />
                            Download Compony List
                        </Button>

                    </div>
                    <div>
                        <div className="firstrow flex" style={{ background: "none", gap: 0 }}>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Distributor Name</span>
                                <span className="data">{tableData.name ? tableData.name : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">GST/IN Number</span>
                                <span className="data">{tableData.gst_number ? tableData.gst_number : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Email</span>
                                <span className="data" style={{ textTransform: 'lowercase' }}>{tableData.email ? tableData.email : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Mobile No.</span>
                                <span className="data">{tableData.phone_number ? tableData.phone_number : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Address</span>
                                <span className="data">{tableData.address ? tableData.address : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Bank Name</span>
                                <span className="data">{tableData.bank_name ? tableData.bank_name : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Account No.</span>
                                <span className="data">{tableData.account_no ? tableData.account_no : '____'}</span>

                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">IFSC Code</span>
                                <span className="data">{tableData.ifsc_code ? tableData.ifsc_code : '____'}</span>
                            </div>
                            <div className="distributor-detail">
                                <span className="text-gray-800 font-bold">Credit Period</span>
                                <span className="data" >{tableData.credit_due_days ? tableData.credit_due_days : '____'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white">
                        <div className="overflow-x-auto mt-4">
                            <table className="custom-table">
                                <thead className="w-full border-collapse">
                                    <tr>
                                        {PaymentHistory.map((column, index) => (
                                            <th key={column.id} >
                                                {column.label}
                                            </th>
                                        ))}

                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.payment_list?.map((item, index) => (
                                        <tr key={index} >
                                            {PaymentHistory.map((column) => (
                                                <td key={column.id} className={`text-lg ${column.id === 'due_amount' ? 'text-red-500' : 'text-dark'}`} >
                                                    {/* {item[column.id]} */}
                                                    {column.id === 'bill_no' ? (
                                                        <a href={`/purchase/view/${item.purches_id}`} target='_blank' className="primary">
                                                            {item[column.id]}
                                                        </a>
                                                    ) : (
                                                        item[column.id]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 12]}
                                component="div"
                                count={tableData?.payment_list?.[0]?.count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default DistributerView