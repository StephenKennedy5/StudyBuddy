from fastapi import FastAPI

app = FastAPI()


@app.get("/api/fastapi/hello")
def hello_world():
    return {"message": "Hello World"}
