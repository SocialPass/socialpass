import styled, { css } from 'styled-components'
import { animated } from 'react-spring'

const toastTypes: any = {
  success: css`
    background: var(--green-success);
    color: #fff;
  `,
  error: css`
    background: var(--red-denied);
    color: #fff;
  `,
  info: css`
    background: var(--blue-info);
    color: #fff;
  `,
}

export const Container: any = styled(animated.div)`
  width: 280px;
  margin-bottom: 4px;
  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  display: flex;
  /* justify-content: center;
  align-items: center; */

  ${(props: any) => toastTypes[props.type] || 'info'}

  > svg {
    margin: 2px 6px 0 0;
  }

  div {
    flex: 1;

    strong {
      font-size: 20px;
      margin-left: 5px;
    }

    p {
      color: #fff;
      margin-top: 1px;
      margin-bottom: -5px;
      font-weight: 500;
      font-size: 16px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 19px;
    border: 0;
    background: transparent;
    color: inherit;
  }
`
