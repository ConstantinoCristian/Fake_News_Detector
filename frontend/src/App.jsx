import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./Pages/Home.jsx"
import VintageSidebar from "./components/Sidebar.jsx"
import Account from "./Pages/Account.jsx"
import Register from "./Pages/Register.jsx"
import Login from "./Pages/Login.jsx"
import Report from "./Pages/Report.jsx"
import Extra from "./Pages/Extra.jsx"
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import axios from "axios";
axios.defaults.withCredentials = true;
import {AnalysisHistoryProvider} from "./context/AnalysisHistory.jsx"
function App() {

    const [user,setUser] = useState("")

    useEffect(() => {
        const fetchUser = async()=>{
            try{
                const res  = await axios.get(`${import.meta.env.VITE_API_AUTH}/me`)
                setUser(res.data)
            }catch (e){
                console.log("Something went wrong while fetching the user data ",e)
            }
        }
        fetchUser();
    }, []);

    return (
      <AnalysisHistoryProvider user={user}>
        <Router>
            <div className="flex h-screen">
                <VintageSidebar  user={user}/>
                <div className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/account" element={<Account user={user}  />} />
                        <Route path="/register" element={<Register setUser={setUser} />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/extra" element={<Extra />} />

                    </Routes>
                </div>
            </div>
        </Router>
      </AnalysisHistoryProvider>


  )
}

export default App;
