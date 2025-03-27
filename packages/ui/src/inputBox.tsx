"use client";

interface InputBoxType {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputBox({ label, placeholder, onChange }: InputBoxType) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-left w-full box-border">
      <div>{label}</div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-3 border rounded focus-visible:outline-none border-slate-200 text-sm"
      />
    </div>
  );
}
