"use strict"
const handleFIleChange = async e => {
    console.log(e.target.files);
    if(e.target.files.length === 0) return
    const loading = document.getElementById("loading-container")
    const resultPreview = document.getElementById("result-preview")
    loading.classList.remove("none")
    resultPreview.classList.add("none")
    const file = e.target.files[0]
    const imageObj = new Image()
    imageObj.src = URL.createObjectURL(file)

    // モデルの読み込み
    const model = await cocoSsd.load()
    // 画像からオブジェクト認識
    const predictions = await model.detect(imageObj)
    console.log(predictions);
    const canvas = document.getElementById("result-canvas")
    canvas.width = imageObj.width
    canvas.height = imageObj.height
    const context = canvas.getContext("2d")
    context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height)
    
    // 描画
    for (const p of predictions) {
        if (p.class === "person") {
            context.beginPath()
            context.rect(...p.bbox)
            context.lineWidth = 1
            context.strokeStyle = "black"
            context.fillStyle = "black"
            context.stroke()
            context.fill()
        }
    }

    const base64 = canvas.toDataURL("image/jpeg");
    resultPreview.classList.remove("none")
    document.getElementById("result-preview-image").src = base64;
    document.getElementById("result-preview-download").href = base64;
    document.getElementById("result-preview-download").download = file.name;
    loading.classList.add("none")
}

const main = async () => {
    document.getElementById("file-input").addEventListener("change", handleFIleChange)
}

window.addEventListener("load", main)