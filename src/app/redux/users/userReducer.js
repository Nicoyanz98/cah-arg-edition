// Actions Type
const SET_INFO_USER = 'SET_INFO_USER';

// Actions
export const setInfoUserAction = (user) => ({
    type: SET_INFO_USER,
    payload: user,
});

// Reducers
export const userReducer = (state = {user: {}}, action) => {
    if (action.type === SET_INFO_USER) 
        return {
            user: {
                id: action.payload.user.id,
                name: action.payload.user.name
            }
        };
    return state;
};