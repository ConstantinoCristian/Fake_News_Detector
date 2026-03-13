"use client";
import {Link} from "react-router-dom";
import { useState , useEffect } from "react";
import {HiHome, HiUser, HiDocumentReport, HiClock, HiMenuAlt2,HiTrash ,HiExternalLink,HiInformationCircle} from "react-icons/hi";
import {useAnalysis} from "../context/AnalysisHistory.jsx"
import axios from "axios"
import {useNavigate} from "react-router-dom";

export default function VintageSidebar({user}) {
    const [open, setOpen] = useState(true);
    const {savedAnalysis, setSavedAnalysis,fetchHistory,selectedAnalysis,loadAnalysis} = useAnalysis()
    console.log("Use analysis "+savedAnalysis)

    const navigator = useNavigate()

        const handleDelete = async (report_id) => {
            try{
                const response = await axios.post(`${import.meta.env.VITE_API_AUTH}/delete`,{ report_id })
                await fetchHistory();

            }catch (e){
                console.log("Something went wrong deleting" +" "+ e )
            }


        }



    return (
        <div className="flex h-screen bg-[#f4f1e8]">

            <div
                className={`${
                    open ? "w-56" : "w-16"
                } bg-[#e8dfc8] border-r border-[#c9b99a] shadow-xl transition-all duration-300 ease-in-out`}
            >

                <div className="flex justify-end p-3">
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-md border border-[#c9b99a] bg-[#f7f3e9] hover:bg-[#ede6d6] transition-all duration-300 cursor-pointer"
                    >
                        <HiMenuAlt2 size={18} />
                    </button>
                </div>


                <nav className="mt-4 space-y-2">
                    <SidebarButton
                        icon={<Link to="/">{<HiHome size={20} />}</Link>}
                        label={<Link to="/">Home</Link>}
                        open={open}
                    />
                    <SidebarButton
                        icon={<Link to="/account">{<HiUser size={20} />}</Link>}
                        label={<Link to="/account">Account</Link>}
                        open={open}
                    />
                    <SidebarButton
                        icon={<Link to="/report"><HiDocumentReport size={20} /></Link>}
                        label={<Link to="/report"> Reports </Link>}
                        open={open}
                    />
                    <div className="relative w-full group">
                        <button className=" flex items-center gap-3 w-full px-4 py-2 text-[#5a4a3b] font-medium font-serif bg-[#e8dfc8] hover:bg-[#d8ccb3] hover:translate-x-1 transition-all duration-300 rounded-md cursor-pointer " >
                            <HiClock size={20} /> <span className={`whitespace-nowrap transition-all duration-300 ${ open ? "opacity-100" : "opacity-0 w-0 overflow-hidden" }`} > History </span> </button>
                        <div className=" hidden group-hover:block absolute left-14 top-full bg-[#f9f5e9] border border-[#c9b99a] shadow-lg rounded-md min-w-[160px] z-20 " >

                            {savedAnalysis.map((report) => (
                                <div
                                    key={report.id}
                                    className="relative group/item flex items-start justify-between gap-3
             px-4 py-3 text-sm text-[#5a4a3b] italic
             cursor-pointer transition-all duration-200
             hover:bg-[#efe7d3]"
                                    onClick={() => loadAnalysis(report)}

                                >

                                    <span
                                        className="absolute left-0 top-0 h-full w-1 bg-[#b89c6b]
               scale-y-0 group-hover/item:scale-y-100
               transition-transform duration-200 origin-top"
                                    />


                                    <div className="flex items-start gap-2 flex-1 min-w-0">

                                       <Link to="/"><HiExternalLink
                                           size={16}
                                           className="mt-[2px] opacity-60 group-hover/item:opacity-100 transition"
                                       /></Link>

                                        <Link to="/"> <p className="break-words leading-snug transition-transform duration-200 group-hover/item:translate-x-1">
                                            {report?.url}
                                        </p></Link>
                                    </div>


                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(report.id);

                                        }}
                                        className="flex items-center justify-center
               p-2 rounded-md
               text-[#a06b6b]
               transition-all duration-200
               hover:bg-red-100 hover:text-red-600
               active:scale-90 cursor-pointer"
                                    >
                                        <HiTrash size={16} />
                                    </button>
                                </div>
                            ))}



                        </div>
                    </div>
                    <SidebarButton
                        icon={<Link to="/Extra"><HiInformationCircle size={20} /></Link>}
                        label={<Link to="/Extra"> Extra </Link>}
                        open={open}
                    />

                </nav>
            </div>
        </div>
    );
}

function SidebarButton({ icon, label, open }) {
    return (
        <button
            className="
                flex items-center gap-3 w-full px-4 py-2
                text-[#5a4a3b] font-medium font-serif
                hover:bg-[#d8ccb3] hover:translate-x-1
                transition-all duration-300
                rounded-md cursor-pointer
            "
        >
            {icon}
            <span
                className={`whitespace-nowrap transition-all duration-300 ${
                    open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
            >
                {label}
            </span>
        </button>
    );
}
