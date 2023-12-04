import Topbar from "./Topbar";
import Navbar from "./Navbar";
import { useAuth } from "../components/auth";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


function Layout() {
    return (
        <main className='flex flex-row max-h-screen h-screen'>
            <Navbar />

            <div className="flex flex-grow flex-col max-h-screen overflow-hidden">
                <Topbar />
                <Outlet />
            </div>
        </main>

    );
};
export default Layout;