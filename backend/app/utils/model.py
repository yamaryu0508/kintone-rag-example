# https://github.com/UKPLab/sentence-transformers
from sentence_transformers import SentenceTransformer

from config.settings import Settings

settings = Settings()

class Model(object):
  def __init__(
    self,
    model_name = settings.chromadb.embeddings_model_name # or 'all-MiniLM-L6-v2'
  ) -> None:
    self.model_name = model_name
    self.model = SentenceTransformer(
      model_name, 
      cache_folder=settings.chromadb.cache_dir
    )

  def encode(self, string: str) -> list[float]:
    return self.model.encode(string)