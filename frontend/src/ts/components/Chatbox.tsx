import * as React from 'react';

import { css } from '@emotion/react';
import {
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline';

import Header from './Header';
// import MicrophoneInput from './MicrophoneInputWithSpeechRecognition';
// import FileUploader from './FileUploader';
import InputBox from './InputBox';
import MessagesBox from './MessagesBox';
import { API_ENDPOINT } from '../constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  context?: {
    metadata: {
      source: string;
    };
  }[];
}

const style = {
  container: css`
    position: fixed;
    bottom: 30px;
    right: 30px;
  `,
  chatbox: css`
    // width: 400px;
    // height: 600px;
    width: 500px;
    height: 60vh;
    background-color: #fff;
    border: 1px solid #e3e7e8;
    border-radius: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `,
  circleButton: css`
    width: 48px;
    height: 48px;
    background-color: #3498db;
    border-radius: 24px;
    border: 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      color: #eee;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
  `
}

const Chatbox: React.FC = () => {
  const [inputText, setInputText] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (inputText.trim() !== '') {
      setMessages(prev => ([...prev, {role: 'user', content: inputText}]));
      setInputText('');
      setIsWaiting(true);
      fetch(`${API_ENDPOINT}/api/chromadb/rag/query`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query: inputText}),
        referrerPolicy: "origin-when-cross-origin"
      })
        .then(res => res.json())
        .then(({answer, context}) => {
          setMessages(prev => [...prev, {role: 'assistant', content: answer, context}]);
          setIsWaiting(false);
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.shiftKey && e.key === 'Enter') {
      // Shift + Enter で改行を挿入
      // setInputText(prev => `${prev}\n`);
    }
  };

  // console.log(messages);

  return (
    <div css={style.container} >
      {/* <EventStream url={`${API_ENDPOINT}/api/rag/query/stream`} body={{query: 'tell me about security measures.'}} /> */}
      {isOpen ?
        <div css={style.chatbox}>

          <Header
            onToggleOpen={() => toggleOpen()}
          />
          <MessagesBox
            messages={messages}
            isWaiting={isWaiting}
          />
          <InputBox 
            inputText={inputText}
            onInputTextChange={e => setInputText(e.target.value)}
            onSubmit={e => handleSubmit(e)}
            onKeyDown={e => handleKeyDown(e)}
          />
        </div>
      :
        <button css={style.circleButton} onClick={() => toggleOpen()}>
          <ChatBubbleOvalLeftEllipsisIcon />
        </button>
      }
    </div>
  );
};

export default Chatbox;