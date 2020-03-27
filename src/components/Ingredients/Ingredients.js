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

    const removeIngredient = (id, obj) => {
        const newIngredients = userIngredients.filter(ig => ig.id !== id);
        setUserIngredients(() => [
                ...newIngredients
            ]
        );
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>

            <section>
                <Search/>
                {/* Need to add list here! */}
                <IngredientList ingredients={userIngredients}
                                onRemoveItem={(id, obj) => {
                                    removeIngredient(id, obj)
                                }}/>
            </section>
        </div>
    );
};

export default Ingredients;
