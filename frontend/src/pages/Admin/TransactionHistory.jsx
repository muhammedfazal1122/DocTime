import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { baseUrl } from "../../utils/constants/Constants";
import axios from "axios";
import avatar from "../../../public/assets/avatar/avatar_6.jpg";

import DocCrump from "../../Compounts/admin/elements/BreadCrumps/DocCrump";

function TransactionHistory() {
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionData, setTrasaction] = useState([])

  const TransactionFields = [
    "transaction_id",
    "payment_id",
    "amount",
    "doctor_id",
    "patient_id",
    "day",
    "start_time",
    "end_time",
    "status",
    // "created_at",
  ];

  const FieldInputTypes = {
    transaction_id: "number",
    payment_id: "text",
    amount: "number",
    doctor_id: "text",
    patient_id: "text",
    day: "date",
    start_time: "time",
    end_time: "time",
    status: "text",
    // created_at: "text",
  };

  // to fetch the data as per the search query
  const fetchTransactions = (url) => {
    const accessToken = localStorage.getItem("access");
    
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((req) => {
        setTrasaction(req.data.results);
        setNextPage(req.data.next);
        setPrevPage(req.data.previous);
        
        // setDoctorData(req.data)
      })
      .catch((err) => {
        
      });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchTransactions(baseUrl + `appointment/detail/transaction/list/?search=${query}`);
  };

  useEffect(() => {
    fetchTransactions(baseUrl + `appointment/detail/transaction/list/?search=${searchQuery}`);
  }, [ searchQuery]);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
       hour12: false // Use 24-hour format
    });
   };
   

  return (
    <>
      {/* ************************************************search bar*********************************************** */}

      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
          <DocCrump />
          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-black-100 sm:mb-0 dark:divide-black-700">
              <form className="lg:pr-3" action="#" method="GET">
                <label htmlFor="users-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    id="users-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search for users"
                  />
                </div>
              </form>
              <div className="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ****************************************************************table ***************************************************** */}
      <div className="flex flex-col">
  <div className="overflow-x-auto">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden shadow-lg rounded-md">
        <table className="min-w-full divide-y divide-black table-fixed dark:divide-black-600">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              {TransactionFields.map((field) => (
                <th
                  key={field}
                  scope="col"
                  className="p-4 text-sm font-semibold text-left uppercase tracking-wider"
                >
                  {field.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-black dark:bg-gray-800 dark:divide-black-700">
            {transactionData.map((item, index) => (
              <tr 
                key={item.transaction_id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {TransactionFields.map((field) => (
                  <td
                    key={field}
                    className={`p-4 ${
                      field === "status"
                        ? "text-base font-normal whitespace-nowrap dark:text-white"
                        : ""
                    }`}
                  >
                    {field === "day" || field === "start_time" || field === "end_time" ? formatDateTime(item[field]) : item[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination section */}
        <nav className="mt-4 flex justify-between">
          <button
            className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded ${
              !prevPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!prevPage}
            onClick={() => fetchTransactions(prevPage)}
          >
            Previous
          </button>
          <button
            className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded ${
              !nextPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!nextPage}
            onClick={() => fetchTransactions(nextPage)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</div>

    </>
  );
}

export default TransactionHistory;
