document.addEventListener("DOMContentLoaded", function() {
  const animalForm = document.getElementById("animalForm");

  animalForm.addEventListener("submit", function(event) {
      event.preventDefault(); 

      const name = document.getElementById("animalName").value.trim();
      const category = document.getElementById("animalCategory").value;
      const price = parseFloat(document.getElementById("animalPrice").value);
      const image = document.getElementById("animalImage").value.trim();
      

      let animals = [];
      const storedAnimals = localStorage.getItem('animals');
      if (storedAnimals) {
          animals = JSON.parse(storedAnimals);
      }

      const newId = animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1;

      const newAnimal = {
          id: newId,
          name: name,
          category: category,
          price: price,
          image: image
      };

      animals.push(newAnimal);

      localStorage.setItem('animals', JSON.stringify(animals));

      alert("Тварина успішно додана до каталогу!");

      animalForm.reset();
  });
});
