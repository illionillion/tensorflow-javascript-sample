"use strict";
import "tfjs";
import "coco-ssd";

let imageList = [];
let currentIndex = 0;

const handleFileChange = async (e) => {
  if (e.target.files.length === 0) return;
  const loading = document.getElementById("loading-container");
  const resultPreview = document.getElementById("result-preview");
  loading.classList.remove("none");
  resultPreview.classList.add("none");

  imageList = [];
  currentIndex = 0;

  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i];
    const imageObj = new Image();
    imageObj.src = URL.createObjectURL(file);

    // モデルの読み込み
    const model = await cocoSsd.load();
    // 画像からオブジェクト認識
    const predictions = await model.detect(imageObj);
    console.log(predictions);
    const canvas = document.getElementById("result-canvas");
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;
    const context = canvas.getContext("2d");
    context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);

    // 描画
    for (const p of predictions) {
      if (p.class === "person") {
        context.beginPath();
        context.rect(...p.bbox);
        context.lineWidth = 1;
        context.fillStyle = generateRandomColor();
        context.stroke();
        context.fill();
      }
    }

    const base64 = canvas.toDataURL("image/jpeg");
    imageList.push({
      name: file.name,
      url: base64,
    });
  }

  resultPreview.classList.remove("none");
  updatePreview();
  loading.classList.add("none");
};

const prev = () => {
  if (currentIndex === 0 || !imageList.length) return;
  currentIndex--;
  updatePreview();
};

const next = () => {
  if (currentIndex >= imageList.length - 1 || !imageList.length) return;
  currentIndex++;
  updatePreview();
};

const updatePreview = () => {
  document.getElementById("result-preview-image").src =
    imageList[currentIndex].url;
  document.getElementById("result-preview-download").href =
    imageList[currentIndex].url;
  document.getElementById("result-preview-download").download =
    imageList[currentIndex].name;
};

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  console.log(`rgb(${r},${g},${b})`)
  return `rgb(${r},${g},${b})`;
}

const main = async () => {
  document
    .getElementById("file-input")
    .addEventListener("change", handleFileChange);
  document.getElementById("prev-button").addEventListener("click", prev);
  document.getElementById("next-button").addEventListener("click", next);
};

window.addEventListener("load", main);
