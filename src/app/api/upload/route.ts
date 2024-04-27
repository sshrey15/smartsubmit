import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import PDFParser from 'pdf2json'; // To parse the pdf
import {  PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      
    },
  },
});


export async function POST(req: NextRequest) {
  
  const formData = await req.formData();
  
  const f = formData.get("file");

  if (!f) {
    return NextResponse.json({}, { status: 400 });
  }

  const file = f as File;
  console.log(`File name: ${file.name}`);
  console.log(`Content-Length: ${file.size}`);

  const destinationDirPath = path.join(process.cwd(), "public/upload");
  console.log(destinationDirPath);

  const fileArrayBuffer = await file.arrayBuffer();

  if (!existsSync(destinationDirPath)) {
    fs.mkdir(destinationDirPath, { recursive: true });
  }
  await fs.writeFile(
    path.join(destinationDirPath, file.name),
    Buffer.from(fileArrayBuffer)
  );

  // Parse the pdf using pdf2json
  const pdfParser = new (PDFParser as any)(null, 1);

  pdfParser.on('pdfParser_dataError', (errData: any) =>
    console.error(errData.parserError)
  );

  const parsedText = await new Promise<string>((resolve, reject) => {
    pdfParser.on('pdfParser_dataReady', () => {
      let text = (pdfParser as any).getRawTextContent();
      text = text.replace(/[\r\n]/g, ''); // Remove all \r and \n characters
      console.log(text);
      resolve(text);
    });
  
    pdfParser.on('pdfParser_dataError', reject);
  
    pdfParser.parseBuffer(Buffer.from(fileArrayBuffer));
  });

  const lines = parsedText.split('\n');
  let currentQA = '';
  let filteredLines = [];
  
  for (let line of lines) {


    if (line.trim().startsWith("Question:")) {
      if (currentQA) {
        filteredLines.push(currentQA + '\n'); // Add a newline after each question
      }
      currentQA = line;
    } else if (line.trim().startsWith("Answer:")) {
      if (currentQA) {
        filteredLines.push(currentQA);
      }
      currentQA = line;
    } else {
      currentQA += '\n' + line;
    }
  }
  if (currentQA) {
    filteredLines.push(currentQA);
  }

  let parsedTextString = filteredLines.join('\n');
  

  const docs = await prisma.docs.create({
    data:{
      name: file.name,
      info: parsedTextString
    },
  })

  const response = NextResponse.json({
    message: "uploaded_data", docs
  })
  return response;  

  // return NextResponse.json({
  //   fileName: file.name,
  //   size: file.size,
  //   lastModified: new Date(file.lastModified),
  //   parsedText: parsedTextString,
  // });
}