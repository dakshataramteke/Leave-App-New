import { NavLink } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CloseIcon from '@mui/icons-material/Close';

const DownNavbar = () => {
  return (
    <section className="bg-white relative overflow-hidden sm:bottom-0 sm:shadow-lg sm:shadow-gray-500/30 hover:shadow-md z-10">
      <div className="w-full mx-auto 2xl:max-w-7xl flex flex-col justify-center relative px-8 ">
        <div className="fixed bottom-0 sm:bottom-0 left-0 duration-300 outline-none overflow-hidden z-50 w-full h-16 border-amber-200 bg-white sm:max-w-full inset-x-0 mx-auto">
          <div className="grid h-full grid-cols-3 mx-auto w-full">
            <NavLink 
              to={'/allpending'} 
              className={({ isActive }) => 
                `text-center inline-flex flex-col items-center justify-center font-medium px-5  gap-1 text-black-500 ${isActive ? 'text-blue-500' : ''}`
              } 
              aria-label="Notifications"
            >
              <PendingActionsIcon />
              <span className="text-xs">All Pending</span>
            </NavLink>
            <NavLink 
              to={'/allapproved'} 
              className={({ isActive }) => 
                `text-center inline-flex flex-col items-center justify-center font-medium px-5  gap-1  text-black-500 ${isActive ? 'text-blue-500' : ''}`
              } 
              aria-label="Search"
            >
              <CheckCircleOutlineIcon />
              <span className="text-xs">All Approve</span>
            </NavLink>
            <NavLink 
              to={'/allrejected'} 
              className={({ isActive }) => 
                `text-center inline-flex flex-col items-center justify-center px-5 font-medium  gap-1  text-black-500 ${isActive ? 'text-blue-500' : ''}`
              } 
              aria-label="Likes"
            >
              <CloseIcon />
              <span className="text-xs">All Rejected</span>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownNavbar;