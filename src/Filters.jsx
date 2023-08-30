import { useContext, useState, useEffect } from 'react'
import { InfoContext } from "./InfoContext.jsx";

export default function Filters(){
    const value = useContext(InfoContext);
    const info = value.info;
    const handleDeleteButton = value.handleDeleteButton;

    const newInfo = info.map(item => {
        const result = {
            ...item,
            "carbs": item.carbs * 4,
            "protein": item.protein * 4,
            "fat": item.fat * 9,
        };
        result["calories"] = result.carbs + result.protein + result.fat;
        return result;
    });

    return <div id="Filters">
        <div id="FiltersContent">
            <form className="filters-form">
                <button type="submit" className="add-food">Reload</button>
                {
                    newInfo.map((ingredient, key) => {
                        return <div className="ingredient-wrapper" key={key}>
                            <button onClick={() => handleDeleteButton(ingredient)} className="delete-ingredient">
                                <img className="delete-icon" src="./delete-item.svg"/>
                            </button> 
                            <div>
                                <span className="ingredient-name">{ingredient.name}</span>
                                <br/>
                                {ingredient.calories.toFixed(0)} cal
                            </div>
                        </div>
                    })
                }
            </form>
        </div>
    </div>
}