import View from './View.js';
import previewView from './previewView.js';// файл с разметкой для рендера на странице 


class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');

  }
  //* делаем отдельный файл PreviewView()
  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   // console.log(id, result.id, window.location.hash);
  //   return `
  //   <li class="preview">
  //     <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
  //     <figure class="preview__fig">
  //       <img src="${result.image}" alt="${result.title}t" />
  //     </figure>
  //     <div class="preview__data">
  //       <h4 class="preview__title">${result.title}</h4>
  //       <p class="preview__publisher">${result.publisher}</p>
  //     </div>
  //     </a>
  //   </li>
  //   `
  // }
}
export default new BookmarksView();
