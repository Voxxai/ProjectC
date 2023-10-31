import { useContext } from "react";
import AuthContext from "../components/auth";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;