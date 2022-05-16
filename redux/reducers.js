import initialState from './state';

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case 'GET_FISH_DATA':
            return {
                ...state,
                state: {
                    fishData: action.data
                }
            }
        case 'ADD_FISH_DATA':
            return {
                ...state,
                state: {
                    fishData: state.state.fishData.concat(action.data)
                }
            }
        case 'EDIT_FISH_DATA':
            return {
                ...state,
                state: {
                    fishData: state.state.fishData.map(data => {
                        if (action.data.uuid !== data.uuid) {
                            return data 
                        } else {
                            return action.data
                        }
                    })
                }
            }
        case 'DELETE_FISH_DATA':
            return {
                ...state,
                state: {
                    fishData: state.state.fishData.filter(({ uuid }) => uuid !== action.data.uuid)
                }
            }
        default:
            return {
                state
            }
    }
};

export default reducer