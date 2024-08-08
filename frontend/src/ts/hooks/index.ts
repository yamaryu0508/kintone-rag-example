import { useState, useEffect } from 'react';

export const useEventStream = ({ url, body }: { url: string; body: any }) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          return;
        }

        let receivedData = '';
        while (true) {
          const { value, done } = await reader.read();
          // console.log(done);
          // console.log(value);
          console.log(new TextDecoder().decode(value));
          if (done) {
            break;
          }
          receivedData += new TextDecoder().decode(value);
          const lines = receivedData.split('\n');
          setData((prevData) => [...prevData, ...lines.slice(0, -1)]);
          receivedData = lines[lines.length - 1];
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [url, body]);

  // console.log(data);

  return data;
};