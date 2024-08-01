import { createStore } from 'redux';

// Định nghĩa reducer
const initialState = {
  data: null,
  allSourceByNotebook: {},
  isChatOpen: true,
  isTutorialOpen: false,
  isOpenSidebar: true,
  isOpenSource: false,
  notebooks: {},
  isLoggedIn: false,
  successBotChat : null,
  userInfo: {
    userId: ''
  },
  tempNotes: [],
  notebookSummary: {},
  chunkId: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, data: action.payload };
    case 'UPDATE_TEMP_NOTES':
      return { ...state, tempNotes: [...state.tempNotes, action.payload] };
    case 'ADD_CHUNK_ID':
      return { ...state, chunkId: [...state.chunkId, action.payload] };
    case 'REMOVE_TEMP_NOTES':
      return {
        ...state,
        tempNotes: state.tempNotes.filter(
          (note) => note.notebookId !== action.payload.notebookId
        )
      };
    case 'UPDATE_NOTEBOOK_SUMMARY':
      return {
        ...state,
        notebookSummary: {
          ...state.notebookSummary,
          [action.payload.notebookId]: action.payload.summary
        }
      };
    case 'UPDATE_FILES':
      return { ...state, allSourceByNotebook: action.payload };
    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };
    case 'TOGGLE_TUTORIAL':
      return { ...state, isTutorialOpen: !state.isTutorialOpen };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isOpenSidebar: !state.isOpenSidebar };
    case 'TOGGLE_SOURCE':
      return { ...state, isOpenSource: !state.isOpenSource };
    case 'LOGIN':
      return { ...state, isLoggedIn: !state.isLoggedIn };
    case 'ADD_USER_MESSAGE':
      const { notebookIdUser, userMessage } = action.payload;
      const newUserMessage = { type: 'user', content: userMessage };
      return {
        ...state,
        notebooks: {
          ...state.notebooks,
          [notebookIdUser]: [...(state.notebooks[notebookIdUser] || []), newUserMessage],
        },
      };
    case 'ADD_BOT_MESSAGE':
      const { notebookIdBot, botMessage } = action.payload;
      const newBotMessage = { type: 'bot', content: botMessage, loading: true };
      return {
        ...state,
        notebooks: {
          ...state.notebooks,
          [notebookIdBot]: [...(state.notebooks[notebookIdBot] || []), newBotMessage],
        },
      };
    case 'UPDATE_BOT_MESSAGE':
      const { notebookId, messageIndex, newContent, newChunkId } = action.payload;
      return {
        ...state,
        notebooks: {
          ...state.notebooks,
          [notebookId]: state.notebooks[notebookId].map((msg, index) =>
            index === messageIndex ? { ...msg, content: newContent, loading: false, chunkId: newChunkId || msg.chunkId } : msg
          ),
        },
      };
    case 'SET_SUCCESS_BOT_CHAT':
      return {
        ...state,
        successBotChat: action.payload
      };
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

// Tạo store
const store = createStore(reducer);

export default store;
