const meals = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const mealInfo = document.getElementById('meal-info');
const closePopupBtn = document.getElementById('close-popup');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
	const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
	const respData = await resp.json();
	const randomMeal = respData.meals[0]
	addMeal(randomMeal, true);
}

async function getMealById(id) {
	const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
	const respData = await resp.json();
	const meal = respData.meals[0];
	return meal;
}

async function getMealBySearch(term) {
	const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
	const respData = await resp.json();
	const meals = respData.meals;
	return meals;

}

function addMeal(mealData, random = false) {
	const meal = document.createElement("div");
	meal.classList.add('meal');
	meal.innerHTML = `
				<div class="meal-header" id="mealHeader">
					<span class="random">Recipe of the Day</span>
					<img src=${mealData.strMealThumb} alt = "${mealData.strMeal}">
				</div>
				<div class="meal-body">
					<h4>${mealData.strMeal}</h4>
					<button class="fav-btn">
						<i class="far fa-heart"></i>
					</button>
				</div>`
			;
	const btn = meal.querySelector(".meal-body .fav-btn");
	const i = meal.querySelector(".meal-body .far")
	const mealHeader = meal.querySelector(".meal-header");

	btn.addEventListener("click", () => {
		if(btn.classList.contains("active")){
			btn.classList.remove("active");
			i.classList.remove("fas");
			removeMealLocalStorage(mealData.idMeal);
		}
		else {
			btn.classList.add("active");
			i.classList.add("fas");
			addMealLocalStorage(mealData.idMeal);
		}
		fetchFavMeals();
	});
    
	mealHeader.addEventListener('click', () =>{
		showMealInfo(mealData);
	});

	meals.appendChild(meal);
}

const mealHeader = document.getElementById('mealHeader');
if(mealHeader != null){
	mealHeader.addEventListener('click', () =>{
		// showMealInfo(mealData);
		console.log("clicked");
	});
}

function addMealLocalStorage(mealId) { 
	const mealIds = getMealsLocalStorage();
	localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId])); 
}

function removeMealLocalStorage(mealId) { 
	const mealIds = getMealsLocalStorage();
	localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLocalStorage() { 
	const mealIds = JSON.parse(localStorage.getItem('mealIds'));

	return mealIds === null ? [] : mealIds;
 }

async function fetchFavMeals() {
	favContainer.innerHTML = '';
	const mealIds = getMealsLocalStorage();
	for(let i = 0; i<mealIds.length; i++){
		const mealId = mealIds[i];
		meal = await getMealById(mealId);
		addFavMeal(meal);
	}
}

function showMealInfo(mealData) {
	//Clean the container mealinfo popup
	mealInfo.innerHTML = '';
	//Add
	mealInfo.innerHTML = `
		<h1>${mealData.strMeal}</h1>
		<img src="${mealData.strMealThumb}">
		<p> ${mealData.strInstructions}
		</p>
	`
	const mealEl = document.createElement('div');

	mealInfo.appendChild(mealEl);
	//Shows the popup
	mealPopup.classList.remove("hidden");
}

function addFavMeal(mealData) {
	const favMeal = document.createElement("li");
	favMeal.innerHTML = `
					<img src="${mealData.strMealThumb}"
					alt="${mealData.strMeal}"/>
					<span>${mealData.strMeal}</span>
					<button class = "clear" ><i class="fa-solid fa-xmark"></i></button>
					`
			;
			const btn = favMeal.querySelector(".clear");
			btn.addEventListener('click', () => {
				removeMealLocalStorage(mealData.idMeal);
				fetchFavMeals();
			});
	const favMealIcon = favMeal.querySelector("img");
	favMealIcon.addEventListener('click', () => {
		showMealInfo(mealData);
	});

	favContainer.appendChild(favMeal);
}

searchBtn.addEventListener('click', async () =>{
	meals.innerHTML = '';
	const search = searchTerm.value;
	const Meals = await getMealBySearch(search);
	if(Meals){
		Meals.forEach((meal) =>{
		addMeal(meal);
		});
	}
	else{
		alert("Recipe not found");
		getRandomMeal();
		searchTerm.value = '';
	}
});

closePopupBtn.addEventListener('click', () =>{
	mealPopup.classList.add("hidden");
});























