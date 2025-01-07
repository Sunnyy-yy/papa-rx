import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { fileName, prescriptionHTML } = await req.json();

    if (!fileName || !prescriptionHTML) {
      return NextResponse.json(
        { error: "Missing fileName or prescriptionHTML" },
        { status: 400 }
      );
    }

    // Get the current date in 'dd mm yyyy' format
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Sanitize file name by replacing special characters like ":" with "-"
    const sanitizedFileName = fileName.replace(/:/g, "-");

    // Construct folder path based on the current date
    const folderPath = path.join(process.cwd(), "backup", formattedDate);

    // Create folder if it doesn't exist
    await fs.mkdir(folderPath, { recursive: true });

    // Generate the file path (assuming fileName already contains the sanitized timestamp)
    const filePath = path.join(folderPath, `${sanitizedFileName}.pdf`);

    console.log("File Path:", filePath); // Add this to log and verify the path

    // Launch Puppeteer and create the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(prescriptionHTML, { waitUntil: "load" });

    // Generate PDF and save it
    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return NextResponse.json({ message: "PDF saved successfully", filePath });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
