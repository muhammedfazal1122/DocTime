import React from 'react'

const PatientList = () => {

    
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);


  
  return (
    <div>
            <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all"
                          aria-describedby="checkbox-1"
                          type="checkbox"
                          className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="checkbox-all" className="sr-only">
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Doctor ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Speciality
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Phone number
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Status
                      <br />
                      (Active / Deactive)
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Aprroval status
                      <br />
                      (Approved / Pending / Rejected)
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {doctorData.map((item, index) => {
                    return (
                      <tr
                        key={item.doctor_user && item.doctor_user.custom_id ? item.doctor_user.custom_id : ""}
                        

                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input
                              id={index}
                              aria-describedby="checkbox-1"
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor={index} className="sr-only">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <td className="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
                          <img
                            className="w-10 h-10 rounded-full"
                            src={
                              item.profile_picture
                                ? item.profile_picture
                                : avatar
                            }
                            alt="{{first_name  }} avatar"
                          />
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {item.first_name + " " + item.last_name}
                            </div>
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {item.email}
                            </div>
                          </div>
                        </td>
                        <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        {item.doctor_user && item.doctor_user.custom_id ? item.doctor_user.custom_id : ""}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {item.doctor_user && item.doctor_user.specializations ? item.doctor_user.specializations : ""}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.phone_number}
                        </td>
                        <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.is_active}
                                className="sr-only peer"
                                onChange={() =>
                                  handleCheckboxChange(
                                    item.doctor_user.custom_id,
                                    item.is_active
                                  )
                                }
                              />
                              <div
                                className={`peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-500 w-8 h-8 shadow-md ${
                                  item.is_active
                                    ? "peer-checked:bg-emerald-500"
                                    : ""
                                } peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-6 after:w-6 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center ${
                                  item.is_active
                                    ? 'peer-checked:after:content-["✔️"]'
                                    : ""
                                } peer-hover:after:scale-75`}
                              ></div>
                            </label>
                          </div>
                        </td>

                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.approval_status}
                        </td>

                        <td className="p-4 space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              doctorEdit(item.doctor_user && item.doctor_user.custom_id ? item.doctor_user.custom_id : "")
                            }
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Edit user
                          </button>
                          <button
                            type="button"
                            onClick={() => doctorDelete(item.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
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
                            Delete user
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <nav>
                <ul className="pagination">
                  <li className={`page-item  ${!prevPage ? " disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchUsers(prevPage)}
                    >
                      Previous{" "}
                    </button>
                  </li>

                  <li  
                    className={`page-item  ${
                      !nextPage ? "disabled btn-primary" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => fetchUsers(nextPage)}
                    >
                      Next{" "}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientList