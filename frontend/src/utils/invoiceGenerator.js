import { jsPDF } from 'jspdf';

const GREENMOVE_ADDRESS = 'B301, Vidyulata Prince Palace CHS, Sector 11, Kharghar, Navi Mumbai, Maharashtra, 410210';
const GST_NUMBER = 'GST27AABCU9603R1ZX'; // GST
const GST_RATE = 0.18; // 18% GST

export const generateInvoice = (ride, user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Generate invoice number (timestamp-based)
  const invoiceNumber = `GM${new Date(ride.startTime).getFullYear()}${String(new Date(ride.startTime).getMonth() + 1).padStart(2, '0')}${ride._id.slice(-6).toUpperCase()}`;
  
  // Colors
  const primaryColor = [34, 197, 94]; // green-500
  const darkColor = [31, 41, 55]; // gray-800
  const lightGray = [156, 163, 175]; // gray-400
  
  // ============ HEADER ============
  // Company Name
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  doc.setFont(undefined, 'bold');
  doc.text('GreenMove', 20, 25);
  
  // Tagline
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.setFont(undefined, 'normal');
  doc.text('Sustainable Urban Mobility', 20, 32);
  
  // Invoice Title
  doc.setFontSize(22);
  doc.setTextColor(...darkColor);
  doc.setFont(undefined, 'bold');
  doc.text('RIDE INVOICE', pageWidth - 20, 25, { align: 'right' });
  
  // Invoice Number & Date
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont(undefined, 'normal');
  doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - 20, 32, { align: 'right' });
  doc.text(`Date: ${new Date(ride.endTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - 20, 37, { align: 'right' });
  
  // Divider
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 45, pageWidth - 20, 45);
  
  // ============ FROM / TO SECTION ============
  let yPos = 55;
  
  // From Section
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont(undefined, 'bold');
  doc.text('FROM:', 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('GreenMove Technologies Pvt. Ltd.', 20, yPos + 7);
  
  // Split address into multiple lines
  const fromAddressLines = doc.splitTextToSize(GREENMOVE_ADDRESS, 80);
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text(fromAddressLines, 20, yPos + 13);
  
  doc.text(`GST: ${GST_NUMBER}`, 20, yPos + 13 + (fromAddressLines.length * 4));
  
  // To Section
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont(undefined, 'bold');
  doc.text('BILL TO:', pageWidth / 2 + 10, yPos);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(user.name, pageWidth / 2 + 10, yPos + 7);
  
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  
  // User address (split and display)
  if (user.address) {
    const toAddressLines = doc.splitTextToSize(user.address, 80);
    doc.text(toAddressLines, pageWidth / 2 + 10, yPos + 13);
    const addressHeight = toAddressLines.length * 4;
    doc.text(user.email, pageWidth / 2 + 10, yPos + 13 + addressHeight);
    doc.text(user.phone || 'N/A', pageWidth / 2 + 10, yPos + 18 + addressHeight);
  } else {
    // Fallback if no address
    doc.text(user.email, pageWidth / 2 + 10, yPos + 13);
    doc.text(user.phone || 'N/A', pageWidth / 2 + 10, yPos + 18);
  }
  
  yPos = 105;
  
  // ============ RIDE DETAILS BOX ============
  doc.setFillColor(249, 250, 251); // gray-50
  doc.rect(20, yPos, pageWidth - 40, 35, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont(undefined, 'bold');
  doc.text('RIDE DETAILS', 25, yPos + 8);
  
  yPos += 15;
  
  // Ride info grid
  const rideDetails = [
    { label: 'Vehicle:', value: `${ride.vehicleId?.brand || 'N/A'} ${ride.vehicleId?.model || ''} (${ride.vehicleId?.vehicleNumber || 'N/A'})` },
    { label: 'Type:', value: ride.vehicleId?.type?.charAt(0).toUpperCase() + ride.vehicleId?.type?.slice(1) || 'N/A' },
    { label: 'Distance:', value: `${ride.distance?.toFixed(2) || '0.00'} km` },
    { label: 'Duration:', value: `${ride.duration || 0} mins` },
  ];
  
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont(undefined, 'normal');
  
  rideDetails.forEach((detail, index) => {
    const xPos = index < 2 ? 25 : pageWidth / 2 + 10;
    const localYPos = yPos + (index % 2) * 6;
    
    doc.setFont(undefined, 'bold');
    doc.text(detail.label, xPos, localYPos);
    
    doc.setFont(undefined, 'normal');
    doc.text(detail.value, xPos + 20, localYPos);
  });
  
  yPos = 140;
  
  // ============ BILLING TABLE ============
  // Table header
  doc.setFillColor(...primaryColor);
  doc.rect(20, yPos, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('Description', 25, yPos + 6.5);
  doc.text('Amount', pageWidth - 45, yPos + 6.5);
  
  yPos += 15;
  
  // Calculate billing breakdown
  const baseFare = parseFloat(ride.baseFare) || 0;
  const distanceFare = parseFloat(ride.distanceFare) || 0;
  const subtotal = baseFare + distanceFare;
  const gstAmount = subtotal * GST_RATE;
  const totalBeforePayments = subtotal + gstAmount;
  
  const rewardPointsUsed = parseFloat(ride.pointsRedeemed) || 0;
  const walletUsed = totalBeforePayments - rewardPointsUsed;
  const cashback = parseFloat(ride.pointsEarned) || 0;
  
  // Billing items
  const billingItems = [
    { desc: 'Base Fare', amount: `Rs. ${baseFare.toFixed(2)}`, isBold: false },
    { desc: 'Distance Charges', amount: `Rs. ${distanceFare.toFixed(2)}`, isBold: false },
    { desc: 'Subtotal', amount: `Rs. ${subtotal.toFixed(2)}`, isBold: true, isSubtotal: true },
    { desc: `GST (${(GST_RATE * 100).toFixed(0)}%)`, amount: `Rs. ${gstAmount.toFixed(2)}`, isBold: false },
    { desc: 'Total Amount', amount: `Rs. ${totalBeforePayments.toFixed(2)}`, isBold: true, isTotal: true },
  ];
  
  // Draw billing items
  doc.setTextColor(...darkColor);
  billingItems.forEach((item, index) => {
    if (item.isSubtotal || item.isTotal) {
      // Divider line before subtotal/total
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.3);
      doc.line(20, yPos - 2, pageWidth - 20, yPos - 2);
      yPos += 3;
    }
    
    doc.setFontSize(item.isBold ? 11 : 10);
    doc.setFont(undefined, item.isBold ? 'bold' : 'normal');
    
    doc.text(item.desc, 25, yPos);
    doc.text(item.amount, pageWidth - 25, yPos, { align: 'right' });
    
    yPos += item.isTotal ? 10 : 7;
  });
  
  // ============ PAYMENT METHOD ============
  doc.setFillColor(239, 246, 255); // blue-50
  doc.rect(20, yPos, pageWidth - 40, 28, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont(undefined, 'bold');
  doc.text('PAYMENT BREAKDOWN', 25, yPos + 7);
  
  yPos += 14;
  
  const paymentItems = [
    { label: 'Reward Points Redeemed:', value: `Rs. ${rewardPointsUsed.toFixed(2)}` },
    { label: 'Wallet Balance Used:', value: `Rs. ${walletUsed.toFixed(2)}` },
    { label: 'Cashback Earned:', value: `+Rs. ${cashback.toFixed(2)}`, isGreen: true },
  ];
  
  doc.setFontSize(9);
  paymentItems.forEach((item) => {
    doc.setTextColor(...lightGray);
    doc.setFont(undefined, 'normal');
    doc.text(item.label, 25, yPos);
    
    if (item.isGreen) {
      doc.setTextColor(...primaryColor);
    } else {
      doc.setTextColor(...darkColor);
    }
    doc.setFont(undefined, 'bold');
    doc.text(item.value, pageWidth - 25, yPos, { align: 'right' });
    
    yPos += 6;
  });
  
  // ============ FOOTER ============
  yPos = doc.internal.pageSize.getHeight() - 40;
  
  // Thank you message
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for choosing GreenMove!', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont(undefined, 'normal');
  doc.text(`You saved ${(ride.carbonSaved || 0).toFixed(2)} kg of CO2 with this ride`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Footer info
  doc.setFontSize(8);
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('For support, contact: support@greenmove.in | +91 98765 43210', pageWidth / 2, yPos, { align: 'center' });
  
  // Final divider
  yPos += 6;
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 4;
  doc.setFontSize(7);
  doc.text('Powered by GreenMove Technologies Pvt. Ltd. | www.greenmove.in', pageWidth / 2, yPos, { align: 'center' });
  
  // Save the PDF
  const fileName = `GreenMove_Invoice_${invoiceNumber}.pdf`;
  doc.save(fileName);
};
