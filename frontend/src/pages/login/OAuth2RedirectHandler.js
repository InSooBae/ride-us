import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {myInfo} from "../../utils/api/userApi";
import {setUser} from "../../stores/modules/user";

export const OAuth2RedirectHandler = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = new URLSearchParams(window.location.search);

    useEffect(()=>{
        const accessToken = params.get("accessToken");
        // const refreshToken = params.get("refreshToken");
        const register = params.get("register");

        let isRegister = JSON.parse(register);
        console.log(isRegister);

        localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);

        // 회원가입후 추가 입력 안했으면
        if (isRegister === true) {
            console.log("추가입력 - X");
            navigate("/moreinfo");
            // window.location.href = "/moreinfo";
        } else {
            console.log(localStorage.getItem("accessToken"));
            myInfo((res) => {
                console.log(res);
                const {data} = res;
                dispatch(setUser(data));
                console.log(data);

                const from = localStorage.getItem("from");
                if (from) {
                    localStorage.removeItem("from");
                    navigate(from);
                } else {
                    navigate("/");
                }
                // navigate("/");
                // window.location.href = '/';
            }, (err) => {
                console.log(err);
                navigate("/");
            });
        }
    },[])


    return null;
};
