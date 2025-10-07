import React from 'react';

interface SubmitButtonProps {
  label?: string;
  isSubmitting?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  isSubmitting = false,
}) => {
  return (
    <button
      type="submit"
      className="px-4 py-2 rounded text-white font-semibold transition
bg-gradient-to-r from-[#14532d] to-[#15803d]
hover:from-[#166534] hover:to-[#22c55e]
shadow-md hover:shadow-lg max-w-[12rem]
"
      // className="bg-gradient-to-r from-[#7FB77E] to-[#B1D7B4] text-white hover:from-[#B1D7B4] hover:to-[#7FB77E] px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : label}
    </button>
  );
};

export default SubmitButton;
