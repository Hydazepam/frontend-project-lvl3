import axios from 'axios';
import parser from './parser';

const updateFeeds = (state) => {
  state.data.feeds.forEach((feed) => {
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(feed.link)}`)
      .then((response) => {
        const data = parser(response.data.contents);

        const newPosts = data.posts.filter((post) => Date.parse(post.pubDate) > feed.latestPubDate);
        if (newPosts.length !== 0) {
          const latestPubDate = Math.max(...newPosts.map((post) => Date.parse(post.pubDate)));
          feed.latestPubDate = latestPubDate;

          const oldPosts = state.data.posts;

          state.data.posts = [...newPosts, ...oldPosts];
        }
      })
      .catch((err) => {
        state.form.state = 'fail';
        state.error = err.message;
      });
  });
  setTimeout(updateFeeds, 5000, state);
};

export default (link, state) => {
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(link)}`)
    .then((response) => {
      try {
        const { feeds, posts } = state.data;
        const data = parser(response.data.contents);

        const latestPubDate = Math.max(...data.posts.map((item) => Date.parse(item.pubDate)));
        data.feed.latestPubDate = latestPubDate;
        data.feed.link = link;

        state.data = {
          feeds: [...feeds, data.feed],
          posts: [...data.posts, ...posts],
        };
        state.requestState.error = null;
        state.requestState.valid = true;

        state.error = null;
        state.form.state = 'success';

        setTimeout(updateFeeds, 5000, state);
      } catch (error) {
        state.requestState = {
          valid: false,
          error: error.message,
        };
      }
    })
    .catch((err) => {
      state.requestState = {
        valid: false,
        error: err.message,
      };
    });
};
