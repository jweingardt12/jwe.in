"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";

const ImageCardStack = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const handleSwipe = useCallback(
    (direction) => {
      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          return (prevIndex + 1) % images.length;
        } else if (direction === "right") {
          return (prevIndex - 1 + images.length) % images.length;
        }
        return prevIndex;
      });
    },
    [images.length]
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  return (
    <div {...handlers} style={styles.container}>
      {images.map((image, index) => {
        const isActive = index === currentIndex;
        const positionOffset = (index - currentIndex + images.length) % images.length;
        const zIndex = images.length - positionOffset;

        return (
          <div
            key={index}
            style={{
              ...styles.card,
              backgroundImage: `url(${image})`,
              transform: `translateY(${positionOffset * 15}px) rotate(${
                isActive ? 0 : positionOffset * 2
              }deg)`,
              zIndex: zIndex,
              opacity: isActive ? 1 : 0.8,
            }}
          ></div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "300px",
    height: "400px",
    margin: "0 auto",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "20px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.5s ease, opacity 0.5s ease",
  },
};

export default ImageCardStack;