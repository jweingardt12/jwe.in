import React from "react";

export function DotBackgroundDemo() {
  return (
    <div className="w-full h-full">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-dot-black dark:bg-dot-white [background-size:16px_16px] opacity-50" />
      </div>
    </div>
  );
}
