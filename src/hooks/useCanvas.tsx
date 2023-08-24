import { useRef, useEffect, useState } from "react";

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState("5");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentFunction, setCurrentFunction] = useState("draw");
  const [action, setAction] = useState("");

  const startDrawing = ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
    if (!context) return null;

    const { offsetX, offsetY } = nativeEvent;

    if (["draw", "erase"].includes(currentFunction)) {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    }

    if (currentFunction !== "write") {
    }
    setIsDrawing(true);
  };

  const finishDrawing = ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
    if (!context) return null;

    const { offsetX, offsetY } = nativeEvent;

    if (["draw", "erase"].includes(currentFunction)) {
      context.closePath();
    }

    if (currentFunction === "write") {
      const textbox = document.querySelector(
        "textarea.textbox"
      ) as HTMLInputElement;

      if (textbox && !["writing", "finished"].includes(action)) {
        textbox.style.top = `${offsetY}px`;
        textbox.style.left = `${offsetX}px`;
        textbox.style.color = strokeColor;
        textbox.focus();
        setAction("writing");
        textbox.onblur = () => {
          if (textbox.value) {
            context.font = "300 24px sans-serif";
            context.fillStyle = strokeColor;
            context.fillText(textbox.value, offsetX, offsetY + 24);
            textbox.value = "";
            textbox.style.top = "";
            textbox.style.left = "";
            setAction("finished");
          }
        };
      }
    }
    setIsDrawing(false);
    setAction("");
  };

  const draw = ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
    if (!context) return null;
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    if (["draw", "erase"].includes(currentFunction)) {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }

    // if (currentFunction === "write") {
    //   console.log("move it!");
    // }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return null;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useEffect(() => {
    const prepareCanvas = () => {
      const canvas = canvasRef.current as any;
      canvas.height = canvas.parentElement.clientHeight;
      canvas.width = canvas.parentElement.clientWidth;
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      setContext(ctx);
    };

    window.addEventListener("resize", resizeCanvas, false);

    function resizeCanvas() {
      prepareCanvas();
    }

    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = strokeColor;
    }
  }, [context, strokeColor]);

  useEffect(() => {
    if (context) {
      context.lineWidth = Number(strokeWidth);
    }
  }, [context, strokeWidth]);

  useEffect(() => {
    if (context) {
      if (currentFunction === "erase") {
        context.strokeStyle = "white";
      } else {
        context.strokeStyle = strokeColor;
      }
    }
    setAction("");
  }, [context, currentFunction, strokeColor]);

  return {
    canvasRef,
    context,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    startDrawing,
    finishDrawing,
    clearCanvas,
    draw,
    currentFunction,
    setCurrentFunction,
  };
};

export default useCanvas;
