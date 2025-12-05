// Local storage keys
const INGREDIENT_KEY = "lb_ingredients";
const FEED_KEY = "lb_feed";

// Load ingredients from localStorage
let ingredients = JSON.parse(localStorage.getItem(INGREDIENT_KEY)) || [];
let feed = JSON.parse(localStorage.getItem(FEED_KEY)) || [];

// Sample recipes
let myRecipes = [
    {name: "Carrot Pancakes", ingredients: ["carrots", "eggs"]},
    {name: "Vegetable Soup", ingredients: ["carrots", "potatoes", "onion"]},
    {name: "Egg Salad", ingredients: ["eggs", "lettuce"]}
];

// -------------- INGREDIENT TRACKER -----------------
function addIngredient() {
    const input = document.getElementById("ingredient-input");
    const ingredient = input.value.trim().toLowerCase();
    if (ingredient && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        updateIngredientList();
        localStorage.setItem(INGREDIENT_KEY, JSON.stringify(ingredients));
    }
    input.value = "";
}

function updateIngredientList() {
    const ul = document.getElementById("ingredient-list");
    ul.innerHTML = "";
    ingredients.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

// -------------- RECIPE FINDER -----------------
function findRecipes() {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";
    const matches = myRecipes.filter(recipe => 
        recipe.ingredients.every(i => ingredients.includes(i))
    );
    if (matches.length === 0) {
        recipeList.innerHTML = "<li>No matching recipes found</li>";
    } else {
        matches.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = recipe.name + " (" + recipe.ingredients.join(", ") + ")";
            recipeList.appendChild(li);
        });
    }
}

// -------------- POST & SNS FEED -----------------
function postRecipe() {
    const name = document.getElementById("recipe-name").value.trim();
    const ingredientsInput = document.getElementById("recipe-ingredients").value.trim().toLowerCase();
    const notes = document.getElementById("recipe-notes").value.trim();
    if (name && ingredientsInput) {
        const ingredientsArray = ingredientsInput.split(",").map(i => i.trim());
        const post = {
            name,
            ingredients: ingredientsArray,
            notes,
            likes: 0,
            comments: []
        };
        feed.unshift(post); // newest first
        localStorage.setItem(FEED_KEY, JSON.stringify(feed));
        document.getElementById("recipe-name").value = "";
        document.getElementById("recipe-ingredients").value = "";
        document.getElementById("recipe-notes").value = "";
        updateFeed();
    }
}

// Display feed
function updateFeed() {
    const ul = document.getElementById("feed-list");
    ul.innerHTML = "";
    feed.forEach((post, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${post.name}</strong> (${post.ingredients.join(", ")})<br>${post.notes}
        <br><button onclick="likePost(${index})">👍 ${post.likes}</button>
        <br><div class="comment-section">
        <input type="text" id="comment-${index}" placeholder="Add comment">
        <button onclick="addComment(${index})">Comment</button>
        <ul id="comment-list-${index}"></ul>
        </div>`;
        ul.appendChild(li);
        updateComments(index);
    });
}

// Like a post
function likePost(index) {
    feed[index].likes++;
    localStorage.setItem(FEED_KEY, JSON.stringify(feed));
    updateFeed();
}

// Add comment
function addComment(index) {
    const input = document.getElementById(`comment-${index}`);
    const comment = input.value.trim();
    if(comment){
        feed[index].comments.push(comment);
        localStorage.setItem(FEED_KEY, JSON.stringify(feed));
        input.value = "";
        updateComments(index);
    }
}

// Display comments
function updateComments(index) {
    const ul = document.getElementById(`comment-list-${index}`);
    ul.innerHTML = "";
    feed[index].comments.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c;
        ul.appendChild(li);
    });
}

// Initialize
updateIngredientList();
updateFeed();

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section'); // All sections
    const navLinks = document.querySelectorAll('#nav-bar a'); // All navigation links

    // Function to show the selected section and hide others
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden'); // Show the selected section
            } else {
                section.classList.add('hidden'); // Hide other sections
            }
        });
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const sectionId = e.target.getAttribute('data-section'); // Get the target section ID
            showSection(sectionId); // Show the corresponding section
        });
    });

    // Initialize: Show the first section by default
    showSection('my-recipe-notes');
});
