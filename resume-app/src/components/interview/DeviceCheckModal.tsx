"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Video, Mic, ShieldCheck, Camera, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";

export interface DeviceCheckModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onProceed: (hasWebcam: boolean, hasMic: boolean) => void;
}

export const DeviceCheckModal: React.FC<DeviceCheckModalProps> = ({
  isOpen,
  onCancel,
  onProceed,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [signalDetected, setSignalDetected] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanupAudioAnalyser = async () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {}
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {}
      analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        await audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  const stopMediaTracks = async () => {
    await cleanupAudioAnalyser();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startDeviceCheck = async () => {
    setIsChecking(true);
    setErrorMsg(null);
    setMicVolume(0);
    setSignalDetected(false);
    await stopMediaTracks();

    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("MediaDevices API is not supported in this browser.");
      }

      console.log("[Mic] Permission check starting");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("[Mic] Stream obtained");
      streamRef.current = stream;

      // Check camera tracks
      const videoTracks = stream.getVideoTracks();
      const cameraWorking = videoTracks.length > 0 && videoTracks[0].readyState === "live";
      setHasCamera(cameraWorking);

      if (videoRef.current && cameraWorking) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }

      // Check microphone tracks
      const audioTracks = stream.getAudioTracks();
      console.log("[Mic] Audio tracks:", audioTracks);

      const audioTrack = audioTracks[0];
      if (audioTrack) {
        console.log("[Mic] Audio track:", {
          enabled: audioTrack.enabled,
          muted: audioTrack.muted,
          readyState: audioTrack.readyState,
          label: audioTrack.label,
        });
      }

      const micWorking = audioTracks.length > 0 && audioTrack?.readyState === "live" && audioTrack?.enabled;
      setHasMic(micWorking);

      if (micWorking) {
        console.log("[Mic] Permission granted");
        await setupAudioAnalyzer(stream);
      }

      setIsChecking(false);
    } catch (err: any) {
      console.warn("Device check error:", err.message);
      setHasCamera(false);
      setHasMic(false);
      setErrorMsg(
        err.name === "NotAllowedError"
          ? "Camera/Microphone permissions were denied. You can still continue in text practice mode."
          : "Webcam or microphone unavailable. Practice will continue with text-based interaction."
      );
      setIsChecking(false);
    }
  };

  const setupAudioAnalyzer = async (stream: MediaStream) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const audioContext = new AudioCtxClass();
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      console.log("[Mic] AudioContext state:", audioContext.state);

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect source to analyser only (NOT to audioContext.destination to avoid acoustic feedback loop)
      source.connect(analyser);
      console.log("[Mic] Analyser created");

      const dataArray = new Uint8Array(analyser.fftSize);

      let logCounter = 0;

      const updateVolume = () => {
        if (!analyserRef.current || !streamRef.current || !isMountedRef.current) return;

        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sum += normalized * normalized;
        }

        const rms = Math.sqrt(sum / dataArray.length);
        const volume = Math.min(100, Math.round(rms * 500));

        if (logCounter % 60 === 0) {
          console.log("[Mic] RMS:", rms.toFixed(4), "| Volume:", volume, "%");
        }
        logCounter++;

        setMicVolume(volume);
        setSignalDetected(rms > 0.015);

        if (streamRef.current.active) {
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };

      updateVolume();
    } catch (err: any) {
      console.warn("[Mic] Audio analyzer error:", err.message);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isOpen) {
      startDeviceCheck();
    } else {
      stopMediaTracks();
    }
    return () => {
      isMountedRef.current = false;
      stopMediaTracks();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#09090B]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="border-[#E4E4E7] bg-white w-full max-w-xl shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-[#F4F4F5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Camera & Microphone Check</CardTitle>
                <p className="text-xs text-[#71717A]">Verify your devices before entering the interview room</p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3 h-3 mr-1" /> Privacy Protected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Live Video Preview Box */}
          <div className="relative aspect-video rounded-xl bg-[#09090B] border border-[#E4E4E7] overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                hasCamera ? "block" : "hidden"
              }`}
            />

            {!hasCamera && (
              <div className="text-center p-6 space-y-2 text-[#A1A1AA]">
                <Video className="w-10 h-10 mx-auto text-[#71717A]" />
                <p className="text-sm font-semibold text-white">Camera Preview Unavailable</p>
                <p className="text-xs text-[#A1A1AA]">You can proceed with text & audio simulation.</p>
              </div>
            )}

            {/* Status indicators over video */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2.5 py-1 rounded-full text-2xs font-bold flex items-center gap-1.5 backdrop-blur-xs ${
                hasCamera ? "bg-[#10B981]/90 text-white" : "bg-[#EF4444]/90 text-white"
              }`}>
                <Video className="w-3 h-3" /> {hasCamera ? "Camera Ready ✓" : "No Video"}
              </span>

              <span className={`px-2.5 py-1 rounded-full text-2xs font-bold flex items-center gap-1.5 backdrop-blur-xs ${
                hasMic ? "bg-[#10B981]/90 text-white" : "bg-[#F59E0B]/90 text-white"
              }`}>
                <Mic className="w-3 h-3" /> {hasMic ? "Mic Active ✓" : "No Audio"}
              </span>
            </div>
          </div>

          {/* Microphone Volume Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#52525B]">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#4F46E5]" /> Microphone Volume Test
              </span>
              <span className={signalDetected ? "text-[#10B981] font-bold" : "text-[#71717A]"}>
                {hasMic
                  ? `${micVolume}% • ${signalDetected ? "Microphone signal detected" : "Speak to test your microphone"}`
                  : "Mic Not Connected"}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F4F4F5] overflow-hidden border border-[#E4E4E7]">
              <div
                className={`h-full transition-all duration-75 ${
                  signalDetected ? "bg-gradient-to-r from-[#10B981] to-[#4F46E5]" : "bg-[#A1A1AA]"
                }`}
                style={{ width: `${hasMic ? Math.max(0, micVolume) : 0}%` }}
              />
            </div>
          </div>

          {/* Error Banner if permissions denied */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B]">
              <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Privacy Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E4E4E7] text-xs text-[#52525B] leading-relaxed">
            <span className="font-bold text-[#09090B]">Privacy Notice:</span> Camera and microphone data are analyzed locally in your browser for posture and positioning coaching. Audio/video is never stored or transmitted to external servers.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={startDeviceCheck}
              disabled={isChecking}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />}
            >
              Re-test Devices
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" size="md" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  stopMediaTracks();
                  onProceed(!!hasCamera, !!hasMic);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold px-6"
              >
                Begin Interview (30 Questions)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
