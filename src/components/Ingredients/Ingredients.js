import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ing => ing.id !== action.id);
        default:
            throw new Error('Should not get there!')
    }
};

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...curHttpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR':
            return {...curHttpState, error: null};
        default:
            throw new Error('Should not get there!')
    }
};

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        // setUserIngredients(filteredIngredients);
        dispatch({
            type: 'SET',
            ingredients: filteredIngredients
        });
    }, []);

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients)
    }, [userIngredients]);

    const addIngredientHandler = useCallback(ingredient => {
        dispatchHttp({type: 'SEND'});
        fetch('https://react-hooks-update-e2b52.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            dispatchHttp({type: 'RESPONSE'});
            return response.json();
        }).then(responseBody => {
            // setUserIngredients(prevIngredients => [
            //     ...prevIngredients,
            //     {
            //         id: responseBody.name,
            //         ...ingredient
            //     }
            // ]);
            dispatch({
                type: 'ADD',
                ingredient: {
                    id: responseBody.name,
                    ...ingredient
                }
            });
        });
    }, []);

    const removeIngredientHandler = useCallback(ingredientId => {
        dispatchHttp({type: 'SEND'});
        fetch(`https://react-hooks-update-e2b52.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            dispatchHttp({type: 'RESPONSE'});
            // setUserIngredients(prevIngredients =>
            //     prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
            // );
            dispatch({
                type: 'DELETE',
                id: ingredientId
            });
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
            // setError(error.message);
        });
    }, []);

    const clearError = useCallback(() => {
        dispatchHttp({type: 'CLEAR'});
    }, []);

    const ingredientList = useMemo(() => {
        return (
            <IngredientList ingredients={userIngredients}
                            onRemoveItem={removeIngredientHandler}/>
        );
    }, [userIngredients, removeIngredientHandler]);

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler}
                            loading={httpState.loading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {/* Need to add list here! */}
                {ingredientList}
            </section>
        </div>
    );
};

export default Ingredients;
