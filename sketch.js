let facemesh;
let video;
let predictions = [];
const points = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291
,76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.faceMesh(video, modelReady); // 注意這裡是 faceMesh
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

    // 以13號點為嘴巴中心
    const [mouthX, mouthY] = keypoints[13];

    // 計算圖形中心
    let sumX = 0, sumY = 0;
    for (let i = 0; i < points.length; i++) {
      const idx = points[i];
      sumX += keypoints[idx][0];
      sumY += keypoints[idx][1];
    }
    const centerX = sumX / points.length;
    const centerY = sumY / points.length;

    // 計算平移量
    const offsetX = mouthX - centerX;
    const offsetY = mouthY - centerY;

    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      const idx = points[i];
      const [x, y] = keypoints[idx];
      vertex(x + offsetX, y + offsetY);
    }
    endShape();
  }
}
