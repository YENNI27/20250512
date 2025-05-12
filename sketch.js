let facemesh;
let video;
let predictions = [];
const points = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291
,76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];
// 右眼的點
const rightEyePoints = [
  359,467,260,259,257,258,286,414,463,341,256,252,253,254,339,255,
  263,466,388,387,386,385,384,398,362,382,381,380,374,373,390,249
];

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

    // --- 嘴巴圖形 ---
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
    const offsetY = mouthY - centerY;

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

    // --- 綠色右眼圖形 ---
    // 以右眼中心362號點為基準
    const [eyeX, eyeY] = keypoints[362];
    let eyeSumX = 0, eyeSumY = 0;
    for (let i = 0; i < rightEyePoints.length; i++) {
      const idx = rightEyePoints[i];
      if (!keypoints[idx]) continue;
      eyeSumX += keypoints[idx][0];
      eyeSumY += keypoints[idx][1];
    }
    const eyeCenterX = eyeSumX / rightEyePoints.length;
    const eyeCenterY = eyeSumY / rightEyePoints.length;
    const eyeOffsetX = eyeX - eyeCenterX;
    const eyeOffsetY = eyeY - eyeCenterY;

    stroke(0, 255, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < rightEyePoints.length; i++) {
      const idx = rightEyePoints[i];
      if (!keypoints[idx]) continue;
      const [x, y] = keypoints[idx];
      vertex(x + eyeOffsetX, y + eyeOffsetY);
    }
    endShape();
  }
}
