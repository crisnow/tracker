import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

class Drink(BaseModel):
    name: str
    caffeine_mg: float
    timestamp: Optional[datetime] = None
    photo_url: Optional[str] = None

class Drinks(BaseModel):
    drinks: List[Drink]

class Summary(BaseModel):
    today_total: float
    week_total: float
    avg_daily: float


class PhotoUpload(BaseModel):
    url: str


app = FastAPI(debug=True)

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

IMAGE_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_IMAGE_SIZE = 5 * 1024 * 1024

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
    if drink.timestamp is None:
        drink.timestamp = datetime.now(timezone.utc)

    memory_db["drinks"].append(drink)
    return drink


@app.post("/uploads", response_model=PhotoUpload)
async def upload_photo(photo: UploadFile = File(...)):
    extension = IMAGE_EXTENSIONS.get(photo.content_type)
    if extension is None:
        raise HTTPException(status_code=400, detail="Please upload a JPEG, PNG, or WebP image.")

    contents = await photo.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Images must be 5 MB or smaller.")

    filename = f"{uuid4().hex}{extension}"
    (UPLOAD_DIR / filename).write_bytes(contents)
    await photo.close()

    return PhotoUpload(url=f"/uploads/{filename}")


@app.get("/summary", response_model=Summary)
def get_summary():
    drinks = memory_db["drinks"]
    now = datetime.now(timezone.utc)
    today = now.date()
    week_ago = now - timedelta(days=7)

    today_total = 0
    week_total = 0

    for drink in drinks:
        drink_time = drink.timestamp

        if drink_time.date() == today:
            today_total += drink.caffeine_mg

        if drink_time >= week_ago:
            week_total += drink.caffeine_mg

    avg_daily = week_total / 7 if week_total > 0 else 0

    return Summary(
        today_total=today_total,
        week_total=week_total,
        avg_daily=avg_daily
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
