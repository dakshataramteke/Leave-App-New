import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import image from "../../src/assets/admin.svg";
import { NavLink } from "react-router-dom";
const AdminPage = () => {
  return (
    <>
      <section className="bg-white-50 w-full flex items-center justify-center  h-screen"> 
        {/* ========= Login Container ======== */}
        <div className="bg-white-100  rounded-md shadow-lg w-full h-screen flex  items-center justify-center lg:p-22 sm:p-20 p-4">
          <div className="sm:w-1/2 sm:px-6 px-9  w-full sm:my-0">
            <h2 className="font-bold lg:text-5xl sm:text-4xl text-3xl text-center l ">
              Sign up
            </h2>
            <p className="md:text-sm lg:text-lg text-center lg:mt-8 sm:mt-4 my-3">
              Login to your Admin Page
            </p>

            <form action="" className="flex flex-col gap-4">
              <input
                type="text"
                className="lg:p-3 lg:mt-18 sm:mt-6 mt-4 rounded-md bg-gray-100 lg:px-6 sm:px-4 p-2"
                name="email"
                placeholder="Email" required
              />
              <input
                type="password"
                className="lg:p-3 lg:mt-5 mt-2 rounded-md bg-gray-100 lg:px-6 p-2"
                name="password"
                placeholder="Password" required
              />
              <NavLink to={'/allpending'} className="bg-[#2638FF] rounded-md text-white lg:py-3 lg:mt-4 py-2 font-medium text-center">
                <PersonAddAltIcon className="sm:me-3 me-2" /> Sign Up
              </NavLink>
            </form>
          </div>

          {/* ====== Image  ========= */}
          <div className="sm:block hidden w-1/2">
            <img
              src={image}
              className="sm:w-full sm:h-60 lg:h-full lg:w-7xl object-cover"
              alt=""
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminPage;