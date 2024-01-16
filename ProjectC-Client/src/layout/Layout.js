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

    // On mobile devices, the navbar is pressed toggle the navbar
    const toggleOpen = (close = false) => {
        setOpenNavbar(close ? !openNavbar : close);
    };

    const toggleClose = () => {
        setOpenNavbar(false);
    };

    // When the bell is pressed, the bellPressed state is set to true
    const [bellPressed, setBellPressed] = useState(false);

    const handleBellPress = () => {
        setBellPressed(true);
    };

    return (
        <main className='flex flex-row max-h-screen h-screen'>
            <Navbar openNavbar={openNavbar} toggleOpen={toggleOpen} toggleClose={toggleClose} handleBellPress={handleBellPress} />

            <div className="flex flex-grow flex-col max-h-screen overflow-hidden">
                <Topbar openNavbar={openNavbar} toggleOpen={toggleOpen} toggleClose={toggleClose} handleBellPress={handleBellPress} bellPressed={bellPressed} setBellPressed={setBellPressed} />
                <Outlet />
            </div>
        </main>
    );
}

export default Layout;
