// edit_animals.js
document.addEventListener("DOMContentLoaded", function() {
    console.log("Edit Animal script loaded.");
    const editAnimalForm = document.getElementById("editAnimalForm");

    if (!editAnimalForm) {
        console.error("Edit form not found!");
        alert("Форма редагування не знайдена!");
        return;
    }

    const animalId = new URLSearchParams(window.location.search).get('id');
    console.log("Animal ID:", animalId);
    if (!animalId) {
        alert("ID тварини не вказано!");
        return;
    }

    let animals = JSON.parse(localStorage.getItem('animals')) || [];
    console.log("Current animals in localStorage:", animals);

    const animalIndex = animals.findIndex(animal => animal.id === parseInt(animalId));
    console.log("Animal index in array:", animalIndex);

    if (animalIndex === -1) {
        alert("Тварину не знайдено!");
        return;
    }

    const animal = animals[animalIndex];
    // Заповнення форми поточними даними тварини
    document.getElementById("editAnimalName").value = animal.name;
    document.getElementById("editAnimalCategory").value = animal.category;
    document.getElementById("editAnimalPrice").value = animal.price;
    document.getElementById("editAnimalImage").value = animal.image;

    editAnimalForm.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("Edit form submitted.");

        const editAnimalName = document.getElementById("editAnimalName").value.trim();
        const editAnimalCategory = document.getElementById("editAnimalCategory").value;
        const editAnimalPrice = parseFloat(document.getElementById("editAnimalPrice").value);
        const editAnimalImage = document.getElementById("editAnimalImage").value.trim();

        console.log("New values:", { editAnimalName, editAnimalCategory, editAnimalPrice, editAnimalImage });

        if (!editAnimalName || !editAnimalCategory || !editAnimalPrice || !editAnimalImage) {
            alert("Будь ласка, заповніть усі поля!");
            return;
        }

        animals[animalIndex] = {
            ...animals[animalIndex],
            name: editAnimalName,
            category: editAnimalCategory,
            price: editAnimalPrice,
            image: editAnimalImage
        };

        localStorage.setItem('animals', JSON.stringify(animals));
        console.log("Updated animals in localStorage:", animals);
        alert("Зміни збережено!");
        window.location.href = 'index.html';
    });
});
