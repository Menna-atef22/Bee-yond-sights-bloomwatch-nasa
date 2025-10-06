import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";

function Layout(){
    return(
        <>
            <Header/>
            <main style={{margin: "0"}}>
                <Outlet/>
            </main>
        </>
    );
}

export default Layout;
