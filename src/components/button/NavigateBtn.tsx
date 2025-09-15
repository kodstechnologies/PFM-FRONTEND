import React from 'react';
import { useNavigate } from 'react-router-dom';

type NavigateBtnProps = {
  to: string;
  state?: any;   // 👈 allow state
  label?: React.ReactNode;
  className?: string;
};

function NavigateBtn({ to, state, label = "Go", className = "" }: NavigateBtnProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to, { state }); // 👈 pass state to navigate
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded text-white font-semibold transition
bg-gradient-to-r from-[#e11d48] to-[#f87171]
hover:from-[#be123c] hover:to-[#ef4444]
shadow-md hover:shadow-lg ${className} min-w-[4rem]
`}
    >
      {label}
    </button>
  );
}

export default NavigateBtn;
