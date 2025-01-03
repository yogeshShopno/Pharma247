import React, { useState, useEffect } from 'react';

const AddPurchaseReturn = () => {
    const [isCheckedCNBill, setIsCheckedCNBill] = useState([]);
    const [cnAmountController, setCnAmountController] = useState([]);
    const [purchaseReturnDataList, setPurchaseReturnDataList] = useState([]);
    const [data, setData] = useState([
        {
            id: 28,
            bill_no: '2',
            bill_date: '2024-09-02',
            count: 2,
            total_amount: '25.09',
            user_name: 'Sun Pharma',
            distributor_name: 'Finn Alen'
        },
        {
            id: 1,
            bill_no: '1',
            bill_date: '2024-08-29',
            count: 2,
            total_amount: '2195.2',
            user_name: 'Sun Pharma',
            distributor_name: 'Finn Alen'
        }
    ]);

    const handleCheckBoxChange = (index) => {
        const newIsCheckedCNBill = [...isCheckedCNBill];
        const newCnAmountController = [...cnAmountController];
        const currentData = data[index];

        newIsCheckedCNBill[index] = !newIsCheckedCNBill[index];

        if (newIsCheckedCNBill[index]) {
            newCnAmountController[index] = currentData.total_amount;
            setPurchaseReturnDataList((prevList) => {
                const updatedList = [
                    ...prevList,
                    {
                        purchesReturnBillId: currentData.id.toString(),
                        bill_no: currentData.bill_no,
                        amount: newCnAmountController[index],
                    },
                ];
                return updatedList;
            });
        } else {
            newCnAmountController[index] = '';
            setPurchaseReturnDataList((prevList) => {
                const updatedList = prevList.filter(
                    (item) => item.purchesReturnBillId !== currentData.id.toString()
                );
                return updatedList;
            });
        }

        setCnAmountController(newCnAmountController);
        setIsCheckedCNBill(newIsCheckedCNBill);
        updateTotalSum();
    };

    const handleAmountChange = (index, value) => {
        const newCnAmountController = [...cnAmountController];
        newCnAmountController[index] = value;
        setCnAmountController(newCnAmountController);

        if (isCheckedCNBill[index]) {
            setPurchaseReturnDataList((prevList) => {
                const updatedList = prevList.map((item) =>
                    item.purchesReturnBillId === data[index].id.toString()
                        ? { ...item, amount: value }
                        : item
                );
                return updatedList;
            });
        }

        updateTotalSum();
    };

    const updateTotalSum = () => {
        // Implement your logic to update the total sum here
    };

    useEffect(() => {
        // This useEffect will trigger every time purchaseReturnDataList changes
    }, [purchaseReturnDataList]);

    return (
        <div>
            {data?.map((item, index) => (
                <div key={item.id}>
                    <input
                        type="checkbox"
                        checked={isCheckedCNBill[index] || false}
                        onChange={() => handleCheckBoxChange(index)}
                    />
                    <input
                        type="text"
                        value={cnAmountController[index] || ''}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                    />
                </div>
            ))}

            <h3>Selected Purchases:</h3>
            <ul>
                {purchaseReturnDataList.map((item, index) => (
                    <li key={index}>
                        Bill No: {item.bill_no}, Amount: {item.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddPurchaseReturn;
