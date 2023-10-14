import Topbar from "./Topbar";
import Navbar from "./Navbar";
import { useAuth } from "../components/auth";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function Layout() {
    return (
        <main className='flex flex-row'>
            <Navbar/>
            
            <div className="maincontainer">
            <Topbar/>
                <Outlet />
            </div>
        </main>
      
    );
  };
  export default Layout;