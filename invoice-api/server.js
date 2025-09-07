const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const path = require("path");

const app = express();
app.use(bodyParser.json({ type: 'application/json', limit: '1mb' }));

app.post("/invoice", (req, res) => {
  let { firm, product, qty, price } = req.body;

  // Безопасна обработка на кирилица
  if (typeof firm !== "string") firm = JSON.stringify(firm);
  if (typeof product !== "string") product = JSON.stringify(product);
  qty = Number(qty) || 0;
  price = Number(price) || 0;
  const total = qty * price;

  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfData),
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=invoice.pdf",
    }).end(pdfData);
  });

  // Зареждаме шрифта за кирилица
  doc.registerFont('DejaVu', path.join(__dirname, 'fonts/DejaVuSans.ttf'));
  doc.font('DejaVu');

  // Съдържание на фактурата
  doc.fontSize(20).text("Фактура", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Фирма: ${firm}`);
  doc.text(`Продукт: ${product}`);
  doc.text(`Количество: ${qty}`);
  doc.text(`Ед. цена: ${price} лв.`);
  doc.moveDown();
  doc.fontSize(14).text(`Общо: ${total} лв.`, { align: "right" });

  doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
