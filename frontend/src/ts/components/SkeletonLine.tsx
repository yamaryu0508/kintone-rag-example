import * as React from 'react';

import { css, keyframes } from '@emotion/react';

import { isShown } from '../functions/style';

const Component: React.FC<{
  duration?: number;
  isLoading?: boolean;
  lastLine?: boolean;
}> = props => {
  const { duration = 1, isLoading = true, lastLine = false } = props;

  const waveLine = keyframes`
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  `;

  const style = {
    line: (lastLine: boolean, waveLine: string, duration: number) => css`
      height: 12px;
      margin-bottom: ${lastLine ? '0px' : '6px'};
      background: rgb(130 130 130 / 20%);
      background: -webkit-gradient(
        linear,
        left top,
        right top,
        color-stop(8%, rgb(130 130 210 / 20%)),
        color-stop(18%, rgb(130 130 210 / 30%)),
        color-stop(33%, rgb(130 130 210 / 20%))
      );
      background: linear-gradient(
        to right,
        rgb(130 130 210 / 20%) 8%,
        rgb(130 130 210 / 30%) 18%,
        rgb(130 130 210 / 20%) 33%
      );
      background-size: 800px 100px;
      border-radius: 5px;
      animation: ${waveLine} ${duration}s infinite ease-out;
    `
  };

  // const style = css`
  //   height: 8px; // 高さを12pxから8pxに変更して細くします
  //   margin-bottom: 4px; // 余白も少し減らします
  //   background: rgb(25, 118, 210 / 40%); // 濃い青色に変更し、不透明度を40%に設定
  //   background: -webkit-gradient(
  //     linear,
  //     left top,
  //     right top,
  //     color-stop(8%, rgb(25, 118, 210 / 40%)), // 濃い青色、不透明度40%
  //     color-stop(18%, rgb(25, 118, 210 / 50%)), // 濃い青色、不透明度50%
  //     color-stop(33%, rgb(25, 118, 210 / 40%)) // 濃い青色、不透明度40%
  //   );
  //   background: linear-gradient(
  //     to right,
  //     rgb(25, 118, 210 / 40%) 8%, // 濃い青色、不透明度40%
  //     rgb(25, 118, 210 / 50%) 18%, // 濃い青色、不透明度50%
  //     rgb(25, 118, 210 / 40%) 33% // 濃い青色、不透明度40%
  //   );
  //   background-size: 800px 100px;
  //   border-radius: 5px;
  //   animation: ${waveLine} ${duration}s infinite ease-out;
  // `;

  return <div css={[isShown(isLoading), style.line(lastLine, waveLine, duration)]} />;
};

export default Component;
