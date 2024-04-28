"use client";
import { useState } from "react";
import { supabase } from "@/../utils/supabase";

export default function TeacherDashboard() {
  const [prompt, setPrompt] = useState("");

  const handleAnalyze = async () => {
    // console.log(prompt)
    let result = await fetch("http://localhost:3000/api/analyze", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    result = await result.json();
    console.log(result);
  };

  const getDataFromDB = async () => {
    const { data, error } = await supabase.from("Docs").select("*");
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.log("Data fetched from Supabase:", data);
    }
  };
  return (
    <>
      <h1>Teacher Dashboard</h1>
      <div className="m-5">
        <label htmlFor="prompt">
          Enter Text -
          <input
            type="text"
            name="prompt"
            id="prompt"
            placeholder="Enter Prompt"
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button onClick={handleAnalyze}>Analyze</button>
      </div>
      <div>
        <button onClick={getDataFromDB}>Supabase</button>
      </div>
    </>
  );
}
