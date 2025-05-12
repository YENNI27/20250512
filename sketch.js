let facemesh;
let video;
let predictions = [];
// 原本的 points
const points = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291
,76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];
// 眼睛的點
const eyePoints = [243,190,56,28,27,29,30,247,130,25,110,24,23,22,26,112,
133,173,157,158,159,160,161,246,33,7,163,144,145,153,154,155];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', gotResults);
}

function modelReady() {
  // 模型載入完成
}

function gotResults(results) {
  predictions = results;
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // --- 原本嘴巴圖形 ---
    const [mouthX, mouthY] = keypoints[13];
    let sumX = 0, sumY = 0;
    for (let i = 0; i < points.length; i++) {
      const idx = points[i];
      if (!keypoints[idx]) continue;
      sumX += keypoints[idx][0];
      sumY += keypoints[idx][1];
    }
    const centerX = sumX / points.length;
    const centerY = sumY / points.length;
    const offsetX = mouthX - centerX;
    const offsetY = mouthY - centerY - 20; // 再往上移一點

    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      const idx = points[i];
      if (!keypoints[idx]) continue;
      const [x, y] = keypoints[idx];
      vertex(x + offsetX, y + offsetY);
    }
    endShape();

    // --- 綠色眼睛圖形 ---
    // 以468號點（左眼中心）為基準，或你可選用133、362等眼睛中心點
    const [eyeCenterX, eyeCenterY] = keypoints[468] || keypoints[133]; // 防呆
    // 計算圖形中心
    let eyeSumX = 0, eyeSumY = 0;
    for (let i = 0; i < eyePoints.length; i++) {
      const idx = eyePoints[i];
      if (!keypoints[idx]) continue;
      eyeSumX += keypoints[idx][0];
      eyeSumY += keypoints[idx][1];
    }
    const eyeShapeCenterX = eyeSumX / eyePoints.length;
    const eyeShapeCenterY = eyeSumY / eyePoints.length;
    // 平移量
    const eyeOffsetX = eyeCenterX - eyeShapeCenterX;
    const eyeOffsetY = eyeCenterY - eyeShapeCenterY;

    stroke(0, 255, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < eyePoints.length; i++) {
      const idx = eyePoints[i];
      if (!keypoints[idx]) continue;
      const [x, y] = keypoints[idx];
      vertex(x + eyeOffsetX, y + eyeOffsetY);
    }
    endShape();
  }
}
