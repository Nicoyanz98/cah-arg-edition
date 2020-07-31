import { createStore, combineReducers } from "redux";

import { messagesReducer, addMessageAction } from './messages/messagesReducer.js';
import { usersReducer, updateUsersAction } from './users/usersReducers.js';
import { userReducer, setInfoUserAction } from './users/userReducer.js';
import { deckReducer, setUserDeckAction, addCardToUserDeckAction } from './deck/deckReducer.js';
import { 
    roomReducer, 
    updateRoomStatusAction, 
    setRoomAction, 
    setRoomJudgeAction, 
    changeRoomHostAction, 
    roomTimeAction, 
    setBlackCardAction, 
    updateRoomDeckAction, 
    setTableCardsAction,
    roundCardWinnerAction,
    setRoomWinnerAction
} from './room/roomReducers.js';

// Root Reducer
const rootReducer = combineReducers({
   messagesList: messagesReducer,
   userInfo: userReducer,
   usersList: usersReducer,
   userDeck: deckReducer,
   roomInfo: roomReducer
});

// Store
export const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// mapStateToProps
export const mapStateToProps = (state => {
    const {messagesList, usersList, roomInfo, userDeck, userInfo} = state;
    return {
        messagesList,
        userInfo,
        usersList,
        userDeck,
        roomInfo
    };
});
// mapDispatchToProps
export const mapDispatchToProps = dispatch => {
    return {
        addMessage: message => dispatch(addMessageAction(message)),
        setInfoUser: user => dispatch(setInfoUserAction(user)),
        updateUsers: users => dispatch(updateUsersAction(users)),
        setUserDeck: deck => dispatch(setUserDeckAction(deck)),
        addCardToUserDeck: cards => dispatch(addCardToUserDeckAction(cards)),
        updateRoomStatus: status => dispatch(updateRoomStatusAction(status)),
        setRoom: room => dispatch(setRoomAction(room)),
        changeRoomHost: host => dispatch(changeRoomHostAction(host)),
        roomTime: time => dispatch(roomTimeAction(time)),
        setRoomJudge: judge => dispatch(setRoomJudgeAction(judge)),
        setBlackCard: card => dispatch(setBlackCardAction(card)),
        updateRoomDeck: deck => dispatch(updateRoomDeckAction(deck)),
        setTableCards: cards => dispatch(setTableCardsAction(cards)),
        roundCardWinner: card => dispatch(roundCardWinnerAction(card)),
        setRoomWinner: winner => dispatch(setRoomWinnerAction(winner))
    }
};