import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';


// for parcel not for recipe code
if (module.hot) {
  module.hot.accept;
}

// https://forkify-api.herokuapp.com/v2
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    //  0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks to mark selected view result
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//* search function / 
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search result
    await model.loadSearchResults(query);

    // 3) Render result
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    // only 10 recipe on one page
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err);
  }
};

//* pagination function
const controlPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search)
};

//* incrise or dicrise numeric of serving people
const controlServings = function (newServings) {
  // Update the recipe serving (in state)
  model.updateServings(newServings);
  // Update the recipe view 
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe);
};

//* bookmark
const controlAddBookmark = function () {
  // 1) Add or remove bookmark 
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmark
  bookmarksView.render(model.state.bookmarks);
};
// solving a problem ;)
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controllAddRecipe = async function (newRecipe) {

  try {
    // Show loading spinner
    //addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe (list bookmarked)
    recipeView.render(model.state.recipe);

    // Succeess message
    //addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in userSelect
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back();
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();

    }, MODAL_CLOSE_SEC * 1000);


  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}


const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controllAddRecipe);
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
