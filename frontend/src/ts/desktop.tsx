// https://medium.com/@hxu296/serving-openai-stream-with-fastapi-and-consuming-with-react-js-part-1-8d482eb89702

import { createRoot } from 'react-dom/client';

import Desktop from './components/Desktop';
import { APP_SELECTOR, API_ENDPOINT, DATA_SOURCE_APP_IDS } from './constants';

kintone.events.on([
  'portal.show',
  'space.portal.show',
  'app.record.index.show',
  'app.record.create.show',
  'app.record.edit.show',
  'app.record.detail.show'
], async (event) => {
  console.log(event);
  if (document.querySelector(APP_SELECTOR) === null) {
    const documentBody = document.body as HTMLBodyElement;
    const appContainer = document.createElement('div');
    appContainer.id = APP_SELECTOR.replace('#', '');
    appContainer.style.display = 'inline-block';
    documentBody.append(appContainer);
    const root = createRoot(appContainer);
    root.render(<Desktop />);
  }
  return event;
});

kintone.events.on([
  'app.record.create.submit.success',
  'app.record.index.edit.submit.success',
  'app.record.edit.submit.success'
], async (event) => {
  const {appId, recordId ,record} = event;
  if (!DATA_SOURCE_APP_IDS.includes(appId)) {
    return event;
  }
  try {
    const response = await fetch(`${API_ENDPOINT}/api/chromadb/kintone/document`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app: appId,
        id: recordId,
        document: `${record['Question']['value']} \n\n ${record['Answer']['value']}`
      }),
      referrerPolicy: 'origin-when-cross-origin'
    }).then(res => res.json());
    console.log(response);
    return event;
  } catch (e) {
    console.error(e);
    return event;
  }
});