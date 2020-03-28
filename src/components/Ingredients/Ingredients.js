import React, {useCallback, useEffect, useMemo, useReducer} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ing => ing.id !== action.id);
        default:
            throw new Error('Should not get there!');
    }
};

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier} = useHttp();

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        // setUserIngredients(filteredIngredients);
        dispatch({
            type: 'SET',
            ingredients: filteredIngredients
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
            dispatch({type: 'DELETE', id: reqExtra});
        } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
            dispatch({
                type: 'ADD',
                ingredient: {
                    id: data.name,
                    ...reqExtra
                }
            });
        }
    }, [data, reqExtra, reqIdentifier, isLoading, error]);

    const addIngredientHandler = useCallback(ingredient => {
        sendRequest(
            'https://react-hooks-update-e2b52.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        );

        // dispatchHttp({type: 'SEND'});
        // fetch('https://react-hooks-update-e2b52.firebaseio.com/ingredients.json', {
        //     method: 'POST',
        //     body: JSON.stringify(ingredient),
        //     headers: {'Content-Type': 'application/json'}
        // }).then(response => {
        //     dispatchHttp({type: 'RESPONSE'});
        //     return response.json();
        // }).then(responseBody => {
        //     // setUserIngredients(prevIngredients => [
        //     //     ...prevIngredients,
        //     //     {
        //     //         id: responseBody.name,
        //     //         ...ingredient
        //     //     }
        //     // ]);
        //     dispatch({
        //         type: 'ADD',
        //         ingredient: {
        //             id: responseBody.name,
        //             ...ingredient
        //         }
        //     });
        // });
    }, [sendRequest]);

    const removeIngredientHandler = useCallback(ingredientId => {
        sendRequest(
            `https://react-hooks-update-e2b52.firebaseio.com/ingredients/${ingredientId}.json`,
            'DELETE',
            null,
            ingredientId,
            'REMOVE_INGREDIENT'
        )
    }, [sendRequest]);

    const clearError = useCallback(() => {

    }, []);

    const ingredientList = useMemo(() => {
        return (
            <IngredientList ingredients={userIngredients}
                            onRemoveItem={removeIngredientHandler}/>
        );
    }, [userIngredients, removeIngredientHandler]);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler}
                            loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
};

export default Ingredients;
