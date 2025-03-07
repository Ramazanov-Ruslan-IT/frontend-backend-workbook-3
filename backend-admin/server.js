const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, '../data/products.json');

app.use(express.json());
app.use(cors());
console.log("🚀 Сервер запускается...");

console.log("📁 Проверяем путь к файлу:", DATA_FILE);
console.log("📁 Файл существует?", fs.existsSync(DATA_FILE));

app.listen(PORT, () => {
    console.log(`✅ API запущено на http://localhost:${PORT}`);
});

function readProducts() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        console.log("📖 JSON считан успешно!");
        return JSON.parse(data) || [];
    } catch (err) {
        console.error("❌ Ошибка чтения JSON:", err);
        return [];
    }
}

function writeProducts(products) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("❌ Ошибка записи JSON:", err);
        return false;
    }
}

app.get('/products', (req, res) => {
    console.log("📥 GET /products");
    res.json(readProducts());
});

app.post('/products', (req, res) => {
    console.log("📤 POST /products", req.body);
    let products = readProducts();

    // Генерация id (находим максимальный)
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id || 0)) : 0;
    const newProduct = { id: maxId + 1, ...req.body };

    products.push(newProduct);

    if (writeProducts(products)) {
        console.log("✅ Товар добавлен:", newProduct);
        res.status(201).json(newProduct);
    } else {
        res.status(500).json({ error: 'Ошибка записи' });
    }
});

app.delete('/products/:id', (req, res) => {
    console.log("🗑️ DELETE /products", req.params.id);

    let products = readProducts();
    const productId = Number(req.params.id); // Приводим к числу

    if (isNaN(productId)) {
        console.log("❌ Ошибка: Некорректный ID");
        return res.status(400).json({ error: "Некорректный ID" });
    }

    const filteredProducts = products.filter(p => Number(p.id) !== productId);

    if (filteredProducts.length === products.length) {
        console.log("❌ Ошибка: Товар не найден");
        return res.status(404).json({ error: 'Товар не найден' });
    }

    if (writeProducts(filteredProducts)) {
        console.log(`✅ Товар с ID ${productId} удалён`);
        res.status(200).json({ message: 'Товар удалён' });
    } else {
        console.log("❌ Ошибка при записи JSON");
        res.status(500).json({ error: 'Ошибка записи' });
    }
});
