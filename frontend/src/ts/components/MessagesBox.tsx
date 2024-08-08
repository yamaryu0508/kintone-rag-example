import * as React from 'react';

import { css } from '@emotion/react';
import { HandThumbUpIcon, HandThumbDownIcon, DocumentDuplicateIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

import SkeletonLine from './SkeletonLine';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  context?: {
    metadata: {
      source: string;
    };
  }[];
}

interface MessagesBoxProps {
  messages: Message[];
  isWaiting: boolean;
}

const style = {
  messagesBox: css`
    flex: 1;
    overflow-y: auto;
    max-height: 100%;
    padding: 15px;
  `,
  message: (role: 'user' | 'assistant') => css`
    // width: 90%;
    border: 1px solid #3498db;
    background-color: ${role === 'user' ? '#3498db' : '#fff'};
    color: ${role === 'user' ? '#fff' : '#3498db'};
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
  `,
  source: css`
    border: 1px solid #3498db;
    background-color: #e2f2fe;
    border-radius: 4px;
    padding: 0px 3px 0px 3px;
    margin-left: 3px;
  `,
  iconWithResponse: css`
    height: 22px;
    width: 22px;
    margin-left: 5px;
    margin-bottom: 10px;
  `,
};

const handleClickSource = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, source: string) => {
  e.preventDefault();
  window.open(source);
};

const MessagesBox = ({ messages, isWaiting }: MessagesBoxProps) => {
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isWaiting]);

  return (
    <div css={style.messagesBox}>
      {messages.map((message, i) => (
        <div key={i}>
          <div css={style.message(message.role)}>
            {message.content}
            {message.context?.length ?
              message.context.map(({ metadata: { source } }, j) => {
                return (<a href={source} css={style.source} onClick={e => handleClickSource(e, source)} key={j}>{j + 1}</a>);
              })
            : <></>}
          </div>
        </div>
      ))}
      {
        isWaiting ?
        <div css={style.message('assistant')}>
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine lastLine />
        </div>
        : <></>
      }
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesBox;
