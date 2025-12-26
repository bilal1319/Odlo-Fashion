// utils/pdfGenerator.js
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export const generateOrderReceipt = async (order, user, shippingAddress) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      
      // ===== HEADER =====
      // Company Name instead of logo
      doc.fontSize(24).font('Helvetica-Bold')
         .text('Odlo Center', 50, 50, { align: 'center' });
      
      // Invoice Title
      doc.moveDown(2);
      doc.fontSize(18).text('INVOICE', { align: 'center' });
      doc.moveDown(1);
      
      // ===== CUSTOMER ADDRESS =====
      const customerY = doc.y;
      doc.fontSize(10).font('Helvetica');
      doc.text(user.username || 'Customer', 50, customerY);
      if (shippingAddress) {
        if (shippingAddress.address) doc.text(shippingAddress.address, 50, doc.y + 5);
        if (shippingAddress.city) doc.text(shippingAddress.city, 50, doc.y + 5);
        if (shippingAddress.state) doc.text(`${shippingAddress.state} ${shippingAddress.zipCode || ''}`, 50, doc.y + 5);
        if (shippingAddress.country) doc.text(shippingAddress.country, 50, doc.y + 5);
      } else {
        doc.text(user.email, 50, doc.y + 5);
      }
      
      // ===== PRODUCT TABLE =====
      doc.moveDown(3);
      doc.fontSize(12).font('Helvetica-Bold')
         .text('Product', 50, doc.y);
      
      // Table Headers
      const tableTop = doc.y + 15;
      const productX = 50;
      const quantityX = 300;
      const priceX = 400;
      
      // Draw table headers
      doc.fontSize(10).font('Helvetica-Bold')
         .text('Product', productX, tableTop)
         .text('Quantity', quantityX, tableTop)
         .text('Price', priceX, tableTop);
      
      // Draw header line
      doc.moveTo(productX, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();
      
      // Table Rows
      let y = tableTop + 25;
      doc.fontSize(10).font('Helvetica');
      
      order.items.forEach((item) => {
        const itemName = item.title || 'Product';
        const itemDescription = item.useCase ? `\n${item.useCase}` : '';
        
        // Product name with description
        doc.text(`${itemName}${itemDescription}`, productX, y, {
          width: 240,
          lineBreak: false
        });
        
        // Quantity
        doc.text(item.quantity.toString(), quantityX, y);
        
        // Price
        doc.text(`$ ${item.price.toFixed(2)}`, priceX, y);
        
        y += 30; // Adjust based on description length
      });
      
      // ===== TOTALS =====
      y = Math.max(y, tableTop + 100); // Ensure minimum space
      
      // Subtotal
      doc.text('Subtotal', productX + 200, y);
      doc.text(`$ ${order.subtotal.toFixed(2)}`, priceX, y);
      y += 20;
      
      // Tax
      doc.text('Tax (23%)', productX + 200, y);
      doc.text(`$ ${order.tax.toFixed(2)}`, priceX, y);
      y += 20;
      
      // Total
      doc.font('Helvetica-Bold');
      doc.text('Total', productX + 200, y);
      doc.text(`$ ${order.total.toFixed(2)}`, priceX, y);
      
      // ===== COMPANY FOOTER =====
      const footerY = 650;
      doc.fontSize(10).font('Helvetica')
         .text('Odlo Center', 50, footerY, { align: 'center' });
      
      doc.fontSize(8);
      doc.text('8 The Green, Suite R, City Dover, State Delaware, United States of America', 
               50, footerY + 15, { align: 'center' });
      doc.text('Dover, DE 19901, United States (US)', 
               50, footerY + 25, { align: 'center' });
      doc.text('01234567890 | feedback@odlocenter.com', 
               50, footerY + 35, { align: 'center' });
      
      // ===== ORDER DETAILS =====
      const detailsY = footerY + 60;
      doc.fontSize(9)
         .text(`Order Number: ${order._id.toString().slice(-6)}`, 50, detailsY)
         .text(`Order Date: ${format(new Date(order.createdAt), 'MMMM dd, yyyy')}`, 
               50, detailsY + 12);
      
      if (order.paymentMethod) {
        doc.text(`Payment Method: ${order.paymentMethod}`, 50, detailsY + 24);
      }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};