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
            if(confirm(`You really wanna remove "${type.description}"?`)) {
                onRemove(type);
            }
        });
    }

    renderHTML() {
        const type = this.props.type;
        console.log(type);

        return /*html*/`
        <div id="list">
            <li class="list-type">
                <span class="${type.done ? 'Done' : ''}">${type.description}</span>
                <div>
                   <button class="done-button">
                       This ${type.done ? 'Has been finished' : 'Needs to get done'}
                   </button>
                   <button class="remove-button">
                        🗑
                   </button>
                <div>
            </div>
        </ul>
        `;
    }

}

export default ListType;