import { useEffect, useState } from "react";
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { BsLightbulbFill } from "react-icons/bs"
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel, Select, MenuItem, Tooltip } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import { FaCheckCircle } from "react-icons/fa";

const ManageStaffRole = () => {
    const history = useHistory()
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [header, setHeader] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('');
    const token = localStorage.getItem("token");
    const [openAddPopUpDeactive, setOpenAddPopUpDeactive] = useState(false);
    const ManageStaffRole = [
        // { id: 'no', label: 'No', minWidth: 100 },
        { id: 'role', label: 'Role', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];
    const [manageId, setManageId] = useState(null)
    const [manageStaffRoleData, setManageStaffRoleData] = useState([])
    const [roleHistory, setRoleHistory] = useState([]);
    const [id, setId] = useState('');
    // const permissions = [
    //     "user-manage", "user-create", "user-edit", "user-delete", "role-manage",
    //     "role-create", "role-edit", "role-delete", "agent-manage", "agent-create",
    //     "agent-edit", "agent-delete", "ledger-head-manage", "ledger-head-create",
    //     "user-manage", "user-create", "user-edit", "user-delete", "role-manage",
    //     "role-create", "role-edit", "role-delete", "agent-manage", "agent-create",
    //     "agent-edit", "agent-delete", "ledger-head-manage", "ledger-head-create"
    // ];
    const resetAddDialog = () => {
        setOpenAddPopUp(false);
    }
    const resetAddDialogDeactive = () => {
        setOpenAddPopUpDeactive(false)
    }
    const handleDeactive = (id) => {
        setOpenAddPopUpDeactive(true)
        setId(id);
    }

    const handleDeactiveRole = () => {
        let data = new FormData();
        const params = {
            id: id,
        }
        axios.post("role-status?", data, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLoading(false)
                setOpenAddPopUpDeactive(false)
                listOfRolePermission();
                // setManageStaffRoleData(response.data.data);

            })
            .catch((error) => {
                console.error("API error:", error);

            });
    }
    useEffect(() => {
        listOfRolePermission();
    }, []);

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
                setManageStaffRoleData(response.data.data);
            })
            .catch((error) => {
                console.error("API error:", error);

            });
    };
    const handelAddOpen = (id) => {
        setOpenAddPopUp(true);
        setHeader('Roles');
        setManageId(id)
        viewRoleHistory(id)
    }
    const viewRoleHistory = async (manageId) => {

        let data = new FormData();
        const params = {
            id: manageId,
        }
        try {
            await axios.post("role-view", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setRoleHistory(response.data.data)

            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    return (
        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-8" style={{width:'100%',minWidth:'50px'}}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl flex items-center primary font-semibold  p-2 mb-5 mng_role_stf_txt" style={{ marginBottom: "25px" }} >Manage Staff Roles
                                        <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                    </h1>
                                </div>

                                <div className="flex gap-6">
                                    <Button variant="contained"
                                        style={{
                                            background: "var(--color1)",
                                            color: "white", textTransform: 'none', marginBottom: "25px"
                                        }}
                                        onClick={(() => history.push('/add-roles'))}>
                                        <AddIcon className="mr-2" />Create Role</Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto mt-4 border-t pt-4">
                                {/* <table className="table-cashManage p-4"> */}
                                <table
                                    className="w-full border-collapse custom-table"
                                    style={{
                                        whiteSpace: "nowrap",
                                        borderCollapse: "separate",
                                        borderSpacing: "0 6px",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            {ManageStaffRole.map((column) => (
                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                    {column.label}
                                                </th>
                                            ))}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ background: "#3f621217" }}>

                                        {manageStaffRoleData?.map((item, index) => (
                                            <tr key={index} >
                                                <td style={{ borderRadius: "10px 0 0 10px" }}> {index + 1}</td>
                                                {ManageStaffRole.map((column) => {
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
                                                <td style={{ borderRadius: "0 10px 10px 0" }}>
                                                    <div className="flex justify-center items-center">
                                                        <VisibilityIcon className="primary mr-3 " onClick={() => handelAddOpen(item.id)} />
                                                        <BorderColorIcon
                                                            style={{ color: "var(--color1)" }} className="primary mr-3" onClick={(() => history.push(`/edit-role/${item.id}`))} />
                                                        <Tooltip title="Deactivate" className="">
                                                            {item.status == 'Active' ?
                                                                <DoNotDisturbIcon className="text-red-600 mr-3" onClick={() => handleDeactive(item.id)} /> :
                                                                <FaCheckCircle className="text-blue-600 mr-3" size={24} onClick={() => handleDeactive(item.id)} />}
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Box>
                    <Dialog open={openAddPopUp} sx={{ '& .MuiDialog-paper': { maxWidth: '1000px', width: '50%' } }} >
                        <DialogTitle id="alert-dialog-title" className="secondary">
                            {header}
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={resetAddDialog}
                            sx={{ position: 'absolute', right: 8, top: 8, color: "#ffffff" }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center w-full">
                                        <div className="w-1/5 flex justify-between">
                                            <span className="font-semibold text-black">Role</span>
                                            <span className="mx-2 font-bold text-xl">:-</span>
                                        </div>
                                        <div className="w-4/5">
                                            <span className="font-semibold text-black ml-4">{roleHistory?.role}</span>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="flex gap-4">
                                            <div className="w-1/5 ">
                                                <div className="flex items-center justify-between h-48">
                                                    <span className="font-semibold text-black">Permissions</span>
                                                    <span className="mx-2 font-bold text-xl ">:-</span>
                                                </div>
                                            </div>
                                            <div className="w-4/5 space-x-2">
                                                {/* {roleHistory?.permission.map((role, index) => (
                                                    <span key={index} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full gap-2 mt-4">
                                                        {role.roleName}
                                                    </span>
                                                ))} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>


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
                </div>
            }
        </>
    )
}
export default ManageStaffRole