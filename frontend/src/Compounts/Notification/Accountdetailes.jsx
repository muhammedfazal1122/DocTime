import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon } from "@heroicons/react/24/solid";
import {
 Card,
 CardHeader,
 Typography,
 CardBody,
 Tooltip,
 IconButton,
} from "@material-tailwind/react";
import { baseUrl } from '../../utils/constants/Constants';

const Accountdetailes = ({ }) => {
 const [Commissions, setCommissions] = useState([]);
 const doctorId = localStorage.getItem("custom_id");

 useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${baseUrl}appointment/api/transactions-doctor-account/${doctorId}/`);
        const transactionsWithCommissions = response.data.results.map(transaction => {
          const doctorCommission = transaction.amount * 0.8; // 80% of amount
          const adminCommission = transaction.amount * 0.2; // 20% of amount
          return {
            ...transaction,
            doctor_commission: doctorCommission,
            admin_commission: adminCommission,
          };
        });

        setCommissions(transactionsWithCommissions);

      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
 }, [doctorId]);


 const totalAmount = Commissions.reduce((total, transaction) => total + transaction.amount, 0);

 return (
    <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Doctor Transactions
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        These are details about the doctor's transactions
                    </Typography>
                </div>
            </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
            <table className="w-full min-w-max table-auto text-left">
            <thead>
                    <tr>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Transaction ID
                            </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Patient ID
                            </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Patient Payed Amount
                            </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Commission for Admin
                            </Typography>
                        </th>
                        
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Amount Received
                            </Typography>
                        </th>
                       
                    </tr>
                </thead>
                <tbody>
                    {Commissions.map((transaction, index) => {
                        const isLast = index === Commissions.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={transaction.transaction_id}>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold"
                                    >
                                        {transaction.transaction_id}
                                    </Typography>
                                </td>
                                <td className={classes}>       
                                    <Typography                
                                        variant="small"        
                                        color="blue-gray"      
                                        className="font-normal"
                                    >
                                        {transaction.patient_id}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                       ₹ {transaction.amount}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                      ₹  {transaction.admin_commission}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        ₹{transaction.doctor_commission}
                                    </Typography>
                                </td>
                                
                                
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" className="text-right font-bold">Total Amount:</td>
                        <td className="font-bold">₹{totalAmount.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </CardBody>
    </Card>
 );
};

export default Accountdetailes;
