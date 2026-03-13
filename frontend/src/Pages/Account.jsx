import {Link} from "react-router-dom";
import axios from "axios"
const Home = ({user}) =>{

    const logout =async () => {
        await axios.post(`${import.meta.env.VITE_API_AUTH}/logout`)
        window.location.href="/";
    }

    return (
        <main>
        {user ? <main
                className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-[#efe7d7] overflow-hidden">

                <div
                    className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#bfa77a_1px,transparent_0)] bg-[length:24px_24px]"></div>

                <div
                    className="relative w-full max-w-xl bg-[#fffaf0]/90 backdrop-blur-sm border border-[#d6c7b2] rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">

                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-serif text-[#4b3f35] tracking-wide transition-all duration-500 hover:tracking-widest">
                            Account Page
                        </h1>
                        <div
                            className="w-20 h-[2px] bg-[#c2a878] mx-auto mt-4 transition-all duration-500 hover:w-28"></div>
                    </div>

                    <div className="space-y-6">

                        <div className="group transition-all duration-300">
                            <p className="text-sm uppercase tracking-widest text-[#8c7b6b] mb-2">
                                Name
                            </p>
                            <div
                                className="bg-[#f8f3ea] border border-[#e0d6c8] rounded-xl px-4 py-3 transition-all duration-300 group-hover:bg-[#efe6d8] group-hover:border-[#c2a878] group-hover:scale-[1.02]">
                                <p className="text-lg font-medium text-[#4b3f35]">
                                    { user.name

                                }
                                </p>
                            </div>
                        </div>

                        <div className="group transition-all duration-300">
                            <p className="text-sm uppercase tracking-widest text-[#8c7b6b] mb-2">
                                    Email
                            </p>
                            <div
                                className="bg-[#f8f3ea] border border-[#e0d6c8] rounded-xl px-4 py-3 transition-all duration-300 group-hover:bg-[#efe6d8] group-hover:border-[#c2a878] group-hover:scale-[1.02]">
                                <p className="text-lg font-medium text-[#4b3f35] break-all">
                                    {user.email
                                    }
                                </p>
                            </div>
                        </div>
                        <button onClick={logout} className="bg-red-500 hover:cursor-pointer text-white p-2 w-full">Logout</button>
                    </div>

                </div>
            </main>

            : //////

            <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-amber-100 border-4 border-amber-900 shadow-lg">

                    <div className="p-8">

                        {/* Header */}
                        <div className="mb-8 pb-6 border-b-2 border-dashed border-amber-900">
                            <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 tracking-wider font-serif">
                                USER ACCESS
                            </h1>

                            <p className="text-xs sm:text-sm mt-3 text-amber-800 font-serif uppercase tracking-wide">
                                Login or register to continue
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-5">

                            <Link
                                to="/login"
                                className="block w-full text-center bg-amber-800 text-amber-50 border-2 border-amber-900 px-4 py-3
          font-bold tracking-wider uppercase text-sm font-serif
          transition-all duration-200
          hover:bg-amber-900 hover:shadow-lg
          active:translate-y-0.5"
                            >
                                 LOGIN
                            </Link>

                            <Link
                                to="/register"
                                className="block w-full text-center bg-amber-50 text-amber-900 border-2 border-amber-900 px-4 py-3
          font-bold tracking-wider uppercase text-sm font-serif
          transition-all duration-200
          hover:bg-amber-200 hover:shadow-md
          active:translate-y-0.5"
                            >
                                 REGISTER
                            </Link>

                        </div>

                    </div>
                </div>
            </div>}
        </main>
    )

}

export default Home;