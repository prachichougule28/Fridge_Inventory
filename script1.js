// const API_KEY = "f08e4ae8edf849df9ddbe2675f654546";

// function addItem() {
//     let itemInput = document.getElementById("itemInput").value.trim();
//     let expiryInput = document.getElementById("expiryInput").value;

//     if (!itemInput) {
//         alert("Please enter an ingredient.");
//         return;
//     }

//     let inventoryList = document.getElementById("inventoryList");
//     let listItem = document.createElement("li");
//     listItem.textContent = `${itemInput} (Expires: ${expiryInput || "No expiry"})`;
//     inventoryList.appendChild(listItem);

//     document.getElementById("itemInput").value = "";
//     document.getElementById("expiryInput").value = "";
// }

// async function loadIndianMeals() {
//     try {
//         let response = await fetch("IndianFoodDatasetCSV.json"); 
//         let recipes = await response.json();

//         return recipes.filter(recipe => recipe.cuisine.toLowerCase() === "indian")
//                       .map(recipe => ({
//                           name: recipe.name,
//                           image: recipe.image,
//                           url: recipe.url,
//                           ingredients: recipe.ingredients.map(ing => ing.toLowerCase())
//                       }));
//     } catch (error) {
//         console.error("Error loading cuisines.json:", error);
//         return [];
//     }
// }

// async function fetchFromSpoonacular(ingredients) {
//     let apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(",")}&number=5&apiKey=${API_KEY}`;

//     try {
//         let response = await fetch(apiUrl);
//         let recipes = await response.json();

//         let fullRecipes = await Promise.all(
//             recipes.map(async (recipe) => {
//                 let fullRecipe = await fetchFullRecipe(recipe.id);
//                 return fullRecipe ? { 
//                     name: recipe.title, 
//                     image: recipe.image, 
//                     url: fullRecipe 
//                 } : null;
//             })
//         );

//         return fullRecipes.filter(recipe => recipe !== null); 
//     } catch (error) {
//         console.error("Error fetching from Spoonacular:", error);
//         return [];
//     }
// }

// async function fetchFullRecipe(recipeId) {
//     let url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
//     try {
//         let response = await fetch(url);
//         let data = await response.json();
//         return data.sourceUrl || null;
//     } catch (error) {
//         console.error("Error fetching full recipe:", error);
//         return null;
//     }
// }
// async function generateMeal() {
//     let inventoryList = document.querySelectorAll("#inventoryList li");
//     let availableItems = [];
//     let expiringItem = null;
//     let minDaysLeft = Infinity;

//     inventoryList.forEach(li => {
//         let text = li.textContent.split(" (Expires: ")[0].toLowerCase();
//         availableItems.push(text);
//     });

//     if (availableItems.length === 0) {
//         document.getElementById("suggestedMeal").innerHTML = "❌ No valid ingredients available.";
//         return;
//     }

//     // Load Indian meals first
//     let indianMealsDataset = await loadIndianMeals();

//     // Check if dataset has results
//     let filteredIndianMeals = indianMealsDataset.filter(recipe =>
//         recipe.ingredients.some(ingredient => availableItems.includes(ingredient))
//     );

//     let allRecipes = [...filteredIndianMeals];

//     // Call Spoonacular **only if** dataset has no recipes
//     if (filteredIndianMeals.length === 0) {
//         console.warn("⚠ No matches in dataset, calling Spoonacular...");
//         let spoonacularRecipes = await fetchFromSpoonacular(availableItems);
//         allRecipes.push(...spoonacularRecipes);
//     }

//     if (allRecipes.length === 0) {
//         document.getElementById("suggestedMeal").innerHTML = "⚠ No matching Indian meals found.";
//         return;
//     }

//     let resultHTML = `<h3>Suggested Indian Meals:</h3><ul>`;
//     for (let recipe of allRecipes) {
//         resultHTML += `<li>
//             <img src="${recipe.image}" alt="${recipe.name}" style="width:80px; height:80px; border-radius:10px;">
//             <a href="${recipe.url}" target="_blank">${recipe.name}</a>
//         </li>`;
//     }
//     resultHTML += "</ul>";

//     document.getElementById("suggestedMeal").innerHTML = resultHTML;
// }



const API_KEY = "f08e4ae8edf849df9ddbe2675f654546";

function addItem() {
    let itemInput = document.getElementById("itemInput");
    let expiryInput = document.getElementById("expiryInput");
    let item = itemInput.value.trim();
    let expiry = expiryInput.value;

    if (!item) {
        alert("Please enter an ingredient.");
        return;
    }

    let list = document.getElementById("inventoryList");
    let li = document.createElement("li");
    li.innerHTML = `${item} (Expires: ${expiry || "No expiry"}) 
        <button class="remove-btn" onclick="removeItem(this)">❌</button>`;
    
    list.appendChild(li);

    checkNewItemExpiry(item, expiry);

    itemInput.value = "";
    expiryInput.value = "";
}

function removeItem(button) {
    button.parentElement.remove();
}

function checkNewItemExpiry(item, expiry) {
    let today = new Date();
    
    if (expiry) {
        let expiryDate = new Date(expiry);
        let daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft === 1) {
            alert(`⚠ ${item} is expiring in 1 day!`);
        } else if (daysLeft === 2) {
            alert(`⚠ ${item} is expiring in 2 days!`);
        }
    }
}

 async function loadIndianMeals() {
        try {
            let response = await fetch("csvjson.json"); 
            let recipes = await response.json();
    
            return recipes.filter(recipe => recipe.cuisine.toLowerCase() === "indian")
                          .map(recipe => ({
                              name: recipe.name,
                              image: recipe.image,
                              url: recipe.url,
                              ingredients: recipe.ingredients.map(ing => ing.toLowerCase())
                          }));
        } catch (error) {
            console.error("Error loading cuisines.json:", error);
            return [];
        }
    }
    
    async function fetchFromSpoonacular(ingredients) {
        let apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(",")}&number=5&apiKey=${API_KEY}`;
    
        try {
            let response = await fetch(apiUrl);
            let recipes = await response.json();
    
            let fullRecipes = await Promise.all(
                recipes.map(async (recipe) => {
                    let fullRecipe = await fetchFullRecipe(recipe.id);
                    return fullRecipe ? { 
                        name: recipe.title, 
                        image: recipe.image, 
                        url: fullRecipe 
                    } : null;
                })
            );
    
            return fullRecipes.filter(recipe => recipe !== null); 
        } catch (error) {
            console.error("Error fetching from Spoonacular:", error);
            return [];
        }
    }
    
    async function fetchFullRecipe(recipeId) {
        let url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
        try {
            let response = await fetch(url);
            let data = await response.json();
            return data.sourceUrl || null;
        } catch (error) {
            console.error("Error fetching full recipe:", error);
            return null;
        }
    }

async function generateMeal() {
    let inventoryList = document.querySelectorAll("#inventoryList li");
    let availableItems = [];
    let expiringItem = null;
    let minDaysLeft = Infinity;

    inventoryList.forEach(li => {
        let text = li.textContent.split(" (Expires: ")[0].toLowerCase();
        availableItems.push(text);

        let expiryText = li.textContent.match(/\(Expires: (.*?)\)/);
        if (expiryText) {
            let expiryDate = new Date(expiryText[1]);
            let today = new Date();
            let daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            if (daysLeft > 0 && daysLeft < minDaysLeft) {
                minDaysLeft = daysLeft;
                expiringItem = text;
            }
        }
    });

    if (availableItems.length === 0) {
        document.getElementById("suggestedMeal").innerHTML = "❌ No valid ingredients available.";
        return;
    }

    let indianMealsDataset = await loadIndianMeals();
    let spoonacularRecipes = await fetchFromSpoonacular(availableItems);

    let filteredIndianMeals = indianMealsDataset.filter(recipe =>
        recipe.ingredients.some(ingredient => availableItems.includes(ingredient))
    );

    let allRecipes = [...spoonacularRecipes, ...filteredIndianMeals].filter(
        (recipe, index, self) =>
            index === self.findIndex((r) => r.name.toLowerCase() === recipe.name.toLowerCase())
    );

    if (allRecipes.length === 0) {
        document.getElementById("suggestedMeal").innerHTML = "⚠ No matching Indian meals found.";
        return;
    }

    let resultHTML = `<h3>${expiringItem ? `⚠️${expiringItem} is expiring soon! Try making:` : "Suggested Indian Meals:"}</h3><ul>`;
    for (let recipe of allRecipes) {
        resultHTML += `<li>
            <img src="${recipe.image}" alt="${recipe.name}" style="width:80px; height:80px; border-radius:10px;">
            <a href="${recipe.url}" target="_blank">${recipe.name}</a>
        </li>`;
    }
    resultHTML += "</ul>";

    document.getElementById("suggestedMeal").innerHTML = resultHTML;
}