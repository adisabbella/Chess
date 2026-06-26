import React from 'react'
import {useNavigate} from "react-router-dom"

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 bg-neutral-800 p-8 rounded-2xl shadow-2xl">
        
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src="../chessPic.png" 
            alt="Chessboard UI" 
            className="w-full max-w-[320px] md:max-w-none aspect-square object-contain rounded-lg shadow-lg" 
          />
        </div>

        <div className="w-full md:w-1/2 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Play Chess Online!
          </h1>
          
          <button 
            onClick={() => {
              navigate('/game')
            }} 
            className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 transition-colors text-white font-bold text-lg rounded-md shadow-lg shadow-emerald-900/20 cursor-pointer"
          >
            Play Now
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default LandingPage;