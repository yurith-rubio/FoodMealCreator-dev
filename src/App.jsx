//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import Filters from './Filters.jsx'
import IngredientsQuantity from './IngredientsQuantity.jsx'
import MacrosOverview from './MacrosOverview.jsx'
import MealOverview from './MealOverview.jsx'
import { InfoProvider } from "./InfoContext";

function App() {
  return (
    <>
    <InfoProvider>
      <div id='MainContainer'>
        <Filters />
        <div id="GraphsContainer">
          <IngredientsQuantity />
          <MacrosOverview />
          <MealOverview />
        </div>
      </div>
    </InfoProvider>
    </>
  )
}

export default App
