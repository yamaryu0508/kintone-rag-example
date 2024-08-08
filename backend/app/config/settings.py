from pydantic_settings import BaseSettings
import os
import yaml

class KintoneApp(BaseSettings):
  id: int
  api_token: str
  fields: list[str]

class Kintone(BaseSettings):
  base_url: str
  apps: list[KintoneApp]

class Datasources(BaseSettings):
  kintone: Kintone

class OpenAIModel(BaseSettings):
  model: str
  api_key: str

class Models(BaseSettings):
  openai: OpenAIModel

class ChromaDB(BaseSettings):
  collection_name: str
  persist_dir: str
  cache_dir: str
  embeddings_model_name: str

class Settings(BaseSettings):
  app_name: str
  docs: dict
  datasources: Datasources
  models: Models
  chromadb: ChromaDB
  debug: bool
  log_level: str
  
  def __init__(self):
    with open('config/development.yml', 'r') as f:
      data = yaml.safe_load(f)
    super().__init__(**data)
    self.datasources.kintone.apps[0].api_token = os.environ.get('KINTONE_APP_API_TOKEN') or self.datasources.kintone.apps[0].api_token
    self.models.openai.api_key = os.environ.get('OPENAI_API_KEY') or self.models.openai.api_key