import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = 8080;

app.use(express.json());

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

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/cards', async (req, res) => {
    try {
        const { limit = 3, offset = 0 } = req.query;
        const cards = await getCards();
        const paginatedCards = cards.slice(Number(offset), Number(offset) + Number(limit));

        res.json(paginatedCards);
    } catch (error) {
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

        cards = cards.filter(card => {
            const isNumber = typeof card.price === 'number' && !isNaN(card.price);
            if (!isNumber) {
                console.warn(`Картка ID ${card.id} має некоректне значення price: ${card.price}`);
            }
            return isNumber;
        });
        console.log('Кількість після перевірки price:', cards.length);

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
        const cards = await getCards();
        const card = cards.find(card => card.id === parseInt(id, 10));

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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущено за адресою http://localhost:${PORT}`);
});
