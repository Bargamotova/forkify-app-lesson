// module for recipe, searching, markups 
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`)

    // !Loading recipe;  create new object to reformat a data to variable {destuction}
    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };

    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;


    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}🧨`);
    throw err;
  }
}


// search functionality 
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      }
    });
    state.search.page = 1;
  } catch (err) {
    //  Temp error handling
    console.error(`${err}🧨💥💥💥`);
    throw err;
  }
}


//  Pagination for search results
export const getSearchResultsPage = function (page = state.search.page) {
  //  which page 
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;// 0;
  const end = page * state.search.resultsPerPage;// 9;
  return state.search.results.slice(start, end);
}


export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    //  newQt = okdQt * newServings / oldServings // 2 * 8 /4 = 4
  });
  state.recipe.servings = newServings;
};

//* Store bookmarks in a local storage/ сохранение закладки в локальное хранилище 
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
};


// adding bukmark/ добавление закладки
export const addBookmark = function (recipe) {
  // add bookmark /добавление закладки
  state.bookmarks.push(recipe);
  // Mark current  recipe as bookmark (let us to display this bookmark )/ если  ади закладки  
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};


// Delete bookmark
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe is NOT bookmarked 
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};


//* при загрузке страницы получаем сохраненные закладки из локального хранилища
const init = function () {
  //* извлекаем закладку 
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);

};
init();
console.log(state.bookmarks);

// console.log(state.bookmarks);
//* Delete all bookmark from local storage / Удаление всех закладок из локального хранилища 
// function for some problem with locale storage
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
}
// clearBookmarks();
// для загрузки собственных рецептов
export const uploadRecipe = async function (newRecipe) {
  try {

    //получаем данные из input и тратсформируем в тот-же формат что и данные из API 
    // 1) получаем ингридиенты и деструктурируем 
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Please use the correct format :)');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
  // создаем объект рецептов

}
// 
// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<insert your key>
