
import { Position, CellType } from '../../types';

export function canSee(startPos: Position, endPos: Position, grid: CellType[][]): boolean {
  let x0 = startPos.x;
  let y0 = startPos.y;
  const x1 = endPos.x;
  const y1 = endPos.y;

  // If start and end are the same, it's visible.
  if (x0 === x1 && y0 === y1) return true;

  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0); // dy is positive for this algorithm version
  const sy = y0 < y1 ? 1 : -1;
  let err = (dx > dy ? dx : -dy) / 2;
  let e2;

  // The loop iterates, moving x0, y0 one step closer to x1, y1
  // We check the cell *at* (x0,y0) *after* it has moved from startPos
  // but *before* it reaches endPos.
  while (true) {
    // Move to the next point on the line
    e2 = err;
    let prevX = x0; // Store current before moving, for safety break
    let prevY = y0;

    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }

    // Check if we've reached the destination
    if (x0 === x1 && y0 === y1) {
      return true; // Destination reached, so it's visible
    }

    // If the current cell (x0, y0) on the path is a wall,
    // then the line of sight to endPos is blocked.
    // Ensure grid boundaries are checked.
    if (y0 < 0 || y0 >= grid.length || x0 < 0 || x0 >= (grid[0]?.length || 0) || grid[y0][x0] === CellType.WALL) {
      return false; // Path is blocked by a wall or out of bounds
    }
    
    // Safety break: if no progress is made (should not happen in a correct Bresenham on a grid)
    if (x0 === prevX && y0 === prevY) {
        // This implies we are stuck or an error in logic, assume blocked.
        return false; 
    }
  }
}