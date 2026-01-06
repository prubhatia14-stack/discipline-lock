import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Video, Mic } from "lucide-react";

interface AuditFlowProps {
  auditCode: number;
  onComplete: (passed: boolean) => void;
  onCancel: () => void;
}

type AuditStep = "intro" | "prompt" | "recording" | "processing" | "result";

export function AuditFlow({ auditCode, onComplete, onCancel }: AuditFlowProps) {
  const [step, setStep] = useState<AuditStep>("intro");
  const [countdown, setCountdown] = useState(10);
  const [recordingTime, setRecordingTime] = useState(0);
  const [result, setResult] = useState<"passed" | "failed" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (step === "recording" && recordingTime > 0) {
      const timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRecordingComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, recordingTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep("recording");
      setRecordingTime(10);
    } catch (error) {
      console.error("Camera access denied");
      setResult("failed");
      setStep("result");
    }
  };

  const handleRecordingComplete = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setStep("processing");
    
    // Simulate processing
    setTimeout(() => {
      const passed = Math.random() > 0.1; // 90% pass rate for demo
      setResult(passed ? "passed" : "failed");
      setStep("result");
    }, 2000);
  };

  const handleResultContinue = () => {
    onComplete(result === "passed");
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {step === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-8">
            <div className="w-20 h-20 border-2 mx-auto flex items-center justify-center">
              <Video className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold uppercase">Audit Required</h2>
            <p className="text-muted-foreground">This will take 10 seconds</p>
            <div className="space-y-4 pt-4">
              <Button 
                onClick={() => setStep("prompt")}
                className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                Continue
              </Button>
              <button 
                onClick={onCancel}
                className="text-muted-foreground text-sm uppercase hover:text-foreground"
              >
                Skip (counts as failure)
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "prompt" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-8">
            <div className="w-20 h-20 border-2 mx-auto flex items-center justify-center">
              <Mic className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground uppercase text-sm">Say clearly:</p>
              <p className="text-2xl font-bold">
                "Audit {auditCode}, workout completed."
              </p>
              <p className="text-muted-foreground text-sm">Then record a short video.</p>
            </div>
            <Button 
              onClick={startRecording}
              className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Start Recording
            </Button>
          </div>
        </div>
      )}

      {step === "recording" && (
        <div className="flex-1 flex flex-col">
          <div className="relative flex-1 bg-secondary">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pointer-events-none">
              <div className="w-full flex justify-between items-start">
                <div className="bg-background px-4 py-2 border-2">
                  <span className="font-mono font-bold text-xl">{auditCode}</span>
                </div>
                <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-current rounded-full animate-pulse" />
                  <span className="font-mono font-bold">{recordingTime}s</span>
                </div>
              </div>
              <div className="bg-background/90 px-6 py-3 border-2">
                <p className="text-sm font-medium">Keep face visible • Slight head movement</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="space-y-8">
            <div className="w-20 h-20 border-2 mx-auto flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xl font-bold uppercase">Verifying...</p>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-8">
            <div className={`w-24 h-24 border-4 mx-auto flex items-center justify-center ${
              result === "passed" ? "border-foreground" : "border-destructive"
            }`}>
              <span className="text-4xl font-bold">
                {result === "passed" ? "✓" : "✗"}
              </span>
            </div>
            <h2 className="text-3xl font-bold uppercase">
              Audit {result === "passed" ? "Passed" : "Failed"}
            </h2>
            <p className="text-muted-foreground">
              {result === "passed" 
                ? "Workout logged successfully." 
                : "Verification failed. Penalty applied."}
            </p>
            <Button 
              onClick={handleResultContinue}
              className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
