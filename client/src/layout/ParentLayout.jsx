import { Outlet } from "react-router-dom";
import Header from "../components/parent/Header";
import FooterParent from "../components/parent/FooterParent";

const ParentLayout = () => {
    return(
        <div>
            <Header />
            <Outlet />
            <FooterParent />
        </div>
    )
}

export default ParentLayout;