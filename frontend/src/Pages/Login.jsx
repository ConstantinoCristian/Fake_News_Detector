import {useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {Link} from "react-router-dom";
const Login = ({setUser}) => {


    const [form,setForm] = useState({
        email:"",
        password:""
    })

    const navigate = useNavigate();

    const [err,setErr] = useState("");

    const handleSubmit = async (e) => {
            e.preventDefault()
            try{
                //vezi ca poti scurta url ul uitate in pern , si vezi ce inseamna withcredentials
                const res = await  axios.post(`${import.meta.env.VITE_API_AUTH}/login`, form, {withCredentials:true})
                setUser(res.data.user)
                navigate("/account")
            }catch (e){
                setErr(e.response.data.message);
            }
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-[#1e1f2b] overflow-hidden">

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#8b6f47_1px,transparent_0)] bg-[length:24px_24px]"></div>

            <div className="relative w-full max-w-md bg-[#2a2c3b]/90 backdrop-blur-sm border border-[#3a3d52] rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-[#f1e8d8] tracking-wide transition-all duration-500 hover:tracking-widest">
                        Welcome Back
                    </h1>
                    <div className="w-20 h-[2px] bg-[#8b6f47] mx-auto mt-4 transition-all duration-500 hover:w-28"></div>
                </div>

                <form className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-widest text-[#cbbfa7]">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-xl border border-[#3a3d52] bg-[#232533] px-4 py-3 text-[#f1e8d8] placeholder:text-[#7d8099] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:border-[#8b6f47] transition-all duration-300"
                            placeholder="you@email.com"
                            onChange={(e)=>setForm({...form,email: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-widest text-[#cbbfa7]">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-[#3a3d52] bg-[#232533] px-4 py-3 text-[#f1e8d8] placeholder:text-[#7d8099] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:border-[#8b6f47] transition-all duration-300"
                            placeholder="••••••••"
                            onChange={(e)=>setForm({...form,password: e.target.value})}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full mt-4 rounded-xl bg-[#8b6f47] text-[#1e1f2b] py-3 font-medium tracking-wide shadow-md transition-all duration-300 hover:bg-[#a07f54] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Login
                    </button>
                    <Link
                        to="/register"
                        className="block text-center mt-6 text-sm font-medium text-[#5a7c9d]
             transition-all duration-200
             hover:text-[#3f5f7e] hover:underline"
                    >
                       Register
                    </Link>

                </form>
                {err && <p className="text-red-500">{err}</p>}
            </div>
        </main>
    );
};

export default Login;