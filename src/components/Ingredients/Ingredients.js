import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    const addIngredientHandler = ingredient => {
        setUserIngredients(prevIngredients => [
                ...prevIngredients,
                {
                    id: Math.random().toString(),
                    ...ingredient
                }
            ]
        );
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
                <Search/>
                {/* Need to add list here! */}
                <IngredientList ingredients={userIngredients}
                                onRemoveItem={removeIngredientHander}/>
            </section>
        </div>
    );
};

export default Ingredients;
