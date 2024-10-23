const ffmpeg = require("@ffmpeg/ffmpeg");

const videoUrl = "../assets/videos/test.mp4";

// 生成帧图片
const generateFrames = (videoUrl) => {
  try {
    var process = new ffmpeg(videoUrl);
    process.then(
      function (video) {
        // console.log(video);
        // Callback mode
        video.fnExtractFrameToJPG(
          "../dist/save_your_frames",
          {
            frame_rate: 30,
            file_name: "%t_%s",
          },
          function (error, files) {
            if (!error) {
              console.log("Frames: " + files);
            } else {
              console.log(error);
            }
          }
        );
      },
      function (err) {
        console.log("Error: " + err);
      }
    );
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
};

generateFrames(videoUrl);
