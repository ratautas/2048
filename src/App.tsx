import HelloWorld from "@/components/HelloWorld";
import "@/assets/style.scss";
import { useEffect, useReducer } from "react";

const SIZE: number = 4;
const board = Array(SIZE).fill(Array(SIZE).fill(null));
const INITIAL_STATE = {
  board: [
    // [8, 4, 2, 2],
    // [4, 2, null, 2],
    // [null, null, null, null],
    // [null, null, null, null],
    [8, 4, null, 2],
    [4, 2, null, 4],
    [2, null, null, 4],
    [2, 2, null, 2],
  ],
};

export enum ActionTypes {
  ADD_RANDOM = "ADD_RANDOM",
  PUSH_UP = "PUSH_UP",
  PUSH_RIGHT = "PUSH_RIGHT",
  PUSH_DOWN = "PUSH_DOWN",
  PUSH_LEFT = "PUSH_LEFT",
}

export type Action = {
  type: string;
  payload?: any;
};

export type Tile = {
  row: number;
  column: number;
};

export type State = {
  board: Tile[][];
};

const checkIfOnBoard = (tile: Tile, board: Tile[][]) => {
  return !!board[tile.row][tile.column];
};

const getRandom = (max: number) => Math.floor(Math.random() * max);

const generateTile = () => {
  return {
    row: getRandom(SIZE),
    column: getRandom(SIZE),
  };
};

const transpose = array => {
  const transposedArray = [];
  JSON.parse(JSON.stringify(array)).forEach((x, xIndex) => {
    x.forEach((y, yIndex) => {
      transposedArray[yIndex] ??= [];
      transposedArray[yIndex][xIndex] = y;
    });
  });

  return transposedArray;
};

const reducer = (state: State, { type, payload = null }: Action) => {
  const board = JSON.parse(JSON.stringify(state.board));
  switch (type) {
    case ActionTypes.ADD_RANDOM: {
      let newTile = generateTile();
      while (!!board[newTile.row][newTile.column]) {
        newTile = generateTile();
      }
      const { row, column } = newTile;

      return {
        ...state,
        board: [
          ...board.slice(0, row),
          [...board[row].slice(0, column), 2, ...board[row].slice(column + 1)],
          ...board.slice(row + 1),
        ],
      };
    }
    case ActionTypes.PUSH_UP: {
      const reduced = transpose(board).map(line => {
        return line
          .reverse()
          .reduce((accumulatedLine: [], item, i) => {
            if (!item) return accumulatedLine;
            const matchIndex = accumulatedLine.findIndex(
              (match, index) => index > i && match === item
            );
            const diffBetweenMatch = matchIndex - i;
            const has = Array.from({ length: diffBetweenMatch }).some(i => !!i);
            // const
            console.log({ has, diffBetweenMatch });
            // const nextMatchIndex = accumulatedLine.findIndex(
            // );
            // if (nextMatchIndex) {
            //   // accumulatedLine[i] = null; // or should be a new one
            //   accumulatedLine[nextMatchIndex] = item * 2; // or should be a new one
            // }
            return accumulatedLine;
            // accumulatedLine[]
            // if (accumulatedLine.findIndex((indexItem, index)=> index !== i && indexItem === item))
            // }, line);
          }, line)
          .reverse();
      });
      console.log(transpose(reduced));
      // const updatedBoard = board.reduce((acc, row, rowIndex, originalArray) => {
      //   console.log({ row });
      //   const udpatedRow = row.map((column, columnIndex) => {
      //     console.log(board[rowIndex][columnIndex]);
      //     return column;
      //   });
      //   return acc;
      // }, board);
      // const board = JSON.parse(JSON.stringify(state.board));

      return { ...state, board: transpose(reduced) };
    }
    default:
      return state;
  }
};

const App = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const keyupHandler = ({ key }: KeyboardEvent) => {
    switch (key) {
      case "ArrowUp":
        return dispatch({ type: ActionTypes.PUSH_UP });
      case "ArrowRight":
        return dispatch({ type: ActionTypes.PUSH_RIGHT });
      case "ArrowDown":
        return dispatch({ type: ActionTypes.PUSH_DOWN });
      case "ArrowLeft":
        return dispatch({ type: ActionTypes.PUSH_LEFT });
    }
  };

  useEffect(() => {
    // setInterval(() => {
    dispatch({ type: ActionTypes.ADD_RANDOM });
    dispatch({ type: ActionTypes.ADD_RANDOM });
    // }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", keyupHandler);
    return () => window.removeEventListener("keyup", keyupHandler);
  }, []);

  const { board } = state;

  return (
    <>
      <pre>{JSON.stringify(state.board)}</pre>
      <pre>{JSON.stringify(transpose(state.board))}</pre>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((column: number, columnIndex: number) => {
            return (
              <div key={`${rowIndex}${columnIndex}`} className="grid__tile">
                {column}
              </div>
            );
          })
        )}
      </div>
      <HelloWorld />
    </>
  );
};
export default App;
