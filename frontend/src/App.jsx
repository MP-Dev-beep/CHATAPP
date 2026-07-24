import Login from "./pages/Login";
import Chat from "./pages/Chat";


function App(){


    const token =

        localStorage.getItem("token");





    return (


        token

        ?

        <Chat />

        :

        <Login />


    );


}



export default App;