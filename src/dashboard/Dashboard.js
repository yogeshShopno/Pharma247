import React, { useEffect, useState } from 'react';
import Header from './Header';
import Box from '@mui/material/Box';
import axios from 'axios';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { PieChart } from '@mui/x-charts/PieChart';
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
import Loader from '../componets/loader/Loader';
import { encryptData } from '../componets/cryptoUtils';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Dashboard = () => {
  
  const history = useHistory()

  const token = localStorage.getItem("token");
  const staffList = [{ id: 'today', value: 'Today' }, { id: 'yesterday', value: 'Yesterday' }, { id: '7_day', value: 'Last 7 Days' }, { id: '30_day', value: 'Last 30 Days' }]
  const expiryList = [{ id: 'expired', value: 'Expired' }, { id: 'next_month', value: 'Next Month' }, { id: 'next_two_month', value: 'Next 2 Month' }, { id: 'next_three_month', value: 'Next 3 Month' }]
  const pieChart = [{ id: 1, value: 'sales' }, { id: 0, value: 'purchase' }]
  const types = [{ id: 1, value: 'sales' }, { id: 0, value: 'purchase' },]
  const [linechartValue, setLinechartValue] = useState('Today')
  const [staffListValue, setStaffListValue] = useState('today')
  const [typeValue, settypeValue] = useState('7_day')
  const [expiredValue, setExpiredValue] = useState('expired')
  const [record, setRecord] = useState()
  const [distributor, setDistributor] = useState([])
  const [billData, setBilldata] = useState([])
  const [customer, setCustomer] = useState([])
  const [expiry, setExpiry] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [pieChartvalue, setpieChartValue] = useState(0)
  const [value, setValue] = useState(1)
  const [data, setData] = useState([])

  const handlechange = (event, newValue) => {
    setValue(newValue);
  }

  const handlestaffTabchange = (event, newValue) => {
    setpieChartValue(newValue);
  }

  const staffListHandlechange = (event) => {
    setStaffListValue(event.target.value)
  }

  const typeHandlechange = (event) => {
    settypeValue(event.target.value)

  }

  const lineHandleChange = (event, newValue) => {
    setLinechartValue(newValue);
    const selectedData = record?.chart.find(e => e.title === newValue);
    if (selectedData) {
      setRecord({
        ...record,
        salesmodel_total: selectedData.sales_total,
        salesmodel_total_count: selectedData.sales_count,
        purchesmodel_total: selectedData.purchase_total,
        purchesmodel_total_count: selectedData.purchase_count,
        salesreturn_total: selectedData.sales_return_total,
        salesreturn_total_count: selectedData.sales_return_count,
        purchesreturn_total: selectedData.purchase_return_total,
        purchesreturn_total_count: selectedData.purchase_return_count,
      });
    }
  };



  
  useEffect(() => {
    dashboardData();
    userPermission();
    
  }, [typeValue, value, expiredValue, staffListValue, pieChartvalue])


  const dashboardData = async () => {
    let data = new FormData();
    // setIsLoading(true)
    const params = {
      type: value,
      bill_day: typeValue,
      expired: expiredValue,
      staff_bill_day: staffListValue,
      staff_overview_count: pieChartvalue
    };
    try {
      await axios.post("dashbord?", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ).then((response) => {
        //    console.log(response.data.data)
        setIsLoading(false)
        const initialData = response.data.data;
        setRecord(initialData);
        setIsLoading(false);
        const todayData = initialData.chart.find(e => e.title === 'Today');
        if (todayData) {
          setRecord({
            ...initialData,
            salesmodel_total: todayData.sales_total,
            salesmodel_total_count: todayData.sales_count,
            purchesmodel_total: todayData.purchase_total,
            purchesmodel_total_count: todayData.purchase_count,
            salesreturn_total: todayData.sales_return_total,
            salesreturn_total_count: todayData.sales_return_count,
            purchesreturn_total: todayData.purchase_return_total,
            purchesreturn_total_count: todayData.purchase_return_count,
          });
        }
        const billData = value === 0 ? initialData.purches : initialData.sales;

        const formattedData = initialData.staff_overview.map(item => ({
          label: item.lable,
          value: item.value
        }));

        setData(formattedData);
        //      console.log('Ayus', formattedData);

        setBilldata(billData);
        setCustomer(initialData?.top_customer)
        setExpiry(initialData?.expiring_iteam)
        setDistributor(initialData?.top_distributor)

      
      })
      
    } catch (error) {
      //   console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  }

  const userPermission = async () => {
    let data = new FormData();
    try {
      await axios.post("user-permission", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ).then((response) => {
        const permission = response.data.data;
        const encryptedPermission = encryptData(permission);
        localStorage.setItem('Permission', encryptedPermission);
        // localStorage.setItem('Permission', JSON.stringify(permission));
      
      })
      
    }
    catch (error) {

    }
  }

  return (
    <div>
      <div>
        <Header />
        {isLoading ? <div className="loaderdash">
          <Loader />
        </div> :
          <div className='p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
              <div className='gap-4'>
                <div className="flex flex-col px-2 py-1 justify-between" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <Box >
                    <Box >
                      <Tabs
                        value={linechartValue}
                        onChange={lineHandleChange}
                        variant="scrollable"
                        scrollButtons={false}
                        className='p-2'
                        aria-label="scrollable prevent tabs example"
                      >
                        {record?.chart?.map((e) => (
                          <Tab key={e.id} value={e.title} label={e.title} />))}
                      </Tabs>
                      <div className='flex py-4 p-6 flex-wrap '>
                        <div className='w-1/2'>
                          <p>Sales</p>
                          <h4 className='text-2xl font-bold' style={{ color: 'green' }}> Rs.{!record?.salesmodel_total ? 0 : record?.salesmodel_total}/- </h4>
                          <span>{record?.salesmodel_total_count} Bills</span>
                        </div>
                        <div className='w-1/2'>
                          <p>Purchase</p>
                          <h4 className='text-red-500 text-2xl font-bold'> Rs.{!record?.purchesmodel_total ? 0 : record?.purchesmodel_total}/- </h4>
                          <span>{record?.purchesmodel_total_count} Bills</span>
                        </div>
                      </div>
                      <div className='flex py-4 p-6 justify-between'>
                        <div className='w-1/2' >
                          <p>Sale Return</p>
                          <h4 className='text-red-500 text-2xl font-bold'> Rs.{!record?.salesreturn_total ? 0 : record?.salesreturn_total}/-</h4>
                          <span>{record?.salesreturn_total_count} Bills</span>
                        </div>
                        <div className='w-1/2'>
                          <p>Purchase Return</p>
                          <h4 className='text-2xl font-bold' style={{ color: 'green' }}> Rs.{!record?.purchesreturn_total ? 0 : record?.purchesreturn_total}/- </h4>
                          <span>{record?.purchesreturn_total_count} Bills</span>
                        </div>
                      </div>
                    </Box>
                  </Box>
                </div>

                <div className="flex flex-col px-2 py-1 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div className='p-2 flex justify-between items-center'>
                    <div className=''>
                      <p className='font-bold '>Top Five Bills</p>
                    </div>
                    {billData.length > 0 &&
                      <FormControl sx={{ minWidth: 100 }}>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          size='small'
                          value={typeValue}
                          onChange={typeHandlechange}
                        >
                          {staffList.map((e) => (
                            <MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>))}
                        </Select>
                      </FormControl>}
                  </div>
                  <Box >
                    <TabContext value={value}  >
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                        <TabList aria-label="lab API tabs example" onChange={handlechange}>
                          {types.map((e) => (
                            <Tab key={e.id} value={e.id} label={e.value} />
                          ))}
                        </TabList>
                      </Box>
                      {billData.length > 0 ?
                        <>
                          {types.map((e) => (
                            <TabPanel key={e.id} value={e.id}>
                              <div className='flex  justify-between py-1 p-5 text-blue-900 border-b border-blue-200' >
                                <div>
                                  {value == 0 ? 'Distributors' : 'Customers'}

                                </div>
                                <div>
                                  Bill Amount
                                </div>
                              </div>
                              <div className='px-2 py-1' style={{ minHeight: "270px" }}>
                                {billData.map((item) =>
                                  <div className='py-1 border-b border-blue-200 flex justify-between items-center'>
                                    <div className='flex'>
                                      <p className='ml-2 font-bold'>{item.name}<br />{item.phone_number == "" ? '--' : item.phone_number}</p>
                                    </div>
                                    <div className={`text-lg font-bold ${value === 0 ? 'text-red-600' : 'text-green-600'}`}>Rs.{item.total_amount == 0 ? 0 : item.total_amount}</div>
                                  </div>
                                )}
                              </div>
                              <div className='text-blue-600 flex justify-end'>
                                {value == 0 ?
                                  <Link to='/purchase/purchasebill'>
                                    <div>
                                      <a href="" >View all <ChevronRightIcon /></a>
                                    </div>
                                  </Link> :
                                  <Link to='/salelist'>
                                    <div>
                                      <a href="" >View all <ChevronRightIcon /></a>
                                    </div>
                                  </Link>
                                }
                              </div>
                            </TabPanel>
                          ))}
                        </> :
                        <div className='flex justify-center' style={{ minHeight: "400px", alignItems: 'center', }}>
                          <img src='../no_Data.png' className='nofound' />
                        </div>
                      }
                    </TabContext>

                  </Box>

                </div>

                {/* need to pay */}

              </div>
              <div className='gap-4'>
                <div>

                  {/* need to collect */}
                  <div className=" p-4 h-fit justify-between " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <div>
                      <div>
                        <div className='flex justify-between py-2'>
                          <div className='justify-start text-lg font-medium'>
                            Top Customers
                            <Tooltip title="Latest Customers" arrow>
                              <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      {customer.length > 0 ?
                        <>
                          <div className='flex justify-between  font-bold  text-blue-900 border-b border-blue-200'>
                            <div>Customer</div>
                            <div>Bill Amount</div>
                          </div>
                          <div style={{ minHeight: "210px" }}>
                            {customer.map((item) =>
                              <div className='p-2 border-b border-blue-200 flex justify-between items-center' >
                                <div className='flex' >
                                  <div className='bg-blue-900 w-8 h-8 rounded-full mt-3 flex items-center justify-center'>
                                    <FaUser className='text-white w-4 h-4' />
                                  </div>
                                  <p className='ml-2 font-bold '>{item.name} <br />{item.mobile}</p>
                                </div>
                                <div className='text-lg font-bold' style={{ color: 'green' }}>Rs.{item.balance}</div>
                              </div>
                            )}
                          </div>
                        </> :
                        <div className='flex justify-center' style={{ minHeight: "300px", alignItems: 'center', }}>
                          <img src='../no_Data.png' className='nofound' />
                        </div>
                      }
                      <div className='text-blue-600 flex justify-end'>
                        <Link to='/more/customer'>
                          <div>
                            <a href="" >View all <ChevronRightIcon /></a>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Stock by PTR and MRP */}
                  <div className="flex flex-col p-2 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <div className='p-5 flex justify-between items-center gap-2'>
                      <div className=''>
                        <p className='font-bold '>Stock By PTR</p>
                        <div className={`text-lg font-bold text-green-600`}>Rs.{record?.total_ptr == 0 ? 0 : record?.total_ptr}</div>
                      </div>
                      <div className=''>
                        <p className='font-bold '>Stock By MRP</p>
                        <div className={`text-lg font-bold text-green-600`}>Rs.{record?.total_mrp == 0 ? 0 : record?.total_mrp}</div>
                      </div>
                    </div>
                  </div>


                  <div className="flex flex-col p-2 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <div className='p-2 flex justify-between items-center gap-2'>
                      <div className=''>
                        <p className='font-bold '>Staff Overview</p>
                      </div>
                      <FormControl >
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          size='small'
                          value={staffListValue}
                          onChange={staffListHandlechange}
                        >
                          {staffList.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                              {e.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="flex justify-center sm:gap-4 gap-2">
                      <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={pieChartvalue}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList aria-label="lab API tabs example" onChange={handlestaffTabchange}>
                              {pieChart.map((e) => (
                                <Tab key={e.id} value={e.id} label={e.value} />
                              ))}
                            </TabList>
                          </Box>
                          {pieChart.map((e) => (
                            <TabPanel
                              key={e.id} value={e.id}>
                              <PieChart
                                series={[
                                  {
                                    data: data,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                  },
                                ]}
                                height={250}
                              />

                            </TabPanel>
                          ))}
                        </TabContext>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
              <div className='gap-4'>
                <div className="flex p-6 mb-5 h-fit loyalbg" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div className='w-1/2'>
                    <h2 className='text-blue-900 text-xl font-semibold'>Loyalty Points</h2>
                    <div className='pointlogo'>
                      <img src='../coin.png' />
                    </div>
                  </div>

                  <div className='w-1/2 items-center'>
                    <div className='mb-2 flex justify-between items-center '>
                      <div className='flex '>
                        <span className='text-lime-800 font-bold mr-2 text-xl'>142,843</span>
                        <p> Issued</p>
                      </div>
                    </div>
                    <div className='mb-2 flex justify-between items-center '>
                      <div className='flex '>
                        <span className='text-blue-800 font-bold mr-2 text-xl '>114</span>
                        <p>  Redeemed</p>
                      </div>
                    </div>
                    <div className='mb-2 flex justify-between items-center '>
                      <div className='flex'>
                        <span className='text-blue-500 font-bold mr-2 text-xl'>32</span>
                        <p> Issued</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" p-4 h-fit justify-between " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div>
                    <div>
                      <div className='flex justify-between py-2'>
                        <div className='justify-start text-lg font-medium'>
                          Expiring Items
                          <Tooltip title="Expiring Items" arrow>
                            <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                          </Tooltip>
                        </div>
                        {/* {expiry.length > 0 && */}
                        <FormControl sx={{ minWidth: 100 }}>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            size='small'
                            value={expiredValue}
                            onChange={(e) => { setExpiredValue(e.target.value) }}
                          >
                            {expiryList.map((e) => (
                              <MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>))}
                          </Select>
                        </FormControl>
                        {/* } */}
                      </div>
                    </div>
                    {expiry.length > 0 ?
                      <>
                        <div className='flex justify-between  font-bold  text-blue-900 border-b border-blue-200'>
                          <div className='ml-2 w-36'>
                            Item Name
                          </div>
                          <div>
                            Qty.
                          </div>
                          <div>
                            Expiry Date
                          </div>
                        </div>
                        <div style={{ minHeight: "235px" }}>
                          {expiry.map((item) =>
                            <div className='p-2 border-b border-blue-200 flex justify-between items-center'>
                              <div className='flex'>
                                <p className='ml-2 w-28'>{item.name}</p>
                              </div>
                              <div className='font-bold text-lg' style={{ color: 'green' }}>{item.qty}</div>
                              <div className='font-bold text-lg' style={{ color: 'red' }}>{item.expiry}</div>
                            </div>
                          )}
                        </div>
                      </>
                      :
                      <div className='flex justify-center' style={{ minHeight: "300px", alignItems: 'center', }}>
                        <img src='../no_Data.png' className='nofound' />
                      </div>
                    }
                    <div className='text-blue-600 flex justify-end'>
                      <Link to='/inventory'>
                        <div>
                          <a href="" >View all <ChevronRightIcon /></a>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-2 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div className='p-2 flex justify-between items-center'>
                    <div className=''>
                      <p className='font-medium'>Top Distributors
                        <Tooltip title="Latest Distributors" >
                          <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                        </Tooltip>
                      </p>
                    </div>
                  </div>
                  {distributor.length > 0 ?
                    <>
                      <div className='flex justify-between py-2 p-5 text-blue-900 border-b border-blue-200 '>
                        <div>
                          Distributor
                        </div>
                        <div>
                          Bill Amount
                        </div>
                      </div>
                      <div className='px-5 py-2' style={{ minHeight: "300px" }} >
                        {distributor.map((item) =>
                          <div className='py-1 border-b border-blue-200 flex justify-between items-center'>
                            <div className='flex'>
                              <p className='ml-2 font-bold'>{item.name}<br />{item.gst_number}</p>
                            </div>
                            <div className='text-red-600  text-lg font-bold'>Rs.{item.due_amount == 0 ? 0 : item.due_amount}</div>
                          </div>
                        )}

                      </div>
                    </>
                    :
                    <div className='flex justify-center' style={{ minHeight: "300px", alignItems: 'center', }}>
                      <img src='../no_Data.png' className='nofound' />
                    </div>
                  }
                  <div className='text-blue-600 flex justify-end'>
                    <Link to='/more/DistributorList'>
                      <div>
                        <a href="" >View all <ChevronRightIcon /></a>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

  )

}

export default Dashboard

