import Header from "../../Header"
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    Divider,
} from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BsLightbulbFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import usePermissions, { hasPermission } from "../../../componets/permission";

const ReportsMain = () => {
    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const history = useHistory()
    const permissions = usePermissions();

    const GstIcon = process.env.PUBLIC_URL + '/gstIcon.png';
    const MarginIcon = process.env.PUBLIC_URL + '/marginIcon.png';
    const StockIcon = process.env.PUBLIC_URL + '/stockIcon.png';
    const OtherIcon = process.env.PUBLIC_URL + '/othersIcon.png';
    const ENtelligentIcon = process.env.PUBLIC_URL + '/entelligentIcon.png';
    const AccouaccountingIcon = process.env.PUBLIC_URL + '/accountingIcon.png';

    const [favorites, setFavorites] = useState([]);

    const gstReports = [
        // { name: 'Purchase Register', path: '/Reports/gst-purchase-register', icon: GstIcon },
        { name: 'Purchase Bills', path: '/Reports/gst-purchase-bills', icon: GstIcon },
        // { name: 'Sales Register', path: '/Reports/gst-sales-register', icon: GstIcon },
        { name: 'Sales Bill', path: '/Reports/gst-sales-bills', icon: GstIcon },
        { name: 'Day wise Summary', path: '/Reports/day-wise-summary', icon: GstIcon },
        { name: 'GSTR-1', path: '/Reports/gst-GSTR1', icon: GstIcon },
        { name: 'GSTR-2', path: '/Reports/gst-GSTR2', icon: GstIcon },
        { name: 'GSTR-3B', path: '/Reports/gst-GSTR-3B', icon: GstIcon },

        { name: 'HSN wise GST', path: '/Reports/gst-hsn-wise', icon: GstIcon },
        // { name: 'Composition GST Report', path: '/Report/margin-report/item-wise', icon: GstIcon },
    ];
    const stockReports = [
        { name: 'Purchase Return Report', path: '/Reports/stock-purchase-return-report', icon: StockIcon },
        { name: 'Non-Moving Items', path: '/Reports/stock-non-moving', icon: StockIcon },
        { name: 'Item-Batch wise Stock', path: '/Reports/stock-item-batchwise', icon: StockIcon },
        { name: 'Stock Adjustment', path: '/Reports/stock-stock-adjustment', icon: StockIcon },
        { name: 'Inventory Reconciliation', path: '/Reports/stock-inventory-reconciliation', icon: StockIcon },
    ]

    const othersReports = [
        { name: 'Doctor - Item Summary', path: '/Reports/others-item-doctor-wise', icon: OtherIcon },
        { name: 'Company Items Analysis', path: '/Reports/others-company-items-analysis', icon: OtherIcon },
        { name: 'Staff Wise Activity Summary', path: '/Reports/others-staff-wise-activity-summary', icon: OtherIcon },
        { name: 'Sales Summary Report', path: '/Reports/others-sales-summary-report', icon: OtherIcon },
    ]

    const eNtelligentReports = [
        { name: 'Monthly Sales Overview', path: '/Reports/monthly-sales-overview', icon: ENtelligentIcon },
        { name: 'Top Selling Items', path: '/Reports/top-selling-items', icon: ENtelligentIcon },
        { name: 'Top Customers', path: '/Reports/top-customers', icon: ENtelligentIcon },
        { name: 'Top Distributors', path: '/Reports/top-distributors', icon: ENtelligentIcon },

    ]

    const accountingReport = [
        { name: 'Purchase Payment Summary', path: '/Reports/account-purchase-payment-summary', icon: AccouaccountingIcon },
    ]

    const marginReports = [
        { name: 'Item wise Margin', path: '/Report/margin-report/item-wise', icon: MarginIcon },
        { name: 'Bill-Item wise Margin', path: '/Report/margin-report/bill-item-wise-margin', icon: MarginIcon },
    ];

    const combinedReports = [...gstReports, ...marginReports, ...accountingReport, ...stockReports, ...eNtelligentReports, ...othersReports];

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Function to update both state and local storage
    const updateFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const toggleFavorite = (report) => {
        const newFavorites = favorites.includes(report.name)
            ? favorites.filter((item) => item !== report.name)
            : [...favorites, report.name];
        updateFavorites(newFavorites);
    };

    return (
        <div>
            <Header />
            <Box className='flex flex-wrap'>
                <Box
                    className="custom-scroll"
                    sx={{
                        width: {
                            xs: '100%',
                            sm: 450,
                        },
                        height: {
                            xs: 'calc(100vh - 100px)',
                            sm: 800,
                        },
                        overflowY: 'auto',
                        padding: {
                            xs: '10px',
                            sm: '15px',
                        },
                    }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                >
                    <Box>
                        <h1 className="text-2xl flex items-center justify-start font-semibold p-2 mb-4 primary" >Reports
                            <BsLightbulbFill className="ml-4 secondary hover-yellow" />
                        </h1>
                    </Box>
                    {hasPermission(permissions, "report accounting") &&
                        <Accordion sx={{ paddingX: '15px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ my: 0, fontSize: "20px", fontWeight: "500", position: "relative", paddingLeft: "50px" }} >
                                    <img src={AccouaccountingIcon} className="reportMain-icon absolute mr-10" alt="Accounting Icon"></img>
                                    Accounting Reports
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    {accountingReport.map(report => (
                                        <ul className="hover-report" key={report.name}>
                                            <li onClick={() => history.push(report.path)} className="font-semibold p-2 cursor-pointer flex justify-between">
                                                <div >
                                                    {report.name}
                                                </div>
                                                <span className="heart-icon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(report);
                                                }}>
                                                    {favorites.includes(report.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </span>
                                            </li>
                                        </ul>
                                    ))}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    }

                    {hasPermission(permissions, "report stock") &&
                        <Accordion sx={{ paddingX: '15px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ my: 0, fontSize: "20px", fontWeight: "500", position: "relative", paddingLeft: "50px" }} >
                                    <img src={StockIcon} className="reportMain-icon absolute mr-10" alt="Stock Icon"></img>
                                    Stock Reports
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    {stockReports.map(report => (
                                        <ul className="hover-report" key={report.name}>
                                            <li onClick={() => history.push(report.path)} className="font-semibold p-2 cursor-pointer flex justify-between">
                                                <div>
                                                    {report.name}
                                                </div>
                                                <span className="heart-icon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(report);
                                                }}>
                                                    {favorites.includes(report.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </span>
                                            </li>
                                        </ul>
                                    ))}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    }

                    {hasPermission(permissions, "report margin") &&
                        <Accordion sx={{ paddingX: '15px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ my: 0, fontSize: "20px", fontWeight: "500", position: "relative", paddingLeft: "50px" }} >
                                    <img src={MarginIcon} className="reportMain-icon absolute mr-10" alt="Margin Icon"></img>
                                    Margin Reports
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    {marginReports.map(report => (
                                        <ul className="hover-report" key={report.name}>
                                            <li onClick={() => history.push(report.path)} className="font-semibold p-2 cursor-pointer flex justify-between">
                                                <div >
                                                    {report.name}
                                                </div>
                                                <span className="heart-icon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(report);
                                                }}>
                                                    {favorites.includes(report.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </span>
                                            </li>
                                        </ul>
                                    ))}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    }

                    {hasPermission(permissions, "report gst") &&
                        <Accordion sx={{ paddingX: '15px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ my: 0, fontSize: "20px", fontWeight: "500", position: "relative", paddingLeft: "50px" }}>
                                    <img src={GstIcon} className="reportMain-icon absolute mr-10" alt="GST Icon" />
                                    <span className="right-0">GST Reports</span>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    <div>
                                        {gstReports.map(report => (
                                            <ul className="hover-report" key={report}>
                                                <li onClick={() => history.push(report.path)} className="font-semibold p-2 cursor-pointer flex justify-between">
                                                    <div >
                                                        {report.name}
                                                    </div>
                                                    <span className="heart-icon" onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(report);
                                                    }}>
                                                        {favorites.includes(report.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                    </span>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    }

                    {hasPermission(permissions, "report entelligent") &&
                        <Accordion sx={{ paddingX: '15px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ my: 0, fontSize: "20px",textTransform: 'none', fontWeight: "500", position: "relative", paddingLeft: "50px" }} >
                                    <img src={ENtelligentIcon} className="reportMain-icon absolute mr-10" alt="eNtelligent Icon"></img>
                                    eNtelligent Reports
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    {eNtelligentReports.map(report => (
                                        <ul className="hover-report" key={report.name}>
                                            <li onClick={() => history.push(report.path)} className="font-semibold p-2 cursor-pointer flex justify-between">
                                                <div >
                                                    {report.name}
                                                </div>
                                                <span className="heart-icon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(report);
                                                }}>
                                                    {favorites.includes(report.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </span>
                                            </li>
                                        </ul>
                                    ))}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    }

                    {hasPermission(permissions, "report others") &&
                        <Accordion sx={{ paddingX: '15px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ my: 0, fontSize: "20px", fontWeight: "500", position: "relative", paddingLeft: "50px" }} >
                                    <img src={OtherIcon} className="reportMain-icon absolute mr-10" alt="Other Icon"></img>
                                    Others
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    {othersReports.map(report => (
                                        <ul className="hover-report" key={report.name}>
                                            <li onClick={() => history.push(report.path)} className="font-semibold p-2 cursor-pointer flex justify-between">
                                                <div >
                                                    {report.name}
                                                </div>
                                                <span className="heart-icon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(report);
                                                }}>
                                                    {favorites.includes(report.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </span>
                                            </li>
                                        </ul>
                                    ))}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    }


                    <Divider />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <div className="p-6" style={{ width: "100%" }}>
                        {favorites.length > 0 ? (
                            <>
                                <h2 className="text-xl mb-8 font-semibold">Favourite Reports</h2>

                                <ul className="flex flex-wrap">
                                    {favorites.map((favorite) => {
                                        const report = combinedReports.find(r => r.name === favorite);
                                        return (
                                            <li key={favorite} className="font-semibold p-2">
                                                <div className="custom-box-report" onClick={() => history.push(report.path)}>
                                                    <img src={report?.icon} className="w-1/2 mt-6" alt="Report Icon" />
                                                    <span className="font-semibold text-sm">
                                                        {favorite}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>


                        ) : (
                            <>
                                <p className="text-7xl w-full tracking-wide font-bold  my-20" style={{ color: "rgba(17, 17, 17, .1)" }}>Favorite Reports & Save Time</p>
                                <p className="mt-4 text-xl tracking-wide"><FavoriteIcon className="mb-2 mr-2 text-red-500" />Mark reports as favorites to access them faster.</p>
                            </>
                        )}
                    </div>
                </Box>
            </Box>
        </div>
    );
};

export default ReportsMain;
