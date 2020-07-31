// Actions Type
const SET_USER_DECK = 'SET_USER_DECK';
const ADD_CARD_TO_USER_DECK = 'ADD_CARD_TO_USER_DECK';

// Actions
export const setUserDeckAction = (deck) => ({
    type: SET_USER_DECK,
    payload: deck
});
export const addCardToUserDeckAction = (cards) => ({
    type: ADD_CARD_TO_USER_DECK,
    payload: cards
});

// Reducers
export const deckReducer = (state = {deck: []}, action) => {
    switch(action.type) {
        case SET_USER_DECK:
            return {
                deck: action.payload.deck
            }
        case ADD_CARD_TO_USER_DECK:
            return {
                deck: [...state.deck, action.payload]
            }
        default:
            return state;
    }
};