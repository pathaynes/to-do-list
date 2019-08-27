function htmlToDom(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    const content = template.content;

    if(content.children.length > 1) {
        throw new Error('html needs to have single parent elmeent');
    }

    const firstElementChild = content.firstElementChild;
    return firstElementChild;
}

export default htmlToDom;