import * as types from '../actions/action_types';

const INITIAL_STATE = {
  id: '',
  title: '',
  ideas: [],
  messages: [],
  members: [],
  authorId: '',
  isLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.NEW_IDEA:
      return state;

    case types.GET_ONE_BOARD_REQUEST:
      return { ...state, isLoading: true };

    case types.GET_ONE_BOARD_SUCCESS:
      return { ...action.payload, isLoading: false };

    case types.GET_ONE_BOARD_ERROR:
      return { ...state, isLoading: false };

    case types.BRANCH_IDEA_TO_BOARD:
      return INITIAL_STATE;

    case types.UP_VOTE:
      return state;

    case types.DELETE_IDEA:
      return state;

    case types.CLEAR_BOARD_VIEW:
      return INITIAL_STATE;

    case types.REFRESH_BOARD_VIEW:
      let changedIdea = action.payload;
      let updateComplete = false;
      // Update idea based on whether or not it is marked toBeDeleted and by matching ids
      const updatedIdeas = state.ideas.reduce((memo, idea) => {
        if (idea.id === changedIdea.id) {
          if (!changedIdea.toBeDeleted) {
            const update = { ...idea, ...changedIdea };
            memo.push(update);
          }
          updateComplete = true;
        } else {
          memo.push(idea);
        }
        return memo;
      }, []);
      // Add new idea if changedIdea id did not matching existing ids
      if (!updateComplete && !changedIdea.toBeDeleted) {
        changedIdea = { ...changedIdea, comments: [] };
        updatedIdeas.push(changedIdea);
      }
      return { ...state, ideas: updatedIdeas };

    case types.SHUFFLE_IDEAS:
      let i = 0;
      let j = 0;
      let temp = null;
      const arrayRandom = state.ideas.slice();

      for (i = arrayRandom.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arrayRandom[i];
        arrayRandom[i] = arrayRandom[j];
        arrayRandom[j] = temp;
      }

      return { ...state, ideas: arrayRandom };

    case types.SORT_IDEAS_BY_VOTES:
      const arrayByVotes = state.ideas.slice();
      const orderVotes = action.order;

      arrayByVotes.sort((a, b) => {
        if (orderVotes === 1) { return b.upvotes.length - a.upvotes.length; }
        if (orderVotes === 2) { return a.upvotes.length - b.upvotes.length; }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      return { ...state, ideas: arrayByVotes };

    case types.SORT_IDEAS_BY_CONTENT:
      const arrayByContent = state.ideas.slice();
      const orderContent = action.order;

      arrayByContent.sort((a, b) => {
        const strA = a.content.toLowerCase();
        const strB = b.content.toLowerCase();
        if (orderContent === 1) { return strA > strB ? 1 : -1; }
        if (orderContent === 2) { return strA < strB ? 1 : -1; }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      return { ...state, ideas: arrayByContent };

    case types.SORT_IDEAS_BY_TIME:
      const arrayByTime = state.ideas.slice();
      const orderTime = action.order;

      arrayByTime.sort((a, b) => {
        if (orderTime === 1) { return new Date(b.createdAt) - new Date(a.createdAt); }
        if (orderTime === 0) { return new Date(a.createdAt) - new Date(b.createdAt); }
      });

      return { ...state, ideas: arrayByTime };

    case types.SYNC_COMMENT:
      const changedIdeas = state.ideas.map(idea => {
        if (idea.id === action.comment.ideaId) {
          idea.comments = action.comment.toBeDeleted
            ? idea.comments.filter(comment => comment.id !== action.comment.id)
            : [...idea.comments, action.comment];
        }
        return idea;
      });
      return { ...state, ideas: changedIdeas };

    case types.JOIN_BOARD:
      return { ...state, members: action.payload.data.board.members };

    case types.LEAVE_BOARD:
      return { ...state, members: action.payload.data.board.members };

    default:
      return state;
  }
}
