import Component from '../Component.js';

class Header extends Component {
    renderHTML() {
        const title = this.props.title || 'To Do List';

        return /*htm*/`
           <header>
               <h1>${title}</h1>
               <nav>
                    <a href="./index.html">TO DO</a>
                    <a href="./auth.html">HOME</a>
                </nav>
           </header>
        `;
    }
}

export default Header;