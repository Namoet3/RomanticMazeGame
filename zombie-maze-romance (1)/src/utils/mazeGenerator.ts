
import { CellType, Position } from '../../types';

// Helper function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getShuffledNeighbors(grid: CellType[][], x: number, y: number, distance: number = 2): Position[] {
  const neighbors: Position[] = [];
  const mazeWidth = grid[0].length;
  const mazeHeight = grid.length;

  // Potential neighbors (up, down, left, right by 'distance' cells)
  const potential = [
    { x: x, y: y - distance }, // Up
    { x: x, y: y + distance }, // Down
    { x: x - distance, y: y }, // Left
    { x: x + distance, y: y }, // Right
  ];

  for (const n of potential) {
    if (n.x > 0 && n.x < mazeWidth -1 && n.y > 0 && n.y < mazeHeight -1) { // Check bounds (must be within grid and not edge)
      neighbors.push(n);
    }
  }
  return shuffle(neighbors);
}

export const generateMaze = (width: number, height: number): {
  grid: CellType[][];
  playerStart: Position;
  doorPosition: Position;
} => {
  // Ensure width and height are odd
  const mazeWidth = width % 2 === 0 ? width + 1 : width;
  const mazeHeight = height % 2 === 0 ? height + 1 : height;

  // Initialize grid with walls
  const grid: CellType[][] = Array.from({ length: mazeHeight }, () =>
    Array(mazeWidth).fill(CellType.WALL)
  );

  const stack: Position[] = [];
  const startX = 1; // Start carving from an odd position
  const startY = 1;
  
  grid[startY][startX] = CellType.FLOOR;
  stack.push({ x: startX, y: startY });

  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek
    const neighbors = getShuffledNeighbors(grid, current.x, current.y, 2);
    let foundNeighbor = false;

    for (const neighbor of neighbors) {
      if (grid[neighbor.y][neighbor.x] === CellType.WALL) {
        // Carve path to neighbor
        grid[neighbor.y][neighbor.x] = CellType.FLOOR;
        grid[neighbor.y - (neighbor.y - current.y) / 2][neighbor.x - (neighbor.x - current.x) / 2] = CellType.FLOOR;
        
        stack.push(neighbor);
        foundNeighbor = true;
        break;
      }
    }

    if (!foundNeighbor) {
      stack.pop(); // Backtrack
    }
  }

  // Find all floor tiles to place player and door
  const floorTiles: Position[] = [];
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (grid[y][x] === CellType.FLOOR) {
        floorTiles.push({ x, y });
      }
    }
  }

  if (floorTiles.length < 2) {
    // Fallback if something went wrong (e.g., too small maze)
    console.error("Maze generation failed to create enough floor tiles.");
    // Create a very simple fallback maze
    const fallbackGrid: CellType[][] = [
      [CellType.WALL, CellType.WALL, CellType.WALL],
      [CellType.WALL, CellType.FLOOR, CellType.WALL],
      [CellType.WALL, CellType.WALL, CellType.WALL]
    ];
    return { grid: fallbackGrid, playerStart: { x: 1, y: 1 }, doorPosition: { x: 1, y: 1 } };
  }

  shuffle(floorTiles);
  const playerStart = floorTiles.pop()!;
  let doorPosition = floorTiles.pop()!;

  // Ensure door is not too close to player start if possible
  if (floorTiles.length > 0) {
    let attempts = 0;
    while (Math.abs(playerStart.x - doorPosition.x) + Math.abs(playerStart.y - doorPosition.y) < Math.min(mazeWidth, mazeHeight) / 2 && attempts < floorTiles.length) {
        floorTiles.unshift(doorPosition); // Put it back if too close
        doorPosition = floorTiles.pop()!;
        attempts++;
    }
  }


  grid[doorPosition.y][doorPosition.x] = CellType.DOOR; // Mark door on grid

  return { grid, playerStart, doorPosition };
};