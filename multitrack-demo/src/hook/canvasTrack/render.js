import dot from "@/assets/canvasTrack/dot.svg";
import dotLeftImage from "@/assets/canvasTrack/dot_left.svg";
import dotRightImage from "@/assets/canvasTrack/dot_right.svg";
import { h, render } from "vue";

export default {
  createPoint: (top, left) => {
    return h(
      "div",
      {
        style: {
          position: "absolute",
          top: top + "px",
          left: left + "px",
        },
      },
      [
        h("img", {
          src: dot,
          style: {
            display: "block",
            width: "12px",
            height: "12px",
          },
        }),
      ]
    );
  },
  createLine: (top1, left1, left2) => {
    return h(
      "div",
      {
        style: {
          position: "absolute",
          top: top1 + "px",
          left: left1 + "px",
        },
      },
      [
        h("img", {
          src: dotLeftImage,
          style: {
            display: "block",
            width: "6px",
            height: "12px",
            position: "absolute",
            top: "0",
            left: "0",
          },
        }),
        h("div", {
          style: {
            position: "absolute",
            top: "5px",
            width: left2 - left1 + "px",
            height: "2px",
            background: "#fff",
          },
        }),
        h("img", {
          src: dotRightImage,
          style: {
            display: "block",
            width: "6px",
            height: "12px",
            position: "absolute",
            top: "0",
            left: left2 - left1 - 6 + "px",
          },
        }),
      ]
    );
  },
};
