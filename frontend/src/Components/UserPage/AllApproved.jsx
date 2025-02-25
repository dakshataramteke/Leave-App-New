import { useState, useEffect } from "react";
import DownNavbar from "./DownNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ImageNotFound from "../../assets/DataNotFound.png";
import "./User.css";

const DateFilterPopup = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClose,
  resetDates,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-5 md:mx-0">
        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
        <div className="flex flex-col space-y-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="border border-gray-300 rounded-lg p-2 focus:border-2 focus:border-blue-500 focus:outline-none"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="border border-gray-300 rounded-lg p-2 focus:border-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onClose(); // Close the popup
              resetDates(); // Reset the dates
            }}
          >
            Apply
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AllApproved = ({ approvedLeaves }) => {
  const [searchName, setSearchName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [error, setError] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

 // Filter leaves based on search name and date range
const filteredLeaves = leaves.filter((leave) => {
  const isNameMatch = leave.name && leave.name.toLowerCase().includes(searchName.toLowerCase());
  const isDateMatch =
    (!startDate || new Date(leave.sdate) >= startDate) &&
    (!endDate || new Date(leave.edate) <= endDate);
  return isNameMatch && isDateMatch;
});

  useEffect(() => {
    const storedApprovedLeaves = JSON.parse(localStorage.getItem('approvedLeaves')) || [];
    setLeaves(storedApprovedLeaves);
    setLoading(false); // Set loading to false after fetching data
  }, []);

  const handleCardClick = (leave) => {
    console.log("Leave clicked:", leave);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-2 bg-sky-300 min-h-screen approved_leaves">
      <div className="lg:col-span-4 bg-sky-300 p-2 overflow-hidden rounded-lg">
        <div className="flex flex-wrap md:justify-end items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 bg-white text-black focus:outline-none"
          />
          <button
            className="border border-gray-300 p-2 rounded-lg flex items-center gap-2 bg-white text-black font-normal focus:border-2 focus:border-blue-500 focus:outline-none"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <span>Filters</span>
            <FilterAltIcon className="w-5 h-5" />
          </button>
        </div>

        {showDatePicker && (
          <DateFilterPopup
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onClose={() => setShowDatePicker(false)}
            resetDates={resetDates}
          />
        )}

        {filteredLeaves.length === 0 ? (
          <div className="flex justify-center items-start">
            <img
              src={ImageNotFound}
              alt="No Data Found"
              className="img_notfound"
            />
          </div>
        ) : (
          <div className="flex flex-wrap justify-start gap-4 mb-14">
            {filteredLeaves.map((leave, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer w-full sm:w-[48%] lg:w-[24%]"
                style={{
                  borderRadius: "0.5rem",
                  borderLeft: `4px solid ${
                    leave.status === "Approved"
                      ? "green"
                      : leave.status === "Rejected"
                      ? "red"
                      : "blue"
                  }`,
                }}
                onClick={() => handleCardClick(leave)}
              >
                <div className="flex items-center justify-between rounded-full">
                  <h3 className="font-semibold text-lg text-gray-800">Leave</h3>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : leave.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Days:</span>{" "}
                  {leave.total_day}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Start Time:</span>{" "}
                  {leave.sdate}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">End Time:</span> {leave.edate}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Comments:</span>{" "}
                  {leave.comments || ""}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                      {leave.name.split(" ")[0][0]}
                      {leave.name.split(" ")[1] ? leave.name.split(" ")[1][0] : ""}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      <p>{leave.name}</p>
                      <p className="text-xs text-gray-400">
                        Initiated: {leave.submitted_at || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <DownNavbar />
    </div>
  );
};

export default AllApproved;