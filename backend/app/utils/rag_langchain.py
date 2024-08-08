import asyncio
import json
from typing import AsyncGenerator

from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

from .chroma import Chroma as WrappedChroma
from config.settings import Settings

settings = Settings()
wrapped_chroma = WrappedChroma()

model = ChatOpenAI(model=settings.models.openai.model)

def build_chain(question: str) -> RunnableParallel:
  """
  Builds a RAG chain for question answering.

  Args:
    question: The question to answer.

  Returns:
    A RunnableParallel chain that can be invoked to answer the question.
  """
  embedding_function = SentenceTransformerEmbeddings(model_name=settings.chromadb.embeddings_model_name)
  db = Chroma(
    client=wrapped_chroma.client,
    collection_name=settings.chromadb.collection_name,
    embedding_function=embedding_function
  )

  retriever = db.as_retriever()

  template = """Answer the question based only on the following context:
  {context}

  Question: {question}
  """
  prompt = ChatPromptTemplate.from_template(template)
  output_parser = StrOutputParser()

  rag_chain_from_docs = (
    RunnablePassthrough.assign(context=(lambda x: x["context"]))
    | prompt
    | model
    | output_parser
  )

  chain = RunnableParallel(
    {"context": retriever, "question": RunnablePassthrough()}
  ).assign(answer=rag_chain_from_docs)

  return chain

def invoke(question: str) -> str:
  """
  Invokes the RAG chain to answer a question.

  Args:
    question: The question to answer.

  Returns:
    The answer to the question.
  """
  chain = build_chain(question)
  result = chain.invoke(question)
  return result

async def stream(question: str) -> AsyncGenerator[bytes, None]:
  """
  Streams the RAG chain's response to a question.

  Args:
    question: The question to answer.

  Yields:
    Chunks of the response as bytes.
  """
  chain = build_chain(question)
  for chunk in chain.stream(question):
    if 'context' in chunk:
      chunk_str = json.dumps({'context': [document.dict() for document in chunk['context']]})
    else:
      chunk_str = json.dumps(chunk)
    chunk_bytes = f'{chunk_str}\n'.encode('utf-8')
    yield chunk_bytes
    await asyncio.sleep(0.05)