import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Loader from "../../../componets/loader/Loader";
import { ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import { Select, MenuItem, TextField, Button } from "@mui/material";

const SehatPoints = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        planId: "",
        paymentMethod: "",
        email: "",
        contacts: []
    });
    const [errors, setErrors] = useState({
        contacts: []
    });


    // Constants
    const planList = [
        { id: 1, plan_name: "Sehat Sathi", price: 199, customer_limit: 2 },
        { id: 2, plan_name: "Sehat Plus", price: 399, customer_limit: 3 },
        { id: 3, plan_name: "Premium Plan", price: 599, customer_limit: 6 }
    ];

    const relations = [
        { id: 1, relation: "Self" },
        { id: 2, relation: "Brother" },
        { id: 3, relation: "Sister" },
        { id: 4, relation: "Father" },
        { id: 5, relation: "Mother" },
        { id: 6, relation: "Grand Father" },
        { id: 7, relation: "Grand Mother" },
        { id: 8, relation: "Son" },
        { id: 9, relation: "Daughter" },
    ];

    const paymentTypes = [
        { id: 1, type: "Cash" },
        { id: 2, type: "Credit" },
        { id: 3, type: "UPI" },
    ];



    const selectedPlanData = planList.find(plan => plan.id === formData.planId);

    // Initialize contacts when plan is selected (only run once when plan changes from empty)
    useEffect(() => {
        if (selectedPlanData && formData.contacts.length === 0) {
            setFormData(prev => ({
                ...prev,
                contacts: Array.from(
                    { length: selectedPlanData.customer_limit },
                    () => ({ name: "", mobile: "", relation: "" })
                )
            }));
        } else if (selectedPlanData && formData.contacts.length !== selectedPlanData.customer_limit) {
            // Adjust array size if plan changes, preserving existing data
            const currentContacts = [...formData.contacts];
            const newLength = selectedPlanData.customer_limit;

            if (newLength > currentContacts.length) {
                // Add empty contacts if new plan has more slots
                const additionalContacts = Array.from(
                    { length: newLength - currentContacts.length },
                    () => ({ name: "", mobile: "", relation: "" })
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

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...formData.contacts];
        updatedContacts[index][field] = value;
        setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    };
    const validateForm = () => {
        let isValid = true;
        const contactErrors = [];

        formData.contacts.forEach((contact, index) => {
            const err = {};

            if (!contact.name.trim()) {
                err.name = "Name is required";
                isValid = false;
            }

            if (!contact.relation) {
                err.relation = "Relation is required";
                isValid = false;
            }

            if (!contact.mobile) {
                err.mobile = "Mobile number is required";
                isValid = false;
            } else if (contact.mobile.length !== 10) {
                err.mobile = "Mobile number must be 10 digits";
                isValid = false;
            }

            contactErrors[index] = err;
        });

        setErrors({ contacts: contactErrors });
        return isValid;
    };


    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const submissionData = {
            planId: formData.planId,
            planName: selectedPlanData?.plan_name,
            price: selectedPlanData?.price,
            paymentMethod: formData.paymentMethod,
            email: formData.email,
            contacts: formData.contacts,
            totalContacts: formData.contacts.length
        };

        console.log("=== SEHAT POINTS SUBMISSION ===");
        console.log("Form Data:", submissionData);
        console.log("================================");
    };


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
                        {/* Header */}
                        <div className="mb-4 lyl_main_header_txt" style={{ display: "flex", gap: "4px" }}>
                            <span className="primary" style={{ fontWeight: 700, fontSize: "20px" }}>
                                Membership Plan
                            </span>
                            <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
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
                                    <label className="label">Select Plan *</label>
                                    <Select
                                        size="small"
                                        value={formData.planId}
                                        onChange={(e) => handleChange("planId", e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Plan</MenuItem>
                                        {planList.map(plan => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.plan_name} ₹{plan.price}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">Payment Method *</label>
                                    <Select
                                        size="small"
                                        value={formData.paymentMethod}
                                        onChange={(e) => handleChange("paymentMethod", e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                        {paymentTypes.map(item => (
                                            <MenuItem key={item.id} value={item.type}>
                                                {item.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">Email *</label>
                                    <TextField
                                        size="small"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Dynamic Contact Forms */}
                            {selectedPlanData && formData.contacts.map((contact, index) => (
                                <React.Fragment key={index}>
                                    <h3 className="font-semibold text-[16px]">
                                        Contact {index + 1}
                                    </h3>

                                    <div
                                        className="flex justify-between gap-5 mb-6 border p-4 rounded-md"
                                        style={{ borderColor: "var(--color2)" }}
                                    >
                                        <div className="flex flex-col w-full">
                                            <label className="label">Contact Name *</label>
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
                                            <label className="label">Mobile No *</label>
                                            <TextField
                                                size="small"
                                                type="tel"
                                                value={contact.mobile}
                                                error={!!errors.contacts?.[index]?.mobile}
                                                helperText={errors.contacts?.[index]?.mobile}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    if (value.length <= 10) {
                                                        handleContactChange(index, "mobile", value);
                                                    }
                                                }}
                                                inputProps={{
                                                    maxLength: 10,
                                                    pattern: "[0-9]*"
                                                }}
                                            />

                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="label">Relation *</label>
                                            <Select
                                                size="small"
                                                value={contact.relation}
                                                error={!!errors.contacts?.[index]?.relation}

                                                onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Relation</MenuItem>
                                                {relations.map(item => (
                                                    <MenuItem key={item.id} value={item.relation}>
                                                        {item.relation}
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
                </div>
            )}
        </div>
    );
};

export default SehatPoints;