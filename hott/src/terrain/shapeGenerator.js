import { randomBetween } from "./random.js";

export function generateShape({
  center,
  width,
  height,
  rotation = 0,
  shape,
}) {
  switch (shape.type) {
    case "rectangle":
      return generateRectangle(center, width, height, rotation);

    case "irregular":
      return generateIrregularPolygon(
        center,
        width,
        height,
        rotation,
        shape,
      );

    default:
      throw new Error(`Unknown shape type: ${shape.type}`);
  }
}