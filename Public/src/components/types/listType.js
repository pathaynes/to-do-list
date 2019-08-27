import Component from '../Component.js';

class ListType extends Component {

    onRender(dom) {
        const type = this.props.type;
        const onUpdate = this.props.onUpdate;
        const onRemove = this.props.onRemove;

        const inactiveButton = dom.querySelector('.done-button');
        inactiveButton.addEventListener('click', () => {
            type.inactive = !type.inactive;
            onUpdate(type);
        });

        const removeButton = dom.querySelector('.remove-button');
        removeButton.addEventListener('click', () => {
            if(confirm(`You really wanna remove "${type.name}"?`)) {
                onRemove(type);
            }
        });
    }

    renderHTML() {
        const type = this.props.type;

        return /*html*/`
            <li class="list-type">
                <span class="${type.done ? 'Done' : ''}">${type.name}</span>
                <div>
                   <button class="done-button">
                       Make ${type.done ? 'Active' : 'Done'}
                   </button>
                   <button class="remove-button">
                        🗑
                   </button>
                <div>
            </li>
        `;
    }

}

export default ListType;