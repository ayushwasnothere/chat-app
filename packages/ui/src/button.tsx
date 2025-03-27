"use client";

interface ButtonType {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ label, onClick }: ButtonType) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full text-white bg-gray-950 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
    >
      {label}
    </button>
  );
}
