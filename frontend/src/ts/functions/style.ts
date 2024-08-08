import { css } from '@emotion/react';

export const isShown = (_isShown: boolean) =>
  css`
    ${!_isShown ? `display: none;` : ``}
  `;

export const shouldBeHighlighted = (_shouldBeHighlighted: boolean) =>
  css`
    font-weight: ${_shouldBeHighlighted ? 700 : 200};
  `;
