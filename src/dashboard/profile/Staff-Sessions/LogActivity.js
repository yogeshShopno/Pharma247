import { useEffect, useState } from "react";
import Loader from "../../../componets/loader/Loader"
import Header from "../../Header"
import ProfileView from "../ProfileView";

  import { Box, TablePagination ,  TableContainer,Paper} from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import { Button } from "flowbite-react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const LogActivity = () => {
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [logAllData, setLogAllData] = useState([])
    const token = localStorage.getItem("token");
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [page, setPage] = useState(0);
    const logactivityColumn = [
        // { id: 'UserID', label: 'UserID', minWidth: 100 },
        { id: 'user_name', label: 'UserName', minWidth: 100 },
        { id: 'message', label: 'Meassage', minWidth: 100 },
        { id: 'date_time', label: 'Date/Time', minWidth: 100 },
    ];

    useEffect(() => {
        listOfRolePermission();
    }, []);

    const listOfRolePermission = () => {
        setIsLoading(true)
        const params = {
            page: page + 1,
            limit: rowsPerPage,
        }
        axios.post("logs-activity?", {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLoading(false)
                //console.log("API Response: ", response.data.data);
                setLogAllData(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <Box sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-8 w-full">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl flex items-center primary font-semibold  p-2 mb-5" style={{ marginBottom: "25px" }} >Log Activity
                                        <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                    </h1>
                                </div>
                            </div>
                            <TableContainer component={Paper} style={{ width: "100%", paddingInline: "25px", paddingBlock: "15px" }}>

                            <table className="table-cashManage p-4">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        {logactivityColumn.map((column) => (
                                            <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                {column.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logAllData?.map((item, index) => (
                                        <tr key={index} >
                                            <td>  {index + 1}</td>
                                            {logactivityColumn.map((column) => (
                                                <>
                                                    <td key={column.id}
                                                    // style={{
                                                    //     color: (item.status === 'Active' ? 'green' : 'red')
                                                    // }}
                                                    >
                                                        {/* {item.status == 1 ? item.status = 'Active' : item.status == 0 ? item.status = 'Disactive ' :  */}
                                                        {item[column.id]}
                                                        {/* // } */}
                                                    </td>

                                                </>
                                            ))}

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 12]}
                                component="div"
                                count={logAllData?.[0]?.count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
            </TableContainer>

                            
                           
                        </div>
                    </Box>
                </div>
            }
        </>
    )
}
export default LogActivity