const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, '../data/products.json');

app.use(express.json());
app.use(cors());

function readProducts() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data) || [];
    } catch (err) {
        console.error("❌ Ошибка чтения JSON:", err);
        return [];
    }
}

app.get('/products', (req, res) => {
    console.log("📥 GET /products");
    res.json(readProducts());
});

app.post('/products', (req, res) => {
    console.log("📤 POST /products", req.body);

    let products = readProducts();
    const newProduct = { id: Date.now(), ...req.body };

    products.push(newProduct);

    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error("❌ Ошибка записи в файл:", err);
            return res.status(500).json({ error: 'Ошибка записи' });
        }
        console.log("✅ Товар добавлен:", newProduct);
        res.status(201).json(newProduct);
    });
});

app.listen(PORT, () => {
    console.log(`✅ API запущено на http://localhost:${PORT}`);
});
