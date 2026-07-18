import Login from "./pages/Login";
import Chat from "./pages/Chat";


function App(){


    const token =
        localStorage.getItem("token");



    if(!token){


        return <Login />;


    }



    return <Chat />;


}



export default App;