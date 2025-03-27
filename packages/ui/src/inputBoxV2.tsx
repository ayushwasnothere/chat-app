"use client";

interface InputBoxType {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputBoxV2({ placeholder, onChange }: InputBoxType) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-left w-full box-border">
      <input
        onChange={onChange}
        placeholder={placeholder}
        className="py-2 border-b border-slate-200 text-sm focus:outline-none"
      />
    </div>
  );
}
