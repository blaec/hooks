import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    const filteredIngredientsHandler = filteredIngredients => {
        setUserIngredients(filteredIngredients);
    };

    useEffect(() => {
        fetch('https://react-hooks-update-e2b52.firebaseio.com/ingredients.json')
            .then(response => response.json())
            .then(responseData => {
                const loadedIngredients = [];
                for (const key in responseData) {
                    loadedIngredients.push({
                        id: key,
                        title: responseData[key].title,
                        amount: responseData[key].amount
                    });
                }
                setUserIngredients(loadedIngredients);
            });
    }, []);

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients)
    }, [userIngredients]);

    const addIngredientHandler = ingredient => {
        fetch('https://react-hooks-update-e2b52.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
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
        setUserIngredients(prevIngredients =>
            prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>

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
