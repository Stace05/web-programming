document.addEventListener("DOMContentLoaded", function() {
    const editAnimalForm = document.getElementById("editAnimalForm");

    const urlParams = new URLSearchParams(window.location.search);
    const animalId = parseInt(urlParams.get('id'));


    let animals = [];
    const storedAnimals = localStorage.getItem('animals');
    if (storedAnimals) {
        animals = JSON.parse(storedAnimals);
    } else {
        alert("Каталог тварин порожній.");
        window.location.href = 'index.html';
        return;
    }

    const animal = animals.find(a => a.id === animalId);

    document.getElementById("editAnimalName").value = animal.name;
    document.getElementById("editAnimalCategory").value = animal.category;
    document.getElementById("editAnimalPrice").value = animal.price;
    document.getElementById("editAnimalImage").value = animal.image;

    editAnimalForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        const updatedName = document.getElementById("editAnimalName").value.trim();
        const updatedCategory = document.getElementById("editAnimalCategory").value;
        const updatedPrice = parseFloat(document.getElementById("editAnimalPrice").value);
        const updatedImage = document.getElementById("editAnimalImage").value.trim();

        animal.name = updatedName;
        animal.category = updatedCategory;
        animal.price = updatedPrice;
        animal.image = updatedImage;

        localStorage.setItem('animals', JSON.stringify(animals));

        alert("Тварина успішно оновлена!");

    });
});
