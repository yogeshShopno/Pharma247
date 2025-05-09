import React, { useState,useEffect } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { GoInfo } from "react-icons/go";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import axios from 'axios';

const Assigned = () => {
      const [isLoading, setIsLoading] = useState(false);
    
  const [value, setValue] = useState(1)
    const [expiredValue, setExpiredValue] = useState('expired')
    const [staffListValue, setStaffListValue] = useState('7_day')
    const token = localStorage.getItem("token");

  const types = [{ id: 1, value: 'sales' }, { id: 0, value: 'purchase' },]
  const staffList = [{ id: 'today', value: 'Today' }, { id: 'yesterday', value: 'Yesterday' }, { id: '7_day', value: 'Last 7 Days' }, { id: '30_day', value: 'Last 30 Days' }]

  const [billData, setBilldata] = useState([])

  const handlechange = (event, newValue) => {
    setValue(newValue);
  }

  
  useEffect(() => {
    // dashboardData();
    orderdata()

  }, [ value ])
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
        console.log(response.data.data)
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
                    <div className='p-4 flex justify-between items-center dsh_cdr_hd_ltbill' style={{ borderBottom: '1px solid var(--color2)' }}>
                      <div className='top_fv_bll'>
                        <p className='font-bold dash_first_crd flex items-center' style={{ fontSize: '1.5625rem' }}>online orders
                          <Tooltip title="Top Five Bills" arrow>
                            <Button ><GoInfo className='absolute' style={{ fontSize: "1rem", fill: 'var(--color1)' }} /></Button>
                          </Tooltip>
                        </p>
                      </div>
                      <div className='flex gap-8 dsh_crd_btn'>
                        <div>
                          <TabContext value={value}  >
                            <Box>
                              <TabList aria-label="lab API tabs example" onChange={handlechange} >
                                {types.map((e) => (
                                  <Tab key={e.id} value={e.id} label={e.value} className='tab_txt_crd' sx={
                                    {
                                      '&.Mui-selected': {
                                        backgroundColor: 'var(--color1)',
                                        fontWeight: 'bold',
                                        color: "white",
                                        borderRadius: "5px"
                                      },
                                    }
                                  } />
                                ))}
                              </TabList>
                            </Box>
                          </TabContext>
                        </div>
                       
                      </div>
                    </div>
                    <Box sx={{ height: '100%' }}>
                      <TabContext value={value}>
                        {billData.length > 0 ? (
                          <>
                            {types.map((e) => (
                              <TabPanel key={e.id} value={e.id} sx={{ height: '100%' }}>

                                <div className='flex flex-col justify-between' style={{ height: '100%' }}>
                                  <div className="overflow-x-auto">
                                    <table className="w-full custom-table" style={{ whiteSpace: 'nowrap' }}>
                                      <thead className="primary">
                                        <tr>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                           sr no
                                          </th>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                        date
                                          </th>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            order ID
                                          </th>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            Amount
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {billData.map((item, index) => (
                                          <tr key={index} className="border-b border-gray-200" style={{ textAlign: 'center' }}>
                                            <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                              {item.name}
                                            </td>
                                            <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                              {item.phone_number === "" ? "--" : item.phone_number}
                                            </td>
                                            <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                              Rs. {item.total_amount === 0 ? 0 : item.total_amount}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  {/* View All Link */}
                                  <div className="flex justify-end mt-5" style={{ color: 'rgb(0 39 123)' }}>
                                    {value == 0 ? (
                                      <Link to="/purchase/purchasebill">
                                        <a href="#">View all <ChevronRightIcon /></a>
                                      </Link>
                                    ) : (
                                      <Link to="/salelist">
                                        <a href="#">View all <ChevronRightIcon /></a>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </TabPanel>
                            ))}
                          </>
                        ) : (
                          <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
                            <img src="../no-data.png" className="nofound" />
                          </div>
                        )}
                      </TabContext>
                    </Box>
                  </div>
                </div>
              </div>
        </div>
    );
}
export default Assigned;
