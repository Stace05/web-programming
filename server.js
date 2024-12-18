import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dbPromise = open({
  filename: path.join(__dirname, 'api', 'my_users.db'),
  driver: sqlite3.Database
});

const JWT_SECRET = process.env.JWT_SECRET;

const initializeDb = async () => {
  try {
    const db = await dbPromise;
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    
    await db.run(`
      CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        color TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    console.log('База даних ініціалізована та таблиці готові.');
  } catch (error) {
    console.error('Помилка ініціалізації бази даних:', error);
    process.exit(1); 
  }
};

initializeDb();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; 
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Недійсний токен' });
      }
      req.userId = decoded.userId;
      next();
    });
  } else {
    res.status(401).json({ error: 'Токен не наданий' });
  }
};

const getCards = async () => {
  const filePath = path.join(__dirname, 'api', 'Cards.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const cards = JSON.parse(data);

    return cards.map(card => ({
      ...card,
      price: Number(card.price)
    }));
  } catch (error) {
    console.error('Помилка доступу або читання Cards.json:', error);
    throw error;
  }
};

app.use(express.static(path.join(__dirname, 'build')));


app.get('/api/cards', async (req, res) => {
  try {
    const { limit = 3, offset = 0 } = req.query;
    const cards = await getCards();
    const paginatedCards = cards.slice(Number(offset), Number(offset) + Number(limit));

    res.json(paginatedCards);
  } catch (error) {
    console.error('Помилка при завантаженні карток:', error);
    res.status(500).json({ error: 'Не вдалося завантажити картки' });
  }
});

app.get('/api/cards-catalog', async (req, res) => {
  try {
    const {
      searchTerm = '',
      sortBy = 'none',
      sortOrder = 'descending',
      cat = 'false',
      dog = 'false',
      hamster = 'false'
    } = req.query;

    console.log('Параметри запиту:', req.query);

    let cards = await getCards();
    console.log('Кількість карток до фільтрації:', cards.length);

    const categoryFilters = [];
    if (cat.toLowerCase() === 'true') categoryFilters.push('cat');
    if (dog.toLowerCase() === 'true') categoryFilters.push('dog');
    if (hamster.toLowerCase() === 'true') categoryFilters.push('hamster');

    console.log('Категорії для фільтрації:', categoryFilters);

    if (categoryFilters.length > 0) {
      cards = cards.filter(card => {
        const cardCategory = card.category.toLowerCase();
        const isMatch = categoryFilters.includes(cardCategory);
        console.log(`Перевірка картки ID ${card.id} з категорією ${card.category}: ${isMatch}`);
        return isMatch;
      });
      console.log('Кількість після фільтрації по категоріям:', cards.length);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      cards = cards.filter(card => {
        const includes = card.title.toLowerCase().includes(lowerSearchTerm);
        console.log(`Перевірка картки ID ${card.id} за пошуком "${searchTerm}": ${includes}`);
        return includes;
      });
      console.log('Кількість після пошуку:', cards.length);
    }

    if (sortBy !== 'none') {
      let normalizedSortOrder = 'descending';
      if (typeof sortOrder === 'string') {
        const lowerSortOrder = sortOrder.toLowerCase();
        if (lowerSortOrder === 'asc' || lowerSortOrder === 'ascending') {
          normalizedSortOrder = 'ascending';
        } else if (lowerSortOrder === 'desc' || lowerSortOrder === 'descending') {
          normalizedSortOrder = 'descending';
        }
      }

      console.log(`Сортування за ${sortBy} у порядку ${normalizedSortOrder}`);

      const validSortBy = ['price', 'title'];
      if (!validSortBy.includes(sortBy.toLowerCase())) {
        return res.status(400).json({ error: 'Некоректне значення sortBy' });
      }

      cards = cards.sort((a, b) => {
        if (sortBy.toLowerCase() === 'price') {
          console.log(`Сортування картки ID ${a.id} зі ціною ${a.price} та картки ID ${b.id} зі ціною ${b.price}`);
          return normalizedSortOrder === 'descending' ? b.price - a.price : a.price - b.price;
        }
        if (sortBy.toLowerCase() === 'title') {
          return normalizedSortOrder === 'descending'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
        return 0;
      });
      console.log('Картки після сортування:', cards);
    }

    await delay(500);

    res.json(cards);
  } catch (error) {
    console.error('Помилка при завантаженні карток:', error);
    res.status(500).json({ error: 'Не вдалося завантажити картки' });
  }
});

app.get('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Запит на картку з id: ${id}`);
    const cards = await getCards();
    const card = cards.find(card => card.id === Number(id));

    console.log(`Знайдено картку:`, card);

    if (!card) {
      return res.status(404).json({ error: 'Картка не знайдена' });
    }

    await delay(500);

    res.json(card);
  } catch (error) {
    console.error('Помилка при завантаженні картки:', error);
    res.status(500).json({ error: 'Не вдалося завантажити картку' });
  }
});

app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const db = await dbPromise;
    const cartItems = await db.all('SELECT * FROM carts WHERE user_id = ?', userId);
    res.json(cartItems);
  } catch (error) {
    console.error('Помилка при завантаженні корзини:', error);
    res.status(500).json({ error: 'Не вдалося завантажити корзину' });
  }
});

app.post('/api/cart', authenticate, async (req, res) => {
  try {
    console.log('Received POST /api/cart request with body:', req.body);
    const { item_id, color, quantity } = req.body;

    if (!item_id || !color || !quantity) {
      console.log('Missing required fields: item_id, color, quantity');
      return res.status(400).json({ error: 'Необхідні поля: item_id, color, quantity' });
    }

    const db = await dbPromise;

    const cards = await getCards();
    const product = cards.find(card => card.id === Number(item_id));
    if (!product) {
      console.log('Product not found with item_id:', item_id);
      return res.status(400).json({ error: 'Product not found' });
    }

    const stockItem = product.stock.find(s => s.color.toLowerCase() === color.toLowerCase());
    if (!stockItem) {
      console.log('Color not available:', color);
      return res.status(400).json({ error: 'Color not available' });
    }

    if (quantity > stockItem.amount) {
      console.log('Requested quantity exceeds stock:', quantity, '>', stockItem.amount);
      return res.status(400).json({ error: 'Requested quantity exceeds stock' });
    }

    const existingItem = await db.get(
      'SELECT * FROM carts WHERE user_id = ? AND item_id = ? AND color = ?',
      req.userId,
      item_id,
      color.toLowerCase()
    );

    if (existingItem) {
      await db.run(
        'UPDATE carts SET quantity = quantity + ? WHERE id = ?',
        quantity,
        existingItem.id
      );
    } else {
      await db.run(
        'INSERT INTO carts (user_id, item_id, color, quantity) VALUES (?, ?, ?, ?)',
        req.userId,
        item_id,
        color.toLowerCase(),
        quantity
      );
    }

    const cartItems = await db.all('SELECT * FROM carts WHERE user_id = ?', req.userId);
    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    console.error('Помилка при додаванні товару до корзини:', error);
    res.status(500).json({ error: 'Не вдалося додати товар до корзини' });
  }
});

app.patch('/api/cart/:id', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params; 
    const { color, quantity } = req.body;

    if (!color || quantity === undefined) {
      return res.status(400).json({ error: 'Необхідні поля: color, quantity' });
    }

    const db = await dbPromise;

    const cartItem = await db.get(
      'SELECT * FROM carts WHERE id = ? AND user_id = ?',
      id,
      userId
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Товар не знайдено в корзині' });
    }

    const cards = await getCards();
    const product = cards.find(card => card.id === cartItem.item_id);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    const stockItem = product.stock.find(s => s.color.toLowerCase() === color.toLowerCase());
    if (!stockItem) {
      return res.status(400).json({ error: 'Color not available' });
    }

    if (quantity > stockItem.amount) {
      return res.status(400).json({ error: 'Requested quantity exceeds stock' });
    }

    await db.run(
      'UPDATE carts SET quantity = ?, color = ? WHERE id = ?',
      quantity,
      color.toLowerCase(),
      id
    );

    const cartItems = await db.all('SELECT * FROM carts WHERE user_id = ?', userId);
    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    console.error('Помилка при оновленні товару в корзині:', error);
    res.status(500).json({ error: 'Не вдалося оновити товар в корзині' });
  }
});

app.delete('/api/cart/:id', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params; 
    const { color } = req.body;

    if (!color) {
      console.log(`Не вказано колір для видалення товару з ID: ${id}`);
      return res.status(400).json({ error: 'Необхідно вказати колір товару для видалення' });
    }

    const db = await dbPromise;

    const cartItem = await db.get(
      'SELECT * FROM carts WHERE id = ? AND user_id = ?',
      id,
      userId
    );

    if (!cartItem || cartItem.color !== color.toLowerCase()) {
      return res.status(404).json({ error: 'Товар не знайдено в корзині' });
    }

    await db.run('DELETE FROM carts WHERE id = ?', id);

    const cartItems = await db.all('SELECT * FROM carts WHERE user_id = ?', userId);
    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    console.error('Помилка при видаленні товару з корзини:', error);
    res.status(500).json({ error: 'Не вдалося видалити товар з корзини' });
  }
});

app.post('/api/cart/clear', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const db = await dbPromise;

    await db.run('DELETE FROM carts WHERE user_id = ?', userId);

    res.status(200).json({ success: true, cart: [] });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Не вдалося очистити корзину' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль є обов\'язковими' });
    }

    const db = await dbPromise;

    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (existingUser) {
      return res.status(400).json({ error: 'Користувач з таким Email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', email, hashedPassword);

    res.status(201).json({ success: true, message: 'Реєстрація успішна' });
  } catch (error) {
    console.error('Помилка при реєстрації:', error);
    res.status(500).json({ error: 'Не вдалося зареєструвати користувача' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль є обов\'язковими' });
    }
а
    const db = await dbPromise;

    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) {
      return res.status(400).json({ error: 'Користувача з таким Email не знайдено' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Неправильний пароль' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, email: user.email });
  } catch (error) {
    console.error('Помилка при вході:', error);
    res.status(500).json({ error: 'Не вдалося виконати вхід' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено за адресою http://localhost:${PORT}`);
});
