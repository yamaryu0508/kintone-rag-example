FROM --platform=linux/amd64 python:3.12 AS build

RUN apt-get -y update
RUN apt-get -y install git

ENV APP_PATH=/workspace
WORKDIR ${APP_PATH}

ADD ./ ${APP_PATH}/
RUN pip install --no-cache-dir --upgrade -r ${APP_PATH}/requirements.txt

ENV HOME ${APP_PATH}
ENV PYTHONPATH ${APP_PATH}

EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
