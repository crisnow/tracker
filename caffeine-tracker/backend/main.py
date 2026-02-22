import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime  

class Drink(BaseModel):
    name: str
    caffeine_mg: float
    timestamp: datetime | None = None

class Drinks(BaseModel):
    drinks: List[Drink]
    
app = FastAPI(debug=True)

origins = [
    "http://localhost:5173",
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"drinks": []}

#---- routes ----#

@app.get("/")
def root():
    return

@app.get("/drinks", response_model=Drinks)
def get_drinks():
    return Drinks(drinks=memory_db["drinks"])

@app.post("/drinks")
def add_drink(drink: Drink):
    memory_db["drinks"].append(drink)
    return drink
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)