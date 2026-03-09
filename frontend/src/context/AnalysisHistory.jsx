import { createContext, useContext, useState , useEffect, useCallback } from "react";
import axios from "axios"



const AnalysisHistory = createContext()
export function AnalysisHistoryProvider ({children,user}){
        const [savedAnalysis,setSavedAnalysis] = useState([])
        const [selectedAnalysis,setSelectedAnalysis] = useState({})


    const fetchHistory = useCallback(async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_API_AUTH}/history`, { withCredentials: true })
            setSavedAnalysis(res.data)
        }catch(e){
            console.log(e)
        }
    }, [])


    const loadAnalysis = (report) => {
            setSelectedAnalysis(report)


    }

    useEffect( () => {
        if (user) {
            fetchHistory()
        } else {
            setSavedAnalysis([])
        }
    }, [user, fetchHistory]);

    return (
            <AnalysisHistory.Provider value={{savedAnalysis,setSavedAnalysis,fetchHistory,selectedAnalysis,loadAnalysis}}>
                {children}
            </AnalysisHistory.Provider>
        )
}


export function useAnalysis(){
    return useContext(AnalysisHistory);
}