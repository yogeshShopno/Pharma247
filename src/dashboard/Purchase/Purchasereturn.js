import React, { useEffect, useState } from 'react';
import Header from '../Header'
import { Formik, Field, Form } from 'formik';
import { IoSearch } from "react-icons/io5";
import { AiOutlineCaretUp } from 'react-icons/ai';
import axios from 'axios';
import Model_return from '../model/purchase/Model_return';
const Purchasereturn = () => {
    const [itemsearch, setItemsearch] = useState([]);
    const [item, setItem] = useState([])
    const [searchInput, setSearchInput] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [displayDistributors, setDisplayDistributors] = useState(true);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [displayItem, setDisplayItem] = useState(true);

    function toggleModal() {
        document.getElementById('modal').classList.toggle('hidden')
    }

    const handleSearchDistributor = (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
        ListDistributor()
    };


    const handleDistributorClick = (name) => {
        setSearchInput(name);
        setDisplayDistributors(false);
        setSelectedDistributor(searchInput);
    };


    const handleItem = (e) => {
        setItemsearch(e.target.value)
        ListItem()
    }

    const ListDistributor = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`list-distributer?search=${searchInput}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
            );
            //console.log("response===>", response.data.data);
            setDistributors(response.data.data);
        } catch (error) {
            //console.log("Error:", error);
        }
    };

    const ListItem = async () => {
        const token = localStorage.getItem('token');
        try {
            if (!itemsearch.trim()) {
                setItem([]);
                return;
            }

            const response = await axios.post(`item-search?search=${itemsearch}`, null, {
                headers: {
                    Authorization: `Bearer  ${token}`,
                    "Content-Type": "application/json",
                },
            }
            );
            const { data } = response.data.data;

            if (Array.isArray(data)) {
                const extractedItems = data.map((item) => ({
                    id: item.id,
                    itemName: item.iteam_name,

                }));

                setItem(extractedItems);
            }
        } catch (error) {
            //console.log("Error:", error);
        }
    }

    return (
        <div>
            <Header />
            <Formik
                initialValues={{
                    distributor_id: ""
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                }}
            >
                <Form>
                    <Model_return />
                    <div className='p-8 rounded-md md:p-12 lg:px-16 h-auto'>
                        <h1 className="text-2xl font-bold mb-12" >Purchase Return</h1>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-1 md:grid-cols-2 ">
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="distributor_id">
                                    Distributor Name
                                </label>
                                <div class="relative w-full">
                                    <div>

                                        <Field
                                            className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                            name='distributor_id'
                                            type="search"
                                            value={searchInput}
                                            onChange={handleSearchDistributor}
                                            onFocus={(e) => {
                                                e.target.placeholder = '';
                                                setDisplayDistributors(true);
                                            }}
                                            disabled={selectedDistributor !== null}
                                        />
                                    </div>
                                    <div>

                                        <ul style={{ display: displayDistributors ? 'block' : 'none' }}>
                                            {distributors.slice(0, 5).map((distributor) => (
                                                <li key={distributor.id}>
                                                    <div className='max-h-36'>
                                                        <p className='bg-white text-black border-b  shadow-md  border-black hover:bg-blue-900 text-blue-900 font-normal hover:text-white w-full h-full p-4 font-s font-semibold' onClick={() => handleDistributorClick(distributor.name)} >
                                                            <span >
                                                                {distributor.name} {distributor.phone_number}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div class="absolute top-0 end-0 h-full p-3 px-4 text-sm font-medium text-white bg-blue-900 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                                        <span > <IoSearch /></span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="bill_date"
                                >
                                    Bill Date
                                </label>
                                <div class="relative w-full">
                                    <Field
                                        className="appearance-none border rounded-lg w-1/2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                        name='bill_date'
                                        type="date"
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-3">
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="date"
                                >
                                    Select Date
                                </label>
                                <div class="relative w-full">
                                    <Field
                                        className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                        name='selectDate'
                                        type="date"
                                    />
                                </div>

                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="remarks"
                                >
                                    Remarks
                                </label>
                                <div class="relative w-full">
                                    <Field
                                        className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                        name='remarks'
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center my-10">
                            <button type="submit" className="py-2 min-w-16 px-5 h-10 bg-blue-500 text-white rounded-lg bg-blue-900 ml-2"> Add</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className='relative flex items-center border-b border-black mb-6 bg-blue-100 '>
                            <label className="flex-none mr-2 cursor-pointer"><IoSearch className='text-black' /></label>
                            <Field
                                type="search"
                                name="iteam_name"
                                className="w-1/2 outline-0  bg-blue-200 text-black flex-grow bg-transparent placeholder-color"
                                onChange={handleItem}
                                onFocus={(e) => {
                                    e.target.placeholder = '';
                                    setDisplayItem(true);
                                }}
                                placeholder="search Item here...."
                            />
                        </div>
                        <div>
                            {itemsearch.length > 0 && <ul>
                                {item.map((item) => (
                                    <div key={item.id}>
                                        <p className='bg-white text-black border-b  shadow-md  border-black hover:bg-blue-900 text-blue-900 font-normal hover:text-white w-full h-full p-4 font-s font-semibold'>{item.itemName}</p>
                                    </div>
                                ))}
                            </ul>}
                        </div>
                        <table className="w-full text-center text-sm">
                            <thead className="bg-blue-100 text-black">
                                <tr>

                                    <th className="py-2">
                                        <label>
                                            Item Name
                                        </label>
                                    </th>
                                    <th className="px-4 py-2">Unit/Pack</th>
                                    <th className="px-4 py-2">Batch</th>
                                    <th className="px-4 py-2">Expiry</th>
                                    <th className="px-4 py-2">MRP</th>
                                    <th className="px-4 py-2">PTR</th>
                                    <th className="px-4 py-2">DISC.%</th>
                                    <th className="px-4 py-2">QTY</th>
                                    <th className="px-4 py-2">Free</th>
                                    <th className="px-4 py-2">Sch.Amt.</th>
                                    <th className="px-4 py-2">Taxable</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <span class="trash">
                                        <span></span>
                                        <i></i>
                                    </span>
                                    <td className="border px-4 py-2">Dolofresh Sp Tab</td>
                                    <td className="border px-4 py-2">10/1-10</td>
                                    <td className="border px-4 py-2">2343</td>
                                    <td className="border px-4 py-2">12/23</td>
                                    <td className="border px-4 py-2">Rs.44.00</td>
                                    <td className="border px-4 py-2">16.00</td>
                                    <td className="border px-4 py-2">17.92 (59.27)</td>
                                    <td className="border px-4 py-2">1</td>
                                    <td className="border px-4 py-2">0</td>
                                    <td className="border px-4 py-2">10</td>
                                    <td className="border px-4 py-2">17.92</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='bg-red-500 p-2  fixed bottom-0 left-0 right-0 w-full max-w-screen-xxl items-center flex text-sm'>
                        <div className='flex ml-auto  pl-5 cursor-pointer align-middle bg-opacity-5 items-center' onClick={toggleModal}>
                            <div className='text-white flex mr-10'>
                                <p >0</p>
                                <span className='ml-2'>Qty.</span>
                            </div>
                            <div className='text-white flex mr-10'>
                                <p >0</p>
                                <span className='ml-2'>Items.</span>
                            </div>
                            <div className='text-white flex mr-10'>
                                <span className='ml-2'>Round Off:0.00</span>
                            </div>
                            <div className='text-white flex mr-10'>
                                <p >0</p>
                                <span className='ml-2'>GST.</span>
                            </div>
                            <div className='text-white flex mr-10 items-center'>
                                <p className='ml-1.5'>Net</p>
                                <span className='ml-10 text-2xl'>0</span>
                                <span>
                                    <AiOutlineCaretUp className='mt-2 ml-2' />
                                </span>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default Purchasereturn
