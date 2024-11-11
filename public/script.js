const apiUrl = '/api/animals'; 

document.addEventListener("DOMContentLoaded", function() {
    fetchAnimals();

    document.getElementById('search').addEventListener('input', searchAnimals);
    document.getElementById('sortPrice').addEventListener('change', sortAnimals);
    document.getElementById('filters-container').addEventListener('change', filterAnimals);
    
    const createAnimalForm = document.getElementById('create-animal-form');
    if (createAnimalForm) {
        createAnimalForm.addEventListener('submit', createOrUpdateAnimal);
    }
    
    document.getElementById('animals-wrapper').addEventListener('click', handleAnimalActions);
    
    document.getElementById('open-create-modal').addEventListener('click', () => {
        toggleCreateAnimalModal(false);
    });
});

/**
 * Fetch animals from the API with optional query parameters.
 * @param {string} queryParams 
 */
async function fetchAnimals(queryParams = '') {
    showLoading();
    try {
        const response = await fetch(`${apiUrl}${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const animals = await response.json();
        displayAnimals(animals);
    } catch (error) {
        document.getElementById("animals-wrapper").innerHTML = "<p>Не вдалося завантажити каталог тварин.</p>";
        console.error('Error fetching animals:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Display the list of animals in the DOM.
 * @param {Array} animals 
 */
function displayAnimals(animals) {
    const animalsWrapper = document.getElementById('animals-wrapper');
    animalsWrapper.innerHTML = '';

    if (animals.length === 0) {
        animalsWrapper.innerHTML = "<p>Тварин не знайдено.</p>";
        calculateTotalPrice(animals);
        return;
    }

    animals.forEach(animal => {
        animalsWrapper.insertAdjacentHTML('beforeend', `
            <div class="animal" data-id="${animal.id}">
                <img src="${animal.image}" alt="${animal.name}" class="animal-image" />
                <h3>${animal.name}</h3>
                <p>Price: $${animal.price.toFixed(2)}</p>
                <button class="edit_button">Edit</button>
                <button class="delete_button">Delete</button>
            </div>
        `);
    });

    calculateTotalPrice(animals);
}

/**
 * Calculate and display the total price of the filtered animals.
 * @param {Array} animals 
 */
function calculateTotalPrice(animals) {
    const totalPrice = animals.reduce((sum, animal) => sum + animal.price, 0);
    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}

/**
 * Handle click events for edit and delete buttons within the animals wrapper.
 * @param {Event} event 
 */
function handleAnimalActions(event) {
    const target = event.target;
    if (target.classList.contains('delete_button')) {
        const animalElement = target.closest('.animal');
        const animalId = animalElement.getAttribute('data-id');
        console.log(`Натиснуто кнопку видалення для тварини з ID: ${animalId}`);
        if (confirm('Ви впевнені, що хочете видалити цю тварину?')) {
            deleteAnimal(animalId);
        }
    }

    if (target.classList.contains('edit_button')) {
        const animalElement = target.closest('.animal');
        const animalId = animalElement.getAttribute('data-id');
        console.log(`Натиснуто кнопку редагування для тварини з ID: ${animalId}`);
        editAnimal(animalId);
    }
}

/**
 * Delete an animal by its ID.
 * @param {number} id 
 */
async function deleteAnimal(id) {
    console.log(`Видаляємо тварину з ID: ${id}`);
    showLoading();
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete animal');
        }
        console.log('Тварина успішно видалена.');
        alert('Тварина видалена успішно.');
        fetchAnimals();
    } catch (error) {
        console.error('Error deleting animal:', error);
        alert(`Не вдалося видалити тварину: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Populate the form with animal data for editing.
 * @param {number} id 
 */
async function editAnimal(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch animal details');
        }
        const animal = await response.json();

        const form = document.getElementById('create-animal-form');
        form.dataset.isEdit = 'true';
        form.dataset.editId = id;
        document.getElementById('animal-name').value = animal.name;
        document.getElementById('animal-image').value = animal.image;
        document.getElementById('animal-price').value = animal.price;
        document.getElementById('animal-category').value = animal.category;

        toggleCreateAnimalModal(true);
    } catch (error) {
        console.error('Error editing animal:', error);
        alert('Не вдалося завантажити дані тварини для редагування.');
    }
}

/**
 * Handle form submission for creating or updating an animal.
 * @param {Event} event - The form submission event.
 */
async function createOrUpdateAnimal(event) {
    event.preventDefault();

    const form = document.getElementById('create-animal-form');
    const isEdit = form.dataset.isEdit === 'true';
    const id = isEdit ? form.dataset.editId : null;
    const name = document.getElementById('animal-name').value.trim();
    const image = document.getElementById('animal-image').value.trim();
    const price = parseFloat(document.getElementById('animal-price').value);
    const category = document.getElementById('animal-category').value.trim();

    console.log(`Submitting form: ${isEdit ? 'Edit' : 'Create'} Animal`);

    const animalData = { name, image, price, category };

    try {
        let response;
        if (isEdit) {
            console.log(`Sending PUT request to /api/animals/${id}`);
            response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(animalData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update animal');
            }
            console.log('Тварина успішно оновлена.');
            alert('Тварина оновлена успішно.');
        } else {
            console.log('Sending POST request to /api/animals');
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(animalData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create animal');
            }
            console.log('Тварина успішно створена.');
            alert('Тварина створена успішно.');
        }

        form.reset();
        toggleCreateAnimalModal(false);
        fetchAnimals();
    } catch (error) {
        console.error('Error creating/updating animal:', error);
        alert(`Помилка: ${error.message}`);
    }
}

/**
 * Search animals based on input.
 */
function searchAnimals() {
    const searchText = document.getElementById('search').value.trim().toLowerCase();
    const selectedCategories = getSelectedCategories();
    const queryParams = buildQueryParams(searchText, selectedCategories);
    fetchAnimals(queryParams);
}

/**
 * Sort animals based on selected option.
 */
function sortAnimals() {
    const sortValue = document.getElementById('sortPrice').value;
    const searchText = document.getElementById('search').value.trim().toLowerCase();
    const selectedCategories = getSelectedCategories();
    const queryParams = buildQueryParams(searchText, selectedCategories, sortValue);
    fetchAnimals(queryParams);
}

/**
 * Filter animals based on selected categories.
 */
function filterAnimals() {
    const searchText = document.getElementById('search').value.trim().toLowerCase();
    const selectedCategories = getSelectedCategories();
    const sortValue = document.getElementById('sortPrice').value;
    const queryParams = buildQueryParams(searchText, selectedCategories, sortValue);
    fetchAnimals(queryParams);
}

/**
 * Get selected categories from checkboxes.
 * @returns {Array} 
 */
function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const categories = Array.from(checkboxes).map(cb => cb.value);
    return categories;
}

/**
 * Build query parameters string based on search text, selected categories, and sort option.
 * @param {string} searchText 
 * @param {Array} categories
 * @param {string} sortValue 
 * @returns {string} 
 */
function buildQueryParams(searchText, categories, sortValue = 'none') {
    const params = new URLSearchParams();

    if (searchText) {
        params.append('search', searchText);
    }

    if (categories.length > 0) {
        categories.forEach(category => params.append('category', category));
    }

    if (sortValue && sortValue !== 'none') {
        params.append('sortBy', sortValue);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Toggle the visibility of the create/edit animal modal.
 * @param {boolean} isEdit - Whether the modal is in edit mode.
 */
function toggleCreateAnimalModal(isEdit = false) {
    const modal = document.getElementById('create-animal-modal');
    const modalTitle = modal.querySelector('h2');
    const submitButton = modal.querySelector('.primary-btn');
    const form = document.getElementById('create-animal-form');

    modal.classList.toggle('show-modal');

    if (isEdit) {
        modalTitle.textContent = 'Edit Animal';
        submitButton.textContent = 'Update Animal';
    } else {
        modalTitle.textContent = 'Create New Animal';
        submitButton.textContent = 'Create Animal';
        form.dataset.isEdit = 'false';
        delete form.dataset.editId;
    }
}


function showLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
}


function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}


function clearSearch() {
    document.getElementById('search').value = '';
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    checkboxes.forEach(cb => cb.checked = false);
    fetchAnimals();
}
