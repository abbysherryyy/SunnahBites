const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const ingredient = document.getElementById('ingredient-select').value;
  const apiKey = '153ed267f6fe4cc1978d7d8576103378';
  const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredient}&number=5`;

  try {
    const response = await fetch(url);
    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
});

function displayRecipes(recipes) {
  resultsDiv.innerHTML = ''; // Clear previous results
  recipes.forEach(recipe => {
    const recipeEl = document.createElement('div');
    recipeEl.className = 'recipe-card';
    recipeEl.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}">
      <button onclick="addToPlan(${recipe.id}, '${recipe.title}')">Add to Plan</button>
    `;
    resultsDiv.appendChild(recipeEl);
  });
}

// This function will need to communicate with the planner page
function addToPlan(recipeId, recipeTitle) {
  // You can use IPC (Inter-Process Communication) or localStorage to send this data to the planner.
  // For simplicity, let's use localStorage.
  let mealPlan = JSON.parse(localStorage.getItem('sunnahBitesPlan')) || [];
  // For now, just add it to a list. We'll assign it to a day in the planner.
  mealPlan.push({ id: recipeId, title: recipeTitle, day: '', meal: '' });
  localStorage.setItem('sunnahBitesPlan', JSON.stringify(mealPlan));
  alert('Recipe added to your plan! Go to the Planner to organize it.');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍯 SunnahBites Homepage Loaded Successfully!');
    
    // food cards
    const foodCards = document.querySelectorAll('.food-card');
    foodCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
    
    // feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 600 + (index * 100));
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 25px rgba(0,0,0,0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Food card hover effects
    foodCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const emoji = this.querySelector('.food-emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const emoji = this.querySelector('.food-emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1.1)';
            }
        });
    });
    
    // Nav link active states
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add floating animation to hero emojis
    const floatingEmojis = document.querySelectorAll('.floating-emoji');
    floatingEmojis.forEach((emoji, index) => {
        emoji.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
    });
    
    // CTA button special effect
    const ctaButton = document.querySelector('.cta-section .btn');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Add scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
    
    console.log('✨ All animations loaded successfully!');
});