from fastapi import FastAPI
from fastapi import HTTPException
import time

import numpy as np
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
    db,
)


from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.document_loaders import PyMuPDFLoader
from langchain.text_splitter import CharacterTextSplitter
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
    aws_key = Column(Text, nullable=False)
    aws_bucket = Column(Text, nullable=False)
    aws_url = Column(Text)

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

data_base = scoped_session(sessionmaker(bind=engine))

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


@app.get("/api/fastapi/health")
def health():
    print("Health")
    return {"Index": "Health"}


"""
Creation of new Collectinos Steps
1. Pass PDF to scrape
2. Finish scraping and return text
3. pass segmented text to openAI embedding API
4. pass embeddings to milvus collection
5. upload embeddings to new milvus collection (collection be named after PDF)
"""


class DataBaseName(BaseModel):
    database_name: str


# User ID to be database name
# At most 64 DBs
@app.post("/api/fastapi/createDatabase")
def create_milvus_database(database_name: DataBaseName):
    conn = connections.connect(host="localhost", port="19530")
    db_name = database_name.database_name
    if db_name in db.list_database():
        print(conn)
        return {"Message": "Database already exists"}
    db.create_database(db_name)
    print(db.list_database())
    print(conn)
    connections.disconnect("default")

    return {"message": database_name}


class CollectionNameParams(BaseModel):
    collection_name: str
    database_name: str


"""
SCHEMA
PDF ID
PDF Name
pdf_length
embeddings (openAI only does 1536 dim)
embedding timestamp
"""


# 2 PDF ID to become Alias d
@app.post("/api/fastapi/createCollections")
def create_milvus_collection(collection_name_args: CollectionNameParams):
    # Connect to database of the user
    db_name = collection_name_args.database_name
    collection_name = collection_name_args.collection_name
    alias = "default"

    # Check if db_exists and if collection with db_exist
    try:
        print("TRYING TO ESTABLISH CONNECITON")
        conn = connections.connect(host="localhost", port="19530")
        print("ESTABLISHED CONNECTION")
    except Exception as e:
        connections.disconnect(alias)
        return {"Error": str(e)}

    # Create Schema
    schema_fields = [
        FieldSchema(name="pdf_id", dtype=DataType.INT64, is_primary=True),
        FieldSchema(name="pdf_name", dtype=DataType.VARCHAR, max_length=100),
        FieldSchema(name="pdf_length", dtype=DataType.INT32),
        FieldSchema(name="pdf_embeddings", dtype=DataType.FLOAT_VECTOR, dim=1536),
        FieldSchema(name="pdf_embedding_timestamp", dtype=DataType.INT64),
    ]

    collection_schema = CollectionSchema(
        schema_fields,
        auto_id=False,
    )

    try:
        # Create collection for the pdf id
        create_collection = Collection(name=collection_name, schema=collection_schema)
        print("Collection created successfully!")

        # Print a list of all collections
        print("List of all collections:")
        print(conn.list_collections())
    except Exception as e:
        print(f"Error creating collection: {e}")

    finally:
        # Disconnect after performing operations
        connections.disconnect(alias)

    return {"message": collection_name_args}


# 3 insert embeddings into collection
@app.get("/api/fastapi/insertEmbeddings")
def insert_embeddings():
    return {"message": "insert Embeddings"}


# Query collections with qustion
@app.get("/api/fastapi/queryCollection")
def query_collection():
    return {"message": "query collection"}


class PdfId(BaseModel):
    id: str


# 1 Pass PDF to Scrape


@app.post("/api/fastapi/pdfScraper/scraper")
def scraper(pdfId: PdfId):
    print("This is the pdfId: ", pdfId.id)
    pdf_record = data_base.query(PDF).filter(PDF.id == pdfId.id).first()
    if pdf_record is None:
        raise HTTPException(status_code=404, detail="PDF not found")
    pdf_record_dic = pdf_record.__dict__
    print(pdf_record_dic["id"])
    print(pdf_record_dic["aws_url"])

    url = pdf_record_dic["aws_url"]
    loader = PyMuPDFLoader(url)
    data = loader.load()
    page_contents = [page.page_content for page in data]
    output = " ".join(page_contents)
    format_output = output.replace("\n", " ")
    print(format_output)
    print(len(format_output))
    text_splitter = CharacterTextSplitter(
        separator=" ",
        chunk_size=200,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )
    texts = text_splitter.create_documents([format_output])
    print(texts)
    print(texts[0])
    print(len(texts))
    # Loop through texts and send to embeddings

    # Save embeddings to Vector Database

    return {"message": format_output}


# 2 Pass to OpenAI Embeddings
@app.get("/api/fastapi/getEmbeddingsOfText")
def textEmbeddings():
    return {"message": "textEmbeddings"}


@app.get("/api/fastapi/helloMilvus")
def hello_world_milvus():
    fmt = "\n=== {:30} ===\n"
    search_latency_fmt = "search latency = {:.4f}s"
    num_entities, dim = 3000, 8

    #################################################################################
    # 1. connect to Milvus
    # Add a new connection alias `default` for Milvus server in `localhost:19530`
    # Actually the "default" alias is a buildin in PyMilvus.
    # If the address of Milvus is the same as `localhost:19530`, you can omit all
    # parameters and call the method as: `connections.connect()`.
    #
    # Note: the `using` parameter of the following methods is default to "default".
    print(fmt.format("start connecting to Milvus"))
    connections.connect("default", host="localhost", port="19530")
    has = utility.has_collection("hello_milvus")
    print(f"Does collection hello_milvus exist in Milvus: {has}")

    #################################################################################
    # 2. create collection
    # We're going to create a collection with 3 fields.
    # +-+------------+------------+------------------+------------------------------+
    # | | field name | field type | other attributes |       field description      |
    # +-+------------+------------+------------------+------------------------------+
    # |1|    "pk"    |   VarChar  |  is_primary=True |      "primary field"         |
    # | |            |            |   auto_id=False  |                              |
    # +-+------------+------------+------------------+------------------------------+
    # |2|  "random"  |    Double  |                  |      "a double field"        |
    # +-+------------+------------+------------------+------------------------------+
    # |3|"embeddings"| FloatVector|     dim=8        |  "float vector with dim 8"   |
    # +-+------------+------------+------------------+------------------------------+
    fields = [
        FieldSchema(
            name="pk",
            dtype=DataType.VARCHAR,
            is_primary=True,
            auto_id=False,
            max_length=100,
        ),
        FieldSchema(name="random", dtype=DataType.DOUBLE),
        FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=dim),
    ]

    schema = CollectionSchema(
        fields, "hello_milvus is the simplest demo to introduce the APIs"
    )

    print(fmt.format("Create collection `hello_milvus`"))
    hello_milvus = Collection("hello_milvus", schema, consistency_level="Strong")

    ################################################################################
    # 3. insert data
    # We are going to insert 3000 rows of data into `hello_milvus`
    # Data to be inserted must be organized in fields.
    #
    # The insert() method returns:
    # - either automatically generated primary keys by Milvus if auto_id=True in the schema;
    # - or the existing primary key field from the entities if auto_id=False in the schema.

    print(fmt.format("Start inserting entities"))
    rng = np.random.default_rng(seed=19530)
    entities = [
        # provide the pk field because `auto_id` is set to False
        [str(i) for i in range(num_entities)],
        rng.random(num_entities).tolist(),  # field random, only supports list
        rng.random(
            (num_entities, dim)
        ),  # field embeddings, supports numpy.ndarray and list
    ]

    insert_result = hello_milvus.insert(entities)

    hello_milvus.flush()
    print(
        f"Number of entities in Milvus: {hello_milvus.num_entities}"
    )  # check the num_entities

    ################################################################################
    # 4. create index
    # We are going to create an IVF_FLAT index for hello_milvus collection.
    # create_index() can only be applied to `FloatVector` and `BinaryVector` fields.
    print(fmt.format("Start Creating index IVF_FLAT"))
    index = {
        "index_type": "IVF_FLAT",
        "metric_type": "L2",
        "params": {"nlist": 128},
    }

    hello_milvus.create_index("embeddings", index)

    ################################################################################
    # 5. search, query, and hybrid search
    # After data were inserted into Milvus and indexed, you can perform:
    # - search based on vector similarity
    # - query based on scalar filtering(boolean, int, etc.)
    # - hybrid search based on vector similarity and scalar filtering.
    #

    # Before conducting a search or a query, you need to load the data in `hello_milvus` into memory.
    print(fmt.format("Start loading"))
    hello_milvus.load()

    # -----------------------------------------------------------------------------
    # search based on vector similarity
    print(fmt.format("Start searching based on vector similarity"))
    vectors_to_search = entities[-1][-2:]
    search_params = {
        "metric_type": "L2",
        "params": {"nprobe": 10},
    }

    start_time = time.time()
    result = hello_milvus.search(
        vectors_to_search,
        "embeddings",
        search_params,
        limit=3,
        output_fields=["random"],
    )
    end_time = time.time()

    for hits in result:
        for hit in hits:
            print(f"hit: {hit}, random field: {hit.entity.get('random')}")
    print(search_latency_fmt.format(end_time - start_time))

    # -----------------------------------------------------------------------------
    # query based on scalar filtering(boolean, int, etc.)
    print(fmt.format("Start querying with `random > 0.5`"))

    start_time = time.time()
    result = hello_milvus.query(
        expr="random > 0.5", output_fields=["random", "embeddings"]
    )
    end_time = time.time()

    print(f"query result:\n-{result[0]}")
    print(search_latency_fmt.format(end_time - start_time))

    # -----------------------------------------------------------------------------
    # pagination
    r1 = hello_milvus.query(expr="random > 0.5", limit=4, output_fields=["random"])
    r2 = hello_milvus.query(
        expr="random > 0.5", offset=1, limit=3, output_fields=["random"]
    )
    print(f"query pagination(limit=4):\n\t{r1}")
    print(f"query pagination(offset=1, limit=3):\n\t{r2}")

    # -----------------------------------------------------------------------------
    # hybrid search
    print(fmt.format("Start hybrid searching with `random > 0.5`"))

    start_time = time.time()
    result = hello_milvus.search(
        vectors_to_search,
        "embeddings",
        search_params,
        limit=3,
        expr="random > 0.5",
        output_fields=["random"],
    )
    end_time = time.time()

    for hits in result:
        for hit in hits:
            print(f"hit: {hit}, random field: {hit.entity.get('random')}")
    print(search_latency_fmt.format(end_time - start_time))

    ###############################################################################
    # 6. delete entities by PK
    # You can delete entities by their PK values using boolean expressions.
    ids = insert_result.primary_keys

    expr = f'pk in ["{ids[0]}" , "{ids[1]}"]'
    print(fmt.format(f"Start deleting with expr `{expr}`"))

    result = hello_milvus.query(expr=expr, output_fields=["random", "embeddings"])
    print(
        f"query before delete by expr=`{expr}` -> result: \n-{result[0]}\n-{result[1]}\n"
    )

    hello_milvus.delete(expr)

    result = hello_milvus.query(expr=expr, output_fields=["random", "embeddings"])
    print(f"query after delete by expr=`{expr}` -> result: {result}\n")

    ###############################################################################
    # 7. drop collection
    # Finally, drop the hello_milvus collection
    print(fmt.format("Drop collection `hello_milvus`"))
    utility.drop_collection("hello_milvus")
    return {"message": "Hello World"}
