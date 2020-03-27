import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
        });
    };

    return (
        <div className="App">
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
