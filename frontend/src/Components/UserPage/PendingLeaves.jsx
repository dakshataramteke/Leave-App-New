import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DownNavbar from "./DownNavbar";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import { useMediaQuery } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "./User.css";

const DateFilterPopup = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClose,
}) => {
  const handleApply = () => {
    onClose(); // Call the onClose function to close the popup
    setStartDate(null); // Clear the start date
    setEndDate(null); // Clear the end date
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-5 md:mx-0">
        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>

        <div className="flex space-y-4">
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
            onClick={handleApply} // Use handleApply instead of onClose
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

const PendingLeaves = ({ setApprovedLeaves, setRejectedLeaves }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isInitialized, setIsInitialized] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDateFilterPopup, setShowDateFilterPopup] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [comments, setComments] = useState(""); // State for comments
  const [leaves, setLeaves] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:991px)");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/allpending");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setLeaves(result); // Set the fetched data to state
    } catch (error) {
      setError(error.message); 
      console.log("The Problem is :" + error.message);
    }
  };

  useEffect(() => {
    fetchData();
    if (leaves.length > 0 && !isInitialized) {
      setSelectedLeave(leaves[0]);
      setIsInitialized(true);
    }
  }, [leaves, isInitialized]);

  const handleCardClick = (leave) => {
    setSelectedLeave(leave);
    if (isSmallScreen) {
      setIsPopupOpen(true);
    }
  };

  const updateLeaveStatus = useCallback(
    async (status, comments) => {
      if (selectedLeave) {
        try {
          const endpoint = status === "Approved" ? "/approved" : "/rejected";
          const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...selectedLeave, status, comments }),
          });

          if (response.ok) {
            const updatedLeave = { ...selectedLeave, status, comments };
            if (status === "Approved") {
              setApprovedLeaves((prev) => [...prev, updatedLeave]);
              toast.success("Leave Approved Successfully!");
              // navigate('/allapproved'); // Navigate to AllApproved page after approval
            } else {
              setRejectedLeaves((prev) => [...prev, updatedLeave]);
              toast.success("Leave Rejected Successfully!");
            }
          } else {
            console.warn("Response is not successfully processed" + response.status);
          }

          // Update local state after successful update
          const updatedLeaves = leaves.map((leave) =>
            leave.ID === selectedLeave.ID
              ? { ...leave, status, comments }
              : leave
          );
          setLeaves(updatedLeaves);
        } catch (error) {
          setError(error.message);
        }
      }
    },
    [selectedLeave, leaves, setApprovedLeaves, setRejectedLeaves, navigate]
  );

  const handleApprove = () => {
    updateLeaveStatus("Approved", comments);
    setIsPopupOpen(false);
    setComments("");
  };

  const handleReject = () => {
    updateLeaveStatus("Rejected", comments);
    setIsPopupOpen(false);
    setComments("");
  };

  const filteredLeaves = leaves.filter((leave) => {
    const timeCondition =
      timeFilter === "All Time" ||
      (timeFilter === "Today" &&
        new Date(leave.sdate).toDateString() === new Date().toDateString()) ||
      (timeFilter === "This Month" &&
        new Date(leave.sdate).getMonth() === new Date().getMonth());
    const statusCondition =
      statusFilter === "All Status" || leave.status === statusFilter;

    const leaveStartDate = new Date(leave.sdate);
    const leaveEndDate = new Date(leave.edate);
    const dateCondition =
      (!startDate && !endDate) ||
      (startDate && leaveStartDate >= startDate) ||
      (endDate && leaveEndDate <= endDate) ||
      (startDate &&
        endDate &&
        leaveStartDate >= startDate &&
        leaveEndDate <= endDate);

    const nameCondition =
      typeof leave.username === "string" &&
      typeof searchName === "string" &&
      leave.username.toLowerCase().includes(searchName.toLowerCase());

    return timeCondition && statusCondition && dateCondition && nameCondition;
  });

  return (
    <div className="flex flex-col items-center md:justify-center text-start w-full min-h-screen pending_leaves bg-sky-300">
      <div className="w-full max-w-7xl shadow sm:rounded-lg grid grid-cols-1 lg:grid-cols-12 bg-sky-300 lg:bg-white">
        <div className="lg:col-span-4 p-4 overflow-hidden ">
          <div className="flex flex-wrap mt-2 md:justify-center items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white text-black focus:outline-none"
            />
            <button
              className="border border-gray-300 p-2 rounded-lg flex items-center gap-2 bg-white text-black font-normal focus:outline-none"
              onClick={() => setShowDateFilterPopup(true)}
            >
              <span>Filters</span>
              <FilterAltIcon className="w-2 h-2" />
            </button>
          </div>

          {/* Date Filter Popup */}
          {showDateFilterPopup && (
            <DateFilterPopup
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              onClose={() => setShowDateFilterPopup(false)}
            />
          )}

          <div className="grid grid-cols-1 gap-4 justify-items-center md:mb-14 mb-13 overflow-y-auto max-h-[calc(100vh)]">
            {filteredLeaves.map((leave, index) => (
              <div
                key={index}
                className="w-full sm:w-full p-4 relative bg-white rounded-xl me-3 shadow-md cursor-pointer pending_Cards"
                onClick={() => handleCardClick (leave)}
                style={{
                  borderRadius: "0.5rem",
                  borderLeft: `4px solid ${
                    leave.status === "Approved"
                      ? "#34D399"
                      : leave.status === "Rejected"
                      ? "#F87171"
                      : "#60A5FA"
                  }`,
                }}
              >
                <h3 className="font-semibold text-lg text-gray-800">Leave</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium"> Total Days:</span>{" "}
                  {leave.totalday}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Start Time:</span> {leave.sdate}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">End Time:</span> {leave.edate}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                      {leave.username.split(" ")[0][0]}
                      {leave.username.split(" ")[1][0]}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      <p>{leave.username}</p>
                      <p className="text-xs text-gray-400">
                        Initiated: {leave.submitted_at || ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`absolute top-2 right-2 px-3 py-1 text-sm font-medium rounded-full ${
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
              </div>
            ))}
          </div>
        </div>

        {/* === Leave Details Section === */}
        {!isSmallScreen || (isSmallScreen && !isPopupOpen) ? (
          <div className="lg:col-span-8 sm:p-8 flex justify-center md:w-full hidden sm:block">
            <div className="w-full flex justify-center ">
              <div className="w-full p-4 max-w-4xl mx-auto bg-white text-gray-700 rounded-lg ">
                <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-3 ">
                  <h1 className="text-xl sm:text-2xl font-semibold mt-4">
                    Leave Details
                  </h1>
                </div>

                {selectedLeave && (
                  <div className="">
                    <div className="mt-4 ">
                      <div className="flex items-center justify-between gap-2 ">
                        <div>
                          <div className="bg-green-500 text-white w-8 h-8 flex justify-center items-center rounded-full">
                            {selectedLeave.username.split(" ")[0][0]}
                            {selectedLeave.username.split(" ")[1][0]}
                          </div>
                          <p className="font-semibold">
                            {selectedLeave.username}
                          </p>
                          <p className="text-sm text-gray-400">
                            Submitted: {selectedLeave.submitted_at || " "}
                          </p>
                        </div>
                        <span
                          className={`bg-blue-200 text-blue-800 text-center px-3 py-1 text-sm sm:text-base mt-2 sm:mt-0 rounded-full ${
                            selectedLeave.status === "Approved"
                              ? "bg-green-200 text-green-800"
                              : selectedLeave.status === "Rejected"
                              ? "bg-red-200 text-red-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {selectedLeave.status}
                        </span>
                      </div>

                      <div className="mt-6 mx-4 ">
                        <h2 className="text-lg sm:text-xl font-semibold ">
                          Details :
                        </h2>
                        <div className="grid grid-cols-1 gap-4 mt-3">
                          <p>
                            <span className="font-semibold">
                              Leave Total Days:
                            </span>{" "}
                            {selectedLeave.totalday}
                          </p>
                          <p>
                            <span className="font-semibold">Start Time:</span>{" "}
                            {selectedLeave.sdate}
                          </p>
                          <p>
                            <span className="font-semibold">End Time:</span>{" "}
                            {selectedLeave.edate}
                          </p>
                          <p>
                            <span className="font-semibold">Leave Type:</span>{" "}
                            {selectedLeave.leave_type}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Reason for Leave:
                            </span>{" "}
                            {selectedLeave.reason}
                          </p>
                          <label htmlFor="comments">
                            <b className="font-semibold"> Comments:</b>
                          </label>
                          <textarea
                            name="comments"
                            rows={5}
                            style={{
                              border: "2px solid grey",
                              borderRadius: "4px",
                            }}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                          ></textarea>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 my-2">
                          Approval Record
                        </h2>

                        <div className="overflow-x-auto mb-5">
                          <div className="mt-3 flex justify-center md:justify-start">
                            <button
                              className="bg-green-500 me-2 w-1/2 py-2 rounded font-medium hover:bg-green-700 text-white"
                              onClick={handleApprove}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 rounded ms-1 w-1/2 py-2 font-medium hover:bg-red-700 text-white"
                              onClick={handleReject}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Toaster />
      <DownNavbar />

      {/* Popup for small screens */}
      {isSmallScreen && isPopupOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-start z-50 mx-4 mt-6 ">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full">
            <div className="flex justify-between mx-4">
              <h2 className="text-lg font-semibold mb-2">Leave Details</h2>
              <ClearIcon onClick={() => setIsPopupOpen(false)} />
            </div>
            {selectedLeave && (
              <>
                <div className=" m-4">
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <p>
                      <span className="font-semibold">Leave Total Days:</span>{" "}
                      {selectedLeave.totalday}
                    </p>
                    <p>
                      <span className="font-semibold">Start Time:</span>{" "}
                      {selectedLeave.sdate}
                    </p>
                    <p>
                      <span className="font-semibold">End Time:</span>{" "}
                      {selectedLeave.edate}
                    </p>
                    <p>
                      <span className="font-semibold">Leave Type:</span>{" "}
                      {selectedLeave.leave_type}
                    </p>
                    <p>
                      <span className="font-semibold">Reason for Leave:</span>{" "}
                      {selectedLeave.reason}
                    </p>
                    <label htmlFor="comments">
                      <b className="font-semibold"> Comments:</b>
                    </label>
                    <textarea
                      name="comments"
                      rows={5}
                      style={{
                        border: "2px solid grey",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className=" bg-white rounded-lg ">
                  <h2 className="text-lg font-semibold text-gray-800 my-3">
                    Approval Record
                  </h2>

                  <div className="overflow-x-auto">
                    <div className="my-3 flex justify-center md:justify-start">
                      <button
                        className="bg-green-500 me-2 w-1/2 py-2 rounded font-medium hover:bg-green-700"
                        onClick={handleApprove}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 rounded ms-1 w-1/2 py-2 font-medium hover:bg-red-700"
                        onClick={handleReject}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingLeaves;