// frontend/src/store/spots.js
import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const DETAILS_SPOT = 'spots/DETAILS_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const USERS_SPOTS = 'spots/USERS_SPOTS';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';

export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

export const userSpots = (spots) => {
    return {
        type: USERS_SPOTS,
        spots
    }
}

export const getDetailsOfSpot = spot => ({
    type: DETAILS_SPOT,
    spot
});

export const CreateASpot = newSpot => ({
    type: CREATE_SPOT,
    newSpot
})

export const editASpot = (id, updatedSpot) => ({
    type: EDIT_SPOT,
    payload: { id, updatedSpot }
})

export const DeleteASpot = spot => ({
    type: DELETE_SPOT,
    spot
})

export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    dispatch(loadSpots(spots));
}

export const getUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const spots = await response.json();
        dispatch(userSpots(spots));
        return spots;
    }
}

export const getOneSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(getDetailsOfSpot(spot));
    }
};

export const createSpot = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const newSpot = await response.json();
        const images = payload.previewImage;
        const spotImage = await csrfFetch(`/api/${newSpot.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(images)
        })
        newSpot.previewImage = "hello"
        dispatch(CreateASpot(newSpot));
    }
}

export const editSpot = (payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.vals)
    })

    const spot = response.json();
    dispatch(createSpot(spot));
    return spot
}

export const deleteSpot = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
        const spot = await response.json();
        dispatch(DeleteASpot(spot));
        return spot
    }

}

const initialState = { allSpots: {}, singleSpot: {} };
const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SPOT:
            return {
                ...state,
                singleSpot: {
                    ...state.singleSpot,
                    [action.newSpot.id]: action.newSpot,
                },
            };
        case LOAD_SPOTS:
            return { ...state, allSpots: { ...action.spots } };
        case USERS_SPOTS:
            return { ...state, userSpots: { ...action.spots } };
        case DETAILS_SPOT:
            return {
                ...state, singleSpot: { ...action.spot }
            };
        case EDIT_SPOT:
            return { ...state, [action.singleSpot.id]: action.updatedSpot };
        case DELETE_SPOT:
            const newState = { ...state };
            delete newState.allSpots[action.spot.id];
            delete newState.userSpots[action.spots];
            return newState;
        default:
            return state;
    }
}

function normalizeData(dataArr) {
    let newObj = {};
    dataArr.forEach(element => {
        newObj[element.id] = element;
    });

    return newObj;
}



export default spotReducer;
