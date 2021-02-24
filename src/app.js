import * as yup from 'yup';
import axios from 'axios';
import parser from './parser';
import view from './view';
import i18next from 'i18next';

const validate = (link, links) => {
    let schema = yup
        .string()
        .url()
        .notOneOf(links);
    try {
        schema.validateSync(link);
        return null;
    } catch (err) {
        return err.message
    };
};

export default () => {
    const state = {
        form: {
            state: 'empty',
            field: {
                valid: true,
                error: null,
              },
        },
        data: {
            links: [],
            feeds: [],
            posts: [],
        },
        error: null,
    };

    const watchedState = view(state);
    const form = document.querySelector('.rss-form');
    const input = document.querySelector('input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const link = input.value;
        const error = validate(link, state.data.links);
        if (error) {
            watchedState.form.field = {
                valid: false,
                error,
            };
            return;
        };

        watchedState.form.field = {
            valid: true,
            error: null,
        };
        watchedState.form.state = 'sent';

        axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${link}`)
            .then(function (response) {
                const { links, feeds, posts } = watchedState.data;
                const data = parser(response.data.contents);
                watchedState.data = {
                    links: [...links, link],
                    feeds: [...feeds, data.feed],
                    posts: [...posts, ...data.posts],
                };
                watchedState.error = null;
                watchedState.form.state = 'success';
            })
            .catch(function (err) {
                watchedState.form.state = 'fail';
                watchedState.error = err.message;
            })
        input.addEventListener('input', () => {
            watchedState.form.state = 'empty';
            watchedState.form.error = null;
        });
    });
};