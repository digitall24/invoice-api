  const html = `
  <html lang="bg">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; margin: 40px; }
        h1 { text-align: center; margin-bottom: 0; }
        .subtitle { text-align: center; margin-top: 0; font-size: 11px; }
        .flex { display: flex; justify-content: space-between; margin-top: 20px; }
        .box { width: 48%; border: 1px solid #000; padding: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        .right { text-align: right; }
        .summary { margin-top: 20px; float: right; border: 1px solid #000; padding: 8px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 80px; }
        .sign { text-align: center; width: 40%; border-top: 1px solid #000; }
      </style>
    </head>
    <body>
      <h1>ФАКТУРА</h1>
      <p class="subtitle">№ ${Date.now()} / ${new Date().toLocaleDateString("bg-BG")}</p>

      <div class="flex">
        <div class="box">
          <strong>Издател:</strong><br>
          Моята фирма ООД<br>
          ЕИК: 123456789<br>
          ДДС №: BG123456789<br>
          Адрес: София, ул. Примерна 1<br>
          Банка: Пример банк<br>
          IBAN: BG00XXXX00000000000000
        </div>
        <div class="box">
          <strong>Получател:</strong><br>
          ${firm}<br>
          ЕИК: 987654321<br>
          ДДС №: BG987654321<br>
          Адрес: Град, Улица 2
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Мярка</th>
            <th>Количество</th>
            <th>Ед. цена</th>
            <th>Стойност</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${product}</td>
            <td>бр.</td>
            <td class="right">${qty}</td>
            <td class="right">${price.toFixed(2)} лв.</td>
            <td class="right">${total.toFixed(2)} лв.</td>
          </tr>
        </tbody>
      </table>

      <div class="summary">
        Данъчна основа: ${total.toFixed(2)} лв.<br>
        ДДС 20%: ${(total * 0.20).toFixed(2)} лв.<br>
        <strong>Общо: ${(total * 1.20).toFixed(2)} лв.</strong>
      </div>

      <div style="clear: both;"></div>

      <p><strong>Начин на плащане:</strong> Банков превод</p>
      <p><strong>Дата на дан. събитие:</strong> ${new Date().toLocaleDateString("bg-BG")}</p>
      <p><em>Словом: ... (тук може да се добави функция за число → думи)</em></p>

      <div class="signatures">
        <div class="sign">Съставил</div>
        <div class="sign">Получил</div>
      </div>
    </body>
  </html>
  `;
