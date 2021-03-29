import onChange from 'on-change';

const generateFeed = (state, i18next) => {
    const feeds = document.querySelector('.feeds');
    const feedback = document.querySelector('.feedback');

    if (feeds.querySelector('h2')) {
        const list = feeds.querySelector('ul');
        const result = state.data.feeds.map((feed) => `<li class='list-group-item'><h3>${feed.title}</h3><p>${feed.description}</p></li>`);
        list.innerHTML = result.join('');
        feedback.innerHTML = `${i18next.t('feedback.success')}`;
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
    feedback.innerHTML = `${i18next.t('feedback.success')}`;
};

const generateModal = (state) => {
    const buttons = document.querySelectorAll('button[class="btn btn-primary btn-sm"]');
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            document.querySelector('body').classList.add('modal-open');

            const modal = document.querySelector('#modal');
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.removeAttribute('aria-hidden');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');

            const index = e.currentTarget.getAttribute('data-id');
            modal.querySelector('.modal-title').innerText = state.data.posts[index].title;
            modal.querySelector('.modal-body').innerText = state.data.posts[index].description;
            modal.querySelector('a[class="btn btn-primary full-article"]').setAttribute('href', state.data.posts[index].link);

            state.viewedPosts.push(index);
            viewedPosts(state);

            const closeModalButtons = document.querySelectorAll('button[data-dismiss="modal"]');
            closeModalButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();

                    document.querySelector('body').classList.remove('modal-open');

                    const modal = document.querySelector('#modal');
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    modal.setAttribute('aria-hidden', 'true');
                    modal.removeAttribute('aria-modal');
                    modal.removeAttribute('role');
                })
            })
        })
    })
};

const viewedPosts = (state) => {
    const posts = document.querySelectorAll('a[class="font-weight-bold"]');

    posts.forEach((post) => {
        if (state.viewedPosts.includes(post.getAttribute('data-id'))) {
            post.classList.remove('font-weight-bold');
            post.classList.add('font-weight-normal');
        }
    })
};

const generatePosts = (state, i18next) => {
    const posts = document.querySelector('.posts');
    if (posts.querySelector('h2')) {
        const list = posts.querySelector('ul');
        const result = state.data.posts.map((post, i) => `<li class="list-group-item d-flex justify-content-between align-items-start"><a href="${post.link}" class="font-weight-bold" data-id="${i}" target="_blank" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-primary btn-sm" data-id="${i}" data-toggle="modal" data-target="#modal">View</button></li>`);
        list.innerHTML = result.join('');

        generateModal(state);
        return;
    }
    const header = document.createElement('h2');
    header.innerHTML = `${i18next.t('posts')}`
    const list = document.createElement('ul');
    list.classList.add('list-group');

    const result = state.data.posts.map((post, i) => `<li class='list-group-item d-flex justify-content-between align-items-start'><a href="${post.link}" class="font-weight-bold" data-id="${i}" target="_blank" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-primary btn-sm" data-id="${i}" data-toggle="modal" data-target="#modal">View</button></li>`);
    list.innerHTML = result.join('');

    posts.appendChild(header);
    posts.appendChild(list);

    generateModal(state);
};

export default (state, i18next) => (
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
                    generateFeed(state, i18next);
                    generatePosts(state, i18next);
                    input.value = '';
                    feedback.innerHTML = `${i18next.t('feedback.success')}`;
                    break;
                case 'sent':
                    feedback.innerHTML = '';
                    break;
            }
        }
        if (path === 'data.posts') {
            generatePosts(state, i18next);
        }
    })
);
