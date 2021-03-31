import * as yup from 'yup';
import view from './view';
import { setLocale } from 'yup';
import fetchData from './updater';

const validate = (link, links) => {
    setLocale({
        string: {
            url: 'notURL',
        },
        mixed: {
            notOneOf: 'duplicate',
        }
    });

    let schema = yup.string()
        .url()
        .notOneOf(links);
    try {
        schema.validateSync(link);
        return null;
    } catch (err) {
        return err.message;
    };
};

export default (i18next) => {
    const state = {
        form: {
            state: 'empty',
            field: {
                valid: true,
                error: null,
              },
        },
        requestState: {
            valid: true,
            error: null,
        },
        data: {
            feeds: [],
            posts: [],
        },
        viewedPosts: [],
        error: null,
    };
    
    const watchedState = view(state, i18next);
    const form = document.querySelector('.rss-form');
    const input = document.querySelector('input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const links = state.data.feeds.map((feed) => feed.link);
        const link = input.value;

        const error = validate(link, links);
        if (error) {
            watchedState.form.field = {
                valid: false,
                error,
            };
            return;
        };
console.log('click');
console.log(error);
console.log(link);
        watchedState.form.field = {
            valid: true,
            error: null,
        };
        watchedState.form.state = 'sent';

        fetchData(link, watchedState);

        input.addEventListener('input', () => {
            watchedState.form.state = 'empty';
            watchedState.form.error = null;

            watchedState.requestState.valid = true;
            watchedState.requestState.error = null;
        });
    });
};