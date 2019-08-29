import Component from '../Component.js';
import ListType from './listType.js';

class ListTypeList extends Component {

    onRender(list) {
        const types = this.props.types;
        const onUpdate = this.props.onUpdate;
        const onRemove = this.props.onRemove;

        types.forEach(type => {
            const listType = new ListType({ type, onUpdate, onRemove });
            list.appendChild(listType.renderDOM());
        });
    }
    renderHTML() {

        return /*html*/`
            <ul class="list-types"><ul>
        `;
    }
}

export default ListTypeList;