const getData = (node, name) => (node.querySelector(name).textContent);

export default (xml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const channel = doc.querySelector('channel');
    const items = Array.from(doc.querySelectorAll('item'));

    const feed = {
        title: getData(channel, 'title'),
        description: getData(channel, 'description'),
    };

    const posts = items.map((item) => ({
        title: getData(item, 'title'),
        description: getData(item, 'description'),
        link: getData(item, 'link'),
    }));

    return {
        feed,
        posts,
    };
};