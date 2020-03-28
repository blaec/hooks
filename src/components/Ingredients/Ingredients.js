import React, {useReducer, useState, useEffect, useCallback} from 'react';

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

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    // const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

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

    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        fetch('https://react-hooks-update-e2b52.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            setIsLoading(false);
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
    };

    const removeIngredientHander = ingredientId => {
        setIsLoading(true);
        fetch(`https://react-hooks-update-e2b52.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            setIsLoading(false);
            // setUserIngredients(prevIngredients =>
            //     prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
            // );
            dispatch({
                type:'DELETE',
                id: ingredientId
            });
        }).catch(error => {
            setError('Something went wrong!');
            // setError(error.message);
            setIsLoading(false);
        });
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler}
                            loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {/* Need to add list here! */}
                <IngredientList ingredients={userIngredients}
                                onRemoveItem={removeIngredientHander}/>
            </section>
        </div>
    );
};

export default Ingredients;
