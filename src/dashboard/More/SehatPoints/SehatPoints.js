import React, { useState } from "react";
import Header from "../../Header";
import Loader from "../../../componets/loader/Loader";
import {  ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";

import { Autocomplete, Box, TextField } from "@mui/material";

const SehatPoints = () => {


    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div>
                {isLoading ? (
                    <div className="loader-container ">
                        <Loader />
                    </div>
                ) : (
                    <div
                        style={{
                            minHeight: 'calc(100vh - 64px)',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}
                    >
                        <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                            <div className="p-6">
                                <div
                                    className="mb-4 lyl_main_header_txt"
                                    style={{ display: "flex", gap: "4px" }}
                                >
                                    <div
                                        style={{ display: "flex", gap: "5px", alignItems: "center" }}
                                    >
                                        <span
                                            className="primary"
                                            style={{
                                                display: "flex",
                                                fontWeight: 700,
                                                fontSize: "20px",
                                                // width: "130px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Membership Plan
                                        </span>
                                        <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
                                    </div>
                                    <div className="headerList">
                                      
                                    </div>
                                </div>
                                <div
                                    className="row border-b border-dashed"
                                    style={{ borderColor: "var(--color2)" }}
                                ></div>
                                <div className="firstrow mt-4">
                                    <div className="overflow-x-auto mt-4">
                                        <div className="flex w-full abt_res_fldd">

                                            <div className="bg-white rounded-lg items-center mt-4 mb-5 p-4 item_inner_box" style={{
                                                border: '1px solid #628a2f73',
                                                boxShadow: 'rgb(184 202 161 / 7%) 11px 12px 20px',
                                                width: "50%",
                                                height: '100%'

                                            }}>
                                                <div className="row gap-3 item_fld_rw">
                                                    <div className="fields Unit_divvv itm_divv_wid" style={{ width: "30%" }}>
                                                        <div
                                                            style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                                                        >
                                                            <label className="label">Select Plans <span className="text-red-600">*</span></label>

                                                        </div>
                                                        <Box>
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={companyList}
                                                                size="small"
                                                                value={selectedCompany}
                                                                onChange={(e, value) => setSelectedCompany(value)}
                                                                // sx={{ width: 350 }}
                                                                getOptionLabel={(option) => option.company_name}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} placeholder="Select Plans" />
                                                                )}
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "rgba(0, 0, 0, 0.38) "
                                                                        },
                                                                        "&:hover fieldset": {
                                                                            borderColor: "var(--color1)", // Hover border color
                                                                        },
                                                                        "&.Mui-focused fieldset": {
                                                                            borderColor: "var(--color1)", // Focused border color
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                          
                                                        </Box>
                                                    </div>
                                                    <div className="fields Unit_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <div
                                                            style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                                                        >
                                                            <label className="label">Payment Method <span className="text-red-600  ">*</span></label>

                                                        </div>
                                                        
                                                        <Box>
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={companyList}
                                                                size="small"
                                                                value={selectedCompany}
                                                                onChange={(e, value) => setSelectedCompany(value)}
                                                                // sx={{ width: 350 }}
                                                                getOptionLabel={(option) => option.company_name}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} placeholder="Payment Method " />
                                                                )}
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "rgba(0, 0, 0, 0.38) "
                                                                        },
                                                                        "&:hover fieldset": {
                                                                            borderColor: "var(--color1)", // Hover border color
                                                                        },
                                                                        "&.Mui-focused fieldset": {
                                                                            borderColor: "var(--color1)", // Focused border color
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        </Box>
                                                    </div>

                                                </div>
                                                <div className="row item_fld_rw gap-3 md:pt-2">
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">Customer Name</label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">Mobile No. 1</label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row item_fld_rw gap-3 md:pt-2">
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">Customer Name</label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">Mobile No. 2</label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row item_fld_rw gap-3 md:pt-2">
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">Customer Name</label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">Mobile No. 6</label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row item_fld_rw gap-3 md:pt-2">
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">City  <span className="text-red-600  ">*</span></label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                                                        <label className="label">State </label>
                                                        <TextField
                                                            required
                                                            id="outlined-number"
                                                            // style={{ width: "350px" }}
                                                            size="small"
                                                            type="number"

                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "rgba(0, 0, 0, 0.38) "
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "var(--color1)", // Hover border color
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "var(--color1)", // Focused border color
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
};
export default SehatPoints;