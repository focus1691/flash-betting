import React, { useState } from "react";
// import LoginTextBox from "../../atoms/LoginTextBox/LoginTextBox";
import LoginTextButton from "../../atoms/LoginTextButton/LoginTextButton";
import "./LoginBox.css"

export default () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className = "modalInputContainer">
            {/* <LoginTextBox placeholder = "Username" secure={false} text = {username} setText={setUsername} />
            <LoginTextBox placeholder = "Password" secure={true} text = {password} setText={setPassword} /> */}
            <LoginTextButton user = {username} pass = {password} />
        </div>
    );
}
    

