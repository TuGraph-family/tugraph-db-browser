import React from 'react';

const backStyleMap = {
  left: {
    left: '100%',
    top: '40%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent transparent transparent #f3f5f9',
  },
  right: {
    right: '100%',
    top: '40%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent #f3f5f9 transparent transparent',
  },
  bottom: {
    left: '10%',
    bottom: 'calc(100% + 1px)',
    height: '38px',
    width: '80px',
    borderColor: 'transparent transparent #f3f5f9 transparent',
  },
};

const handlerStyleMap = {
  left: {
    left: 'calc(100% - 1px)',
    top: '40%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent transparent transparent #f3f5f9',
  },
  right: {
    right: 'calc(100% - 1px)',
    top: '40%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent #f3f5f9 transparent transparent ',
  },
  bottom: {
    left: '10%',
    bottom: '100%',
    height: '38px',
    width: '80px',
    borderColor: 'transparent transparent #f3f5f9  transparent',
  },
};

const textStyleMap = {
  left: {
    left: '-15px',
    top: '8px',
  },
  right: {
    left: '5px',
    top: '8px',
  },
  bottom: {
    left: '15px',
    top: '0',
  },
};

export interface HandlerProps {
  style?: React.CSSProperties;
  handleClick: () => void;
  handlerPosition: 'left' | 'right' | 'bottom';
  icon?: React.ReactNode;
}

const Handler: React.FC<HandlerProps> = (props) => {
  const { handleClick, handlerPosition, icon, style = {} } = props;

  const handerBackStyles = {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '20px',
    ...backStyleMap[handlerPosition],
  };
  const handlerStyles: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '20px',
    userSelect: 'none',
    ...handlerStyleMap[handlerPosition],
  };
  const handlerTextStyles = {
    position: 'absolute',
    ...textStyleMap[handlerPosition],
  };

  return (
    <>
      <div style={{ ...handerBackStyles, ...style } as any}></div>
      <div onClick={handleClick} style={{ ...handlerStyles, ...style } as any}>
        <span style={handlerTextStyles as any}>
          {icon ? icon : handlerPosition === 'bottom' ? '=' : '||'}
        </span>
      </div>
    </>
  );
};

export default Handler;
