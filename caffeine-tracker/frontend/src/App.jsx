import { useState, useEffect } from "react";

const API_URL = "http://localhost:8002";

function App() {
    const [drinks, setDrinks] = useState([]);
    const [drinkType, setDrinkType] = useState("");
    const [caffeineMg, setCaffeineMg] = useState("");

    // Fetch drinks from backend
    const fetchDrinks = async() => {
        try {
            const response = await fetch(`${API_URL}/drinks`);
            const data = await response.json();
            setDrinks(data);
        } catch (error) {
            console.error("Error fetching drinks:", error);
        }
    };

    useEffect(() => {
        fetchDrinks();
    }, []);

    // Add new drink
    const addDrink = async() => {
        if (!drinkType || !caffeineMg) return;

        try {
            await fetch(`${API_URL}/drinks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    drink_type: drinkType,
                    caffeine_mg: parseInt(caffeineMg),
                }),
            });

            setDrinkType("");
            setCaffeineMg("");
            fetchDrinks();
        } catch (error) {
            console.error("Error adding drink:", error);
        }
    };

    return ( <
        div style = {
            { padding: "40px", fontFamily: "Arial, sans-serif" }
        } >
        <
        h1 > ☕Caffeine Tracker < /h1>

        <
        div style = {
            { marginBottom: "20px" }
        } >
        <
        input type = "text"
        placeholder = "Drink type"
        value = { drinkType }
        onChange = {
            (e) => setDrinkType(e.target.value)
        }
        style = {
            { marginRight: "10px", padding: "5px" }
        }
        />

        <
        input type = "number"
        placeholder = "Caffeine mg"
        value = { caffeineMg }
        onChange = {
            (e) => setCaffeineMg(e.target.value)
        }
        style = {
            { marginRight: "10px", padding: "5px", width: "120px" }
        }
        />

        <
        button onClick = { addDrink }
        style = {
            { padding: "5px 10px" }
        } >
        Add Drink <
        /button> < /
        div >

        <
        h2 > Drink History < /h2> <
        ul > {
            drinks.map((drink, index) => ( <
                li key = { index } > { drink.drink_type } - { drink.caffeine_mg }
                mg <
                /li>
            ))
        } <
        /ul> < /
        div >
    );
}

export default App;