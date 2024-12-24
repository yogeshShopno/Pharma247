import { BsLightbulbFill } from "react-icons/bs"
import Header from "../../Header"
import { Box, Button, Input, InputAdornment, OutlinedInput, Tooltip } from "@mui/material"
import ProfileView from "../ProfileView"
import { useEffect, useState } from "react"
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import Loader from "../../../componets/loader/Loader"
import axios from "axios"
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Visibility, VisibilityOff } from "@mui/icons-material"
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"
import usePermissions, { hasPermission } from "../../../componets/permission"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const StaffMember = () => {
    const history = useHistory()

    const token = localStorage.getItem("token");
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [header, setHeader] = useState('');
    const [mobileNo, setMobileNo] = useState('')
    const [fullName, setFullName] = useState('')
    const [buttonLabel, setButtonLabel] = useState('');
    const [password, setPassword] = useState('')
    const [emailID, setEmailID] = useState('')
    const [id, setID] = useState('')
    const [selectedAssignRole, setSelectedAssignRole] = useState('')
    const [reEnterPassword, setReEnterPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [PasswordIcon, setPasswordIcon] = useState(false);
    const [reEnterPasswordIcon, setReEnterPasswordIcon] = useState(false);
    const handleClickPassword = () => setPasswordIcon((show) => !show);
    const handleClickReEnterPassword = () => setReEnterPasswordIcon((show) => !show);
    const [isEditMode, setIsEditMode] = useState(false);
    const [manageStaffRoleData, setManageStaffRoleData] = useState([])
    const [openAddPopUpDeactive, setOpenAddPopUpDeactive] = useState(false);
    const [roleId, setRoleId] = useState('');
    const permissions = usePermissions();

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const StaffMemberColumns = [
        { id: 'name', label: 'Staff Name', minWidth: 100 },
        { id: 'mobile_number', label: 'Mobile', minWidth: 100 },
        { id: 'role_name', label: 'Role Name', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
        { id: 'created_at', label: 'Created Date', minWidth: 100 },
    ];
    const [tableData, setTableData] = useState([])

    const resetAddDialog = () => {
        setOpenAddPopUp(false);
        setErrors({})
        setEmailID()
        setFullName()
        setMobileNo()
        setSelectedAssignRole()
        setPassword()
        setReEnterPassword()
    }
    const handelAddOpen = () => {
        setOpenAddPopUp(true);
        setHeader('Manage Staff Member');
        setButtonLabel('Add')
    }

    const handelEditOpen = (item) => {
        setOpenAddPopUp(true);
        setIsEditMode(true);
        setHeader('Edit Staff Member');
        setButtonLabel('Update')
        setFullName(item.name)
        setID(item.id);
        setMobileNo(item.mobile_number);
        setSelectedAssignRole(item.role_id);
        setEmailID(item.email_id)
        setPassword(item.password)
        setReEnterPassword(item.password);
    }


    useEffect(() => {
        listOfRolePermission();
        staffList();
    }, []);

    const staffList = () => {
        setIsLoading(true)
        axios
            .post("manage-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setIsLoading(false)
                //console.log("API Response: ", response.data.data);
                setTableData(response.data.data);
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    };


    const listOfRolePermission = () => {
        setIsLoading(true)
        axios
            .get("role-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setIsLoading(false)
                //console.log("API Response: ", response.data.data);
                setManageStaffRoleData(response.data.data);
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    };

    const validateForm = async () => {
        if (isEditMode == false) {
            const newErrors = {};
            if (!selectedAssignRole) newErrors.selectedAssignRole = 'Assign Role is required'
            if (!fullName) newErrors.fullName = 'Full Name is required';
            if (!mobileNo) {
                newErrors.mobileNo = 'Mobile No is required';
            } else if (!/^\d{10}$/.test(mobileNo)) {
                newErrors.mobileNo = 'Mobile number must be 10 digits';
            }
            if (!emailID) newErrors.emailID = 'emailID is required';
            if (!password) {
                newErrors.password = 'Password is required';
            } else if (password < 8) {
                newErrors.password = 'password must be at least 8 characters';
            } else if (!/[A-Z]/.test(password)) {
                newErrors.password = 'password must contain at least one uppercase letter';
            } else if (!/[0-9]/.test(password)) {
                newErrors.password = 'password must contain at least one number';

            } else if (password !== reEnterPassword) {
                newErrors.reEnterPassword = 'Passwords do not match';
            }
            setErrors(newErrors);
            const isValid = Object.keys(newErrors).length === 0;
            if (isValid) {
                AddStaffMemberRecord();
            }
            return isValid;
        } else {
            const newErrors = {};
            if (!selectedAssignRole) newErrors.selectedAssignRole = 'Assign Role is required'
            if (!fullName) newErrors.fullName = 'Full Name is required';
            if (!mobileNo) {
                newErrors.mobileNo = 'Mobile No is required';
            } else if (!/^\d{10}$/.test(mobileNo)) {
                newErrors.mobileNo = 'Mobile number must be 10 digits';
            }
            if (!emailID) newErrors.emailID = 'emailID is required';
            // if (password.length < 8) {
            //     newErrors.password('New password must be at least 8 characters');
            //     return false;
            // }

            // if (!/[A-Z]/.test(password)) {
            //     newErrors.password('New password must contain at least one uppercase letter');
            //     return false;
            // }

            // if (!/[0-9]/.test(password)) {
            //     newErrors.password('New password must contain at least one number');
            //     return false;
            // }

            if (!password) {
                newErrors.password = 'Password is required';
            } if (password !== reEnterPassword) {
                newErrors.reEnterPassword = 'Passwords do not match';
            }
            setErrors(newErrors);
            const isValid = Object.keys(newErrors).length === 0;
            if (isValid) {
                EditStaffMemberRecord();
            }

            return isValid;
        }
    }
    const AddStaffMemberRecord = async () => {
        // if (validateForm()) {
        let data = new FormData();
        data.append('name', fullName)
        data.append('mobile_no', mobileNo)
        data.append('assgin_role', selectedAssignRole)
        data.append('email_id', emailID)
        data.append('password', password)
        data.append('password_confirmation', reEnterPassword)
        try {
            await axios.post("manage-staff", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                staffList();
                setFullName('');
                setMobileNo('');
                setSelectedAssignRole('');
                setEmailID('');
                setPassword('');
                setReEnterPassword('');
                setOpenAddPopUp(false)
                toast.success(response.data.message);
                setErrors({});
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
                //console.log(error.message, 'mp');
            }
            console.error("API error:", error);
        }
        // }
    }

    const EditStaffMemberRecord = async () => {
        // if (validateForm()) {
        let data = new FormData();
        data.append('name', fullName)
        data.append('mobile_no', mobileNo)
        data.append('assgin_role', selectedAssignRole)
        data.append('email_id', emailID)
        data.append('password', password)
        data.append('password_confirmation', reEnterPassword)
        data.append('id', id)
        const params = {
            id: id
        }
        try {
            await axios.post("manage-update", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                staffList();
                setFullName('');
                setMobileNo('');
                setSelectedAssignRole('');
                setEmailID('');
                setPassword('');
                setReEnterPassword('');
                setOpenAddPopUp(false)
                setIsEditMode(false)
                setErrors({});
                toast.success(response.data.message);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
        // }
    }

    const handleDeactive = (id) => {
        setOpenAddPopUpDeactive(true)
        setRoleId(id);
    }

    const resetAddDialogDeactive = () => {
        setOpenAddPopUpDeactive(false)
    }

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setMobileNo(value);
        }
    };

    const handleDeactiveRole = () => {
        let data = new FormData();
        const params = {
            id: roleId,
        }
        axios.post("status-change?", data, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLoading(false)
                //console.log("API Response: ", response.data.data);
                setOpenAddPopUpDeactive(false)
                // listOfRolePermission();
                staffList()
                // setManageStaffRoleData(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    }

    return (
        <>
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
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <Box sx={{ display: "flex" }}>
                    <ProfileView />
                    <div className="p-8 w-full">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl flex items-center primary font-semibold  p-2 mb-5" style={{ marginBottom: "25px" }}>Staff Member
                                    <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                </h1>
                            </div>

                            <div className="flex gap-6">
                                <Button variant="contained" color="primary" style={{ textTransform: 'none', marginBottom: "25px" }} onClick={handelAddOpen}> <AddIcon className="mr-2" />Add New Member</Button>
                            </div>
                        </div>
                        <table className="table-cashManage p-4">
                            <thead>
                                <tr>
                                    <th>No</th>

                                    {StaffMemberColumns.map((column) => (
                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </th>
                                    ))}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData?.map((item, index) => (
                                    <tr key={index} >
                                        <td>  {index + 1}</td>
                                        {StaffMemberColumns.map((column) => {
                                            const value = item[column.id];
                                            const isStatus = column.id === 'status';
                                            const statusClass = isStatus && value === 'Active' ? 'orderStatus' : isStatus && value === 'Disactive' ? 'dueStatus' : 'text-black';
                                            return (
                                                <td key={column.id} className={`text-lg `}>
                                                    <span className={`text ${isStatus && statusClass}`}>
                                                        {item.status == 1 ? item.status = 'Active' : item.status == 0 ? item.status = 'Disactive' : item[column.id]}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                        <td className="flex justify-center">
                                            {hasPermission(permissions, "staff members edit") &&
                                                <BorderColorIcon
                                                    style={{ color: "var(--color1)" }} className="primary mr-3" onClick={() => handelEditOpen(item)} />}
                                            {hasPermission(permissions, "staff members activation") && (
                                                <Tooltip title="Deactivate" className="">
                                                    {item.status == 'Active' ?
                                                        <DoNotDisturbIcon className="text-red-600 mr-3" onClick={() => handleDeactive(item.id)} /> :
                                                        <FaCheckCircle className="text-blue-600 mr-3" size={20} onClick={() => handleDeactive(item.id)} />}
                                                </Tooltip>)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </Box>
            }
            <Dialog open={openAddPopUp} >
                <DialogTitle id="alert-dialog-title" className="secondary">
                    {header}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={resetAddDialog}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="p-2">
                            <div className="flex gap-6">
                                <div >
                                    <span className="flex primary mb-2 font-medium">Full Name</span>
                                    <TextField
                 autoComplete="off"id="standard-basic"
                                        size="small"
                                        sx={{ width: 250 }}
                                        label="Full Name" variant="outlined"
                                        value={fullName}
                                        onChange={(e) => {
                                            const capitalizedValue = e.target.value
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char) => char.toUpperCase());
                                        setFullName(capitalizedValue)
                                         }}/>
                                    {errors.fullName && <span style={{ color: 'red', fontSize: '12px' }}>{errors.fullName}</span>}

                                </div>
                                <div >
                                    <span className="flex primary mb-2 font-medium">Mobile No</span>
                                    <TextField
                 autoComplete="off" id="standard-basic"
                                        size="small"
                                        sx={{ width: 250 }}
                                        label="Mobile No" variant="outlined"
                                        value={mobileNo}
                                        onChange={handleChange}
                                    />
                                    {errors.mobileNo && <span style={{ color: 'red', fontSize: '12px' }}>{errors.mobileNo}</span>}

                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex gap-6">
                                <div>
                                    <span className="flex primary mb-2 font-medium">Assign Role</span>
                                    <FormControl sx={{ minWidth: 250 }} size="small">
                                        <InputLabel id="demo-select-small-label">Assign Role</InputLabel>
                                        <Select
                                            labelId="demo-select-small-label"
                                            id="demo-select-small"
                                            value={selectedAssignRole}
                                            onChange={(e) => setSelectedAssignRole(e.target.value)}
                                            label="Assign Role"
                                        >
                                            <MenuItem value="" disabled>
                                                Select Assign Role
                                            </MenuItem>
                                            {manageStaffRoleData.map((item) =>
                                                <MenuItem value={item.id}>{item.role}</MenuItem>
                                            )}
                                        </Select>
                                        {errors.selectedAssignRole && <span style={{ color: 'red', fontSize: '12px' }}>{errors.selectedAssignRole}</span>}
                                    </FormControl>
                                </div>
                                <div >
                                    <span className="flex primary mb-2 font-medium">Email ID</span>
                                    <TextField
                 autoComplete="off" id="standard-basic"
                                        size="small"
                                        sx={{ width: 250 }}
                                        label="Email ID" variant="outlined"
                                        value={emailID}
                                        onChange={(e) => setEmailID(e.target.value)} />
                                    {errors.emailID && <span style={{ color: 'red', fontSize: '12px' }}>{errors.emailID}</span>}

                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex gap-6">
                                <div >
                                    <span className="flex primary mb-2 font-medium">Password</span>
                                    <FormControl sx={{ width: '600', height: '42px' }} variant="outlined">
                                        <OutlinedInput
                                            value={password}
                                            className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                                            id="outlined-basic"
                                            type={PasswordIcon ? 'text' : 'password'}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end" sx={{ size: "small" }}>
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {PasswordIcon ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            sx={{ height: '42px' }}
                                        />
                                        {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
                                    </FormControl>
                                </div>
                                <div >
                                    <span className="flex primary mb-2 font-medium">Re-enter Password</span>
                                    <FormControl sx={{ width: '600', height: '42px' }} variant="outlined">
                                        <OutlinedInput
                                            value={reEnterPassword}
                                            className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                                            id="outlined-basic"
                                            type={reEnterPasswordIcon ? 'text' : 'password'}
                                            onChange={(e) => setReEnterPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end" sx={{ size: "small" }}>
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickReEnterPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {reEnterPasswordIcon ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            sx={{ height: '42px' }}
                                        />
                                        {errors.reEnterPassword && <span style={{ color: 'red', fontSize: '12px' }}>{errors.reEnterPassword}</span>}
                                    </FormControl>
                                </div>
                            </div>
                        </div>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" color="success" onClick={validateForm}>
                        {buttonLabel}
                    </Button>
                </DialogActions>
            </Dialog >


            <Dialog open={openAddPopUpDeactive} sx={{ '& .MuiDialog-paper': { maxWidth: '500px', width: '50%' } }} >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="text-center">
                            <div className="text-center">
                                <span className='text-2xl text-gray-500'>Are You Sure?</span>
                            </div>
                            <div className="flex gap-6 mt-5 justify-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDeactiveRole}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={resetAddDialogDeactive}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default StaffMember