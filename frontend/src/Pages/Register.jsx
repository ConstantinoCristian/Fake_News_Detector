import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import {Link} from "react-router-dom";
const Register = ({setUser}) => {


    const[form,setForm]=useState({
        name:"",
        email:"",
        password:"",
    })

    const [err,setErr] = useState("");

    const navigate = useNavigate();

    const handleSubmit =async (e) => {
        e.preventDefault()
        try{
          const res = await  axios.post(`${import.meta.env.VITE_API_AUTH}/register`,form)
          setUser(res.data.user)
          navigate("/account")
        }catch (e){
            setErr(e.response.data.message)
        }
    }


    return (
        <main className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-[#e6edf4] overflow-hidden">

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#6b8cae_1px,transparent_0)] bg-[length:26px_26px]"></div>

            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-sm border border-[#c9d6e2] rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-[#2f3e4d] tracking-wide transition-all duration-500 hover:tracking-widest">
                        Create Account
                    </h1>
                    <div className="w-20 h-[2px] bg-[#6b8cae] mx-auto mt-4 transition-all duration-500 hover:w-28"></div>
                </div>

                <form className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-widest text-[#5c6f82]">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-[#c9d6e2] bg-[#f4f8fb] px-4 py-3 text-[#2f3e4d] placeholder:text-[#8aa0b6] focus:outline-none focus:ring-2 focus:ring-[#6b8cae] focus:border-[#6b8cae] transition-all duration-300"
                            placeholder="John Doe"
                            onChange={(e)=>setForm({...form, name : e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-widest text-[#5c6f82]">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-xl border border-[#c9d6e2] bg-[#f4f8fb] px-4 py-3 text-[#2f3e4d] placeholder:text-[#8aa0b6] focus:outline-none focus:ring-2 focus:ring-[#6b8cae] focus:border-[#6b8cae] transition-all duration-300"
                            placeholder="you@email.com"
                            onChange={(e)=>setForm({...form,email:e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-widest text-[#5c6f82]">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-[#c9d6e2] bg-[#f4f8fb] px-4 py-3 text-[#2f3e4d] placeholder:text-[#8aa0b6] focus:outline-none focus:ring-2 focus:ring-[#6b8cae] focus:border-[#6b8cae] transition-all duration-300"
                            placeholder="••••••••"
                            onChange={(e)=>setForm({...form,password:e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full mt-4 rounded-xl bg-[#6b8cae] text-white py-3 font-medium tracking-wide shadow-md transition-all duration-300 hover:bg-[#5a7c9d] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Register
                    </button>

                    <Link
                        to="/login"
                        className="block text-center mt-6 text-sm font-medium text-[#5a7c9d]
             transition-all duration-200
             hover:text-[#3f5f7e] hover:underline"
                    >
                        Already have an account? Login
                    </Link>
                </form>

                {err && <p className="text-red-500 text-bold">{err}</p>}

            </div>
        </main>
    );
};

export default Register;