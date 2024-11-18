import { useEffect } from 'react';

import * as faceApi from 'face-api.js';
import { useLocalStorage } from 'usehooks-ts';
import { create } from 'zustand';

interface BiometricAuthStore {
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

const useBiometricStore = create<BiometricAuthStore>((set) => ({
  loaded: false,
  setLoaded: (loaded: boolean) => set({ loaded }),
}));

export const useBiometric = () => {
  const { loaded, setLoaded } = useBiometricStore();

  const [storeID, setStoreID] = useLocalStorage<string | null>('storeID', null);

  useEffect(() => {
    const loadModels = async () => {
      if (loaded) return;
      try {
        console.log('Loading models...');
        await faceApi.nets.ssdMobilenetv1.loadFromUri(
          '/models/ssd_mobilenetv1'
        );
        await faceApi.nets.tinyFaceDetector.loadFromUri(
          '/models/tiny_face_detector'
        );
        await faceApi.nets.faceLandmark68Net.loadFromUri(
          '/models/face_landmark_68'
        );
        await faceApi.nets.faceRecognitionNet.loadFromUri(
          '/models/face_recognition'
        );
        await faceApi.nets.faceExpressionNet.loadFromUri(
          '/models/face_expression'
        );

        setLoaded(true);
        console.log('Models loaded');
      } catch (error) {
        console.error('Failed to load models', error);
      }
    };

    void loadModels();
  }, [loaded, setLoaded]);

  const getDescriptors = async (image: string) => {
    const imageElement = document.createElement('img');
    imageElement.src = image;
    await imageElement.decode();
    const res = await faceApi
      .detectSingleFace(imageElement, new faceApi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!res) {
      throw new Error('No face detected');
    }

    const { descriptor } = res;
    return Array.from(descriptor).map((e) => Math.round(e * 1000) + 512);
  };

  return {
    modelsLoaded: loaded,
    getDescriptors,
    storeID,
    setStoreID,
  };
};
