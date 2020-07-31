// Actions Type
const UPDATE_ROOM_STATUS = 'UPDATE_ROOM_STATUS';
const CHANGE_ROOM_HOST = 'CHANGE_ROOM_HOST';
const SET_ROOM_JUDGE = 'SET_ROOM_JUDGE';
const SET_ROOM = 'SET_ROOM';
const ROOM_TIME = 'ROOM_TIME';
const SET_BLACK_CARD = 'SET_BLACK_CARD';
const UPDATE_ROOM_DECK = 'UPDATE_ROOM_DECK';
const SET_TABLE_CARDS = 'SET_TABLE_CARDS';
const ROUND_CARD_WINNER = 'ROUND_CARD_WINNER';
const SET_ROOM_WINNER = 'SET_ROOM_WINNER';

// Actions
export const updateRoomStatusAction = (status) => ({
    type: UPDATE_ROOM_STATUS,
    payload: status
});
export const changeRoomHostAction = (host) => ({
    type: CHANGE_ROOM_HOST,
    payload: host
});
export const setRoomJudgeAction = (judge) => ({
    type: SET_ROOM_JUDGE,
    payload: judge
});
export const setRoomAction = (room) => ({
    type: SET_ROOM,
    payload: room
});
export const roomTimeAction = (time) => ({
    type: ROOM_TIME,
    payload: time
});
export const setBlackCardAction = (card) => ({
    type: SET_BLACK_CARD,
    payload: card.black
});
export const updateRoomDeckAction = (deck) => ({
    type: UPDATE_ROOM_DECK,
    payload: deck
});
export const setTableCardsAction = (cards) => ({
    type: SET_TABLE_CARDS,
    payload: cards
});
export const roundCardWinnerAction = (card) => ({
    type: ROUND_CARD_WINNER,
    payload: card
});
export const setRoomWinnerAction = (winner) => ({
    type: SET_ROOM_WINNER,
    payload: winner
})

// Reducers
export const roomReducer = (state = {room: {}}, action) => {
    switch(action.type) {
        case SET_ROOM:
            return {
                room: {
                    ...state.room,
                    ...action.payload
                }
            };
        case UPDATE_ROOM_STATUS:
            return {
                room: {
                    ...state.room,
                    status: action.payload.status
                }
            };
        case CHANGE_ROOM_HOST:
            return {
                room: {
                    ...state.room,
                    host: action.payload.host
                }
            }
        case SET_ROOM_JUDGE:
            return {
                room: {
                    ...state.room,
                    judge: action.payload.judge
                }
            }
        case ROOM_TIME:
            return {
                room: {
                    ...state.room,
                    timer: action.payload.timer
                }
            }
        case SET_BLACK_CARD:
            return {
                room: {
                    ...state.room,
                    cards: {
                        ...state.room.cards,
                        black: action.payload
                    }
                }
            }
        case UPDATE_ROOM_DECK:
            return {
                room: {
                    ...state.room,
                    cards: {
                        ...state.room.cards,
                        white: {
                            ...state.room.cards.white,
                            deck: action.payload.deck
                        }
                    }
                }
            }
        case SET_TABLE_CARDS:
            return {
                room: {
                    ...state.room,
                    cards: {
                        ...state.room.cards,
                        white: {
                            ...state.room.cards.white,
                            played: action.payload.tableCards
                        }
                    }
                }
            }
        case ROUND_CARD_WINNER:
            return {
                room: {
                    ...state.room,
                    cards: {
                        ...state.room.cards,
                        white: {
                            ...state.room.cards.white,
                            roundWinner: action.payload.card
                        }
                    }
                }
            }
        case SET_ROOM_WINNER:
            return {
                room: {
                    ...state.room,
                    winner: action.payload.winner
                }
            }
        default:
            return state;
    }
};