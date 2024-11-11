const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'animals.json');


const getAnimals = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Помилка читання файлу animals.json:', error);
        return [];
    }
};

const saveAnimals = (animals) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(animals, null, 2));
    } catch (error) {
        console.error('Помилка запису у файл animals.json:', error);
    }
};

app.get('/api/animals', (req, res) => {
    const { search, sortBy } = req.query;
    let categories = req.query.category;

    let animals = getAnimals();

    if (categories) {
        if (!Array.isArray(categories)) {
            categories = [categories];
        }
        animals = animals.filter(animal => categories.includes(animal.category));
    }

    if (search) {
        const query = search.toLowerCase();
        animals = animals.filter(animal => 
            animal.name.toLowerCase().includes(query) ||
            animal.category.toLowerCase().includes(query)
        );
    }

    if (sortBy) {
        switch (sortBy) {
            case 'price-asc':
                animals.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                animals.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                animals.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                animals.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }
    }

    res.json(animals);
});

app.get('/api/animals/:id', (req, res) => {
    const animals = getAnimals();
    const animalId = parseInt(req.params.id, 10);
    const animal = animals.find(a => a.id === animalId);

    if (!animal) {
        return res.status(404).json({ message: 'Тварина не знайдена.' });
    }

    res.json(animal);
});

app.post('/api/animals', (req, res) => {
    const animals = getAnimals();
    const newAnimal = req.body;

    console.log('Received POST request to create a new animal:', newAnimal);

    if (!newAnimal.name || !newAnimal.category || !newAnimal.price) {
        console.log('Validation failed: Missing required fields.');
        return res.status(400).json({ message: 'Всі поля є обов\'язковими.' });
    }

    if (!newAnimal.id) {
        newAnimal.id = animals.length > 0 ? animals[animals.length - 1].id + 1 : 1;
    } else {
        const existingAnimal = animals.find(a => a.id === newAnimal.id);
        if (existingAnimal) {
            console.log('Duplicate ID detected.');
            return res.status(400).json({ message: 'Тварина з таким ID вже існує.' });
        }
    }

    animals.push(newAnimal);
    saveAnimals(animals);
    console.log(`Created new animal with ID: ${newAnimal.id}`);
    res.status(201).json(newAnimal);
});

app.put('/api/animals/:id', (req, res) => {
    const animals = getAnimals();
    const animalId = parseInt(req.params.id, 10);
    const updatedAnimal = req.body;

    const index = animals.findIndex(animal => animal.id === animalId);
    if (index === -1) {
        return res.status(404).json({ message: 'Тварина не знайдена.' });
    }

    animals[index] = { ...animals[index], ...updatedAnimal };
    saveAnimals(animals);
    console.log(`Тварина з ID: ${animalId} оновлена.`);
    res.json(animals[index]);
});

app.delete('/api/animals/:id', (req, res) => {
    const animals = getAnimals();
    const animalId = parseInt(req.params.id, 10);
    console.log(`Отримано запит на видалення тварини з ID: ${animalId}`);

    const index = animals.findIndex(animal => animal.id === animalId);
    if (index === -1) {
        console.log('Тварина не знайдена.');
        return res.status(404).json({ message: 'Тварина не знайдена.' });
    }

    animals.splice(index, 1);
    saveAnimals(animals);
    console.log('Тварина видалена успішно.');
    res.status(200).json({ message: 'Тварина видалена успішно.' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});



