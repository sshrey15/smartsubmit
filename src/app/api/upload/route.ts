import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import PDFParser from 'pdf2json';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function saveFile(file: File, destinationDirPath: string) {
  const fileArrayBuffer = await file.arrayBuffer();

  if (!existsSync(destinationDirPath)) {
    await fs.mkdir(destinationDirPath, { recursive: true });
  }
  await fs.writeFile(
    path.join(destinationDirPath, file.name),
    Buffer.from(fileArrayBuffer)
  );
}

async function parsePdf(file: File) {
  const fileArrayBuffer = await file.arrayBuffer();
  const pdfParser = new PDFParser(null, 1) as any;

  return new Promise<string>((resolve, reject) => {
    pdfParser.on('pdfParser_dataReady', () => {
      let text = pdfParser.getRawTextContent();
      text = text.replace(/[\r\n]/g, '');
      resolve(text);
    });

    pdfParser.on('pdfParser_dataError', reject);

    pdfParser.parseBuffer(Buffer.from(fileArrayBuffer));
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const f = formData.get("file");

    if (!f) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const file = f as File;
    const destinationDirPath = path.join(process.cwd(), "public/upload");

    await saveFile(file, destinationDirPath);

    const parsedText = await parsePdf(file);

    const docs = await prisma.docs.create({
      data:{
        name: file.name,
        info: parsedText
      },
    });

    return NextResponse.json({ message: "uploaded_data", docs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}