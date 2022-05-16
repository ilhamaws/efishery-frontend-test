export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        
        if (serializedState === null) {
            return {
                fishData: []
            };
        } else {
            return JSON.parse(serializedState.state);
        }
    } catch (error) {
        return undefined
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch (error) {
        // ignore write errors.
    }
}