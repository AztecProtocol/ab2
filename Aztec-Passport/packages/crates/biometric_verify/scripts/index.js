import faceapi from 'face-api.js';

const rootPath = './data';

// Images to Compare
const IMAGE_1_PATH = './data/n2.jpeg';
const IMAGE_2_PATH = './data/n1.jpeg';

import { Canvas, Image, ImageData } from 'canvas';
// @ts-expect-error err
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

await faceapi.nets.ssdMobilenetv1.loadFromDisk(
  `${rootPath}/models/ssd_mobilenetv1`
);
await faceapi.nets.tinyFaceDetector.loadFromDisk(
  `${rootPath}/models/tiny_face_detector`
);
await faceapi.nets.faceLandmark68Net.loadFromDisk(
  `${rootPath}/models/face_landmark_68`
);
await faceapi.nets.faceRecognitionNet.loadFromDisk(
  `${rootPath}/models/face_recognition`
);
await faceapi.nets.faceExpressionNet.loadFromDisk(
  `${rootPath}/models/face_expression`
);

const canvas1 = new Canvas(1000, 1000, 'image');
const ctx1 = canvas1.getContext('2d');
const img1 = new Image();
img1.onload = () => {
  ctx1.drawImage(img1, 0, 0);
};
img1.src = IMAGE_1_PATH;

const canvas2 = new Canvas(1000, 1000, 'image');
const ctx2 = canvas2.getContext('2d');
const img2 = new Image();
img2.onload = () => {
  ctx2.drawImage(img2, 0, 0);
};
img2.src = IMAGE_2_PATH;

const face1 = await faceapi
  .detectSingleFace(canvas1, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptor();

const face2 = await faceapi
  .detectSingleFace(canvas2, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptor();

const privateSecrets = {};

const descriptor1 = Array.from(face1.descriptor).map((v, i) => {
  privateSecrets[`actual-${i}`] = {
    SecretInteger: String(Math.round(v * 1000)),
  };
  return Math.round(v * 1000);
});

const descriptor2 = Array.from(face2.descriptor).map((v, i) => {
  privateSecrets[`given-${i}`] = {
    SecretInteger: String(Math.round(v * 1000)),
  };
  return Math.round(v * 1000);
});

const sqrt = (num) => {
  let guess = num;
  for (let i = 0; i < 12; i++) {
    guess = (guess + num / guess) / 2;
  }
  return guess;
};

const get_euclidean_distance = (actual, given) => {
  const distances = [];
  for (const encoding of actual) {
    let distance = 0;
    for (let i = 0; i < 128; i++) {
      const diff = encoding[i] - given[i];
      const squared_diff = diff * diff;
      distance += squared_diff;
    }
    distances.push(sqrt(distance));
  }
  return distances[0];
};

const distance = get_euclidean_distance([descriptor1], descriptor2);
const euclidean_distance = String(Math.floor(distance));
const match = parseInt(euclidean_distance) > 550 ? '0' : '1';

console.log(JSON.stringify(descriptor1, null, 2));
console.log(JSON.stringify(descriptor2, null, 2));

console.log('euclidean_distance', euclidean_distance);
console.log('match', match === '1');
