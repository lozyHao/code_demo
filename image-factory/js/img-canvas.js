function drawImageAndText() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = "your-image-url.jpg";
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let brightness = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      brightness += (r + g + b) / 3;
    }
    const averageBrightness = brightness / (imageData.data.length / 4);
    const textColor = averageBrightness > 128 ? "black" : "white";

    ctx.font = "20px Arial";
    ctx.fillStyle = textColor;
    ctx.fillText("Your custom text", 10, canvas.height - 10);

    const link = document.createElement("a");
    link.download = "image-with-text.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}

drawImageAndText();
