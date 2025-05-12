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
