import useCanvas from "@/hooks/useCanvas";

import "./canvas.css";

const Canvas = () => {
  const {
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    clearCanvas,
    startDrawing,
    finishDrawing,
    draw,
    canvasRef,
    currentFunction,
    setCurrentFunction,
  } = useCanvas();

  return (
    <div className="canvas-application">
      <div className="toolbar">
        <div className="toolbar-draw">
          <button
            className={`${currentFunction === "draw" ? "active" : ""}`}
            onClick={() => setCurrentFunction("draw")}
          >
            <img src="/pencil.png" alt="pencil" />
          </button>
        </div>
        {["draw", "write"].includes(currentFunction) && (
          <>
            <div className="toolbar-color">
              <input
                type="color"
                onChange={(e) => setStrokeColor(e.target.value)}
                value={strokeColor}
              />
            </div>
          </>
        )}
        {["draw", "erase"].includes(currentFunction) && (
          <div className="toolbar-color">
            <input
              type="number"
              onChange={(e) => setStrokeWidth(e.target.value)}
              value={strokeWidth}
            />
          </div>
        )}
        <div className="toolbar-text">
          <button
            className={`${currentFunction === "write" ? "active" : ""}`}
            onClick={() => setCurrentFunction("write")}
          >
            <img src="/text.png" alt="eraser" />
          </button>
        </div>
        <div className="toolbar-erase">
          <button
            className={`${currentFunction === "erase" ? "active" : ""}`}
            onClick={() => setCurrentFunction("erase")}
          >
            <img src="/eraser.png" alt="eraser" />
          </button>
        </div>
        <div className="toolbar-clear">
          <button onClick={() => clearCanvas()}>
            <img src="/trash.png" alt="trash" />
          </button>
        </div>
      </div>
      <div className="canvas-container">
        <canvas
          height={500}
          width={500}
          onPointerDown={startDrawing}
          onPointerUp={finishDrawing}
          onPointerMove={draw}
          ref={canvasRef}
        />
        {currentFunction === "write" && (
          <textarea className="textbox" name="text" id="input" />
        )}
      </div>
    </div>
  );
};

export default Canvas;
