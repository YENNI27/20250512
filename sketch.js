function draw() {
  background(220);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 嘴巴中心
    const [mouthX, mouthY] = keypoints[13];

    // 嘴巴左右端點
    const [leftX, leftY] = keypoints[61];
    const [rightX, rightY] = keypoints[291];
    const mouthWidth = dist(leftX, leftY, rightX, rightY);

    // 計算圖形原本的中心與寬度
    let sumX = 0, sumY = 0;
    let minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < points.length; i++) {
      const idx = points[i];
      const [x, y] = keypoints[idx];
      sumX += x;
      sumY += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    const centerX = sumX / points.length;
    const centerY = sumY / points.length;
    const shapeWidth = maxX - minX;

    // 計算縮放比例
    const scaleRatio = mouthWidth / shapeWidth;

    // 畫圖形（平移到嘴巴中心並縮放）
    push();
    translate(mouthX, mouthY);
    scale(scaleRatio);
    translate(-centerX, -centerY);

    stroke(255, 0, 0);
    strokeWeight(5 / scaleRatio); // 線條粗細也要縮放
    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      const idx = points[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape();
    pop();
  }
}
