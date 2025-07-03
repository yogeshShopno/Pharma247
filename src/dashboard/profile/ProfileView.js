
import * as React from 'react';
import Box from '@mui/material/Box';
import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControl, Typography, Switch } from "@mui/material";
import { useState } from "react";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import usePermissions, { hasPermission } from '../../componets/permission';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const ProfileView = () => {
    const [open, setOpen] = useState(false);
    const history = useHistory()
    const permissions = usePermissions();
    const location = useLocation();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleItemClick = (path, name) => {
        history.push(path);
    };
    const hasStaffSessionsPermission = hasPermission(permissions, "staff members view") || hasPermission(permissions, "manage staff roles view");

    return (
        <>
            <div>
                <Box
                    className="custom-scroll pb_mn_hdsssss_vv"
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '100%',
                            md: 265,
                            lg: 320,
                            xl: 320,
                        },
                        height: {
                            xs: '100%',
                            sm: '99.9vh',
                            md: '99.9vh',
                            lg: '99.9vh',
                            xl: '99.9vh',
                        },

                        position: 'sticky',
                        top: 0,
                        bgcolor: 'rgba(153, 153, 153, 0.1)',
                        padding: '15px'
                    }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary sx={{ color: "var(--color1)" }} >
                            <PersonIcon sx={{ mb: 1 }} />
                            <Typography className='pb_list_hedrr' sx={{ paddingX: "20px" }}>Account</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                <ul className='list-text_pb'>
                                    {hasPermission(permissions, "profile details update") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/about-info' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/about-info', 'About Pharmacy')}
                                        >
                                            Profile Details
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile details update") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/documents' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/documents', 'Documents')}
                                        >
                                            Documents
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile plan view") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/plans' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/plans', 'Plan')}
                                        >
                                            Plan
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile plan view") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/refer&earn' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/refer&earn', 'refer&earn')}
                                        >
                                            Refer & Earn
                                        </li>
                                    )}
                                    <li
                                        className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/password' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                        onClick={() => handleItemClick('/password', 'Password')}
                                    >
                                        Password
                                    </li>
                                </ul>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    {hasStaffSessionsPermission && (
                        <Accordion defaultExpanded >
                            <AccordionSummary sx={{ color: "var(--color1)" }} >
                                <SupervisorAccountIcon sx={{ mb: 1 }} />
                                <Typography className='pb_list_hedrr' sx={{ paddingX: "20px" }}>Staff & Sessions</Typography>
                            </AccordionSummary>
                            <AccordionDetails  >
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    <ul className='list-text_pb'>
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/Staff-sessions/staff-member' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/Staff-sessions/staff-member', 'Staff Members')}
                                            >
                                                Staff Members
                                            </li>
                                        )}
                                        {hasPermission(permissions, "manage staff roles view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/Staff-sessions/manage-staffrole' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/Staff-sessions/manage-staffrole', 'Manage Staff Roles')}
                                            >
                                                Manage Staff Roles
                                            </li>
                                        )}
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/Staff-sessions/reconciliation-manage' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/Staff-sessions/reconciliation-manage', 'Reconciliation')}
                                            >
                                                Reconciliation
                                            </li>
                                        )}

                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/Staff-sessions/sessions' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/Staff-sessions/sessions', 'Log Activity')}
                                        >Log Activity
                                        </li>
                                    </ul>
                                    {/* {/ ))} /} */}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {hasStaffSessionsPermission && (
                        <Accordion defaultExpanded >
                            <AccordionSummary sx={{ color: "var(--color1)" }} >
                                <SupervisorAccountIcon sx={{ mb: 1 }} />
                                <Typography className='pb_list_hedrr' sx={{ paddingX: "20px" }}>Setting</Typography>
                            </AccordionSummary>
                            <AccordionDetails  >
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    <ul className='list-text_pb'>

                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/settings/online-orders' ? 'bg-[var(--color1)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/settings/online-orders', 'online-orders')}
                                            >
                                                Online Orders
                                            </li>
                                        )}
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={'font-semibold items-center p-2 cursor-pointer flex justify-between rounded-lg '}
                                                onClick={() => handleItemClick('/settings/online-orders', 'online-orders')}
                                            >
                                                Whatsapp Bill <Switch
                                                    // checked={settings.accept_online_orders == 1}
                                                    sx={{
                                                        "& .MuiSwitch-track": {
                                                            backgroundColor: "lightgray",
                                                        },
                                                        "&.Mui-checked .MuiSwitch-track": {
                                                            backgroundColor: "var(--color1) !important",
                                                        },
                                                        "& .MuiSwitch-thumb": {
                                                            backgroundColor: "var(--color1)",
                                                        },
                                                        "&.Mui-checked .MuiSwitch-thumb": {
                                                            backgroundColor: "var(--color1)",
                                                        },
                                                    }}
                                                    // onchecked={settings.accept_online_orders == 1}
                                                    onClick={() => {
                                                        if (localStorage.getItem('whatsapp_bill') === 'true') {
                                                            localStorage.setItem('whatsapp_bill', false)
                                                        }
                                                    }}
                                                />
                                            </li>
                                        )}
                                    </ul>
                                    {/* {/ ))} /} */}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    <Divider />
                </Box>
            </div>
        </>
    )
}

export default ProfileView