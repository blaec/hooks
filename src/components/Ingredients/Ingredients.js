import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients);
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
            setUserIngredients(prevIngredients => [
                ...prevIngredients,
                {
                    id: responseBody.name,
                    ...ingredient
                }
            ]);
        });
    };

    const removeIngredientHander = ingredientId => {
        setIsLoading(true);
        fetch(`https://react-hooks-update-e2b52.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            setIsLoading(false);
            setUserIngredients(prevIngredients =>
                prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
            );
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
