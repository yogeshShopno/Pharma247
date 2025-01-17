import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TextField } from "@mui/material";
import axios from "axios";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import GetAppIcon from "@mui/icons-material/GetApp";

import ReplyAllIcon from '@mui/icons-material/ReplyAll'; 
import { toast } from "react-toastify";

const Search = ({ searchPage, setSearchPage }) => {
  const token = localStorage.getItem("token");
  const [searchType, setSearchType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [tableData, setTableData] = useState(
    [{
      "id": 11,
      "payment_date": "2025-01-09 to 2026-01-09",
      "plan_name": "",
      "expiry_date": "2026-01-09",
      "paid_on": "2025-01-09 02:55 PM",
      "payment_id": "pay_PhIKDGsQM3NSDZ",
      "entity": "payment",
      "amount": 600000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Pharma Plan Purchase",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 14160,
      "tax": 2160,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736414725
    },
    {
      "id": 13,
      "payment_date": "2025-01-09 to 2026-01-09",
      "plan_name": "",
      "expiry_date": "2026-01-09",
      "paid_on": "2025-01-09 03:21 PM",
      "payment_id": "pay_PhIl2zj1huUSIm",
      "entity": "payment",
      "amount": 300000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Pharma Plan Purchase",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 7080,
      "tax": 1080,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736416250
    },
    {
      "id": 14,
      "payment_date": "2025-01-09 to 2026-01-09",
      "plan_name": "",
      "expiry_date": "2026-01-09",
      "paid_on": "2025-01-09 05:57 PM",
      "payment_id": "pay_PhLPw2JfVNprwb",
      "entity": "payment",
      "amount": 600000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Pharma Plan Purchase",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 14160,
      "tax": 2160,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736425615
    },
    {
      "id": 15,
      "payment_date": "2025-01-10 to 2026-01-10",
      "plan_name": "",
      "expiry_date": "2026-01-10",
      "paid_on": "2025-01-10 02:57 PM",
      "payment_id": "pay_PhgtZwk89F0Pbo",
      "entity": "payment",
      "amount": 300000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Pharma Plan Purchase",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 7080,
      "tax": 1080,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736501253
    },
    {
      "id": 16,
      "payment_date": "2025-01-10 to 2026-01-10",
      "plan_name": "",
      "expiry_date": "2026-01-10",
      "paid_on": "2025-01-10 04:59 PM",
      "payment_id": "pay_PhixmKpUqBK05y",
      "entity": "payment",
      "amount": 600000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Pharma Plan Purchase",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 14160,
      "tax": 2160,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736508535
    },
    {
      "id": 17,
      "payment_date": "2025-01-10 to 2026-01-10",
      "plan_name": "",
      "expiry_date": "2026-01-10",
      "paid_on": "2025-01-10 05:07 PM",
      "payment_id": "pay_Phj6dBe8D8IkR1",
      "entity": "payment",
      "amount": 600000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Advanced",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 14160,
      "tax": 2160,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736509037
    },
    {
      "id": 18,
      "payment_date": "2025-01-10 to 2026-01-10",
      "plan_name": "",
      "expiry_date": "2026-01-10",
      "paid_on": "2025-01-10 05:19 PM",
      "payment_id": "pay_PhjJ4gcGOYcEXC",
      "entity": "payment",
      "amount": 300000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Basic",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 7080,
      "tax": 1080,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736509744
    },
    {
      "id": 19,
      "payment_date": "2025-01-11 to 2026-01-11",
      "plan_name": "",
      "expiry_date": "2026-01-11",
      "paid_on": "2025-01-11 05:52 PM",
      "payment_id": "pay_Pi8Or9G562Rms6",
      "entity": "payment",
      "amount": 600000,
      "currency": "INR",
      "status": "captured",
      "order_id": "",
      "invoice_id": "",
      "method": "wallet",
      "amount_refunded": 0,
      "refund_status": "",
      "captured": true,
      "description": "Advanced",
      "card_id": "",
      "bank": "",
      "wallet": "airtelmoney",
      "vpa": "",
      "email": "krishnachemist207@gmail.com",
      "contact": "+919558822345",
      "fee": 14160,
      "tax": 2160,
      "acquirer_data": {
        "transaction_id": null
      },
      "created_at": 1736598113
    }]);

  /*<================================================================================== Plans column ==================================================================================> */

 const [plansColumns,setPlansColumns] = useState([
  { id: "subscription", label: "Subscription", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "duration", label: "Duration", minWidth: 100 },
    { id: "payment", label: "Payment", minWidth: 100 },
    { id: "paidon", label: "Paid on", minWidth: 100 },
    { id: "paymentmode", label: "Payment Mode", minWidth: 100 },
]) 

  const SearchType = (value) =>{
    setSearchType(value)
    setSearchQuery("")
  }

  useEffect(() => {
    if(searchQuery){
      searchData()

    }
    

  }, [searchQuery]

  )

  const apiEndpoints = {
    1: "item-search",     // Medicine
    2: "drug-list",       // Drug Group
    3: "list-distributer",    // Distributor
    4: "list-customer",   // Customer
  };

  /*<================================================================================== Plans column ==================================================================================> */

  const searchData = async () => {
    if (!searchQuery && !searchType){

      toast.error("select ")
      return; // Avoid calling API with empty input
    } 
  
    console.log(searchQuery, "value");
  
    const api = apiEndpoints[searchType];
    if (!api) {
      console.error("Invalid search type");
      return;
    }
  
    const data = new FormData();
    data.append("search", searchQuery);
  
    try {
      const response = await axios.post(api, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response?.data?.data) 
        if(searchType === 1){
          setTableData(response?.data?.data?.data)

        }else{
        setTableData(response?.data?.data)

        }
        setTableData(response?.data?.data?.data)

        const object  = response.data.data[0]; // Assume this is ["description", "amount", ...]

        const keys = Object.keys(object);

        const columns = keys.map((key) => ({
          key: key,
          label: key,
          minWidth: "100"
      }));

        console.log(columns,"key")

     
        setPlansColumns(columns); 
    
    
    
     else {
        console.error("Invalid API response structure", response);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  /*<======================================================================================= UI =======================================================================================> */

  return (
    <>
      <div
        id="modal"
        value={searchPage}
        className={`fixed top-[calc(var(--header-height,25px))] left-0 right-0 bottom-0 p-4 flex flex-wrap justify-center items-center w-full h-[calc(100%-var(--header-height,15px))] z-[100] before:fixed before:top-[calc(var(--header-height,25px))] before:left-0 before:w-full before:h-[calc(100%-var(--header-height,5px))] before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]
            ${searchPage ? "block" : "hidden"}`}
      >
        <div />
        <div className="bg-white shadow-lg rounded-md p-4 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6  absolute top-4 right-4 fill-current text-red-500 hover:text-red-500 "
            viewBox="0 0 24 24"
            onClick={() => setSearchPage(false)}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>
          <div className="my-4 flex  justify-evenly items-center" >
            <Box className="my-5" sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="Select">Select</InputLabel>
                <Select
                
                  labelId="select"
                  id="select"
                  value={searchType}
                  label="Select"
                  onChange={(event) => SearchType(event.target.value)}
                ><MenuItem value={1}>Medicine</MenuItem>
                  <MenuItem value={2}>Drug Group</MenuItem>
                  <MenuItem value={3}>Distributor</MenuItem>
                  <MenuItem value={4}>Customer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              autoComplete="off"
              id="outlined-basic"
              size="small"
              disabled={!searchType}
              autoFocus
              value={searchQuery} // Bind the value to searchQuery
              sx={{ width: "75%", marginTop: "5px" }}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="standard"
              placeholder="please search ......"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                type: "search",
              }}
            />
          </div>
          <div>
            <table className="table-cashManage my-5 p-4">
              <thead>
                <tr>
                  {plansColumns.map((column) => (
                    <th
                      key={column.id}
                      style={{ minWidth: 100 }}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((item, index) => (
                  <tr className="" key={index}>
                    {plansColumns.map((column) => (
                      <td className="primary" key={column.id}>{item[column.id]}</td>
                    ))}
                    <td>
                      <ReplyAllIcon className="primary transform -scale-x-100"/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Search;
