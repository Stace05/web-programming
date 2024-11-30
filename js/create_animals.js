
document.addEventListener("DOMContentLoaded", function() {
    console.log("Create Animal script loaded.");
    const animalForm = document.getElementById("animalForm");

    if (!animalForm) {
        console.error("Create form not found!");
        alert("Форма створення не знайдена!");
        return;
    }

    animalForm.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("Create form submitted.");

        const name = document.getElementById("animalName").value.trim();
        const category = document.getElementById("animalCategory").value;
        const price = parseFloat(document.getElementById("animalPrice").value);
        const image = document.getElementById("animalImage").value.trim();

        console.log("New animal details:", { name, category, price, image });

        if (!name || !category || !price || !image) {
            alert("Будь ласка, заповніть усі поля!");
            return;
        }

        let animals = JSON.parse(localStorage.getItem('animals')) || [];
        console.log("Current animals in localStorage:", animals);

        const newAnimal = {
            id: animals.length > 0 ? animals[animals.length - 1].id + 1 : 1,
            name,
            category,
            price,
            image
        };

        animals.push(newAnimal);
        localStorage.setItem('animals', JSON.stringify(animals));
        console.log("Updated animals in localStorage:", animals);
        alert("Тварину додано до каталогу!");
        window.location.href = 'index.html';
    });
});
