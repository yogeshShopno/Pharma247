import { BsLightbulbFill } from "react-icons/bs"
import axios from "axios"
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material"
import { useEffect, useState } from "react"
import Loader from "../../../componets/loader/Loader"
import { toast, ToastContainer } from "react-toastify"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ReferEarn=()=>{
    const history = useHistory()
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);

    return(
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
                                <h1 className="text-2xl flex items-center  font-semibold  p-2 mb-5" style={{ color: "var(--color1)", marginBottom: "25px" }}>Refer & Earn
                                    <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                </h1>
                            </div>
                        </div>
                    </Box>
                </div>}
        </>
    )
}
export default ReferEarn