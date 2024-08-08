from pydantic import BaseModel

from .chroma import Chroma
from .extractors import extract_kintone_records
from .rag_langchain import invoke, stream
from config.settings import Settings

settings = Settings()
db = Chroma()

class Api (object):
  def __init__(
    self
  ) -> None:
    pass

  def query(self, query: str) -> dict:
    """
    Queries the ChromaDB collection for similar documents.

    Args:
      query: The query string.

    Returns:
      A dictionary containing the query results.
    """
    result = db.query(query)
    return result

  def invoke(self, question: str) -> str:
    """
    Invokes the RAG chain to answer a question.

    Args:
      question: The question to answer.

    Returns:
      The answer to the question.
    """
    result = invoke(question)
    return result

  def stream(self, question: str) -> any:
    """
    Streams the RAG chain's response to a question.

    Args:
      question: The question to answer.

    Returns:
      An asynchronous generator that yields chunks of the response as bytes.
    """
    return stream(question)
  
  def upsert_kintone_document(self, app: int, id: int, document: str) -> None:
    """
    Upserts a single document from Kintone into the ChromaDB collection.

    Args:
      app: The Kintone app ID.
      id: The Kintone record ID.
      document: The document content.
    """
    db.upsert_documents(
      documents=[document],
      metadatas=[{"source": f"{settings.datasources.kintone.base_url}/k/{app}/show#record={id}"}],
      ids=[f"{app}-{id}"]
    )
    return {"status": "success", "message": "Document indexed."}
  
  def upsert_kintone_documents(self, app: int, condition: str, fields: list[str]) -> dict:
    """
    Upserts multiple documents from Kintone into the ChromaDB collection.

    Args:
      app: The Kintone app ID.
      condition: The condition to filter records.
      fields: The fields to extract.

    Returns:
      A dictionary containing the upsert status.
    """
    kintone_documents = extract_kintone_records(app, condition, fields)
    for document in kintone_documents:
      db.upsert_documents(
        documents=[document['document']],
        metadatas=[{
          "source": f"{settings.datasources.kintone.base_url}/k/{app}/show#record={document['recordId']}",
          "recordId": document['recordId']
        }],
        ids=[f"{app}-{document['recordId']}"]
      )

    return {"status": "success", "message": "Documents indexed."}