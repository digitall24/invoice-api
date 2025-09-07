const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json({ type: 'application/json', limit: '1mb' }));

// Папка за PDF файлове
const pdfFolder = path.join(__dirname, "generated");
if (!fs.existsSync(pdfFolder)) fs.mkdirSync(pdfFolder);

// Static folder за публичен достъп
app.use("/generated", express.static(pdfFolder));

app.post("/invoice", (req, res) => {
  let { firm, product, qty, price } = req.body;

  if (typeof firm !== "string") firm = JSON.stringify(firm);
  if (typeof product !== "string") product = JSON.stringify(product);
  qty = Number(qty) || 0;
  price = Number(price) || 0;
  const total = qty * price;

  // Име на PDF файла
  // Функция за безопасно ASCII име
function slugify(text) {
  return text.toString().normalize("NFD")           // нормализиране
             .replace(/[\u0300-\u036f]/g, "")     // маха диакритики
             .replace(/\s+/g, "_")               // интервали → _
             .replace(/[^\w\-]+/g, "")           // маха всички не-ASCII символи
             .replace(/\_\_+/g, "_")             // двойни _ → единични
             .replace(/^_+/, "")                 // маха _ от начало
             .replace(/_+$/, "");                // маха _ от край
}

const fileName = `${slugify(firm)}_${Date.now()}.pdf`;;
  const filePath = path.join(pdfFolder, fileName);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Шрифт за кирилица
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

  stream.on("finish", () => {
    // Връщаме JSON с публичен URL
    const pdfUrl = `https://invoice-api-na2i.onrender.com/generated/${fileName}`;
    res.json({ pdfUrl });
  });

  stream.on("error", (err) => {
    res.status(500).json({ error: "Грешка при запис на PDF", details: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
