import * as React from 'react';

import { css } from '@emotion/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface InputBoxProps {
  inputText: string;
  onInputTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const style = {
  inputBox: css`
    min-height: 100px;
    display: flex;
    justify-content: center;
    margin: 15px 15px 15px 15px;
  `,
  inputBoxInner: css`
    background-color: #eee;
    width: 100%;
    border: 1px solid #d8d8d8;
    border-radius: 10px;
  `,
  textarea: css`
    width: 100%;
    box-sizing: border-box;
    resize: none;
    border: 0;
    padding: 10px;
    background-color: transparent;
  `,
  inputBoxButtonContainer: css`
    display: flex;
    justify-content: end;
  `,
  transparentButton: css`
    width: 36px;
    height: 36px;
    background-color: transparent;
    border-radius: 18px;
    border: 0;
    // color: #3498db;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:hover {
      color: #3498db;
    }
  `,
  paperAirplaneIcon: css`

  `
};

const InputBox = ({ inputText, onInputTextChange, onSubmit, onKeyDown }: InputBoxProps) => {
  return (
    <div css={style.inputBox}>
      <form
        onSubmit={(e) => onSubmit(e)}
        css={style.inputBoxInner}
      >
        <textarea
          css={style.textarea}
          placeholder={`Ask me anything...`}
          value={inputText}
          onChange={e => onInputTextChange(e)}
          onKeyDown={e => onKeyDown(e)}
        />
        <div css={style.inputBoxButtonContainer}>
          <button
            type="submit"
            css={style.transparentButton}
          >
            <PaperAirplaneIcon css={style.paperAirplaneIcon} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;