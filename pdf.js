/*import PDFDocument from "pdfkit";
import fs from "fs";

export function generatePDF (data){

  const doc = new PDFDocument();
  const filename = `booking_summary_${bookingDetail.name}_${bookingDetail.surname}.pdf`;
  const stream = fs.createWriteStream(filename);

  doc.pipe(stream);
  doc.fontSize(24).text('Booking Summary', { align: 'center' });

  doc.fontSize(18).text(`Name: ${bookingDetail.name} ${bookingDetail.surname}`);
  // Add other details to the PDF

  // End the PDF generation
  doc.end();

  return filename;
}*/


async function generateAndHandlePDF() {
  try {
    const pdfData = await generatePDF();
    console.log('PDF Data: ', pdfData);
  } catch (error) {
    console.error('Error generating PDF: ', error);
  }
}

generateAndHandlePDF();
