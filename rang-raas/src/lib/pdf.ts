import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export async function generateBookingPDF(booking: any, tickets: any[]) {
  const pdfDoc = await PDFDocument.create();
  
  // Use Helvetica as standard sans-serif
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const totalTickets = tickets.length;
  const sortedTickets = [...tickets].sort((a, b) => a.id - b.id);

  // Colors
  const bgColor = rgb(10 / 255, 15 / 255, 25 / 255); // Deep navy/black
  const goldColor = rgb(220 / 255, 179 / 255, 101 / 255); // Rich Gold
  const whiteColor = rgb(1, 1, 1);
  const grayColor = rgb(150 / 255, 160 / 255, 170 / 255);
  const darkGold = rgb(150 / 255, 110 / 255, 40 / 255);

  // Ticket Dimensions
  const width = 420;
  const height = 800;

  for (let i = 0; i < totalTickets; i++) {
    const ticket = sortedTickets[i];
    const page = pdfDoc.addPage([width, height]);
    
    // Background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: bgColor,
    });

    // Gold Border
    page.drawRectangle({
      x: 15,
      y: 15,
      width: width - 30,
      height: height - 30,
      borderColor: darkGold,
      borderWidth: 1,
    });

    let y = height - 60;

    // Logo Area
    page.drawText("WCC", { x: width / 2 - 25, y, size: 18, font: fontBold, color: goldColor });
    
    y -= 30;
    // Title
    const title = "RANG RAAS";
    const titleWidth = fontBold.widthOfTextAtSize(title, 28);
    page.drawText(title, { x: (width - titleWidth) / 2, y, size: 28, font: fontBold, color: whiteColor });
    
    y -= 20;
    const subtitle = "PRE-NAVRATRI GARBA NIGHT";
    const subWidth = font.widthOfTextAtSize(subtitle, 12);
    page.drawText(subtitle, { x: (width - subWidth) / 2, y, size: 12, font: font, color: goldColor });
    
    y -= 30;
    // Status Badge
    page.drawRectangle({
      x: width / 2 - 70,
      y: y - 10,
      width: 140,
      height: 25,
      color: goldColor,
    });
    page.drawText("VALID ENTRY PASS", { x: width / 2 - 58, y: y - 3, size: 11, font: fontBold, color: rgb(0, 0, 0) });
    
    y -= 30;

    // QR Section
    // Draw white background for QR
    const qrSize = 180;
    const qrX = (width - qrSize) / 2;
    const qrY = y - qrSize;
    
    page.drawRectangle({
      x: qrX - 10,
      y: qrY - 10,
      width: qrSize + 20,
      height: qrSize + 20,
      color: whiteColor,
      borderColor: goldColor,
      borderWidth: 2,
    });

    const qrDataUrl = await QRCode.toDataURL(ticket.qr_token, { errorCorrectionLevel: 'H', margin: 0 });
    const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    
    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    y -= (qrSize + 40);

    // Ticket Number & ID
    const tNumStr = `TICKET ${i + 1} OF ${totalTickets}`;
    const tNumWidth = fontBold.widthOfTextAtSize(tNumStr, 14);
    page.drawText(tNumStr, { x: (width - tNumWidth) / 2, y, size: 14, font: fontBold, color: goldColor });
    
    y -= 20;
    const tIdStr = ticket.ticket_id;
    const tIdWidth = font.widthOfTextAtSize(tIdStr, 18);
    page.drawText(tIdStr, { x: (width - tIdWidth) / 2, y, size: 18, font: fontBold, color: whiteColor });

    y -= 30;
    
    // Perforation Line
    page.drawLine({
      start: { x: 30, y },
      end: { x: width - 30, y },
      thickness: 1,
      color: darkGold,
      dashArray: [5, 5]
    });

    y -= 30;

    // Customer & Booking Info Card
    const infoX = 40;
    page.drawText("CUSTOMER", { x: infoX, y, size: 9, font: font, color: grayColor });
    page.drawText("BOOKING ID", { x: width / 2 + 10, y, size: 9, font: font, color: grayColor });
    y -= 15;
    page.drawText(booking.name.substring(0, 20), { x: infoX, y, size: 12, font: fontBold, color: whiteColor });
    page.drawText(booking.booking_id, { x: width / 2 + 10, y, size: 12, font: fontBold, color: whiteColor });
    
    y -= 25;
    page.drawText("PASS TYPE", { x: infoX, y, size: 9, font: font, color: grayColor });
    page.drawText("TOTAL AMOUNT", { x: width / 2 + 10, y, size: 9, font: font, color: grayColor });
    y -= 15;
    page.drawText(booking.pass_type.toUpperCase() + " PASS", { x: infoX, y, size: 12, font: fontBold, color: whiteColor });
    page.drawText(`Rs. ${booking.total_amount}`, { x: width / 2 + 10, y, size: 12, font: fontBold, color: whiteColor });

    y -= 35;
    
    // Perforation Line 2
    page.drawLine({
      start: { x: 30, y },
      end: { x: width - 30, y },
      thickness: 1,
      color: darkGold,
      dashArray: [5, 5]
    });

    y -= 35;

    // Event Info
    page.drawText("DATE & TIME", { x: infoX, y, size: 9, font: font, color: grayColor });
    y -= 15;
    page.drawText("Saturday, 10 October 2026", { x: infoX, y, size: 11, font: fontBold, color: whiteColor });
    y -= 15;
    page.drawText("7:00 PM - 10:00 PM", { x: infoX, y, size: 11, font: font, color: whiteColor });

    y -= 25;
    page.drawText("VENUE", { x: infoX, y, size: 9, font: font, color: grayColor });
    y -= 15;
    page.drawText("Ranbhoomi", { x: infoX, y, size: 11, font: fontBold, color: whiteColor });
    y -= 15;
    page.drawText("Marambal Pada Rd, Jatty Rd, near Sai Baba Mandir", { x: infoX, y, size: 9, font: font, color: grayColor });
    y -= 12;
    page.drawText("Virar West, Maharashtra 401301", { x: infoX, y, size: 9, font: font, color: grayColor });

    y -= 40;
    
    // Footer
    page.drawText("PLEASE SHOW THIS QR CODE AT THE ENTRANCE", { x: width / 2 - 130, y, size: 9, font: fontBold, color: goldColor });
    y -= 15;
    page.drawText("Please carry a valid photo ID matching the name on this ticket.", { x: width / 2 - 130, y, size: 8, font: font, color: grayColor });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
