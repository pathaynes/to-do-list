import Component from '../Component.js';
import Header from './Header.js';
import TypeForm from '../types/listTypeForm.js';
import listTypeList from '../types/ListTypeList.js';
import { getTypes, addType, updateType, removeType } from '../../services/api.js';

class ListTypesApp extends Component {

    onRender(dom) {
        const header = new Header({ title: 'Cat Types ' });
        dom.prepend(header.renderDOM());

        const main = dom.querySelector('main');

        const typeForm = new TypeForm({
            onAdd: type => {
                loading.update({ loading: true });

                //part 1: do work on the server
                return addType(type)
                    .then(saved => {
                       //part 2: integrate back into your list
                        const types = this.state.types;
                        types.push(saved);
                        typeList.update({ types });
                    })
                    .finally(() => {
                        loading.update({ loading: false });
                    });
            }
        });
        main.appendChild(typeForm.renderDOM());

        const typeList = new ListTypeList({
            types: [],
            onUpdate: type => {
               // loading.update({ loading: true });

               // part 1: do work on the server
                return updateType(type)
                    .then(updated => {
                        // part 2: integrate back into our list
                        const types = this.state.types;

                        // what to do with updated?
                        const index = types.indexOf(type);
                        types.splice(index, 1, updated);

                        typeList.update({ types });
                    })
                    .finally(() => {
                        // loading.update({ loading: false });
                    });
            },
            onRemove: type => {
                loading.update({ loading: true });

            // part 1: do work on the server
                return removeType(type.id)
                    .then(() => {
                    // part 2: integrate back in
                        const types = this.state.types;

                    // remove from the list
                        const index = types.indexOf(types);
                        types.splice(index, 1);
                    })
                    .finally(() => {
                        loading.update({ loading: false });
                    });
            }
        });
        main.appendChild(typeList.renderDOM());

        getTypes({ showAll: true })
            .then(types => {
                this.state.types = types;
                typeList.update({ types });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                loading.update({ loading: false });
            });
    }

    renderHTML() {
        return /*html*/`
           <div>
               <!-- header goes here -->
               <main>
               </main>
           </div>
        `;
    }
}

export default ListTypesApp;