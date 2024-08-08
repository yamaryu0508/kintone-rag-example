from functools import wraps
from http.client import HTTPException
from typing import Union, List, Dict, Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from config.settings import Settings
from utils.api import Api

class QueryRequest(BaseModel):
  """
  A model for a query request.
  """
  query: str

class Document(BaseModel):
  """
  A model for a document.
  """
  title: str
  content: str

class Documents(BaseModel):
  """
  A model for a list of documents.
  """
  documents: List[Document] = Field(...)

class DocumentRequest(BaseModel):
  """
  A model for a document request.
  """
  id: str
  document: str

class DocumentsRequest(BaseModel):
  """
  A model for a list of document requests.
  """
  documents: List[DocumentRequest] = Field(...)

settings = Settings()

app = FastAPI()
# https://fastapi.tiangolo.com/tutorial/cors/
origins = [
  settings.datasources.kintone.base_url
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)

api = Api()

kintone_app_id = settings.datasources.kintone.apps[0].id
fields = settings.datasources.kintone.apps[0].fields
api.upsert_kintone_documents(kintone_app_id, '', fields)

def handle_400_errors(func):
  """
  A decorator for handling 400 errors.
  """
  @wraps(func)
  async def wrapper(request: Request, *args, **kwargs):
    try:
      return await func(request, *args, **kwargs)
    except HTTPException as e:
      if e.status_code == 400:
        return JSONResponse(status_code=400, content={"message": "Invalid request data"})
      raise e

  return wrapper

def handle_500_errors(func):
  """
  A decorator for handling 500 errors.
  """
  @wraps(func)
  async def wrapper(request: Request, *args, **kwargs):
    try:
      return await func(request, *args, **kwargs)
    except HTTPException as e:
      if e.status_code == 500:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
      raise e

  return wrapper

@app.get('/api/')
def read_root(request: Request):
  """
  The root endpoint.
  """
  user_agent = request.headers.get('user-agent')
  referer = request.headers.get('referer')
  
  print(f'User-Agent: {user_agent}')
  print(f'Referer: {referer}')

  return {'message': 'Welcome to the RAG app server.'}


@app.post('/api/chromadb/query', summary='Execute ChromaDB Query', description='Executes a query against ChromaDB and returns the results.')
@handle_400_errors
@handle_500_errors
async def chromadb_query(request: Request, query_request: QueryRequest):
  """
  Executes a query against ChromaDB and returns the results.

  Args:
    request: The FastAPI request object.
    query_request: The query request object.

  Returns:
    A JSON response containing the query results.
  """
  try:
    result = api.query(query_request.query)
    return result

  except Exception as e:
    raise e  # Re-raise the exception for unhandled errors

@app.post('/api/chromadb/rag/query', summary='Execute RAG Query', description='Executes a query against RAG and returns the results.')
@handle_400_errors
@handle_500_errors
async def rag_query(request: Request, query_request: QueryRequest):
  """
  Executes a query against RAG and returns the results.

  Args:
    request: The FastAPI request object.
    query_request: The query request object.

  Returns:
    A JSON response containing the query results.
  """
  try:
    result = api.invoke(query_request.query)
    return result

  except Exception as e:
    raise e  # Re-raise the exception for unhandled errors

@app.post('/api/chromadb/rag/query/stream', summary='Execute Streaming RAG Query', description='Executes a query against RAG and returns results as a stream.')
@handle_400_errors
@handle_500_errors
async def rag_query_stream(request: Request, query_request: QueryRequest):
  """
  Executes a query against RAG and returns results as a stream.

  Args:
    request: The FastAPI request object.
    query_request: The query request object.

  Returns:
    A StreamingResponse object containing the query results as a stream.
  """
  try:
    stream = api.stream(query_request.query)
    return StreamingResponse(stream, media_type='text/event-stream')

  except Exception as e:
    raise e  # Re-raise the exception for unhandled errors

@app.put('/api/chromadb/kintone/document', summary='Upsert a Single Document', description='Upserts a Kintone document in ChromaDB.')
@handle_400_errors
@handle_500_errors
async def upsert_kintone_document(request: Request, document_request: DocumentRequest):
  """
  Upserts a single document in ChromaDB.

  Args:
    request: The FastAPI request object.
    document_request: The document to upsert (DocumentRequest object).

  Returns:
    A JSON response containing the upsert result.
  """
  try:
    id = document_request.id
    document = document_request.document

    result = api.upsert_kintone_document(kintone_app_id, id, document)
    return result

  except Exception as e:
    raise e  # Re-raise the exception for unhandled errors