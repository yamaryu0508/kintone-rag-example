import pandas as pd
import pypdfium2 as pdfium
from kintone_rest_client import Client as KintoneRESTClient

from config.settings import Settings

settings = Settings()

# Kintone API client
client = KintoneRESTClient(
  base_url=settings.datasources.kintone.base_url,
  auth={
    'api_token': settings.datasources.kintone.apps[0].api_token
  }
)

def extract_pdf(pdf_document: bytes) -> list[dict[str, any]]:
  """
  Extracts text from a PDF document.

  Args:
    pdf_document: The PDF document as bytes.

  Returns:
    A list of dictionaries, each containing the extracted text and page number.
  """
  pdf_reader = pdfium.PdfDocument(pdf_document)
  documents = []
  try:
    for page_number, page in enumerate(pdf_reader):
      text_page = page.get_textpage()
      content = text_page.get_text_range()
      text_page.close()
      page.close()
      documents.append({
        'document': content,
        'page': page_number
      })
  finally:
    pdf_reader.close()
  return documents

def extract_xlsx(xlsx_document: bytes) -> list[dict[str, any]]:
  """
  Extracts text from an Excel document.

  Args:
    xlsx_document: The Excel document as bytes.

  Returns:
    A list of dictionaries, each containing the extracted text and sheet name.
  """
  file_path = '/tmp/tmp.xlsx'
  with open(file_path, 'wb') as f:
    f.write(xlsx_document)

  # Read each worksheet of an Excel file using Pandas
  xls = pd.ExcelFile(file_path)
  documents = []
  for sheet_name in xls.sheet_names:
    df = pd.read_excel(xls, sheet_name=sheet_name)

    # filter out rows with all NaN values
    df.dropna(how='all', inplace=True)

    # transform each row into a Document
    for i, row in df.iterrows():
      item = ';'.join(f'{k}:{v}' for k, v in row.items() if pd.notna(v))
      documents.append({
        'document': item,
        'sheetName': sheet_name
      })
  return documents

def extract_kintone_records(app: str, condition: str, fields: list[str]) -> list[dict[str, any]]:
  """
  Extracts records from a Kintone app.

  Args:
    app: The Kintone app ID.
    condition: The condition to filter records.
    fields: The fields to extract.

  Returns:
    A list of dictionaries, each containing the extracted record text and record ID.
  """
  params = {
    'app': app,
    'condition': condition,
    'fields': fields
  }

  try:
    response = client.Record.get_all_records_with_id(params)
    documents = []

    for record in response['records']:
      record_text = '\n\n'.join(record[code]['value'] for code in fields if code != '$id')
      documents.append({
        'document': record_text,
        'recordId': record['$id']['value']
      })
        
    return documents
  except Exception as e:
    print(e.to_dict)