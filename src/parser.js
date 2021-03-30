const getData = (node, name) => (node.querySelector(name).textContent);

export default (xml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    // console.log(doc.documentElement.textContent);
    console.log(doc.documentElement);
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
        pubDate: getData(item, 'pubDate'),
    }));

    return {
        feed,
        posts,
    };
};