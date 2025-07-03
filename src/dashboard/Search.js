import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TablePagination, TextField } from "@mui/material";
import axios from "axios";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { toast } from "react-toastify";

const Search = ({ searchPage, setSearchPage }) => {
  const history = useHistory();

  const token = localStorage.getItem("token");
  const [searchType, setSearchType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [medicineTableData, setMedicineTableData] = useState([])
  const [drugsTableData, setDrugsTableData] = useState([])
  const [distributorTableData, setDistributorTableData] = useState([])
  const [customerTableData, setCustomerTableData] = useState([])

  const [medicineColumns, setMedicineColumns] = useState([
    { id: "iteam_name", label: "Item Name", minWidth: 100 },
    { id: "weightage", label: "weightage", minWidth: 100 },
    { id: "drug_group", label: "drug_group", minWidth: 100 },
    { id: "mrp", label: "mrp", minWidth: 100 },
    { id: "stock", label: "stock", minWidth: 100 },
  ])

  const [drugsColumns, setDrugsColumns] = useState([
    { id: "id", label: "Drug Group ID", minWidth: 100 },
    { id: "name", label: "Drug Group", minWidth: 100 },
    { id: "count", label: "Count", minWidth: 100 },
  ])

  const [distributorColumns, setDistributorColumns] = useState([
    { id: "name", label: "Distributor Name", minWidth: 100 },
    { id: "gst", label: "gst", minWidth: 100 },
  ])

  const [customerColumns, setCustomerColumns] = useState([
    { id: "name", label: "Customer Name", minWidth: 100 },
    { id: "phone_number", label: "Mobile No.", minWidth: 100 },
    { id: "total_order", label: "Total Order", minWidth: 100 },
    { id: "roylti_point", label: "Loyalty Points", minWidth: 100 },
    { id: "total_amount", label: "Total Amount", minWidth: 100 },
  ])

  /*<================================================================================== search fn ==================================================================================> */

  const SearchType = (value) => {
    setSearchType(value)
    setSearchQuery("")
    setPage(0) // Reset page when changing search type

    // Clear previous search results
    setMedicineTableData([])
    setDrugsTableData([])
    setDistributorTableData([])
    setCustomerTableData([])
  }

  const handleSearchQueryChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (newValue.trim()) {
      searchData(newValue);
    } else {
      // Clear results if search query is empty
      setMedicineTableData([])
      setDrugsTableData([])
      setDistributorTableData([])
      setCustomerTableData([])
    }
  };

  const apiEndpoints = {
    1: "item-search",
    2: "drug-list",
    3: "list-distributer",
    4: "list-customer",
  };

  const searchData = async (query = searchQuery) => {
    if (!query.trim() || !searchType) {
      if (!searchType) {
        toast.error("Please select a search type");
      }
      return;
    }

    const api = apiEndpoints[searchType];
    if (!api) {
      console.error("Invalid search type");
      return;
    }

    const data = new FormData();
    if (searchType == 3) {
      data.append("name_mobile_gst_search", query);
    }
    data.append("search", query);

    try {
      const response = await axios.post(api, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.data) {
        if (searchType == 1) {
          setMedicineTableData(response.data.data.data || response.data.data)
        } else if (searchType == 2) {
          setDrugsTableData(response.data.data)
        } else if (searchType == 3) {
          setDistributorTableData(response.data.data)
        } else if (searchType == 4) {
          setCustomerTableData(response.data.data)
        }
      }

    } catch (error) {
      console.error("API error:", error);
      toast.error("Search failed. Please try again.");
    }
  };

  // Navigation handler
  const handleNavigation = (row) => {
    if (searchType == 1) {
      history.push(`/inventoryView/${row.id}`)
    } else if (searchType == 2) {
      // Add navigation for drug group if needed
      // history.push(`/drugGroupView/${row.id}`)
      console.log("Drug group navigation not implemented yet");
    } else if (searchType == 3) {
      history.push(`/DistributerView/${row.id}`)
    } else if (searchType == 4) {
      history.push(`/more/customerView/${row.id}`)
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Get current table data based on search type
  const getCurrentTableData = () => {
    switch (searchType) {
      case 1: return medicineTableData;
      case 2: return drugsTableData;
      case 3: return distributorTableData;
      case 4: return customerTableData;
      default: return [];
    }
  };

  // Get current columns based on search type
  const getCurrentColumns = () => {
    switch (searchType) {
      case 1: return medicineColumns;
      case 2: return drugsColumns;
      case 3: return distributorColumns;
      case 4: return customerColumns;
      default: return [];
    }
  };

  useEffect(() => {
    if (searchPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchPage]);

  const currentTableData = getCurrentTableData();
  const currentColumns = getCurrentColumns();

  return (
    <>
      <div
        id="modal"
        value={searchPage}
        className={`fixed top-[calc(var(--header-height,25px))] left-0 right-0 bottom-0 p-4 flex flex-wrap justify-center items-center w-full h-[calc(100%-var(--header-height,15px))] z-[100] before:fixed before:top-[calc(var(--header-height,31px))] before:left-0 before:w-full before:h-[calc(100%-var(--header-height,5px))] before:bg-[rgba(0,0,0,0.5)] overflow-hidden font-[sans-serif]
            ${searchPage ? "block" : "hidden"}`}
      >
        <div />
        <div className="bg-white shadow-lg rounded-md p-4 relative" style={{ width: "51%" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 absolute top-4 right-4 fill-current primary cursor-pointer"
            viewBox="0 0 24 24"
            onClick={() => setSearchPage(false)}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>

          <div className="my-4 flex gap-4 justify-evenly items-center" style={{ position: 'sticky', top: '0', alignItems: 'end' }}>
            <Box className=" " sx={{ width: "40%" }}>
              <FormControl fullWidth>
                <InputLabel id="Select">Select</InputLabel>
                <Select
                  style={{ height: "48px" }}
                  labelId="select"
                  id="select"
                  value={searchType}
                  label="Select"
                  onChange={(event) => SearchType(event.target.value)}
                >
                  <MenuItem value={1}>Medicine</MenuItem>
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
              value={searchQuery}
              sx={{ width: "100%", marginTop: "0px" }}
              onChange={handleSearchQueryChange}
              variant="standard"
              placeholder="Please search......"
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

          <div className="">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse custom-table" style={{
                whiteSpace: "nowrap",
                borderCollapse: "separate",
                borderSpacing: "0 6px",
              }}>
                <thead>
                  <tr style={{ whiteSpace: 'nowrap' }}>
                    <th>Sr No.</th>
                    {currentColumns.map((column) => (
                      <th key={column.id} style={{ minWidth: 50 }}>
                        {column.label}
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#3f621217", overflow: 'auto' }}>
                  {currentTableData && currentTableData.length > 0 ? (
                    currentTableData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <tr className="primary" key={index}>
                          <td
                            style={{ borderRadius: "10px 0 0 10px", cursor: "pointer" }}
                            onClick={() => handleNavigation(row)}
                          >
                            {page * rowsPerPage + index + 1}
                          </td>
                          {currentColumns.map((column) => (
                            <td
                              onClick={() => handleNavigation(row)}
                              className="cursor-pointer"
                              key={column.id}
                            >
                              {row[column.id] || "-"}
                            </td>
                          ))}
                          <td style={{ borderRadius: "0 10px 10px 0" }}>
                            <ReplyAllIcon
                              className="primary transform -scale-x-100 cursor-pointer"
                              onClick={() => handleNavigation(row)}
                            />
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={currentColumns.length + 2} className="text-center primary" style={{ borderRadius: '10px 10px 10px 10px' }}>
                        {searchQuery && searchType ? "No data found" : "Please select a search type and enter search query"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={currentTableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;