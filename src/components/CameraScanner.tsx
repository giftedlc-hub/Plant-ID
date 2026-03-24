import React, { useRef, useState } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  onReset: () => void;
  isProcessing: boolean;
}

export default function CameraScanner({ onCapture, onReset, isProcessing }: CameraScannerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
        setPreview(canvasRef.current.toDataURL('image/jpeg'));
        onCapture(base64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setPreview(null);
    onReset();
    stopCamera();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
      <div className="relative aspect-square bg-emerald-50 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!preview && !isCameraActive && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 p-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Camera size={40} />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900">Scan Your Plant</h3>
              <p className="text-emerald-600 text-sm">Take a photo or upload an image to identify or diagnose your plant.</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Camera size={20} /> Use Camera
                </button>
                <label className="px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-full font-medium hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-2">
                  <Upload size={20} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </motion.div>
          )}

          {isCameraActive && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-emerald-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                />
                <button
                  onClick={stopCamera}
                  className="absolute right-6 bottom-6 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img src={preview} alt="Plant Preview" className="w-full h-full object-cover" />
              {isProcessing && (
                <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                  <RefreshCw className="animate-spin mb-4" size={48} />
                  <h3 className="text-xl font-bold">Analyzing...</h3>
                  <p className="opacity-80">Our AI is identifying your plant and its health status.</p>
                </div>
              )}
              {!isProcessing && (
                <button
                  onClick={reset}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
