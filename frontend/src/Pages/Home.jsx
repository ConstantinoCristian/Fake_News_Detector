import {useState,useEffect} from "react";
import axios from "axios";
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import * as React from 'react';
import { useAnalysis } from "../context/AnalysisHistory.jsx";
import {Link} from "react-router-dom";
function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
        // No value to display
        return null;
    }

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="red" />
            <path
                d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                stroke="red"
                strokeWidth={3}
            />
        </g>
    );
}



const Home = ({user}) => {
    const [key, rerender] = React.useReducer((x) => x + 1, 0);

    const [url, setUrl] = useState("");
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasResults, setHasResults] = useState(false);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [showSavedPopup, setShowSavedPopup] = useState(false);


    const {selectedAnalysis,setSelectedAnalysis,savedAnalysis,fetchHistory} = useAnalysis()

    useEffect(() => {
        if(selectedAnalysis?.label) {
            setUrl(selectedAnalysis.url)
            setResponse({label: selectedAnalysis.label, score: selectedAnalysis.score})
            setHasResults(true)
        }
    }, [selectedAnalysis])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse({});
        setHasResults(false);
        setError("");
        setLoading(true);
        setSaveError("")

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/urlCheck`, { userInput: url });
            console.log("Success:", res.data);
            setResponse(res.data.output);
            setHasResults(true);
            setLoading(false);
        } catch (e) {
            console.log(`Error occurred:`);
            console.log(`Status:`, e.response?.status);
            console.log(`Data:`, e.response?.data);
            console.log(`Message:`, e.message);





            setError(errorMessage);
            setLoading(false);
        }
    };


    const save = async () => {
        try{
            setSaveError("")

            const res = await axios.post(
                "http://localhost:5000/api/auth/save",
                { url: url, label: response?.label, score: response?.score },
                { withCredentials: true }
            )

            setShowSavedPopup(true);
           // await refreshHistory?.()

            await fetchHistory();
            setTimeout(() => {
                setShowSavedPopup(false);
            }, 3000);



        }catch (e){
            setSaveError(e.response.data.message)
        }



    }

    return (
        <div className="min-h-screen bg-amber-50">
            {!hasResults && !loading && (
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-md bg-amber-100 border-4 border-amber-900 shadow-lg">
                        <div className="p-8">
                            <div className="mb-8 pb-6 border-b-2 border-dashed border-amber-900">
                                <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 tracking-wider font-serif">
                                    NEWS SENTIMENT
                                </h1>
                                <p className="text-xs sm:text-sm mt-3 text-amber-800 font-serif uppercase tracking-wide">
                                    Analyze the press
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="url" className="block text-xs sm:text-sm font-bold mb-3 text-amber-900 tracking-wide font-serif uppercase">
                                        Article URL
                                    </label>
                                    <input
                                        type="text"
                                        name="url"
                                        id="url"
                                        placeholder="https://example.com/news"
                                        className="w-full bg-amber-50 border-2 border-amber-800 text-amber-900 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-amber-900 font-serif text-sm"
                                        onChange={(e) => setUrl(e.target.value)}
                                        value={url}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-amber-800 text-amber-50 border-2 border-amber-900 px-4 py-3 font-bold tracking-wider uppercase text-sm transition-all duration-200 cursor-pointer hover:bg-amber-900 hover:shadow-lg active:translate-y-0.5 font-serif"
                                >
                                    ▶ ANALYZE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-md bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-300 rounded p-8 text-center animate-pulse">
                        <div className="h-2 bg-amber-400 rounded w-12 mx-auto mb-4"></div>
                        <p className="text-amber-800 font-serif uppercase tracking-wider">
                            Analyzing sentiment...
                        </p>
                    </div>
                </div>
            )}

            {hasResults && response.label != "TRUE" && response.label != "FALSE" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-md bg-red-50 border-4 border-red-900 rounded shadow-2xl animate-shake">
                        <div className="p-8">
                            <div className="mb-6 pb-4 border-b-2 border-red-900">
                                <h2 className="text-2xl font-bold text-red-900 font-serif tracking-wider">
                                    ⚠ ERROR
                                </h2>
                            </div>
                            <div className="mb-6">
                                <p className="text-red-800 font-serif text-sm leading-relaxed">
                                    {response.label}
                                </p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full cursor-pointer bg-red-900 text-red-50 border-2 border-red-900 px-4 py-3 font-bold tracking-wider uppercase text-sm transition-all duration-200 hover:bg-red-800 hover:shadow-lg active:translate-y-0.5 font-serif rounded"
                            >
                                ✓ OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {hasResults && (response.label != "TRUE" || response.label != "FALSE")   && (
                <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            <div className="animate-slide-left">
                                <div className="bg-amber-100 border-4 border-amber-900 rounded p-6 h-full flex flex-col">
                                    <h2 className="text-lg sm:text-xl font-bold text-amber-900 font-serif mb-4 uppercase tracking-wider">
                                        Analysis Results
                                    </h2>
                                    <div className="space-y-4 flex-grow">
                                        <div className="bg-amber-50 border-2 border-amber-800 rounded p-4">
                                            <p className="text-xs uppercase tracking-widest text-amber-800 font-serif mb-2">
                                                URL
                                            </p>
                                            <p className="text-sm text-amber-900 font-serif break-all line-clamp-2">
                                                {url}
                                            </p>
                                        </div>
                                        <div className="bg-amber-50 border-2 border-amber-800 rounded p-4">
                                            <p className="text-xs uppercase tracking-widest text-amber-800 font-serif mb-2">
                                                Sentiment
                                            </p>
                                            <p className={`text-lg font-bold font-serif ${response.label === 'TRUE' ? 'text-green-700' : 'text-red-700'}`}>
                                                {response.label === 'TRUE' ? '✓ POSITIVE' : '✗ NEGATIVE'}
                                            </p>
                                        </div>
                                        <div className="bg-amber-50 border-2 border-amber-800 rounded p-4">
                                            <p className="text-xs uppercase tracking-widest text-amber-800 font-serif mb-2">
                                                Confidence
                                            </p>
                                            <p className="text-2xl font-bold text-amber-900 font-serif">
                                                {(response.score * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>
                                    <Link to="/extra">
                                        <button
                                            className="w-full flex items-center justify-center gap-2
               bg-amber-200/80 text-amber-900
               px-4 py-3 mt-4
               font-serif font-bold uppercase tracking-wider text-xs
               rounded-md
               transition-all duration-200
               hover:bg-amber-300 hover:shadow-md hover:-translate-y-0.5
               active:translate-y-0.5"
                                        >
                                            Extra
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setHasResults(false);
                                            setUrl("");
                                            setResponse({});
                                            window.location.reload()
                                        }}
                                        className="w-full bg-amber-800 text-amber-50 border-2 border-amber-900 px-4 py-3 font-bold tracking-wider uppercase text-xs transition-all duration-200 hover:bg-amber-900 hover:shadow-lg active:translate-y-0.5 font-serif mt-4"
                                    >
                                        ⟲ NEW ANALYSIS
                                    </button>
                                    {user &&

                                        <button
                                            onClick={save}
                                                className="bg-amber-400 text-amber-900 border-2 border-amber-900 px-4 py-2
                                        font-bold font-serif uppercase tracking-wide text-sm
                                        shadow-md transition-all duration-200 cursor-pointer
                                        hover:bg-amber-500 hover:shadow-lg
                                        active:translate-y-0.5 mt-2"

                                        >
                                            Save
                                        </button>
                                    }
                                    {showSavedPopup && (
                                        <div className="fixed bottom-6 right-6 animate-fade-in">
                                            <div className="bg-amber-100 border-4 border-amber-900 shadow-lg px-6 py-4 flex items-center gap-3">
                                                <span className="text-green-700 text-xl">✓</span>
                                                <p className="font-serif font-bold text-amber-900 uppercase tracking-wide text-sm">
                                                    Report Saved
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {saveError && <p className="text-red-500">{saveError}</p>}
                                </div>
                            </div>

                            <div className="animate-fade-in-right space-y-4">
                                <div className="bg-amber-100 border-4 border-amber-900 rounded p-5">
                                    <div className="flex justify-center mb-3">
                                        <PieChart
                                            key={key}
                                            series={[{
                                                data: [{
                                                    id: 0,
                                                    value: response.score * 100,
                                                    label: response.label
                                                }],
                                                arcLabel: () => `${response.label}`
                                            }]}
                                            width={180}
                                            height={180}
                                            hideLegend
                                            sx={{
                                                [`& .${pieArcLabelClasses.root}`]: {
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-xs uppercase tracking-widest text-amber-800 font-serif">
                                            Sentiment
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-amber-100 border-4 border-amber-900 rounded p-5">
                                    <div className="flex justify-center mb-3">
                                        <GaugeContainer
                                            width={180}
                                            height={180}
                                            startAngle={-110}
                                            endAngle={110}
                                            value={response.score * 100}
                                        >
                                            <GaugeReferenceArc />
                                            <GaugeValueArc />
                                            <GaugePointer />
                                        </GaugeContainer>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-xs uppercase tracking-widest text-amber-800 font-serif">
                                            Confidence
                                        </p>
                                        <p className="text-xl font-bold text-amber-900 font-serif">
                                            {(response.score * 100).toFixed(2)}%
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-left {
                    animation: slideInLeft 0.7s ease-out;
                }
                .animate-fade-in-right {
                    animation: fadeInRight 0.7s ease-out 0.2s both;
                }
                
                @keyframes fadeInToast {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeInToast 0.4s ease-out;
}
            `}</style>
        </div>
    );
}

export default Home;