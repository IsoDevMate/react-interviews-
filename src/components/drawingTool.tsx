// import React from 'react';

// type DrawingToolProps = {
//   width: number;
//   height: number;
// };

// type CSSColor = string;

// type DrawingToolState = {
//   pointerPosition: { x: number; y: number };
//   isPointerDown: boolean;
//   touchAction: 'none' | 'pan-x' | 'pan-y' | 'pan-x pan-y';
//   penActive: boolean;
//   pressedKeys: Set<string>;
//   fontSize: number;
//   fillColor: CSSColor;
//   strokeColor: CSSColor;
//   strokeWidth: number;
// };

// const DrawingTool: React.FC<DrawingToolProps> = (props): JSX.Element => {
//   const [state, setState] = React.useState<DrawingToolState>({
//     pointerPosition: { x: 0, y: 0 },
//     isPointerDown: false,
//     touchAction: 'none',
//     penActive: false,
//     pressedKeys: new Set(),
//     fontSize: 16,
//     fillColor: 'black',
//     strokeColor: 'black',
//     strokeWidth: 1,
//   });

//   const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
//   const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

//   React.useEffect(() => {
//     if (canvasRef.current) {
//       canvasCtxRef.current = canvasRef.current.getContext('2d');
//       const ctx = canvasCtxRef.current;

//       if (ctx) {
//         ctx.canvas.width = props.width;
//         ctx.canvas.height = props.height;
//         ctx.fillStyle = 'black';
//         ctx.fillRect(0, 0, props.width, props.height);
//       }
//     }
//   }, []);

//   const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
//     const ctx = canvasCtxRef.current;
//     if (!ctx) return;

//     ctx.beginPath();
//     ctx.moveTo(event.clientX, event.clientY);
//     ctx.lineWidth = state.strokeWidth;
//     ctx.strokeStyle = state.strokeColor;
//     ctx.fillStyle = state.fillColor;
//     ctx.stroke();
//     ctx.fill();
//   };
//   const handlePointerMove = (
//     event: React.PointerEvent<HTMLCanvasElement>,
//   ) => {};
//   const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {};
//   const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {};
//   const handleKeyUp = (event: React.KeyboardEvent<HTMLCanvasElement>) => {};
//   const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {};
//   const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {};
//   const handleResize = () => {};

//   return (
//     <canvas ref={canvasRef} {...props} style={{ border: '1px solid black' }} />
//   );
// };

// export default DrawingTool;

import React, { useReducer, useRef, useEffect } from 'react';

// Enhanced interfaces and types
interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  lineWidth: number;
}

type DrawingToolProps = {
  width: number;
  height: number;
};

interface DrawingState {
  points: DrawingPoint[];
  currentColor: string;
  lineWidth: number;
  isDrawing: boolean;
  mode: 'draw' | 'erase';
}

// Expanded Action Types for Reducer
type DrawingAction =
  | { type: 'ADD_POINT'; payload: DrawingPoint }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'CHANGE_COLOR'; payload: string }
  | { type: 'CHANGE_LINE_WIDTH'; payload: number }
  | { type: 'CHANGE_MODE'; payload: DrawingState['mode'] }
  | { type: 'START_DRAWING' }
  | { type: 'STOP_DRAWING' };

// Comprehensive Reducer Function
const drawingReducer = (
  state: DrawingState,
  action: DrawingAction,
): DrawingState => {
  switch (action.type) {
    case 'ADD_POINT':
      return {
        ...state,
        points: [...state.points, action.payload],
      };
    case 'CLEAR_CANVAS':
      return {
        ...state,
        points: [],
      };
    case 'CHANGE_COLOR':
      return {
        ...state,
        currentColor: action.payload,
      };
    case 'CHANGE_LINE_WIDTH':
      return {
        ...state,
        lineWidth: action.payload,
      };
    case 'CHANGE_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'START_DRAWING':
      return {
        ...state,
        isDrawing: true,
      };
    case 'STOP_DRAWING':
      return {
        ...state,
        isDrawing: false,
      };
    default:
      return state;
  }
};

// Initial State with Enhanced Configuration
const initialDrawingState: DrawingState = {
  points: [],
  currentColor: 'black',
  lineWidth: 5,
  isDrawing: false,
  mode: 'draw',
};

const DrawingTool: React.FC<DrawingToolProps> = ({ width, height }) => {
  const [state, dispatch] = useReducer(drawingReducer, initialDrawingState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Canvas Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        canvasCtxRef.current = ctx;
      }
    }
  }, [width, height]);

  // Render Points Effect
  useEffect(() => {
    const ctx = canvasCtxRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);

      state.points.forEach((point, index) => {
        ctx.beginPath();
        ctx.fillStyle = point.color;
        ctx.arc(point.x, point.y, point.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect points for smoother drawing
        if (index > 0) {
          const prevPoint = state.points[index - 1];
          ctx.beginPath();
          ctx.strokeStyle = point.color;
          ctx.lineWidth = point.lineWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });
    }
  }, [state.points, width, height]);

  // Coordinate Calculation
  const getCanvasCoordinates = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  // Drawing Event Handlers
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    dispatch({ type: 'START_DRAWING' });
    const { x, y } = getCanvasCoordinates(event);

    dispatch({
      type: 'ADD_POINT',
      payload: {
        x,
        y,
        color: state.mode === 'draw' ? state.currentColor : 'white',
        lineWidth: state.lineWidth,
      },
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!state.isDrawing) return;

    const { x, y } = getCanvasCoordinates(event);
    dispatch({
      type: 'ADD_POINT',
      payload: {
        x,
        y,
        color: state.mode === 'draw' ? state.currentColor : 'white',
        lineWidth: state.lineWidth,
      },
    });
  };

  const handlePointerUp = () => {
    dispatch({ type: 'STOP_DRAWING' });
  };

  // Action Methods
  const clearCanvas = () => {
    dispatch({ type: 'CLEAR_CANVAS' });
  };

  const changeColor = (color: string) => {
    dispatch({ type: 'CHANGE_COLOR', payload: color });
    dispatch({ type: 'CHANGE_MODE', payload: 'draw' });
  };

  const changeLineWidth = (width: number) => {
    dispatch({ type: 'CHANGE_LINE_WIDTH', payload: width });
  };

  const toggleEraserMode = () => {
    dispatch({
      type: 'CHANGE_MODE',
      payload: state.mode === 'draw' ? 'erase' : 'draw',
    });
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="color"
          value={state.currentColor}
          onChange={(e) => changeColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={state.lineWidth}
          onChange={(e) => changeLineWidth(Number(e.target.value))}
        />
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={toggleEraserMode}>
          {state.mode === 'draw' ? 'Eraser' : 'Draw'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          border: '1px solid black',
          touchAction: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
};

export default DrawingTool;


// he following should get the proper touch or click location from the event. I did fight with this quite a bit myself, and this finally did the trick. It is basically a merged snipped from other answers here on stackoverflow. The trick should be to properly consider the canvas' getBoundingClientRect.

// function getInteractionLocation(event) {
//     let pos = { x: event.clientX, y: event.clientY };
//     if (event.touches) {
//         pos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
//     }
//     const rect = event.target.getBoundingClientRect();
//     const x_rel = pos.x - rect.left;
//     const y_rel = pos.y - rect.top;
//     const x = Math.round((x_rel * event.target.width) / rect.width);
//     const y = Math.round((y_rel * event.target.height) / rect.height);
//     return [x, y];
// };
