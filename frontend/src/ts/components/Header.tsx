import * as React from 'react';

import { css } from '@emotion/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { HEADER_TITLE } from '../constants';

interface HeaderProps {
  onToggleOpen: () => void;
}

const style = {
  header: css`
    height: 56px;
    background-color: #e3e7e8;
    border-radius: 24px 24px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  title: css`
    margin-left: 20px;
  `,
  buttons: css`
    display: flex;
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
};

const Header: React.FC<HeaderProps> = ({ onToggleOpen }: HeaderProps) => {
  return (
    <div css={style.header}>
      <div css={style.title}>{HEADER_TITLE}</div>
      <div css={style.buttons}>
        <button css={[style.transparentButton, css`margin-right: 10px;`]} onClick={onToggleOpen}>
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
};

export default Header;
