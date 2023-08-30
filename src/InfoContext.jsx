import { useState, createContext } from 'react'
import IngredientsJson from './ingredients.json'

const InfoContext = createContext();

function InfoProvider(props){

    const ingredientsList = IngredientsJson.ingredients;
    let [info, setInfo] = useState([...ingredientsList]);

    info = info.map(item => {
        const result = {
            ...item
        };
        result["calories"] = result.carbs + result.protein + result.fat;
        return result;
    });

    function handleDeleteButton(ingredient){
        let updatedInfo = info.filter(i => {
            return i.name != ingredient.name;
        });
        setInfo(updatedInfo)
    }

    function handleReload() {
        setInfo([...ingredientsList]);
    }

    const value = {
        'info': info,
        'handleDeleteButton': handleDeleteButton,
        'handleReload': handleReload,
    };

    return <>
        <InfoContext.Provider value={value}>
            {props.children}
        </InfoContext.Provider>
    </>
}

export {InfoContext, InfoProvider}