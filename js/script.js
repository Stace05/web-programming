document.addEventListener("DOMContentLoaded", function() {
  let animals = [];

  function loadAnimals() {
      const storedAnimals = localStorage.getItem('images/animals');
      if (storedAnimals) {
          animals = JSON.parse(storedAnimals);
          initialize();
      } else {

          fetch('animals.json')
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok ' + response.statusText);
                  }
                  return response.json();
              })
              .then(data => {
                  animals = data;
                  localStorage.setItem('animals', JSON.stringify(animals));
                  initialize();
              })
              .catch(error => {
                  document.getElementById("animals-wrapper").innerHTML = "<p>Не вдалося завантажити каталог тварин.</p>";
              });
      }
  }

  loadAnimals();

  function initialize() {
      const filtersContainer = document.getElementById("filters-container");
      const animalsWrapper = document.getElementById("animals-wrapper");
      const searchInput = document.getElementById("search");
      const sortPriceSelect = document.getElementById("sortPrice");
      const totalPriceElement = document.getElementById("totalPrice");

      function displayAnimals(filteredAnimals) {
          animalsWrapper.innerHTML = "";

          if (filteredAnimals.length === 0) {
              animalsWrapper.innerHTML = "<p>Тварин не знайдено.</p>";
              return;
          }

          filteredAnimals.forEach(animal => {
              const animalElement = document.createElement("div");
              animalElement.classList.add("animal");
              animalElement.setAttribute('data-id', animal.id); 

              animalElement.innerHTML = `
                  <img src="${animal.image}" alt="${animal.name}" class="animal-image" />
                  <h3>${animal.name}</h3>
                  <p>Price: $${animal.price}</p>
                  <button class="delete_button">Delete</button>
                  <button class="edit_button">Edit</button>
              `;

              animalsWrapper.appendChild(animalElement);
          });
      }

      function calculateTotalPrice(filteredAnimals) {
          const totalPrice = filteredAnimals.reduce((total, animal) => total + animal.price, 0);
          totalPriceElement.textContent = totalPrice.toFixed(2); 
      }

      function sortAnimals(animalsArray) {
          const sortValue = sortPriceSelect.value;
          if (sortValue === "asc") {
              return animalsArray.sort((a, b) => a.price - b.price);
          } else if (sortValue === "desc") {
              return animalsArray.sort((a, b) => b.price - a.price);
          }
          return animalsArray; 
      }

      function filterAnimals() {
          const activeFilters = Array.from(filtersContainer.querySelectorAll(".check:checked")).map(
              checkbox => checkbox.id
          );
          
          const searchText = searchInput.value.trim().toLowerCase();

          let filteredAnimals = animals.filter(animal => {
              const matchesCategory = activeFilters.length === 0 || activeFilters.includes(animal.category);
              const matchesSearch = animal.name.toLowerCase().includes(searchText);
              return matchesCategory && matchesSearch;
          });

          filteredAnimals = sortAnimals(filteredAnimals);

          displayAnimals(filteredAnimals);

          calculateTotalPrice(filteredAnimals);
      }

      filtersContainer.addEventListener("change", filterAnimals);
      searchInput.addEventListener("input", filterAnimals);
      sortPriceSelect.addEventListener("change", filterAnimals);

      animalsWrapper.addEventListener("click", function(event) {
          if (event.target) {
              if (event.target.classList.contains("delete_button")) {
                  const animalElement = event.target.closest(".animal");
                  const animalId = parseInt(animalElement.getAttribute('data-id'));

                  animals = animals.filter(animal => animal.id !== animalId);

                  localStorage.setItem('animals', JSON.stringify(animals));

                  filterAnimals();
              }

              if (event.target.classList.contains("edit_button")) {
                  const animalElement = event.target.closest(".animal");
                  const animalId = parseInt(animalElement.getAttribute('data-id'));

                  window.location.href = `index3.html?id=${animalId}`;
              }
          }
      });

      displayAnimals(animals);
      calculateTotalPrice(animals);
  }
});


