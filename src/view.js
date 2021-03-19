import onChange from 'on-change';
import i18next from 'i18next';

i18next.init({
    lng: 'en',
    debug: false,
    resources: {
        en: {
            translation: {
                feeds: 'Feeds',
                posts: 'Posts',
                feedback: {
                    success: 'RSS has been loaded',
                    notURL: 'The link must be a valid URL',
                    duplicate: 'RSS already exists',
                },
            }
        }
    }
});

const generateFeed = (state) => {
    const feeds = document.querySelector('.feeds');
    if (feeds.querySelector('h2')) {
        const list = feeds.querySelector('ul');
        const result = state.data.feeds.map((feed) => `<li class='list-group-item'><h3>${feed.title}</h3><p>${feed.description}</p></li>`);
        list.innerHTML = result.join('');
        return;
    }
    const header = document.createElement('h2');
    header.innerHTML = `${i18next.t('feeds')}`;
    const list = document.createElement('ul');
    list.classList.add('list-group', 'mb-5');

    const result = state.data.feeds.map((feed) => `<li class='list-group-item'><h3>${feed.title}</h3><p>${feed.description}</p></li>`);
    list.innerHTML = result.join('');

    feeds.appendChild(header);
    feeds.appendChild(list);
};

const generatePosts = (state) => {
    const posts = document.querySelector('.posts');
    if (posts.querySelector('h2')) {
        const list = posts.querySelector('ul');
        const result = state.data.posts.map((post) => `<li class='list-group-item'><p><a href="${post.link}">${post.title}</a></p></li>`);
        list.innerHTML = result.join('');
        return;
    }
    const header = document.createElement('h2');
    header.innerHTML = `${i18next.t('posts')}`
    const list = document.createElement('ul');
    list.classList.add('list-group');

    const result = state.data.posts.map((post) => `<li class='list-group-item'><p><a href="${post.link}">${post.title}</a></p></li>`);
    list.innerHTML = result.join('');

    posts.appendChild(header);
    posts.appendChild(list);
};

export default (state) => (
    onChange(state, (path, value) => {
        const feedback = document.querySelector('.feedback');
        const input = document.querySelector('input');
        const posts = document.querySelector('div[class="posts"]');
        if (path === 'form.field') {
            switch (value.valid) {
                case true:
                    input.classList.remove('is-invalid');
                    feedback.classList.remove('text-danger');
                    feedback.classList.add('text-success');
                    feedback.innerHTML = `${i18next.t('feedback.success')}`;
                    break;
                case false:
                    feedback.classList.add('text-danger');
                    input.classList.add('is-invalid');
                    feedback.innerHTML = `${i18next.t(`feedback.${value.error}`)}`;
                    break;
            }
        }
        if (path === 'form.state') {
            switch (value) {
                case 'success':
                    generateFeed(state);
                    generatePosts(state);
                    input.value = '';
                    break;
            }
        }
        if (path === 'data.posts') {
            generatePosts(state);
        }
    })
);
