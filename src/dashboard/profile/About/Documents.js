// import { BsLightbulbFill } from "react-icons/bs"
// import Header from "../../Header"
// import ProfileView from "../ProfileView"
// import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
// import { useEffect, useState } from "react"
// import CloseIcon from '@mui/icons-material/Close';
// import AddIcon from '@mui/icons-material/Add';
// import { MdOutlineCloudUpload } from "react-icons/md";
// import DatePicker from 'react-datepicker';
// import { addDays, format, subDays, subMonths } from 'date-fns';
// import Loader from "../../../componets/loader/Loader"
// import axios from "axios"
// import { toast, ToastContainer } from "react-toastify"
// const Documents = () => {
//     const token = localStorage.getItem("token");
//     // const [license20, setLicense20] = useState('')
//     // const [license21, setLicense21] = useState('')
//     const [openAddPopUp, setOpenAddPopUp] = useState(false);
//     const [header, setHeader] = useState('');
//     const [selectedLicenseName, setSelectedLicenseName] = useState('')
//     const [selectedUploadFile, setSelectedUploadFile] = useState(null)
//     const [licenseNo, setLicenseNo] = useState('')
//     const [licenseExpiryDate, setLicenseExpiryDate] = useState(new Date())
//     const [buttonLabel, setButtonLabel] = useState('');
//     const [uploadUrl, setUploadUrl] = useState(null)
//     const [document, setDocument] = useState([])
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [uploadImg, setUploadImg] = useState('')
//     useEffect(() => {
//         fetchAboutDetails();
//     }, []);

//     const fetchAboutDetails = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.post("license-list", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             const data = response.data.data;
//             setDocument(data)
//             setIsLoading(false);
//         } catch (error) {
//             setIsLoading(false);
//             console.error("API error:", error);
//         }
//     };


//     const handelAddOpen = () => {
//         setOpenAddPopUp(true);
//         setHeader('Add other License');
//         setButtonLabel('Upload')
//     }

//     const resetAddDialog = () => {
//         setOpenAddPopUp(false);
//         setSelectedLicenseName()
//         setLicenseNo()
//         setLicenseExpiryDate()
//         setSelectedUploadFile()
//         setErrors({})
//     }

//     const handleUploadFile = (event) => {
//         const file = event.target.files[0];
//         setSelectedUploadFile(file);
//         const url = URL.createObjectURL(file);
//         setUploadUrl(url);
//     };

//     const validateForm = async () => {
//         const newErrors = {};
//         if (!selectedLicenseName) newErrors.SelectedLicenseName = 'License Name is required';
//         if (!licenseNo) newErrors.LicenseNo = 'LicenseNo is required';
//         if (!selectedUploadFile) newErrors.selectedUploadFile = 'Document is required';

//         setErrors(newErrors);
//         const isValid = Object.keys(newErrors).length === 0;
//         if (isValid) {
//             AddDocumentRecord();
//         }
//         return isValid;

//     }

//     const AddDocumentRecord = async () => {
//         // if (validateForm()) {
//         let data = new FormData();
//         data.append('license_name', selectedLicenseName)
//         data.append('license_no', licenseNo)
//         data.append('license_expiry_date', licenseExpiryDate ? format(licenseExpiryDate, 'yyyy-MM-dd') : '')
//         data.append('license_image', selectedUploadFile)
//         try {
//             await axios.post("license-store", data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }).then((response) => {
//                 setOpenAddPopUp(false);
//                 setSelectedLicenseName()
//                 setLicenseNo()
//                 toast.success(response.data.message)
//                 setLicenseExpiryDate()
//                 setSelectedUploadFile()
//                 setErrors({})
//             })
//         } catch (error) {
//             console.error("API error:", error);
//         }
//         // }
//     }

//     // const handleImageClick = () => {
//     //     const imageUrl = document[1]?.license_image;
//     //     if (!imageUrl) {
//     //         console.error('Image URL not found');
//     //         return;
//     //     }

//     //     const link = document.createElement('a');
//     //     link.href = imageUrl;
//     //     link.download = 'exported-image.png'; // Set the desired file name
//     //     document.body.appendChild(link);
//     //     link.click();
//     //     document.body.removeChild(link);
//     // };

//     return (
//         <>
//             <Header />
//             <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//             />
//             {isLoading ? <div className="loader-container ">
//                 <Loader />
//             </div> :
//                 <div>
//                     <Box sx={{ display: "flex" }}>
//                         <ProfileView />
//                         <div className="p-5 ml-4" style={{ width: "100%" }}>
//                             <div className="flex justify-between">
//                                 <div>
//                                     <h1 className="text-2xl flex items-center  font-semibold  p-2 mb-5" style={{ color: "rgb(4, 76, 157)", marginTop: "25px" }}>Documents
//                                         <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
//                                     </h1>
//                                 </div>
//                                 {/* <div>
//                                     <Button variant="contained" color="primary" style={{ textTransform: 'none', marginTop: "25px" }} onClick={handelAddOpen}> <AddIcon className="mr-2" />Add other License</Button>
//                                 </div> */}
//                             </div>
//                             <div className="w-full">
//                                 {/* {document.map((item,index) => */}
//                                 <div className="flex flex-wrap w-9/12 justify-between flex-row items-center mb-5">
//                                     <div>
//                                         <span className="primary font-semibold ">Drug License</span>
//                                     </div>
//                                     <div>
//                                         <span className="primary flex">License Number</span>
//                                         <TextField
//                                             required
//                                             id="outlined-number"
//                                             style={{ width: '300px' }}
//                                             size="small"
//                                             type='number'
//                                         // value={barcode}
//                                         // onChange={(e) => { setBarcode(e.target.value) }}
//                                         />
//                                         {/* <span className="font-semibold">{document[0]?.license_no ? document[0]?.license_no : '-'}</span> */}
//                                     </div>
//                                     <div>
//                                         <span className="primary flex">License Expiry Date</span>
//                                         <DatePicker
//                                             className="custom-datepicker w-full"
//                                             //   selected={startDate}
//                                             //   onChange={(newDate) => setStartDate(newDate)}
//                                             dateFormat="dd/MM/yyyy"
//                                         />
//                                         {/* <span className="font-semibold">{document[0]?.license_expiry_date ? document[0]?.license_expiry_date : '-'}</span> */}

//                                     </div>
//                                     <div class="flex items-center justify-center w-32">
//                                         <label for="upload-photo-file" class="flex flex-col items-center justify-center w-32 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
//                                             <img className="w-32 h-24 border-dashed rounded-lg" src={document[0]?.license_image} />

//                                         </label>
//                                     </div>

//                                 </div>
//                                 {/* )} */}
//                                 <div className="flex flex-wrap w-9/12 justify-between items-center mb-5">
//                                     <div>
//                                         <span className="primary font-semibold">Food License</span>
//                                     </div>
//                                     <div>
//                                         <span className="primary flex">License Number</span>
//                                         <TextField
//                                             required
//                                             id="outlined-number"
//                                             style={{ width: '300px' }}
//                                             size="small"
//                                             type='number'
//                                         // value={barcode}
//                                         // onChange={(e) => { setBarcode(e.target.value) }}
//                                         />
//                                         {/* <span className="font-semibold">{document[1]?.license_no ? document[1]?.license_no : '-'}</span> */}
//                                     </div>
//                                     <div>
//                                         <span className="primary flex">License Expiry Date</span>
//                                         <DatePicker
//                                             className="custom-datepicker w-full"
//                                             //   selected={startDate}
//                                             //   onChange={(newDate) => setStartDate(newDate)}
//                                             dateFormat="dd/MM/yyyy"
//                                         />
//                                         {/* <span className="font-semibold">{document[1]?.license_expiry_date ? document[1]?.license_expiry_date : '-'}</span> */}
//                                     </div>
//                                     <div class="flex items-center justify-center w-32">
//                                         <label for="upload-photo-file" class="flex flex-col items-center justify-center w-32 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer" >
//                                             <img className="w-32 h-24 border-dashed rounded-lg" src={document[1]?.license_image} />
//                                         </label>
//                                     </div>

//                                 </div>
//                                 <div className="flex flex-wrap w-9/12 justify-between items-center mb-5">
//                                     <div>
//                                         <span className="primary font-semibold ">GSTN</span>
//                                     </div>
//                                     <div className="pl-12">
//                                         <span className="primary flex ">License Number</span>
//                                         <TextField
//                                             required
//                                             id="outlined-number"
//                                             style={{ width: '300px' }}
//                                             size="small"
//                                             type='number'
//                                         // value={barcode}
//                                         // onChange={(e) => { setBarcode(e.target.value) }}
//                                         />
//                                         {/* <span className="font-semibold">{document[2]?.license_no ? document[2]?.license_no : '-'}</span> */}
//                                     </div>
//                                     <div>
//                                         <span className="primary flex">License Expiry Date</span>
//                                         <DatePicker
//                                             className="custom-datepicker w-full"
//                                             //   selected={startDate}
//                                             //   onChange={(newDate) => setStartDate(newDate)}
//                                             dateFormat="dd/MM/yyyy"
//                                         />
//                                         {/* <span className="font-semibold">{document[2]?.license_expiry_date ? document[2]?.license_expiry_date : '-'}</span> */}

//                                     </div>
//                                     <div class="flex items-center justify-center w-32">
//                                         <label for="upload-photo-file" class="flex flex-col items-center justify-center w-32 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
//                                             <img className="w-32 h-24 border-dashed rounded-lg" src={document[2]?.license_image} />
//                                         </label>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <Button variant="contained">Update</Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </Box>
//                     <Dialog open={openAddPopUp}  >
//                         <DialogTitle id="alert-dialog-title" className="secondary">
//                             {header}
//                         </DialogTitle>
//                         <IconButton
//                             aria-label="close"
//                             onClick={resetAddDialog}
//                             sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
//                         >
//                             <CloseIcon />
//                         </IconButton>
//                         <DialogContent>
//                             <DialogContentText id="alert-dialog-description">
//                                 <div className="w-full flex gap-8 p-2">
//                                     <div className="w-1/2 " >
//                                         <span className="flex primary mb-2 font-medium">License Name</span>
//                                         <FormControl sx={{ minWidth: 250 }} size="small">
//                                             <InputLabel id="demo-select-small-label">License Name</InputLabel>
//                                             <Select
//                                                 labelId="demo-select-small-label"
//                                                 id="demo-select-small"
//                                                 value={selectedLicenseName}
//                                                 onChange={(e) => setSelectedLicenseName(e.target.value)}
//                                                 label="License Name"

//                                             >
//                                                 <MenuItem value="" disabled>
//                                                     Select License Name
//                                                 </MenuItem>
//                                                 <MenuItem value="Drug License">Drug License</MenuItem>
//                                                 <MenuItem value="Food License">Food License</MenuItem>
//                                                 <MenuItem value="GSTN">GSTN</MenuItem>
//                                             </Select>
//                                             {errors.SelectedLicenseName && <span style={{ color: 'red', fontSize: '12px' }}>{errors.SelectedLicenseName}</span>}

//                                         </FormControl>
//                                         <div className="mt-6" >
//                                             <span className="flex primary mb-2 font-medium">
//                                                 License Expiry Date
//                                             </span>
//                                             <div className="detail">
//                                                 <div style={{ width: "215px" }}>
//                                                     <DatePicker
//                                                         className='custom-datepicker '
//                                                         selected={licenseExpiryDate}
//                                                         onChange={(newDate) => setLicenseExpiryDate(newDate)}
//                                                         dateFormat="dd/MM/yyyy"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="my-4">
//                                             <span className="primary font-medium">Upload Image</span>
//                                         </div>
//                                         {/* <div class="flex items-center justify-center w-44">
//                                             <label for="upload-photo-file" class="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
//                                                 <input
//                                                     accept="image/*"
//                                                     style={{ display: 'none' }}
//                                                     id="upload-photo-file"
//                                                     type="file"
//                                                     value={uploadImg}
//                                                     hidden
//                                                     onChange={handleUploadFile}
//                                                 />
//                                                 {selectedUploadFile == null ? (
//                                                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                                         <MdOutlineCloudUpload className="w-10 h-10" />
//                                                     </div>
//                                                 ) : (
//                                                     <img src={uploadUrl} alt="Uploaded Image" className="w-44 h-28 border-dashed rounded-lg" />
//                                                 )}
//                                             </label>
//                                         </div> */}
//                                         <div className="flex items-center justify-center w-44">
//                                             <label htmlFor="upload-photo-file" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
//                                                 <input
//                                                     accept="image/*"
//                                                     style={{ display: 'none' }}
//                                                     id="upload-photo-file"
//                                                     type="file"
//                                                     onChange={handleUploadFile}
//                                                 />
//                                                 {selectedUploadFile == null ? (
//                                                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                                         <MdOutlineCloudUpload className="w-10 h-10" />
//                                                         <p className="text-sm text-gray-500">Click to upload</p>
//                                                     </div>
//                                                 ) : (
//                                                     <img src={uploadUrl} alt="Uploaded Image" className="w-44 h-28 border-dashed rounded-lg" />
//                                                 )}
//                                             </label>
//                                         </div>
//                                         {errors.selectedUploadFile && <span style={{ color: 'red', fontSize: '12px' }}>{errors.selectedUploadFile}</span>}

//                                     </div>
//                                     <div className="w-1/2">
//                                         <div >
//                                             <span className="flex primary mb-2 font-medium">License No</span>
//                                             <TextField id="standard-basic"
//                                                 size="small"
//                                                 // sx={{ width: 200 }}
//                                                 label="License No" variant="outlined" value={licenseNo}
//                                                 onChange={(e) => setLicenseNo(e.target.value)} />
//                                             {errors.LicenseNo && <span style={{ color: 'red', fontSize: '12px' }}>{errors.LicenseNo}</span>}
//                                         </div>
//                                     </div>
//                                 </div>

//                             </DialogContentText>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button autoFocus variant="contained" color="success" onClick={validateForm} >
//                                 {buttonLabel}
//                             </Button>
//                         </DialogActions>
//                     </Dialog>
//                 </div>
//             }
//         </>
//     )
// }
// export default Documents
import { BsLightbulbFill } from "react-icons/bs"
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { MdOutlineCloudUpload } from "react-icons/md";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import Loader from "../../../componets/loader/Loader"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Documents = () => {
      const history = useHistory()
    
    const token = localStorage.getItem("token");
    const [header, setHeader] = useState('');
    const [selectedLicenseName, setSelectedLicenseName] = useState('')
    const [selectedUploadFile, setSelectedUploadFile] = useState(null)
    const [selectedUploadFileTwo, setSelectedUploadFileTwo] = useState(null)
    const [selectedUploadFileThree, setSelectedUploadFileThree] = useState(null)
    const [selectedUploadFileFour, setSelectedUploadFileFour] = useState(null)
    const [licenseNo, setLicenseNo] = useState('')
    const [licenseNoTwo, setLicenseNoTwo] = useState('')
    const [licenseNoThree, setLicenseNoThree] = useState('')
    const [licenseNoFour, setLicenseNoFour] = useState('')
    const [licenseExpiryDate, setLicenseExpiryDate] = useState(new Date())
    const [licenseExpiryDateTwo, setLicenseExpiryDateTwo] = useState(new Date())
    const [licenseExpiryDateThree, setLicenseExpiryDateThree] = useState(new Date())
    const [licenseExpiryDateFour, setLicenseExpiryDateFour] = useState(new Date())
    const [uploadUrl, setUploadUrl] = useState(null)
    const [uploadUrlTwo, setUploadUrlTwo] = useState(null)
    const [uploadUrlThree, setUploadUrlThree] = useState(null)
    const [uploadUrlFour, setUploadUrlFour] = useState(null)
    const [document, setDocument] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [uploadImg, setUploadImg] = useState('')
    useEffect(() => {
        fetchAboutDetails();
    }, []);

    const fetchAboutDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("license-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            //console.log(data, '123')
            if (response.data.status == 200) {
                setLicenseNo(data?.license_no);
                setLicenseExpiryDate(data?.license_expiry_date);
                setSelectedUploadFile(data?.license_image);
                setUploadUrl(data?.license_image)
                setLicenseNoTwo(data?.license_no_two);
                setLicenseExpiryDateTwo(data?.license_expiry_date_two);
                setSelectedUploadFileTwo(data?.license_image_two);
                setUploadUrlTwo(data?.license_image_two)
                setLicenseNoThree(data?.license_no_three);
                setLicenseExpiryDateThree(data?.license_expiry_date_three);
                setSelectedUploadFileThree(data?.license_image_three);
                setUploadUrlThree(data?.license_image_three)
                setLicenseNoFour(data?.license_no_four);
                setLicenseExpiryDateFour(data?.license_expiry_date_four);
                setSelectedUploadFileFour(data?.license_image_four);
                setUploadUrlFour(data?.license_image_four)

            }
            // setDocument(data)
            setIsLoading(false);
            if(response.data.status === 401){ 
                history.push('/');
                localStorage.clear();
            }
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);
        }
    };

    const handleUploadFile = (event, setSelectedFile, setUrl) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setUrl(url);
    };
    // const handleUploadFile = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedUploadFile(file);
    //     const url = URL.createObjectURL(file);
    //     setUploadUrl(url);
    // };
    // const handleUploadFileTwo = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedUploadFileTwo(file);
    //     const url = URL.createObjectURL(file);
    //     setUploadUrlTwo(url);
    // };

    // const handleUploadFileThree = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedUploadFileThree(file);
    //     const url = URL.createObjectURL(file);
    //     setUploadUrlThree(url);
    // };
    // const handleUploadFileFour = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedUploadFileFour(file);
    //     const url = URL.createObjectURL(file);
    //     setUploadUrlFour(url);
    // };

    const documentDetails = async () => {
        let data = new FormData();
        setIsLoading(true);
        // data.append('license_name', selectedLicenseName)
        data.append('license_no', licenseNo)
        data.append('license_image', selectedUploadFile)
        data.append('license_expiry_date', licenseExpiryDate ? format(licenseExpiryDate, 'yyyy-MM-dd') : '')
        data.append('license_no_two', licenseNoTwo)
        data.append('license_expiry_date_two', licenseExpiryDateTwo ? format(licenseExpiryDateTwo, 'yyyy-MM-dd') : '')
        data.append('license_image_two', selectedUploadFileTwo)
        data.append('license_no_three', licenseNoThree)
        data.append('license_expiry_date_three', licenseExpiryDateThree ? format(licenseExpiryDateThree, 'yyyy-MM-dd') : '')
        data.append('license_image_three', selectedUploadFileThree)
        data.append('license_no_four', licenseNoFour)
        data.append('license_expiry_date_four', licenseExpiryDateFour ? format(licenseExpiryDateFour, 'yyyy-MM-dd') : '')
        data.append('license_no_four', licenseNoFour)
        data.append('license_image_four', selectedUploadFileFour)
        try {
            await axios.post("license-store", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                toast.success(response.data.message)
                fetchAboutDetails();
                setErrors({})
                if(response.data.status === 401){ 
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
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
                <div>
                    <Box sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-5 ml-4" style={{ width: "100%" }}>
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-2xl flex items-center  font-semibold  p-2 mb-6" style={{ color: "rgb(4, 76, 157)", marginTop: "25px" }}>Documents
                                        <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                    </h1>
                                </div>

                            </div>

                            <div className="flex flex-wrap justify-around">
                                <div className="w-2/5 flex-col justify-evenly align-center">
                                    <div>
                                        <span className="primary text-lg font-bold">Drug License No.20</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5">
                                        <span>
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    required
                                                    id="outlined-number"
                                                    style={{ width: '189px' }}
                                                    size="small"
                                                    type="number"
                                                    value={licenseNo}
                                                    onChange={(e) => setLicenseNo(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDate}
                                                    onChange={(newDate) => setLicenseExpiryDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </span>
                                        <div className="flex items-center justify-center w-44">
                                            <label htmlFor="upload-photo-file-one" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-one"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFile, setUploadUrl)}
                                                />
                                                {selectedUploadFile == null ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <p className="text-sm text-gray-500">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrl} alt="Uploaded Image 1" className="w-44 h-28 border-dashed rounded-lg" />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-2/5 flex-col justify-evenly align-center">
                                    <div>
                                        <span className="primary text-lg font-bold">Drug License No.21</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5">
                                        <span>
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    required
                                                    id="outlined-number-two"
                                                    style={{ width: '189px' }}
                                                    size="small"
                                                    type="number"
                                                    value={licenseNoTwo}
                                                    onChange={(e) => setLicenseNoTwo(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDateTwo}
                                                    onChange={(newDate) => setLicenseExpiryDateTwo(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </span>
                                        <div className="flex items-center justify-center w-44">
                                            <label htmlFor="upload-photo-file-two" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-two"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFileTwo, setUploadUrlTwo)}
                                                />
                                                {selectedUploadFileTwo == null ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <p className="text-sm text-gray-500">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrlTwo} alt="Uploaded Image 2" className="w-44 h-28 border-dashed rounded-lg" />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-around flex-wrap">
                                <div className="w-2/5 flex-col justify-evenly align-center">
                                    <div>
                                        <span className="primary text-lg font-bold">FSSAI No. (Optional)</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5">
                                        <span>
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    required
                                                    id="outlined-number-three"
                                                    style={{ width: '189px' }}
                                                    size="small"
                                                    type="number"
                                                    value={licenseNoThree}
                                                    onChange={(e) => setLicenseNoThree(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDateThree}
                                                    onChange={(newDate) => setLicenseExpiryDateThree(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </span>
                                        <div className="flex items-center justify-center w-44">
                                            <label htmlFor="upload-photo-file-three" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-three"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFileThree, setUploadUrlThree)}
                                                />
                                                {selectedUploadFileThree == null ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <p className="text-sm text-gray-500">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrlThree} alt="Uploaded Image 3" className="w-44 h-28 border-dashed rounded-lg" />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-2/5 flex-col justify-evenly align-center">
                                    <div>
                                        <span className="primary text-lg font-bold">GSTN (Optional)</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5">
                                        <span>
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    required
                                                    id="outlined-number-four"
                                                    style={{ width: '189px' }}
                                                    size="small"
                                                    type="number"
                                                    value={licenseNoFour}
                                                    onChange={(e) => setLicenseNoFour(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDateFour}
                                                    onChange={(newDate) => setLicenseExpiryDateFour(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}

                                                />
                                            </div>
                                        </span>
                                        <div className="flex items-center justify-center w-44">
                                            <label htmlFor="upload-photo-file-four" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-four"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFileFour, setUploadUrlFour)}
                                                />
                                                {selectedUploadFileFour == null ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <p className="text-sm text-gray-500">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrlFour} alt="Uploaded Image 4" className="w-44 h-28 border-dashed rounded-lg" />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <div className="self-end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ textTransform: 'none' }}
                                        onClick={documentDetails}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </div>


                        </div>
                    </Box>

                </div>
            }
        </>
    )
}
export default Documents