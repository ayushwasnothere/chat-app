"use client";
import { InputBox } from "@repo/ui/inputBox";
import { useState } from "react";

export default function Temp() {
  const [m, setM] = useState(0);
  const [p, setP] = useState(0);
  const [c, setC] = useState(0);
  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="p-10 text-4xl flex flex-col items-start text-left gap-4">
        <div className="font-bold">Something's High School</div>
        <div className="flex flex-row gap-4">
          <div>
            <InputBox label="Admin no." placeholder="" onChange={(e) => e} />
          </div>
          <div>
            <InputBox
              label="Name"
              placeholder=""
              onChange={(e) => {
                e;
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-start">
          <InputBox
            label="Math"
            placeholder=""
            onChange={(e) => setM(Number(e.target.value))}
          />
          <InputBox
            label="Physics"
            placeholder=""
            onChange={(e) => setP(Number(e.target.value))}
          />
          <InputBox
            label="Chemistry"
            placeholder=""
            onChange={(e) => setC(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-row text-xl gap-4 justify-center items-center">
          <div>Result:</div>
          <div className="border-2 border-gray-100 w-40 h-10 flex items-center justify-center">
            {m && c && p
              ? m >= 35 && p >= 35 && c >= 35
                ? "PASS"
                : "FAIL"
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
