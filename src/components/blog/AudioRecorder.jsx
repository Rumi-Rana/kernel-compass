'use client';
import { useState, useRef } from 'react';
import { HiMicrophone, HiStop } from 'react-icons/hi';

export default function AudioRecorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = e => chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const { url } = await res.json();
      onRecordingComplete(url);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <button type="button" onClick={recording ? stopRecording : startRecording} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
      {recording ? <HiStop className="text-red-500" /> : <HiMicrophone />}
    </button>
  );
}