import React, { useRef, useState, useEffect } from "react";

const gridSize = 3;

const Home = () => {
    const [pattern, setPattern] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const dotRefs = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const size = 400;

        canvas.width = size;
        canvas.height = size;
        ctx.lineWidth = 18;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
    }, []);

    const getDotCenter = (index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const spacing = 120;
        const offset = 60;

        return {
            x: col * spacing + offset + 20,
            y: row * spacing + offset + 20,
        };
    };

    const startDraw = (index) => {
        setIsDrawing(true);
        setPattern([index]);
        activateDot(index);
    };

    const enterDot = (index) => {
        if (!isDrawing || pattern.includes(index)) return;

        setPattern((prev) => {
            const next = [...prev, index];
            drawLine(prev[prev.length - 1], index);
            activateDot(index);
            return next;
        });
    };

    const endDraw = () => {
        setIsDrawing(false);
        // setTimeout(clearCanvas, 1500);
    };

    const drawLine = (from, to) => {
        const ctx = canvasRef.current.getContext("2d");
        const a = getDotCenter(from);
        const b = getDotCenter(to);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    };

    const activateDot = (index) => {
        dotRefs.current[index]?.classList.add("bg-black", "scale-125");
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, 400, 400);
        setPattern([]);
        dotRefs.current.forEach((dot) =>
            dot?.classList.remove("bg-black", "scale-125")
        );
    };

    // ✅ MODERN: Pointer events (works on PC + Mobile)
    const handlePointerMove = (e) => {
        if (!isDrawing) return;
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target?.dataset?.index) {
            enterDot(Number(target.dataset.index));
        }
    };

    return (
        <div className="font-dmsans py-6">
            <div>
                <h1 className="font-black text-5xl tracking-[-3px] text-center">
                    Pattern Lock Previewer
                </h1>

                <p className="font-normal text-lg text-center mt-4 max-w-4xl mx-auto text-black/70 leading-relaxed px-4">
                    Draw Android-style pattern locks using your mouse or finger. This works
                    smoothly on desktop, laptop, tablet and mobile phones.
                </p>
            </div>

            {/* Pattern Area */}
            <div
                className="flex justify-center items-center py-20 relative touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={endDraw}
                onPointerLeave={endDraw}
            >
                {/* Canvas */}
                <canvas ref={canvasRef} className="absolute pointer-events-none " />

                {/* Dots */}
                <div className="grid grid-cols-3 gap-16 select-none"> {Array.from({ length: 9 }).map((_, index) => (<div key={index} data-index={index} ref={(el) => (dotRefs.current[index] = el)} onPointerDown={() => startDraw(index)} className={`
  w-14 h-14 rounded-full cursor-pointer relative
  transition-all duration-200 ease-out

  ${pattern.includes(index)
                        ? "bg-[#006eff] after:content-[''] after:absolute after:inset-0 after:rounded-full after:scale-150 after:transition-all after:duration-300 after:bg-[#AEDEFC] z-10 after:opacity-70"
                        : "bg-[#44444E] hover:bg-[#303030] after:content-[''] after:absolute after:inset-0 after:rounded-full hover:scale-90 after:transition-all after:duration-300 hover:after:scale-150 after:bg-[#44444E] after:opacity-40 "}
`}
                />))} </div>
            </div>
            {/* RESET Button */}
            {pattern.length > 0 && (
                <div className="text-center">
                    <button onClick={clearCanvas} className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                        Reset Pattern
                    </button>
                </div>
            )}

            {/* Pattern Preview */}
            <div className="text-center mt-4">
                <p className="text-lg font-medium tracking-tight">
                    Your Pattern:
                    <span className="ml-2 font-medium tracking-tight">
                        {pattern.length > 0 ? pattern.join(" → ") : "Draw with mouse or finger"}
                    </span>
                </p>
            </div>
            <footer className="text-center text-black tracking-tight md:absolute bottom-4 w-full text-lg ">
                <span>Developed by </span>
                <a href="https://thinakaran.dev" target="_blank" rel="noopener noreferrer" className="underline font-medium">Thinakaran Manokaran</a>
            </footer>
        </div>
    );
};

export default Home;
