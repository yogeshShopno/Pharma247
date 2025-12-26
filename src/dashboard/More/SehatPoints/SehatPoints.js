import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import { Select, MenuItem, TextField, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, FormControl, DialogActions } from "@mui/material";
import axios from "axios";
import PlanDialog from "./Plandialog";

const SehatPoints = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(false);
    const [planList, setPlanList] = useState([])
    const [relations, setRelations] = useState([])
    const [showPlans, setShowPlans] = useState(false);
    const [formData, setFormData] = useState({
        planId: "",
        paymentMethod: "",
        email: "",
        contacts: []
    });

    const paymentTypes = [
        { id: 1, type: "Cash" },
        { id: 2, type: "Credit" },
        { id: 3, type: "UPI" },
    ];

    const [errors, setErrors] = useState({
        planId: "",
        paymentMethod: "",
        email: "",
        contacts: []
    });

    /*<======================================================================== Fetch data from API ====================================================================> */

    useEffect(() => {
        getPlanList()
        relationList()
    }, []);

    /*<======================================================================== fetch plan list ====================================================================> */

    const getPlanList = async () => {

        try {
            await axios.get("sehat-membership-plan-list?", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setPlanList(response.data.data);
                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
            if (error?.response?.status === 401) {
            }
        }
    };

    /*<======================================================================== fetch Relations list ====================================================================> */

    const relationList = async () => {
        try {
            await axios.get("patient-family-relation-list?", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setRelations(response.data.data);
                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
            if (error?.response?.status === 401) {
            }
        }
    };

    /*<======================================================================== Change plan ====================================================================> */

    const selectedPlanData = planList.find(plan => plan.id === formData.planId);

    // Initialize contacts when plan is selected (only run once when plan changes from empty)
    useEffect(() => {
        if (selectedPlanData && formData.contacts.length === 0) {
            setFormData(prev => ({
                ...prev,
                contacts: Array.from(
                    { length: selectedPlanData.user_covered },
                    () => ({ name: "", number: "", relation: "" })
                )
            }));
        } else if (selectedPlanData && formData.contacts.length !== selectedPlanData.user_covered) {
            // Adjust array size if plan changes, preserving existing data
            const currentContacts = [...formData.contacts];
            const newLength = selectedPlanData.user_covered;

            if (newLength > currentContacts.length) {
                // Add empty contacts if new plan has more slots
                const additionalContacts = Array.from(
                    { length: newLength - currentContacts.length },
                    () => ({ name: "", number: "", relation: "" })
                );
                setFormData(prev => ({
                    ...prev,
                    contacts: [...currentContacts, ...additionalContacts]
                }));
            } else {
                // Remove extra contacts if new plan has fewer slots
                setFormData(prev => ({
                    ...prev,
                    contacts: currentContacts.slice(0, newLength)
                }));
            }
        }
    }, [formData.planId]);

    // Handlers
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    /*<==================================================================== handle contact form =============================================================== => */

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...formData.contacts];
        updatedContacts[index][field] = value;
        setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    };

    /*<========================================================================== Validation ======================================================================> */
    const validateForm = () => {
        let isValid = true;

        const contactErrors = [];
        const newErrors = {
            planId: "",
            paymentMethod: "",
            email: "",
            contacts: []
        };

        // ---- Plan Validation ----
        if (!formData.planId) {
            newErrors.planId = "Plan is required";
            isValid = false;
        }

        // ---- Payment Method Validation ----
        if (!formData.paymentMethod) {
            newErrors.paymentMethod = "Payment method is required";
            isValid = false;
        }

        // ---- Email Validation ----
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Enter a valid email address";
                isValid = false;
            }
        }

        // ---- Contacts Validation ----
        formData.contacts.forEach((contact, index) => {
            const err = {};

            const hasAnyValue =
                contact.name.trim() ||
                contact.number.trim() ||
                contact.relation;
            if (index === 0) {
                if (!contact.name.trim()) {
                    err.name = "Name is required";
                    isValid = false;
                }

                if (!contact.relation) {
                    err.relation = "Relation is required";
                    isValid = false;
                }

                if (!contact.number) {
                    err.number = "Number number is required";
                    isValid = false;
                } else if (contact.number.length !== 10) {
                    err.number = "Number number must be 10 digits";
                    isValid = false;
                }
            }


            contactErrors[index] = err;
        });

        newErrors.contacts = contactErrors;
        setErrors(newErrors);

        return isValid;
    };

    /*<========================================================================= handle submit =====================================================================> */

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        const data = new FormData();
        data.append("plan_id", String(formData.planId));
        data.append("payment_method", formData.paymentMethod);
        data.append("email", formData.email);
        data.append("customers", JSON.stringify(formData.contacts));

        try {
            await axios.post("sehat-membership-plan-create", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    toast.success(response.data.message);
                    setFormData({
                        planId: "",
                        paymentMethod: "",
                        email: "",
                        contacts: []
                    });
                });
        } catch (error) {
            console.error("API error:", error);
            toast.error(error.response.data.message);

        }

    };

    {/*<====================================================================== UI =====================================================================> */ }

    return (
        <div>
            <Header />
            <ToastContainer position="top-right" autoClose={5000} />

            {isLoading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                <div style={{ minHeight: "calc(100vh - 64px)" }}>
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
                                    Membership plan
                                </span>
                                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
                            </div>
                            <div className="headerList">
                                <Button
                                    style={{
                                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                                        color: "white",
                                    }}
                                    className="add_lyl_btn"
                                    variant="contained"
                                    size="small"
                                    onClick={() => { setShowPlans(true) }}
                                >
                                    View Plans
                                </Button>
                            </div>
                        </div>

                        {/* Main Form Container */}
                        <div
                            className="bg-white rounded-lg mt-4 mb-5 p-4 item_inner_box"
                            style={{
                                border: "1px solid #628a2f73",
                                boxShadow: "rgb(184 202 161 / 7%) 11px 12px 20px"
                            }}
                        >
                            {/* Plan Selection Row */}
                            <div className="flex justify-between gap-5 my-5">
                                <div className="flex flex-col w-full">
                                    <label className="label">Select Plan <span className="text-red-600 ">*</span></label>
                                    <Select
                                        size="small"
                                        value={formData.planId}
                                        onChange={(e) => handleChange("planId", e.target.value)}
                                        error={!!errors.planId}

                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Plan <span className="text-red-600 ">*</span></MenuItem>
                                        {planList.map(plan => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.plan_name} ₹{plan.price}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.planId && (
                                        <span className="text-red-600 text-xs">{errors.planId}</span>
                                    )}


                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">Payment Method <span className="text-red-600 ">*</span></label>
                                    <Select
                                        size="small"
                                        value={formData.paymentMethod}
                                        onChange={(e) => handleChange("paymentMethod", e.target.value)}
                                        displayEmpty
                                        required
                                        error={!!errors.paymentMethod}


                                    >
                                        <MenuItem value="" disabled>Select Payment Method <span className="text-red-600 ">*</span></MenuItem>
                                        {paymentTypes.map(item => (
                                            <MenuItem key={item.id} value={item.type}>
                                                {item.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.paymentMethod && (
                                        <span className="text-red-600 text-xs">{errors.paymentMethod}</span>
                                    )}

                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">Email <span className="text-red-600 ">*</span></label>
                                    <TextField
                                        size="small"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />

                                </div>
                            </div>

                            {/* Dynamic Contact Forms */}
                            {selectedPlanData && formData.contacts.map((contact, index) => (
                                <React.Fragment key={index}>
                                    <h3 className="font-semibold text-[16px]">
                                        Contact {index + 1}
                                        {index === 0 && (
                                            <span className="text-red-600"> *</span>
                                        )}
                                    </h3>

                                    <div
                                        className="flex justify-between gap-5 mb-6 border p-4 rounded-md"
                                        style={{ borderColor: "var(--color2)" }}
                                    >
                                        <div className="flex flex-col w-full">
                                            <label className="label">Contact Name    {index === 0 && (
                                                <span className="text-red-600"> *</span>
                                            )}</label>
                                            <TextField
                                                size="small"
                                                type="text"
                                                value={contact.name}
                                                error={!!errors.contacts?.[index]?.name}
                                                helperText={errors.contacts?.[index]?.name}
                                                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                                            />

                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="label">Mobile No    {index === 0 && (
                                                <span className="text-red-600"> *</span>
                                            )}</label>
                                            <TextField
                                                size="small"
                                                type="tel"
                                                value={contact.number}
                                                error={!!errors.contacts?.[index]?.number}
                                                helperText={errors.contacts?.[index]?.number}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    if (value.length <= 10) {
                                                        handleContactChange(index, "number", value);
                                                    }
                                                }}
                                                inputProps={{
                                                    maxLength: 10,
                                                    pattern: "[0-9]*"
                                                }}
                                            />

                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="label">Relation    {index === 0 && (
                                                <span className="text-red-600"> *</span>
                                            )}</label>
                                            <Select
                                                size="small"
                                                value={contact.relation}
                                                error={!!errors.contacts?.[index]?.relation}

                                                onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Relation </MenuItem>
                                                {relations.map(item => (
                                                    <MenuItem key={item.id} value={item.name}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="self-end"
                            variant="contained"
                            sx={{ backgroundColor: "#3f6212" }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                    {showPlans && <PlanDialog showPlans={showPlans} setShowPlans={setShowPlans} plans={planList} />}
                 
                </div>

            )}
        </div>
    );
};

export default SehatPoints;