from fastapi import FastAPI
from fastapi import HTTPException

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.document_loaders import PyMuPDFLoader
from sqlalchemy import (
    create_engine,
    Column,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship


Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    pdfs = relationship("PDF", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")


class PDF(Base):
    __tablename__ = "pdfs"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    title = Column(Text, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    upload_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    AWS_key = Column(Text, nullable=False)
    AWS_bucket = Column(Text, nullable=False)
    AWS_url = Column(Text)

    user = relationship("User", back_populates="pdfs")
    chat_messages = relationship("ChatMessage", back_populates="pdf")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    chat_message = Column(Text)
    creation_date = Column(DateTime, server_default="CURRENT_TIMESTAMP", nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    chat_bot = Column(Boolean)
    pdf_id = Column(UUID(as_uuid=True), ForeignKey("pdfs.id"))

    user = relationship("User", back_populates="chat_messages")
    pdf = relationship("PDF", back_populates="chat_messages")


app = FastAPI()

connection_url = "postgresql+psycopg2://stephen:buddydb@localhost:5432/studydb"

engine = create_engine(connection_url, echo=False)

db = scoped_session(sessionmaker(bind=engine))

origins = [
    "http://localhost",
    "http://localhost:3000",
]

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
    url = pdfId.id
    loader = PyMuPDFLoader(url)
    data = loader.load()
    page_contents = [page.page_content for page in data]
    output = " ".join(page_contents)
    format_output = output.replace("\n", " ")

    user_id = "46a5814d-a0d2-45cb-bc4e-c358d907bdc8"
    user_record = db.query(User).filter(User.id == user_id).first()
    if user_record is None:
        raise HTTPException(status_code=404, detail="PDF not found")
    print(user_record)

    return {"message": format_output}
