import { BsLightbulbFill } from "react-icons/bs"
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material"
import { useEffect, useState } from "react"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios"
import Loader from "../../../componets/loader/Loader"
import { toast, ToastContainer } from "react-toastify"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Password = () => {
    const history = useHistory()

    const token = localStorage.getItem("token");
    const [currentPasswordIcon, setCurrentPasswordIcon] = useState(false);
    const [newPasswordIcon, setNewPasswordIcon] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        fetchAboutDetails();
    }, []);

    const fetchAboutDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("about-get", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            if (response.data.status == 200) {
                setNewPassword(data.password);
                setCurrentPassword(data.password);

            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);

        }
    };

    const handleClickNewPassword = () => {
        setNewPasswordIcon(!newPasswordIcon);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickCurrentPassword = () => {
        setCurrentPasswordIcon(!currentPasswordIcon);
    };

    const validatePasswords = () => {
        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters');
            return false;
        }

        if (!/[A-Z]/.test(newPassword)) {
            setPasswordError('New password must contain at least one uppercase letter');
            return false;
        }

        if (!/[0-9]/.test(newPassword)) {
            setPasswordError('New password must contain at least one number');
            return false;
        }

        if (newPassword !== currentPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        setPasswordError(null);
        return true;
    };

    const handleUpdate = async () => {
        if (validatePasswords()) {
            setIsLoading(true)
            let data = new FormData();

            data.append('password', newPassword)
            data.append('name', localStorage.getItem('UserName'))
            data.append('password_confirmation', currentPassword)
            try {
                await axios.post("update-password", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
                    toast.success(response.data.message);
                    setIsLoading(false);

                })
            } catch (error) {
                console.error("API error:", error);

            }
        }
    };
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
                <div>
                    <Box sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="pt-8 pl-8 w-full">
                            <div>
                                <h1 className="text-2xl flex items-center  font-semibold  p-2 mb-5" style={{ color: "var(--color1)", marginBottom: "25px" }}>Update Password
                                    <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                </h1>
                            </div>

                            <div>
                                <FormControl variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                                    <Input
                                        className="aboutTextField"
                                        value={newPassword}
                                        sx={{ minWidth: 350 }}
                                        id="standard-adornment-password"
                                        type={newPasswordIcon ? 'text' : 'password'}
                                        onChange={(e) => { setNewPassword(e.target.value) }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickNewPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {newPasswordIcon ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-10">
                                <FormControl variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                                    <Input
                                        className="aboutTextField"
                                        value={currentPassword}
                                        sx={{ minWidth: 350 }}
                                        id="standard-adornment-password"
                                        type={currentPasswordIcon ? 'text' : 'password'}
                                        onChange={(e) => { setCurrentPassword(e.target.value) }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickCurrentPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {currentPasswordIcon ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}
                            </div>
                            <Box className='ml-2'>
                                <Button variant="contained" sx={{ textTransform: 'none', background: "var(--color1)", paddingLeft: "20px", marginTop: "20px" }} onClick={handleUpdate} >Update</Button>
                            </Box>
                        </div>

                    </Box>
                </div>}
        </>
    )
}
export default Password