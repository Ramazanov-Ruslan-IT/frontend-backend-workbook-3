const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
    console.log(`✅ Клиентский сервер запущен: http://localhost:${PORT}`);
    console.log(`📌 Открыть каталог товаров: http://localhost:${PORT}`);
    console.log(`📌 Открыть админ-панель: http://localhost:${PORT}/admin.html`);
});
