//  haram ingredients filter
const haramIngredients = [
    "pork", "bacon", "ham", "gelatin", "lard", "prosciutto", "salami", "pepperoni",
    "wine", "beer", "rum", "brandy", "whiskey", "vodka", "alcohol", "gin", "vermouth", 
    "tequila", "champagne", "sherry", "cognac", "liqueur", "cordials",  "bacon bits", 
    "bacon grease", "beer batter", "wine vinegar", "rum extract","mead","martini","pig"];

// Spoonacular API configuration
const API_KEY = '4882e71195d7425a87b4a3ad9051749d';
const API_BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

let selectedSunnahIngredients = [];
let customIngredients = [];
let currentSearchResults = [];

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const resultsGrid = document.getElementById('results-grid');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const recipeModal = document.getElementById('recipe-modal');
const modalContent = document.getElementById('modal-recipe-content');
const selectedTagsContainer = document.getElementById('selected-tags');
const customTagsContainer = document.getElementById('custom-tags');

// Initialize the search page
document.addEventListener('DOMContentLoaded', function() {
    initializeIngredientCheckboxes();
    searchBtn.addEventListener('click', performSearch);
    console.log('🔍 Enhanced Search page loaded successfully!');
});

// Initialize ingredient checkboxes
function initializeIngredientCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="sunnah-ingredient"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedIngredients();
        });
    });
}

// Update selected ingredients display
function updateSelectedIngredients() {
    selectedSunnahIngredients = [];
    const checkboxes = document.querySelectorAll('input[name="sunnah-ingredient"]:checked');
    
    checkboxes.forEach(checkbox => {
        selectedSunnahIngredients.push(checkbox.value);
    });
    
    // Update display
    selectedTagsContainer.innerHTML = '';
    selectedSunnahIngredients.forEach(ingredient => {
        const tag = createIngredientTag(ingredient, true);
        selectedTagsContainer.appendChild(tag);
    });
    
    // Show/hide selected ingredients section
    const selectedContainer = document.getElementById('selected-ingredients');
    if (selectedSunnahIngredients.length > 0) {
        selectedContainer.style.display = 'block';
    } else {
        selectedContainer.style.display = 'none';
    }
}

// Add custom ingredient
function addCustomIngredient() {
    const customInput = document.getElementById('custom-ingredient');
    const ingredient = customInput.value.trim().toLowerCase();
    
    if (ingredient && !customIngredients.includes(ingredient)) {
        customIngredients.push(ingredient);
        const tag = createIngredientTag(ingredient, false);
        customTagsContainer.appendChild(tag);
        customInput.value = '';
    }
}

// Create ingredient tag element
function createIngredientTag(ingredient, isSunnah) {
    const tag = document.createElement('div');
    tag.className = `ingredient-tag ${isSunnah ? 'sunnah-tag' : 'custom-tag'}`;
    tag.innerHTML = `
        <span>${getIngredientEmoji(ingredient)} ${ingredient}</span>
        <button type="button" class="tag-remove" onclick="removeIngredient('${ingredient}', ${isSunnah})">×</button>
    `;
    return tag;
}

// Remove ingredient
function removeIngredient(ingredient, isSunnah) {
    if (isSunnah) {
        // Remove from sunnah ingredients
        const checkbox = document.querySelector(`input[name="sunnah-ingredient"][value="${ingredient}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
        updateSelectedIngredients();
    } else {
        // Remove from custom ingredients
        customIngredients = customIngredients.filter(item => item !== ingredient);
        const tags = customTagsContainer.querySelectorAll('.custom-tag');
        tags.forEach(tag => {
            if (tag.textContent.includes(ingredient)) {
                tag.remove();
            }
        });
    }
}

// Get emoji for ingredient
function getIngredientEmoji(ingredient) {
    const emojiMap = {
        'dates': '🍇',
        'olives': '🫒',
        'honey': '🍯',
        'milk': '🥛',
        'barley': '🌾',
        'pomegranate': '🍎',
        'figs': '🍐',
        'grapes': '🍇',
        'melon': '🍈',
        'cucumber': '🥒'
    };
    return emojiMap[ingredient] || '🌿';
}

// Main search function
async function performSearch() {
    const allIngredients = [...selectedSunnahIngredients, ...customIngredients];
    
    if (allIngredients.length === 0) {
        showError('Please select at least one Sunnah ingredient');
        return;
    }

    showLoading();
    hideError();
    clearResults();

    try {
        const recipes = await fetchRecipes(allIngredients);
        const halalRecipes = filterHaramRecipes(recipes);
        
        if (halalRecipes.length === 0) {
            showNoResults(allIngredients);
        } else {
            displayRecipes(halalRecipes);
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Failed to fetch recipes. Please check your connection and try again.');
    } finally {
        hideLoading();
    }
}

// Fetch recipes from API
async function fetchRecipes(ingredients) {
    const ingredientsString = ingredients.join(',');
    const url = `${API_BASE_URL}?apiKey=${API_KEY}&ingredients=${encodeURIComponent(ingredientsString)}&number=15&ranking=2`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
}

// Enhanced haram filtering
function filterHaramRecipes(recipes) {
    return recipes.filter(recipe => {
        const allIngredients = [
            ...(recipe.usedIngredients || []),
            ...(recipe.missedIngredients || [])
        ];
        
        // Check each ingredient against haram list
        const hasHaram = allIngredients.some(ingredient => {
            const ingredientName = ingredient.name.toLowerCase();
            return haramIngredients.some(haram => 
                ingredientName.includes(haram.toLowerCase()) ||
                haram.toLowerCase().includes(ingredientName)
            );
        });
        
        return !hasHaram;
    });
}

// Display recipes in grid
function displayRecipes(recipes) {
    console.log('🎯 Storing search results:', recipes);
    resultsGrid.innerHTML = '';
    currentSearchResults = recipes; // ← ADD THIS LINE
    
    recipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        resultsGrid.appendChild(recipeCard);
    });
    
    console.log('💾 Current search results stored:', currentSearchResults.length, 'recipes');
}

// Create recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    // Count matching ingredients
    const matchingCount = recipe.usedIngredients.length;
    const missingCount = recipe.missedIngredients.length;
    
    card.innerHTML = `
        <div class="recipe-image-container">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhGOEY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="recipe-info">
            <h3 class="recipe-title">${recipe.title}</h3>
            <div class="recipe-meta">
                <span class="ingredient-count">
                    <span class="used-count">${matchingCount} matching</span>
                    <span class="missed-count">${missingCount} needed</span>
                </span>
            </div>
            <button class="btn btn-small view-recipe-btn" onclick="viewRecipeDetails(${recipe.id})">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

// View recipe details in modal
async function viewRecipeDetails(recipeId) {
    const button = event.target;
    const originalText = button.textContent;
    
    // Add loading state to button
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        console.log('🔍 Looking for recipe ID:', recipeId);
        console.log('📊 Current search results:', currentSearchResults);
        
        // Find the original recipe data from our stored results
        const originalRecipe = currentSearchResults.find(recipe => recipe.id === recipeId);
        
        console.log('📋 Found original recipe:', originalRecipe);
        
        if (!originalRecipe) {
            // Fallback: create a basic recipe object from available data
            console.log('⚠️ Original recipe not found, using fallback');
            const fallbackRecipe = {
                usedIngredients: [],
                missedIngredients: []
            };
            
            // Get detailed recipe information
            const recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
            const response = await fetch(recipeUrl);
            const recipeDetails = await response.json();
            
            // Pass both the detailed info AND the fallback data
            displayRecipeModal(recipeDetails, fallbackRecipe);
        } else {
            // Get detailed recipe information
            const recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
            const response = await fetch(recipeUrl);
            const recipeDetails = await response.json();
            
            // Pass both the detailed info AND the original search data
            displayRecipeModal(recipeDetails, originalRecipe);
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        showError('Failed to load recipe details. Please try again.');
    } finally {
        // Remove loading state
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Display recipe in modal with organized layout
function displayRecipeModal(recipeDetails, originalRecipe) {
    // Use the original search data for used/missed ingredients
    const usedIngredients = originalRecipe.usedIngredients || [];
    const missedIngredients = originalRecipe.missedIngredients || [];
    const allIngredients = recipeDetails.extendedIngredients || [];
    
    // Format instructions
    const instructions = formatInstructions(recipeDetails.instructions);
    
    modalContent.innerHTML = `
        <div class="modal-recipe-header">
            <h2>${recipeDetails.title}</h2>
            <div class="recipe-stats">
                <span class="stat">⏱️ ${recipeDetails.readyInMinutes || 'N/A'} mins</span>
                <span class="stat">👥 Serves ${recipeDetails.servings || 'N/A'}</span>
                <span class="stat">❤️ ${recipeDetails.healthScore || 'N/A'} health score</span>
            </div>
        </div>
        
        <div class="modal-recipe-content">
            <div class="recipe-image-large">
                <img src="${recipeDetails.image}" alt="${recipeDetails.title}" onerror="this.style.display='none'">
            </div>
            
            <div class="recipe-details">
                <!-- Used Ingredients Section -->
                <div class="ingredients-section">
                    <h3>✅ Ingredients From Your Search</h3>
                    <p class="section-description">These match the ingredients you selected:</p>
                    <ul class="ingredients-list used-ingredients">
                        ${usedIngredients.map(ing => `
                            <li class="ingredient-item">
                                <span class="ingredient-name">${ing.original || ing.name}</span>
                                <span class="ingredient-amount">${ing.amount || ''} ${ing.unit || ''}</span>
                            </li>
                        `).join('')}
                        ${usedIngredients.length === 0 ? '<li class="no-items">No matching ingredients found</li>' : ''}
                    </ul>
                </div>
                
                <!-- Missed Ingredients Section -->
                <div class="ingredients-section">
                    <h3>🛒 Additional Ingredients Needed</h3>
                    <p class="section-description">You'll need to get these to make the recipe:</p>
                    <ul class="ingredients-list missed-ingredients">
                        ${missedIngredients.map(ing => `
                            <li class="ingredient-item">
                                <span class="ingredient-name">${ing.original || ing.name}</span>
                                <span class="ingredient-amount">${ing.amount || ''} ${ing.unit || ''}</span>
                            </li>
                        `).join('')}
                        ${missedIngredients.length === 0 ? '<li class="no-items">No additional ingredients needed</li>' : ''}
                    </ul>
                </div>
                
                <!-- Full Ingredients List -->
                <div class="ingredients-section">
                    <h3>📋 Complete Ingredients List</h3>
                    <p class="section-description">All ingredients required for this recipe:</p>
                    <ul class="ingredients-list full-ingredients">
                        ${allIngredients.map(ing => `
                            <li class="ingredient-item">
                                <span class="ingredient-name">${ing.original || ing.name}</span>
                                <span class="ingredient-amount">${ing.measures?.metric?.amount || ''} ${ing.measures?.metric?.unitShort || ''}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Instructions Section -->
                <div class="instructions-section">
                    <h3>👩‍🍳 Cooking Instructions</h3>
                    <div class="instructions-steps">
                        ${instructions}
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="recipe-actions">
                    <button class="btn btn-primary" onclick="addToMealPlan(${recipeDetails.id}, '${recipeDetails.title.replace(/'/g, "\\'")}')">
                        ➕ Add to Meal Plan
                    </button>
                    <a href="${recipeDetails.sourceUrl || '#'}" target="_blank" class="btn btn-secondary" ${!recipeDetails.sourceUrl ? 'style="display:none"' : ''}>
                        🔗 View Original Recipe
                    </a>
                </div>
            </div>
        </div>
    `;
    
    recipeModal.style.display = 'block';
}

// Format instructions into steps
function formatInstructions(instructions) {
    if (!instructions) return '<p class="no-instructions">No instructions available for this recipe.</p>';
    
    // Remove HTML tags
    const cleanInstructions = instructions.replace(/<[^>]*>/g, '');
    
    // Split by numbers, periods, or steps
    const steps = cleanInstructions.split(/\d+\.|\n|\.\s+(?=[A-Z])/).filter(step => step.trim().length > 0);
    
    if (steps.length <= 1) {
        return `<div class="single-instruction">${cleanInstructions}</div>`;
    }
    
    return steps.map((step, index) => `
        <div class="instruction-step">
            <div class="step-number">${index + 1}</div>
            <div class="step-text">${step.trim()}</div>
        </div>
    `).join('');
}

// Add to meal plan
function addToMealPlan(recipeId, recipeTitle) {
    let savedRecipes = JSON.parse(localStorage.getItem('sunnahBitesRecipes')) || [];
    
    if (!savedRecipes.find(recipe => recipe.id === recipeId)) {
        savedRecipes.push({
            id: recipeId,
            title: recipeTitle,
            savedAt: new Date().toISOString()
        });
        
        localStorage.setItem('sunnahBitesRecipes', JSON.stringify(savedRecipes));
        
        // Show success message
        showToast(`✅ "${recipeTitle}" added to your saved recipes!`);
    } else {
        showToast(`ℹ️ "${recipeTitle}" is already in your saved recipes.`);
    }
    
    closeModal();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modal
function closeModal() {
    recipeModal.style.display = 'none';
}

// Error and loading states
function showNoResults(ingredients) {
    resultsGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🍽️</div>
            <h3>No Halal Recipes Found</h3>
            <p>We couldn't find any halal recipes for "${ingredients.join(', ')}". Try different ingredient combinations!</p>
        </div>
    `;
}

function retrySearch() {
    hideError();
    performSearch();
}

// UI State Management
function showLoading() {
    loadingState.style.display = 'block';
    searchBtn.disabled = true;
    searchBtn.querySelector('.btn-text').style.display = 'none';
    searchBtn.querySelector('.btn-loading').style.display = 'inline';
}

function hideLoading() {
    loadingState.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.querySelector('.btn-text').style.display = 'inline';
    searchBtn.querySelector('.btn-loading').style.display = 'none';
}

function showError(message) {
    errorState.style.display = 'block';
    document.getElementById('error-message').textContent = message;
}

function hideError() {
    errorState.style.display = 'none';
}

function clearResults() {
    resultsGrid.innerHTML = '';
}

// Close modal when clicking outside or pressing Escape
window.addEventListener('click', function(event) {
    if (event.target === recipeModal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Allow Enter key in custom ingredient input
document.getElementById('custom-ingredient').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCustomIngredient();
    }
});