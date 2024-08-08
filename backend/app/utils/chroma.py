import pandas as pd
import pypdfium2 as pdfium
import chromadb
from chromadb.config import Settings as ChromaSettings

from config.settings import Settings

settings = Settings()

from .model import Model

model = Model()

class Chroma(object):
  """
  A class for interacting with a ChromaDB collection.
  """
  def __init__(self) -> None:
    """
    Initializes a Chroma object.
    """
    chromadb_client = chromadb.Client(
      ChromaSettings(
        # chroma_db_impl="duckdb+parquet",
        persist_directory=settings.chromadb.persist_dir
      )
    )
    self.client = chromadb_client
    collection = chromadb_client.get_or_create_collection(settings.chromadb.collection_name)
    self.collection = collection

  def upsert_documents(self, *args, **kwargs):
    """
    Upserts documents into the ChromaDB collection.

    Args:
      *args: Positional arguments for the upsert method.
      **kwargs: Keyword arguments for the upsert method.

    Returns:
      The result of the upsert operation.
    """
    return self.collection.upsert(*args, **kwargs)
  
  def query(self, query: str) -> dict:
    """
    Queries the ChromaDB collection for similar documents.

    Args:
      query: The query string.

    Returns:
      A dictionary containing the query results.
    """
    query_vector = model.encode(query).tolist()
    k = 10

    results = self.collection.query(
      query_embeddings=[query_vector], 
      n_results=k
    )

    for index in range(len(results["ids"][0])):
      print(f'{results["ids"][0][index]} : {results["distances"][0][index]} : {results["documents"][0][index]} : {results["metadatas"][0][index]["source"]}')

    return results