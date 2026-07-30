import { useState } from "react";

function Navigation() {

    const [active, setActive] = useState("chat");

    return (

        <div className="navigation">

            <button
                className={active === "chat" ? "nav-btn active" : "nav-btn"}
                onClick={() => setActive("chat")}
            >
                💬
            </button>

            <button
                className={active === "call" ? "nav-btn active" : "nav-btn"}
                onClick={() => setActive("call")}
            >
                📞
            </button>

            <button
                className={active === "saved" ? "nav-btn active" : "nav-btn"}
                onClick={() => setActive("saved")}
            >
                ⭐
            </button>

            <button
                className={active === "profile" ? "nav-btn active" : "nav-btn"}
                onClick={() => setActive("profile")}
            >
                👤
            </button>

            <button
                className={active === "settings" ? "nav-btn active" : "nav-btn"}
                onClick={() => setActive("settings")}
            >
                ⚙
            </button>

        </div>

    );

}

export default Navigation;