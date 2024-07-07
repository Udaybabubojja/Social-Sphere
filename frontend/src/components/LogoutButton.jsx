/* eslint-disable no-unused-vars */
import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { FiLogOut } from "react-icons/fi";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            console.log(data);
            if (data.message) {
                showToast("Logout", data.message, "logout");
            }
            localStorage.removeItem("user-threads");
            setUser(null);
        } catch (error) {
            showToast("Error", error, "error");
            console.log(error);
        }
    };

    return (
        <Button
            size={"s"}
            leftIcon={<FiLogOut />}
            pl={2}
            onClick={handleLogout}
        />
    );
};

export default LogoutButton;
