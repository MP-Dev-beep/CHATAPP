import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";



const ThemeContext = createContext(null);



export function ThemeProvider({children}) {


    const [dark,setDark] = useState(true);



    useEffect(()=>{


        document.documentElement.classList.toggle(
            "dark",
            dark
        );


    },[dark]);





    const toggleTheme = ()=>{


        setDark(value => !value);


    };





    return (

        <ThemeContext.Provider

            value={{
                dark,
                toggleTheme
            }}

        >

            {children}

        </ThemeContext.Provider>

    );

}





export function useTheme(){


    const context = useContext(ThemeContext);



    if(!context){

        throw new Error(
            "useTheme doit être utilisé dans ThemeProvider"
        );

    }


    return context;


}