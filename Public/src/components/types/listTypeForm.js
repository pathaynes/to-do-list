import Component from '../Component.js';

class TypeForm extends Component {
   
    onRender(dom) {
        const onAdd = this.props.onAdd;
        const form = dom.querySelector('form');
        const input = dom.querySelector('input[name=type]');
        const error = dom.querySelector('p.error');

        form.addEventListener('submit', event => {
            event.preventDefault();

            const listType = {
                name: input.value
            };
            error.textContent = '';

            onAdd(listType)
                .then(() => {
                    form.reset();
                    document.activeElement.blur();
                })
                .catch(err => {
                    error.textContent = err;
                });
        });
    }

    renderHTML() {
        return /*html*/`
           <section class="type-form-section">
               <form class="type-form">
                  <input name="type" required>
                  <button>Add</button>
               </form>
               <p class="error"></p>
            <section>
        `;
    }
}

export default TypeForm;