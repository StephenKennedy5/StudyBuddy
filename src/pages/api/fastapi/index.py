from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/fastapi/index")
def hello_world():
    print("Hello World")
    return {"message": "Hello World"}


class PdfId(BaseModel):
    id: str


@app.post("/api/fastapi/pdfScraper/scraper")
def scraper(pdfId: PdfId):
    print("This is the pdfId: ", pdfId.id)
    return {"message": pdfId.id}
