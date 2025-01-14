"use client";
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { useDetection } from "@/contexts/DetectionContext";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

const ObjectDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [initialDetectionSent, setInitialDetectionSent] =
    useState<boolean>(false);
  const { addDetection } = useDetection();

  useEffect(() => {
    const loadModel = async (): Promise<void> => {
      try {
        await tf.setBackend("webgl");
        console.log("Loading coco-ssd model...");
        const loadedModel = await cocossd.load();
        console.log("Model loaded successfully");
        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        console.error("Error loading model:", err);
        setError("Failed to load object detection model");
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    const setupCamera = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            console.log("Video data loaded");
            setIsVideoReady(true);
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError(
          `Camera access error: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    };

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current || !isVideoReady) return;

    const detectObjects = async (): Promise<void> => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      if (video.readyState === 4) {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const predictions = await model.detect(video);

          if (!initialDetectionSent && predictions.length > 0) {
            predictions.forEach((prediction: Detection) => {
              if (
                [
                  "person",
                  "cat",
                  "dog",
                  "bird",
                  "horse",
                  "sheep",
                  "cow",
                  "elephant",
                  "bear",
                  "zebra",
                  "giraffe",
                ].includes(prediction.class)
              ) {
              }
            });
            setInitialDetectionSent(true);
            addDetection({
              class: predictions[0].class,
              score: predictions[0].score * 100,
            });
          }

          predictions.forEach((prediction: Detection) => {
            if (
              [
                "person",
                "cat",
                "dog",
                "bird",
                "horse",
                "sheep",
                "cow",
                "elephant",
                "bear",
                "zebra",
                "giraffe",
              ].includes(prediction.class)
            ) {
              const [x, y, width, height] = prediction.bbox;

              // Draw bounding box
              ctx.strokeStyle = "#00ff00";
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, width, height);

              // Draw label with background
              const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
              ctx.fillStyle = "#00ff00";
              ctx.font = "16px Arial";
              const textWidth = ctx.measureText(label).width;

              // Draw label background
              ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
              ctx.fillRect(x, y - 25, textWidth + 10, 20);

              // Draw label text
              ctx.fillStyle = "#00ff00";
              ctx.fillText(label, x + 5, y - 10);
            }
          });
        } catch (err) {
          console.error("Detection error:", err);
        }
      }

      requestAnimationFrame(detectObjects);
    };

    detectObjects();
  }, [model, isVideoReady, addDetection, initialDetectionSent]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div>Loading model...</div>
        <div className="text-sm text-gray-500">
          This may take a few moments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <div className="mb-2">Error: {error}</div>
        <div className="text-sm">
          Please make sure:
          <ul className="mt-2 inline-block list-disc text-left">
            <li>You have granted camera permissions</li>
            <li>Your device has a working camera</li>
            <li>You are using a modern browser (Chrome recommended)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />
      <canvas ref={canvasRef} className="w-full rounded-lg shadow-lg" />
      {!isVideoReady && (
        <div className="mt-4 text-center">Initializing camera...</div>
      )}
    </div>
  );
};

export default ObjectDetection;
