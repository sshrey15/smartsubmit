import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);    //[NOTE: ] HIDE THIS

async function generateSummary(userDefinedText: any) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Check the correctness of the following in one line. Rate it on the scale of 1 to 10. Specify the part that is incorrect:"${userDefinedText}`;
    // const prompt = `Rate it on the scale of 1 to 10 based on correctness of the following. Explain What is incorrect:"${userDefinedText}`;


    const result = await model.generateContent(prompt);
    const response = await result.response; 
    const text = response.text();
    console.log(text);
    return text;
}

export async function POST(request:any) {
    try {
        const { prompt } = await request.json();
        const summary = await generateSummary(prompt);
        return NextResponse.json({ summary: summary });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.error();
    }
}
