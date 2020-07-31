// Actions Type
const ADD_MESSAGE = 'add_message';

// Actions
export const addMessageAction = (message) => ({
    type: ADD_MESSAGE,
    payload: message,
});

// Reducers
export const messagesReducer = (state = {messages: []}, action) => {
    if (action.type === ADD_MESSAGE) {
        return {
            messages: [action.payload, ...state.messages]
        };
    }
    return state;
};