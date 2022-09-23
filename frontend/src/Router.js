import React from "react";
import {Outlet, Route, Routes, useNavigate} from "react-router-dom";
import {Footer, LogoHeader, NavBar} from "./components/Common.jsx";
import {Course} from "./pages/Course";
import {CourseDetail} from "./pages/CourseDetail.jsx";
import {Main} from "./pages/Main";
import {MyPage} from "./pages/MyPage";
import {Rank} from "./pages/Rank";
import {ReviewRegister} from "./pages/ReviewRegister.jsx";
import {Ride} from "./pages/Ride.jsx";
import {RideEnd} from "./pages/RideEnd.jsx";
import {GpsTest} from "./pages/test/GpsTest";
import {Login} from "./pages/login/Login";
import {OAuth2RedirectHandler} from "./pages/login/OAuth2RedirectHandler";
import MapTest from "./pages/test/MapTest";
import {MoreInfo} from "./pages/login/MoreInfo";

const Layout = () => {
    return (
        <div>
            <LogoHeader/>
            <Outlet/>
            <Footer/>
            <NavBar/>
        </div>
    );
};

const LayoutNoFooter = () => {
    return (
        <div>
            <LogoHeader/>
            <Outlet/>
            <NavBar/>
        </div>
    );
};

const LayoutLogo = () => {
    return (
        <div>
            <LogoHeader/>
            <Outlet/>
        </div>
    );
};

const FullLayout = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
};

const NoHeaderLayout = () => {
    return (
        <div>
            <Outlet/>
            <NavBar/>
        </div>
    )
}

export const Router = () => {
    return (
        <Routes>
            {/* 로고, 푸터, 내브바 */}
            <Route path="/" element={<Layout/>}>
                {/* <Route index element={<MapTest />}></Route> */}
                <Route index element={<Main/>}/>
                <Route path="/course" element={<Course/>}/>
                <Route path="/rank" element={<Rank/>}/>
                <Route path="/gpsTest" element={<GpsTest/>}/>
            </Route>
            {/* 로고, 내브바 */}
            <Route path="/" element={<LayoutNoFooter/>}></Route>
            {/* 로고 */}
            <Route path="/" element={<LayoutLogo/>}>
                <Route path="/courseDetail" element={<CourseDetail/>}/>
            </Route>
            {/* 풀스크린 */}
            <Route path="/" element={<FullLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                <Route path="/moreinfo" element={<MoreInfo/>}/>
                <Route path="/ride" element={<Ride/>}/>
                <Route path="/rideEnd" element={<RideEnd/>}/>
                <Route path="/registerReview" element={<ReviewRegister/>}/>
            </Route>
            <Route path="/" element={<NoHeaderLayout/>}>
                <Route path="/mypage" element={<MyPage/>}/>
            </Route>

        </Routes>
    );
};
