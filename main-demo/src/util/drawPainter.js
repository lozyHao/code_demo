import { ref } from "vue";
export function usePainter({
  canvasRef,
  isLandscape,
  options,
  isTrace = false,
}) {
  const canvas = canvasRef.value;
  const canvasClientWidth = canvas.clientWidth;
  const canvasClientHeight = canvas.clientHeight;
  let {
    lineWidth = 8,
    lineColor = "#05CCB4",
    clearLastLine = false,
    type = "pen",
  } = options || {};

  const history = ref([canvas.toDataURL()]);
  let currentHistoryIndex = 0;
  // 点集合
  let uniPoints = [];
  const recordHistory = () => {
    const image = canvas.toDataURL();
    const trimmedHistory = history.value.slice(0, currentHistoryIndex + 1);
    history.value = [...trimmedHistory, image];
    currentHistoryIndex++;
  };

  // 撤回
  const revocation = () => {
    if (currentHistoryIndex > 0) {
      currentHistoryIndex--;
      drawFromHistory();
    }
  };

  // 重做
  const renewal = () => {
    if (currentHistoryIndex < history.value.length - 1) {
      currentHistoryIndex++;
      drawFromHistory();
    }
  };

  // 清空
  const clear = () => {
    currentHistoryIndex = 0;
    drawFromHistory();
  };
  // 恢复全部
  const renewalAll = () => {
    currentHistoryIndex = history.value.length - 1;
    drawFromHistory();
  };

  // 文字
  const startWrite = (event) => {};

  // 修改配置项
  const updateOption = (option) => {
    lineWidth = option.lineWidth;
    lineColor = option.lineColor;
  };

  const paint = (pre, cur) => {
    let layout = canvas.getContext("2d");
    layout.beginPath();
    layout.strokeStyle = lineColor;
    layout.lineWidth = lineWidth;
    layout.moveTo(pre.x, pre.y);
    layout.lineTo(cur.x, cur.y);
    layout.stroke();
  };

  const canvasMouseHandler = (canvas) => {
    let isTouch = document.body.ontouchstart !== undefined;
    if (isTouch) {
      // 移动端绘制
      canvas.ontouchstart = (e) => {
        if (isTrace) {
          clear();
          uniPoints = [];
        }
        const { left, top, right, width } = canvas.getBoundingClientRect();
        if (clearLastLine) {
          const layout = canvas.getContext("2d");
          layout.clearRect(0, 0, canvas.width, canvas.height);
        }
        let pre = {};
        if (isLandscape) {
          pre = {
            // 屏幕宽度减去鼠标的X位置，减去右边的距离，右边的距离等于right（屏幕左边到右边的距离） - canvas的宽度
            y: parseInt(
              document.documentElement.offsetWidth -
                e.touches[0].clientX -
                (right - width)
            ),
            x: parseInt(e.touches[0].clientY - top),
          };
        } else {
          pre = {
            x: parseInt(e.touches[0].clientX - left),
            y: parseInt(e.touches[0].clientY - top),
          };
        }
        canvas.ontouchmove = (e) => {
          let cur = {};
          if (isLandscape) {
            cur = {
              y: parseInt(
                document.documentElement.offsetWidth -
                  e.touches[0].clientX -
                  (right - width)
              ),
              x: parseInt(e.touches[0].clientY - top),
            };
          } else {
            cur = {
              x: parseInt(e.touches[0].clientX - left),
              y: parseInt(e.touches[0].clientY - top),
            };
          }
          paint(pre, cur);
          pre = {
            ...cur,
          };
          if (isTrace) {
            if (
              cur.x >= 0 &&
              cur.y >= 0 &&
              cur.x <= canvasClientWidth &&
              cur.y <= canvasClientHeight
            ) {
              const uniX = (cur.x / canvasClientWidth).toFixed(4);
              const uniY = (cur.y / canvasClientHeight).toFixed(4);
              uniPoints.push([Number(uniX), Number(uniY)]);
            }
          }
        };
        canvas.ontouchend = () => {
          canvas.ontouchmove = null;
          canvas.ontouchend = null;
          recordHistory();
        };
      };
    } else {
      // pc 端绘制
      canvas.onmousedown = (e) => {
        if (isTrace) {
          clear();
          uniPoints = [];
        }
        const { left, top, right, width } = canvas.getBoundingClientRect();
        if (clearLastLine) {
          const layout = canvas.getContext("2d");
          layout.clearRect(0, 0, canvas.width, canvas.height);
        }

        let pre = {};
        if (isLandscape) {
          pre = {
            // 屏幕宽度减去鼠标的X位置，减去右边的距离，右边的距离等于right（屏幕左边到右边的距离） - canvas的宽度
            y: parseInt(
              document.documentElement.offsetWidth - e.clientX - (right - width)
            ),
            x: parseInt(e.clientY - top),
          };
        } else {
          pre = {
            x: parseInt(e.clientX - left),
            y: parseInt(e.clientY - top),
          };
        }
        canvas.onmousemove = (e) => {
          let cur = {};
          if (isLandscape) {
            cur = {
              y: parseInt(
                document.documentElement.offsetWidth -
                  e.clientX -
                  (right - width)
              ),
              x: parseInt(e.clientY - top),
            };
          } else {
            cur = {
              x: parseInt(e.clientX - left),
              y: parseInt(e.clientY - top),
            };
          }
          paint(pre, cur);
          pre = {
            ...cur,
          };
          if (isTrace) {
            if (
              cur.x >= 0 &&
              cur.y >= 0 &&
              cur.x <= canvasClientWidth &&
              cur.y <= canvasClientHeight
            ) {
              const uniX = (cur.x / canvasClientWidth).toFixed(4);
              const uniY = (cur.y / canvasClientHeight).toFixed(4);
              uniPoints.push([Number(uniX), Number(uniY)]);
            }
          }
        };
        canvas.onmouseup = () => {
          canvas.onmousemove = null;
          canvas.onmouseup = null;
          recordHistory();
        };
      };
    }
  };
  const drawFromHistory = () => {
    const layout = canvas.getContext("2d");
    const image = new Image();
    image.src = history.value[currentHistoryIndex];
    image.onload = () => {
      layout.clearRect(0, 0, canvas.width, canvas.height);
      layout.drawImage(image, 0, 0);
    };
  };

  canvasMouseHandler(canvas);

  return {
    revocation,
    renewal,
    clear,
    renewalAll,
    updateOption,
    startWrite,
  };
}
