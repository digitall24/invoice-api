const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const app = express();
app.use(bodyParser.json({ type: "application/json", limit: "1mb" }));

// Папка за PDF файлове
const pdfFolder = path.join(__dirname, "generated");
if (!fs.existsSync(pdfFolder)) fs.mkdirSync(pdfFolder);

// Static folder за публичен достъп
app.use("/generated", express.static(pdfFolder));

app.post("/invoice", async (req, res) => {
  const { firm, product, qty, price } = req.body;
  const total = Number(qty) * Number(price);

  const fileName = `invoice_${Date.now()}.pdf`;
  const filePath = path.join(pdfFolder, fileName);

  // HTML шаблон – тук ще сложим дизайна ти
  const html = `
  <html lang="bg">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; margin: 40px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        .right { text-align: right; }
        .summary { margin-top: 20px; float: right; }
      </style>
    </head>
    <body>
      <h1>Фактура</h1>
      <p><strong>Фирма:</strong> ${firm}</p>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Продукт</th>
            <th>Количество</th>
            <th>Ед. цена</th>
            <th>Стойност</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${product}</td>
            <td class="right">${qty}</td>
            <td class="right">${price} лв.</td>
            <td class="right">${total} лв.</td>
          </tr>
        </tbody>
      </table>
      <div class="summary">
        <p><strong>Общо: ${total} лв.</strong></p>
      </div>
    </body>
  </html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4" });
    await browser.close();

    const pdfUrl = `https://invoice-api-na2i.onrender.com/generated/${fileName}`;
    res.json({ pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Грешка при генериране на PDF" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
