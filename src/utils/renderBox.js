import labels from "./labels.json";

export const renderBoxes = (canvasRef, res, rawImage) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  const numClasses = res.length;
  const numRows = res[0].length;
  const numCols = res[0][0].length;
  const cellWidth = canvas.width / numCols;
  const cellHeight = canvas.height / numRows;

  ctx.drawImage(rawImage, 0, 0, canvas.width, canvas.height);

  //Skipping the class 0: background
  for (let classIdx = 1; classIdx < numClasses; classIdx++) {
    const classColor = generateClassColors(numClasses)[classIdx];
    ctx.fillStyle = classColor;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const maskValue = res[classIdx][row][col];

        if (maskValue > 0) {
          const x = col * cellWidth;
          const y = row * cellHeight;

          ctx.globalAlpha = 0.5;
          ctx.fillRect(x, y, cellWidth, cellHeight);
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }
};

const generateClassColors = (numClasses) => {
  const colors = [];
  const hueStep = 360 / numClasses;

  for (let i = 0; i < numClasses; i++) {
    const hue = i * hueStep;
    const color = `hsl(${hue}, 100%, 50%)`;
    colors.push(color);
  }

  return colors;
};
