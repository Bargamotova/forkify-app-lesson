import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    })
  }
  _generateMarkup() {
    const curPage = this._data.page;

    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    // console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._markupNext(curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._markupLast(curPage);
    }
    // Other pages
    if (curPage < numPages) {
      return [
        this._markupLast(curPage),
        this._markupNext(curPage)
      ];
    }
    // Page 1, and there are NO pages
    return '';
  }

  _markupNext(page) {
    return `
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
    <span>Page ${page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
    `;
  }

  _markupLast(page) {
    return `
    <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${page - 1}</span>
  </button>`;
  }
}
export default new PaginationView();
