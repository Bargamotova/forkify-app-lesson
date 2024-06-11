class SearchView {
  _parentEl = document.querySelector('.search');
  // function getting value of search 
  getQuery() {
    // 1) Get query(search value) value / метод получения значения ввода в поле поиска 
    const query = this._parentEl.querySelector('.search__field').value;

    // 2) Clear field 
    this._clearInput();

    // 3) Return value
    return query;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    // Listening submit event in block of search(clicked the button submit value)
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); // function in controller.js
    })
  }
}
export default new SearchView();