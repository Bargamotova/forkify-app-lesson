import icons from 'url:../../img/icons.svg'; //Parcel 2

// Parent class for all view classes 
export default class View {
  _data;
  // method render/
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be renderd (e.g. recipe)
   * @param {boolean} [render =true] If false, create markup string instead of rendering to the DOM 
   * @returns{undefined | string} A markup string is returned if render=false 
   * @this {Object} View instance
   * @author Jonas
   * @todo Finish implementation 
   */
  render(data, render = true) {
    // Checking  tha data exists and data is array, and empty array 
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // updating only some items in the view 
  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert string markup for comparing with newMarkup (newMarkup convert to a new real object DOM Node)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);
    //* comparing (сравнивается содержимое всех элементов isEqualNode)
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT / changing only value of elements
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTS
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    })
  }
  // method
  _clear() {
    this._parentElement.innerHTML = '';
  }
  // method
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Обработка ошибок
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}
