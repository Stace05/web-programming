
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import cors from 'cors'; 

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCards = async () => {
  const filePath = path.join(__dirname, 'api/Cards.json');
  try {
    await fs.access(filePath);
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


const getCart = async () => {
  const filePath = path.join(__dirname, 'api/Cart.json');
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    if (!data.trim()) {
      return [];
    }
    const cart = JSON.parse(data);
    return cart.map(item => ({
      ...item,
      id: Number(item.id), 
      color: item.color.toLowerCase() 
    }));
  } catch (error) {
    console.error('Помилка доступу або читання Cart.json:', error);
    if (error.code === 'ENOENT') { 
      return [];
    }
    throw error;
  }
};


const saveCart = async (cart) => {
  const filePath = path.join(__dirname, 'api/Cart.json');
  try {
    await fs.writeFile(filePath, JSON.stringify(cart, null, 2), 'utf8');
  } catch (error) {
    console.error('Помилка запису в Cart.json:', error);
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

app.get('/api/cart', async (req, res) => {
  try {
    const cart = await getCart();
    res.json(cart);
  } catch (error) {
    console.error('Помилка при завантаженні корзини:', error);
    res.status(500).json({ error: 'Не вдалося завантажити корзину' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const newItem = {
      ...req.body,
      id: Number(req.body.id), 
      color: req.body.color.toLowerCase() 
    };

    if (isNaN(newItem.id)) {
      console.log(`Некоректний формат ID при додаванні: ${req.body.id}`);
      return res.status(400).json({ error: 'Некоректний формат ID' });
    }

    let cart = await getCart();

    const existingItemIndex = cart.findIndex(item => item.id === newItem.id && item.color === newItem.color);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += newItem.quantity;
    } else {
      cart.push(newItem);
    }

    await saveCart(cart);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Помилка при додаванні товару до корзини:', error);
    res.status(500).json({ error: 'Не вдалося додати товар до корзини' });
  }
});

app.patch('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { color, quantity } = req.body; 

    let cart = await getCart();

    const idNum = Number(id);
    if (isNaN(idNum)) {
      console.log(`Некоректний формат ID: ${id}`);
      return res.status(400).json({ error: 'Некоректний формат ID' });
    }

    const itemIndex = cart.findIndex(item => item.id === idNum && item.color === color.toLowerCase());

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Товар не знайдено в корзині' });
    }

    cart[itemIndex].quantity = quantity;

    await saveCart(cart);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Помилка при оновленні товару в корзині:', error);
    res.status(500).json({ error: 'Не вдалося оновити товар в корзині' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { color } = req.body; 

    if (!color) {
      console.log(`Не вказано колір для видалення товару з ID: ${id}`);
      return res.status(400).json({ error: 'Необхідно вказати колір товару для видалення' });
    }

    color = color.toLowerCase();

    console.log(`Спроба видалити товар з ID: ${id}, кольором: ${color}`);

    let cart = await getCart();

    console.log('Поточна корзина:', cart);
    cart.forEach(item => console.log(`Item ID: ${item.id}, Color: ${item.color}`));

    const idNum = Number(id);
    if (isNaN(idNum)) {
      console.log(`Некоректний формат ID: ${id}`);
      return res.status(400).json({ error: 'Некоректний формат ID' });
    }

    const newCart = cart.filter(item => !(item.id === idNum && item.color === color));

    console.log('Корзина після фільтрації:', newCart);

    if (newCart.length === cart.length) {
      console.log(`Товар з ID: ${idNum} та кольором: ${color} не знайдено в корзині.`);
      return res.status(404).json({ error: 'Товар не знайдено в корзині' });
    }

    await saveCart(newCart);

    console.log(`Товар з ID: ${idNum} та кольором: ${color} успішно видалено.`);
    console.log('Картки після видалення:', newCart);

    res.status(200).json({ success: true, cart: newCart });
  } catch (error) {
    console.error('Помилка при видаленні товару з корзини:', error);
    res.status(500).json({ error: 'Не вдалося видалити товар з корзини' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено за адресою http://localhost:${PORT}`);
});
