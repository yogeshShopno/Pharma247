import React, { useEffect, useState } from "react";
import Header from "./Header";
import Box from "@mui/material/Box";
import axios from "axios";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuItem from "@mui/material/MenuItem";
// import Tabs from '@mui/material/Tabs';
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { GoInfo } from "react-icons/go";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Loader from "../componets/loader/Loader";
import { encryptData } from "../componets/cryptoUtils";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import stockByPTR from '../Image/ptr.jpg'
// import stockByPTROne from '../Image/stockbyptr.png'
// import stockByMRP from '../Image/mrp.jpg'
// import stockByMRPOne from '../Image/stockbymrp.png'
import stockBySales from "../Image/sales.png";
import stockByPurchase from "../Image/purchase.png";
import stockByDistributor from "../Image/distributor.png";
import stockByCustomer from "../Image/customer.png";
import { Card } from "flowbite-react";
// import { PieChart } from 'react-minimal-pie-chart';
// import { PieChart } from '@mui/x-charts/PieChart';
// import DonutChart from './Chart/DonutChart';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
// import { PieChart } from '@mui/x-charts'
// import { Tooltip as RechartsTooltip } from 'recharts';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
// import BarChartIcon from '@mui/icons-material/BarChart';
// import ListIcon from '@mui/icons-material/List';
const Dashboard = () => {
  // const history = useHistory()

  const token = localStorage.getItem("token");

  const staffList = [
    { id: "today", value: "Today" },
    { id: "yesterday", value: "Yesterday" },
    { id: "7_day", value: "Last 7 Days" },
    { id: "30_day", value: "Last 30 Days" },
  ];
  const expiryList = [
    { id: "expired", value: "Expired" },
    { id: "next_month", value: "Next Month" },
    { id: "next_two_month", value: "Next 2 Month" },
    { id: "next_three_month", value: "Next 3 Month" },
  ];
  const pieChart = [
    { id: 1, value: "sales" },
    { id: 0, value: "purchase" },
  ];
  const types = [
    { id: 1, value: "sales" },
    { id: 0, value: "purchase" },
  ];
  const [linechartValue, setLinechartValue] = useState("Today");
  const [staffListValue, setStaffListValue] = useState("7_day");
  const [typeValue, settypeValue] = useState("7_day");
  const [expiredValue, setExpiredValue] = useState("expired");
  const [record, setRecord] = useState();
  const [distributor, setDistributor] = useState([]);
  const [billData, setBilldata] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [expiry, setExpiry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pieChartvalue, setpieChartValue] = useState('sales');
  const [value, setValue] = useState(1);
  const [data, setData] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState();
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState();
  const [loyaltiPointTotal, setLoyaltiPointTotal] = useState();
  const [switchValue, setSwitchValue] = useState(false);
  const [switchCustomerValue, setSwitchCustomerValue] = useState(false);
  const [reRender, setreRender] = useState(0);
  const [barChartData, setBarChartData] = useState([]);

  const [tickFontSize, setTickFontSize] = useState("2px");
  const [staffOverview, setStaffOverview] = useState([])
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setTickFontSize("23px");
      } else if (window.innerWidth < 900) {
        setTickFontSize("18px");
      } else {
        setTickFontSize("14px");
      }
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const lineChartData = customer.map(item => ({
  //   name: item.name,
  //   balance: item.balance,
  // }));

  // Add at the top of your component
  const [expiryTabValue, setExpiryTabValue] = useState(types[0]?.id || "0");

  const handleExpiryTabChange = (event, newValue) => {
    setExpiryTabValue(newValue);
  };

  const generateYAxisTicks = (data) => {
    if (!data.length) return [];

    const maxBalance = Math.max(...data.map((item) => item.balance));
    const interval = Math.ceil(maxBalance / 5); // Divide max value into 5 equal parts

    return Array.from({ length: 6 }, (_, i) => i * interval);
  };

  const lineHandleChange = (event, newValue) => {
    setLinechartValue(newValue);
    const selectedData = record?.chart.find((e) => e.title === newValue);
    if (selectedData) {
      setBarChartData([
        {
          name: "Sales",
          value: selectedData.sales_total || 0,
          fill: "#00AEEF",
        },
        // { name: 'Sales Count', value: selectedData.sales_count || 0 },
        {
          name: "Sales Return",
          value: selectedData.sales_return_total || 0,
          fill: "#00A651",
        },
        // { name: 'Sales Return Count', value: selectedData.sales_return_count || 0 },
        {
          name: "Purchases",
          value: selectedData.purchase_total || 0,
          fill: "#FFEB3B",
        },
        // { name: 'Purchase Count', value: selectedData.purchase_count || 0 },
        {
          name: "Purchases Return",
          value: selectedData.purchase_return_total || 0,
          fill: "#E53935",
        },
        // { name: 'Purchases Return Count', value: selectedData.purchase_return_count || 0 },
      ]);
      setRecord({
        ...record,
        salesmodel_total: selectedData.sales_total,
        salesmodel_total_count: selectedData.sales_count,
        salesreturn_total: selectedData.sales_return_total,
        salesreturn_total_count: selectedData.sales_return_count,
        purchesmodel_total: selectedData.purchase_total,
        purchesmodel_total_count: selectedData.purchase_count,
        purchesreturn_total: selectedData.purchase_return_total,
        purchesreturn_total_count: selectedData.purchase_return_count,
      });
    }
  };

  useEffect(() => {
    if (reRender < 2) {
      const timeout = setTimeout(() => {
        setreRender(reRender + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [reRender]);

  const handlechange = (event, newValue) => {
    setValue(newValue);
  };

  const handlestaffTabchange = (event, newValue) => {
    setpieChartValue(newValue);
    console.log(newValue)
    setValue(newValue);
  };

  const staffListHandlechange = (event) => {
    setStaffListValue(event.target.value);
  };

  const typeHandlechange = (event) => {
    settypeValue(event.target.value);
  };

  const lineHandleChanges = (event, newValue) => {
    setLinechartValue(newValue);
    const selectedData = record?.chart.find((e) => e.title === newValue);
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
  }, [typeValue, value, expiredValue, staffListValue, pieChartvalue]);

  const dashboardData = async () => {
    let data = new FormData();
    const params = {
      type: value,
      bill_day: typeValue,
      expired: expiredValue,
      staff_bill_day: staffListValue,
      staff_overview_count: pieChartvalue,
    };
    try {
      await axios
        .post("dashbord?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          const initialData = response.data.data;
          setRecord(initialData);
          setIsLoading(false);
          const todayData = initialData.chart.find((e) => e.title === "Today");
          if (todayData) {
            setBarChartData([
              {
                name: "Sales",
                value: todayData.sales_total || 0,
                fill: "#00AEEF",
              },
              {
                name: "Sales Return",
                value: todayData.sales_return_total || 0,
                fill: "#00A651",
              },
              {
                name: "Purchases",
                value: todayData.purchase_total || 0,
                fill: "#FFEB3B",
              },
              {
                name: "Purchases Return",
                value: todayData.purchase_return_total || 0,
                fill: "#E53935",
              },
            ]);
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
          const billData =
            value === 0 ? initialData.purches : initialData.sales;

          const formattedData = initialData.staff_overview.map((item) => ({
            label: item.lable,
            value: item.value,
          }));

          setData(formattedData);

          setBilldata(billData);
          setCustomers(initialData?.top_customer);
          setStaffOverview(initialData?.staff_overview)
          setExpiry(initialData?.expiring_iteam);
          setDistributor(initialData?.top_distributor);
          setLoyaltyPoints(initialData?.loyalti_point_all_customer);
          setUseLoyaltyPoints(initialData?.loyalti_point_use_all_customer);
          setLoyaltiPointTotal(initialData?.today_loyalti_point_total);
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const userPermission = async () => {
    let data = new FormData();
    try {
      await axios
        .post("user-permission", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const permission = response.data.data;
          const encryptedPermission = encryptData(permission);
          localStorage.setItem("Permission", encryptedPermission);
        });
    } catch (error) { }
  };


  const getNiceTicks = (data) => {
    if (!data || data.length === 0) return [];
    const max = Math.max(...data.map((d) => d.value || 0));
    const step = Math.ceil(max / 5 / 10) * 10 || 10;
    return Array.from({ length: 6 }, (_, i) => i * step);
  };
  const pieChartTabs = [
    { id: "sales", value: "Sales" },
    { id: "purchase", value: "Purchase" },
  ];


  return (
    <div>
      <div>
        <Header key={reRender} />

        {isLoading ? (
          <div className="loaderdash">
            <Loader />
          </div>
        ) : (
          <div
            className="p-2 paddin12-8"
            style={{ background: "rgb(231 230 230 / 36%)", height: "100%" }}
          >
            <div className="dsh_card_chart grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-3 px-4 py-3 rounded-lg">
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6"
                style={{ width: "100%" }}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-500 text-lg">
                    Total Sales
                  </span>
                  <div className="text-3xl font-bold text-gray-900">
                    Rs. {record?.total_ptr === 0 ? 0 : record?.total_ptr}
                  </div>
                  <span className="text-green-600 text-lg font-medium">
                    ↑ 60.00% from last month
                  </span>
                </div>
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={stockBySales}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6"
                style={{ width: "100%" }}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-500 text-lg">
                    Total Purchase
                  </span>
                  <div className="text-3xl font-bold text-gray-900">
                    Rs. {record?.total_mrp === 0 ? 0 : record?.total_mrp}
                  </div>
                  <span className="text-green-600 text-lg font-medium">
                    ↑ 60.00% from last month
                  </span>
                </div>
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={stockByPurchase}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6"
                style={{ width: "100%" }}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-500 text-lg">
                    Total Customer
                  </span>
                  <div className="text-3xl font-bold text-gray-900">
                    Rs. {record?.total_ptr === 0 ? 0 : record?.total_ptr}
                  </div>
                  <span className="text-green-600 text-lg font-medium">
                    ↑ 60.00% from last month
                  </span>
                </div>
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={stockByCustomer}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6"
                style={{ width: "100%" }}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-500 text-lg">
                    Total Distributor
                  </span>
                  <div className="text-3xl font-bold text-gray-900">
                    Rs. {record?.total_ptr === 0 ? 0 : record?.total_ptr}
                  </div>
                  <span className="text-green-600 text-lg font-medium">
                    ↑ 60.00% from last month
                  </span>
                </div>
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={stockByDistributor}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="dsh_card_chart grid grid-cols-1 lg:grid-cols-2 gap-6 mb-3 px-4 py-3 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-3 h-full rounded-lg">
                <div
                  className=" bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6 h-full"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-600 dark:text-gray-500 text-lg">
                      STOCK BY PTR
                    </span>
                    <div className="text-3xl font-bold text-gray-900">
                      Rs. {record?.total_ptr === 0 ? 0 : record?.total_ptr}
                    </div>
                    <span className="text-green-600 text-lg font-medium">
                      ↑ 60.00% from last month
                    </span>
                  </div>
                  {/* <div className="w-24 h-24 flex-shrink-0">
                  <img src={stockBySales} className="w-full h-full object-contain" />
                </div> */}
                </div>
                <div
                  className=" bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6 h-full"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-600 dark:text-gray-500 text-lg">
                      STOCK BY MRP
                    </span>
                    <div className="text-3xl font-bold text-gray-900">
                      Rs. {record?.total_mrp === 0 ? 0 : record?.total_mrp}
                    </div>
                    <span className="text-green-600 text-lg font-medium">
                      ↑ 60.00% from last month
                    </span>
                  </div>
                  {/* <div className="w-24 h-24 flex-shrink-0">
                  <img src={stockByPurchase} className="w-full h-full object-contain" />
                </div> */}
                </div>
              </div>
              <div
                className="flex flex-col gap-5 md:flex-row col-md-6"
                style={{ width: "100%" }}
              >
                <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Loyalty Points
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="bg-gradient-to-br from-green-50 to-white border border-teal-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">Issued</p>
                        <p className="text-3xl font-bold text-green-700 mt-1">
                          {loyaltyPoints}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">Redeemed</p>
                        <p className="text-3xl font-bold text-amber-500 mt-1">
                          {useLoyaltyPoints}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-white border border-rose-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">
                          Today Loyalty Points
                        </p>
                        <p className="text-3xl font-bold text-red-500 mt-1">
                          {loyaltiPointTotal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dsh_card_chart grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 px-4 py-3">
              <div className="lg:col-span-1 md:col-span-1">
                <div className="flex h-full">
                  <div style={{ justifyContent: "flex-start", width: "100%" }}>
                    <Card
                      className="w-full rounded-2xl shadow-lg bg-white border border-gray-200"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="flex h-full flex-col justify-center gap-4 p-1"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="flex flex-col ">
                          <div className="flex justify-between items-center border-b pb-2">
                            <p className="font-bold text-[1.5625rem] text-gray-800 flex items-center">
                              Top Customers
                              <Tooltip title="Latest Customers">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-2"
                                >
                                  <GoInfo
                                    className="text-green-600"
                                    style={{ fontSize: "1rem" }}
                                  />
                                </Button>
                              </Tooltip>
                            </p>
                          </div>
                          <div className="mt-3 space-y-4">
                            {customers.map((customer, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 shadow-sm"
                              >
                                <div>
                                  <p className="font-semibold text-base text-gray-800">
                                    {customer.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {customer.mobile}
                                  </p>
                                </div>
                                <div className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm shadow-inner">
                                  ₹{customer.balance.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link
                            to="/more/customer"
                            className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                          >
                            View all <ChevronRightIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 md:col-span-1">
                <div className="bg-white h-full rounded-2xl shadow-lg border border-gray-200 p-6 w-full">
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {record?.chart?.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => lineHandleChange(null, e.title)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${linechartValue === e.title
                          ? "bg-[var(--color2)] text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        {e.title}
                      </button>
                    ))}
                  </div>

                  {/* Chart + Legend */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    {/* Bar Chart */}
                    <div className="w-full lg:w-[75%]">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={barChartData}
                          barCategoryGap="20%" // closes gap between label and bar
                          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                        >
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 14, fontWeight: 600 }}
                            axisLine={{ stroke: "#ccc" }}
                          />
                          <YAxis
                            tick={{ fontSize: 14, fontWeight: 600 }}
                            axisLine={{ stroke: "#ccc" }}
                            tickMargin={10}
                            domain={[
                              0,
                              Math.max(
                                ...barChartData.map((d) => d.value || 0)
                              ) + 2000, // ⬅️ Added padding
                            ]}
                            ticks={getNiceTicks(barChartData)}
                          />

                          <Bar
                            dataKey="value"
                            radius={[10, 10, 0, 0]}
                            barSize={45}
                            label={({ x, y, width, value }) => (
                              <text
                                x={x + width / 2}
                                y={y - 10}
                                fill="#333"
                                fontSize="13"
                                textAnchor="middle"
                                style={{ background: "rgba(255,0,0,0.2)" }} // testing only
                              >
                                {value}
                              </text>
                            )}
                          >
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="w-full lg:w-[25%] flex flex-col gap-4">
                      {[
                        { label: "Sale", color: "#00AEEF" },
                        { label: "Sale Return", color: "#00A651" },
                        { label: "Purchase", color: "#FFEB3B" },
                        { label: "Purchase Return", color: "#E53935" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="text-sm font-medium text-gray-800">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View All */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      to="/more/customer"
                      className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                    >
                      View all <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/*  First Component - Top Distributors & Top Five Bills */}
            <div className="dsh_card_chart grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 px-4 py-3 auto-rows-fr">
              {/* Top Distributors Card */}
              <div className="lg:col-span-1 md:col-span-1 mt-2">
                <div
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col border border-gray-200 h-full"
                  style={{ minHeight: "577px" }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row items-center border-b pb-4 ">
                    <p className="font-bold  text-[1.5625rem] text-gray-800 flex items-center">
                      Top Distributors
                      <Tooltip title="Latest Distributors">
                        <Button variant="ghost" size="icon" className="ml-2">
                          <GoInfo className="text-green-600" style={{ fontSize: "1rem" }} />
                        </Button>
                      </Tooltip>
                    </p>
                  </div>

                  {/* Scrollable List */}
                  <div className="mt-6 space-y-4 overflow-auto max-h-[400px] flex-1">
                    {distributor.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-base text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">GST: {item.gst_number}</p>
                        </div>
                        <div className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm shadow-inner">
                          ₹{item.due_amount === 0 ? "0" : item.due_amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All */}
                  <div className="flex justify-end mt-4">
                    <Link
                      to="/more/DistributorList"
                      className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                    >
                      View all <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Top Five Bills Card */}
              <div className="lg:col-span-2 md:col-span-1">
                <div
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col border border-gray-200 h-full"
                  style={{ minHeight: "577px" }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
                    <div className="flex items-center text-[1.5625rem] font-bold text-gray-800">
                      Top Five Bills
                      <Tooltip title="Top Five Bills" arrow>
                        <Button>
                          <GoInfo style={{ fontSize: "1.1rem", fill: "var(--color1)" }} />
                        </Button>
                      </Tooltip>
                    </div>

                    {/* Tabs + Staff Select */}
                    <div className="flex items-center gap-4 flex-wrap md:mt-0">
                      <TabContext value={value}>
                        <TabList
                          onChange={handlechange}
                          aria-label="tabs"
                          className="rounded-lg overflow-hidden bg-gray-100"
                        >
                          {types.map((e) => (
                            <Tab
                              key={e.id}
                              value={e.id}
                              label={e.value}
                              className="tab_txt_crd"
                              sx={{
                                "&.Mui-selected": {
                                  backgroundColor: "var(--color1)",
                                  color: "#fff",
                                  fontWeight: 600,
                                },
                                textTransform: "none",
                                paddingX: 2,
                              }}
                            />
                          ))}
                        </TabList>
                      </TabContext>

                      {billData.length > 0 && (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={typeValue}
                            onChange={typeHandlechange}
                            className="rounded-md"
                          >
                            {staffList.map((e) => (
                              <MenuItem key={e.id} value={e.id}>
                                {e.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </div>
                  </div>

                  {/* Table with scroll + View All pinned */}
                  <div className="flex flex-col flex-1 mt-6">
                    {billData.length > 0 ? (
                      <>
                        {/* Table Header */}
                        <div className="grid grid-cols-3 bg-gray-50 text-gray-700 text-sm font-semibold border-b rounded-t-lg">
                          <div className="px-4 py-3 text-center">Distributors</div>
                          <div className="px-4 py-3 text-center">Contact Number</div>
                          <div className="px-4 py-3 text-center">Amount</div>
                        </div>

                        {/* Scrollable Rows */}
                        <div className="flex-1 overflow-auto">
                          {billData.map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 border-b hover:bg-gray-50 transition"
                            >
                              <div className="px-4 py-3 text-center">{item.name}</div>
                              <div className="px-4 py-3 text-center">{item.phone_number || "--"}</div>
                              <div className="px-4 py-3 text-center font-medium">
                                ₹ {item.total_amount || 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      // No data state
                      <div className="flex justify-center items-center flex-1">
                        <img
                          src="../no-data.png"
                          alt="No data"
                          className="h-28 opacity-80"
                        />
                      </div>
                    )}

                    {/* View All pinned at bottom-right */}
                    <div className="flex justify-end mt-4">
                      {value === 0 ? (
                        <Link
                          to="/purchase/purchasebill"
                          className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                        >
                          View all <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          to="/salelist"
                          className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                        >
                          View all <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/*  Second Component - Staff Overview & Expiring Items */}
            <div className="dsh_card_chart grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2 gap-6 px-4 py-3">
              {/* Staff Overview Card */}
              <div className="lg:col-span-2 md:col-span-1 w-full bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col min-h-[500px]">
                {/* Header */}
                <div className="flex justify-between items-start sm:items-center border-b border-gray-200 px-6 py-4 bg-gray-50 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">Staff Overview</h2>
                    <Tooltip title="Staff sales and purchase overview" arrow>
                      <Button size="small" color="primary" sx={{ minWidth: 0, padding: 0 }}>
                        <GoInfo className="text-base text-gray-600" />
                      </Button>
                    </Tooltip>
                  </div>

                  {/* Tabs + Dropdown */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    {/* Tabs */}
                    <TabContext value={value}>
                      <TabList
                        onChange={handlechange}
                        TabIndicatorProps={{ style: { display: "none" } }}
                        className="rounded-full bg-gray-100 flex-shrink"
                      >
                        {types.map((tab) => (
                          <Tab
                            key={tab.id}
                            value={tab.id}
                            label={tab.value}
                            className="px-4 py-1 text-sm font-medium capitalize"
                            sx={{
                              "&.Mui-selected": {
                                backgroundColor: "var(--color1)",
                                color: "white",
                                borderRadius: "999px",
                              },
                            }}
                          />
                        ))}
                      </TabList>
                    </TabContext>

                    {/* Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 120 }} className="flex-shrink">
                      <Select
                        value={staffListValue}
                        onChange={staffListHandlechange}
                        className="rounded-md bg-white text-sm"
                      >
                        {staffList.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>


                {/* Content + Footer pinned */}
                <div className="flex flex-col flex-1 p-4">
                  <TabContext value={pieChartvalue}>
                    {pieChartTabs.map((tab) => (
                      <TabPanel key={tab.id} value={tab.id} sx={{ p: 0 }} className="flex-1 flex flex-col">
                        {/* Content area */}
                        <div className="flex-1 flex flex-col justify-center">
                          {staffOverview.length > 0 ? (
                            <div className="space-y-3 overflow-auto">
                              {staffOverview.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                >
                                  <p className="text-gray-800 font-medium">{item.lable}</p>
                                  <p className="text-green-700 font-semibold">
                                    ₹ {item.value.toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            // ✅ Centered No Data Image
                            <div className="flex flex-1 justify-center items-center">
                              <img src="../no-data.png" alt="No data" className="h-28 opacity-70" />
                            </div>
                          )}
                        </div>
                      </TabPanel>
                    ))}
                  </TabContext>

                  {/* ✅ Footer pinned bottom-right */}
                  <div className="pt-4 flex justify-end">
                    <Link
                      to="/staff/overview"
                      className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                    >
                      View all <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>


              {/* Expiring Items Card */}
              <div className="lg:col-span-3 md:col-span-1 w-full h-full">
                <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col p-4">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold text-gray-800">Expiring Items</h2>
                      <Tooltip title="Expiring Items" arrow>
                        <Button size="small" color="primary" sx={{ minWidth: 0, padding: 0 }}>
                          <GoInfo className="text-base text-gray-600" />
                        </Button>
                      </Tooltip>
                    </div>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select value={expiredValue} onChange={(e) => setExpiredValue(e.target.value)}>
                        {expiryList.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Content + Footer pinned */}
                  <div className="flex-1 flex flex-col">
                    <TabContext value={expiryTabValue}>
                      {types.map((e) => (
                        <TabPanel key={e.id} value={e.id} sx={{ p: 0 }} className="flex-1 flex flex-col">
                          {expiry.length > 0 ? (
                            <>
                              {/* Header Row */}
                              <div className="grid grid-cols-4 bg-gray-50 text-gray-700 text-sm font-semibold border-b">
                                <div className="col-span-2 px-4 py-2 text-center">Item Name</div>
                                <div className="px-4 py-2 text-center">Qty.</div>
                                <div className="px-4 py-2 text-center">Expiry Date</div>
                              </div>

                              {/* Rows */}
                              <div className="flex-1 overflow-auto">
                                {expiry.map((item) => (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-4 border-b hover:bg-gray-50 text-sm"
                                  >
                                    <div className="col-span-2 px-4 py-2 text-center">{item.name}</div>
                                    <div className="px-4 py-2 text-center">{item.qty}</div>
                                    <div className="px-4 py-2 text-center">{item.expiry}</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-1 justify-center items-center">
                              <img src="../no_Data1.png" alt="No data" className="w-48 opacity-70" />
                            </div>
                          )}
                        </TabPanel>
                      ))}
                    </TabContext>

                    {/* ✅ Footer pinned bottom-right */}
                    <div className="pt-4 flex justify-end">
                      <Link
                        to="/inventory"
                        className="text-green-600 flex items-center gap-1 hover:underline font-medium"
                      >
                        View all <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-5'>
                <div className='gap-4'>
                  <div className="flex flex-col px-2 py-1 justify-between" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <Box >
                      <Box >
                        <Tabs
                          value={linechartValue}
                          onChange={lineHandleChanges}
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
                            <img src='../no_Data1.png' className='nofound' />
                          </div>
                        }
                      </TabContext>
                    </Box>
                  </div>
                  {/* need to pay 
                </div>
                <div className='gap-4'>
                  <div>
                    {/* need to collect 
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
                            <div style={{ minHeight: "170px" }}>
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
                            <img src='../no_Data1.png' className='nofound' />
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
                    {/* Stock by PTR and MRP 
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
                          {/* {expiry.length > 0 && 
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
                          {/* } 
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
                          <img src='../no_Data1.png' className='nofound' />
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
                        <img src='../no_Data1.png' className='nofound' />
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
              </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
