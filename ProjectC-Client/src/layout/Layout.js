import Topbar from "./Topbar";
import Navbar from "./Navbar";
import { useAuth } from "../components/auth";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


function Layout() {
    const [openNavbar, setOpenNavbar] = useState(false);

    const toggleOpen = () => {
        setOpenNavbar(!openNavbar);
    };
    return (
        <main className='flex flex-row max-h-screen h-screen'>
            <Navbar openNavbar={openNavbar} toggleOpen={toggleOpen} />

            <div className="flex flex-grow flex-col max-h-screen overflow-hidden">
                <Topbar openNavbar={openNavbar} toggleOpen={toggleOpen} />
                <Outlet />
            </div>
        </main>

    );
};
export default Layout;