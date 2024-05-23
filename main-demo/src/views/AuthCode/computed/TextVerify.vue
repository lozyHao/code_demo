<script>
import treeScenery01 from "@/assets/img/tree_scenery01.jpg";
import treeScenery02 from "@/assets/img/tree_scenery02.jpg";
import treeScenery03 from "@/assets/img/tree_scenery03.jpg";
import { useMessage } from "naive-ui";

export default {
  data() {
    return {
      num: 1,
      x: null,
      y: null,
      py: 10, //偏移量
      lastPic: null, //上一个图片下标，防止重复之后导致刷新不重载
      pointArr: [],
      bgPictures: [
        { id: "0", src: treeScenery01 },
        { id: "1", src: treeScenery02 },
        { id: "2", src: treeScenery03 },
      ],
      background: "",
      codeCharacter: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ], //16进制数
      words: new Array(4), //储存四个汉字
      choseOrder: [], //用户选择的顺序
      falseTip: false, //用户验证失败，但是仍有次数，自动刷新时的提示
      isSucceed: false, //用户验证成功
      message: useMessage(),
    };
  },
  watch: {
    choseOrder: {
      deep: true,
      handler(newval) {
        for (var i = 0; i < this.choseOrder.length; i++) {
          var xMinTrue = this.pointArr[i].x - this.py;
          var xMaxTrue = this.pointArr[i].x + 34 + this.py;
          var yMinTrue = this.pointArr[i].y - 40 - this.py;
          var yMaxTrue = this.pointArr[i].y + this.py;
          console.log(xMinTrue, xMaxTrue, yMinTrue, yMaxTrue);
          if (
            this.choseOrder[i].x < xMinTrue ||
            this.choseOrder[i].x > xMaxTrue
          ) {
            this.falseTip = true;
          }
          if (
            this.choseOrder[i].y < yMinTrue ||
            this.choseOrder[i].y > yMaxTrue
          ) {
            this.falseTip = true;
          }
        }
        if (this.falseTip == true) {
          this.message.error("很遗憾，验证失败，请重试哦！");
          setTimeout(() => {
            this.changeAll();
            this.falseTip = false;
            this.clearPoint();
          }, 1000);
        }
        if (!this.falseTip && this.choseOrder.length == 4) {
          this.isSucceed = true;
          this.message.success("恭喜您，验证成功啦！");
          this.changeAll();
        }
      },
    },
  },
  beforeMount() {
    this.chooseFourWords();
  },
  mounted() {
    this.chooseBGP();
  },
  beforeDestroy() {},
  methods: {
    checkPointAtCanvas(event) {
      this.x = event.offsetX + 34;
      this.y = event.offsetY + 12;
      this.createPoint();
      //减去padding偏移量
      this.choseOrder.push({
        x: this.x - 34,
        y: this.y - 12,
      });
    },
    //创建坐标点
    createPoint() {
      document
        .getElementsByClassName("display-area")[0]
        .insertAdjacentHTML(
          "beforeEnd",
          '<div class="point-area" style="background-color:#1abd6c;color:#fff;z-index:9999;width:30px;height:30px;text-align:center;line-height:30px;border-radius: 50%;position:absolute;top:' +
            parseInt(this.y - 10) +
            "px;left:" +
            parseInt(this.x - 10) +
            'px;">' +
            this.num +
            "</div>"
        );
      this.num = this.num + 1;
    },
    //随机选择四个文字，加入到 words 数组
    chooseFourWords() {
      let arr = new Array();
      var indexArr = [];
      var fontStr =
        "天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐吊民伐罪周发殷汤坐朝问道垂拱平章爱育黎首臣伏戎羌遐迩体率宾归王"; //不重复的汉字
      while (indexArr.length < 4) {
        var index = this.rand(0, fontStr.length);
        if (
          indexArr.indexOf(index) == -1 &&
          fontStr.substring(index, index + 1) != ""
        ) {
          indexArr.push(index);
          arr.push(fontStr.substring(index, index + 1));
        }
      }
      console.log(indexArr, arr);
      this.words = arr;
    },
    rand(m, n) {
      return Math.ceil(Math.random() * (n - m + 1) + m - 1);
    },
    //随机获取四个坐标点
    getFourPoint() {
      var arr = [];
      var x1 = this.rand(30, 80);
      var x2 = this.rand(130, 180);
      var x3 = this.rand(230, 280);
      var x4 = this.rand(314, 350);
      var y1 = this.rand(105, 176);
      var y2 = this.rand(105, 176);
      var y3 = this.rand(105, 176);
      var y4 = this.rand(105, 176);
      arr.push({ x: x1, y: y1 });
      arr.push({ x: x2, y: y2 });
      arr.push({ x: x3, y: y3 });
      arr.push({ x: x4, y: y4 });
      this.pointArr = this.shuffleArray(arr);
    },
    //  乱序处理
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    //更换背景图片
    chooseBGP() {
      var index = Math.round(Math.random() * (this.bgPictures.length - 1));

      while (this.lastPic == index) {
        index = Math.round(Math.random() * (this.bgPictures.length - 1));
      }
      this.lastPic = index;
      this.background = this.bgPictures[index].src;
      this.getFourPoint();
      var _this = this;

      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      var img = document.getElementById("tulip");

      var size = 400;
      canvas.style.width = size + "px";
      canvas.style.height = 260 + "px";

      var scale = 1;
      canvas.width = Math.floor(size * scale);
      canvas.height = Math.floor(260 * scale);
      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, size, 260);
      img.onload = function () {
        ctx.drawImage(this, 0, 0, size, 260);
        for (var i = 0; i < _this.pointArr.length; i++) {
          ctx.font = "34px STXingkai";
          ctx.fillStyle =
            "#" +
            ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(
              -6
            );
          ctx.fillText(
            _this.words[i],
            _this.pointArr[i].x,
            _this.pointArr[i].y
          );
        }
      };
    },
    //换一张,重新部署
    changeAll() {
      this.chooseFourWords();
      this.chooseBGP();
      this.numtip = [];
      this.choseOrder = [];
      this.clearPoint();
    },
    clearPoint() {
      document.querySelectorAll(".point-area").forEach((x) => {
        document.querySelector(".display-area").removeChild(x);
      });
      this.choseOrder = [];
      this.num = 1;
    },
    closeVerify() {
      this.$emit("closeVerify");
    },
  },
};
</script>

<template>
  <div class="outside" ref="outside">
    <div class="action-tip">
      请依次点
      <p class="action-target">
        "{{ words[0] }}""{{ words[1] }}""{{ words[2] }}""{{ words[3] }}"
      </p>
      <span id="closeIcon" @click="closeVerify">
        <el-icon><Close /></el-icon>
      </span>
    </div>
    <div class="display-area" ref="content">
      <!-- 风景背景图 -->
      <!-- style="display: none;" -->
      <img
        id="tulip"
        class="bg-picture"
        :src="background"
        style="display: none"
        alt="背景图片"
      />
      <canvas
        class="bg-picture"
        @click="checkPointAtCanvas"
        id="myCanvas"
      ></canvas>
    </div>

    <div class="flex justify-center">
      <span class="cursor-pointer hover:text-red" @click="changeAll">
        看不清，换一张
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 最外侧轮廓 */
.outside {
  width: 468px;
  height: 360px;
  border-radius: 6px;
  background-color: #ffffff;
}

/**上方图片展示区域 */
.display-area {
  /* width: 100%; */
  /* height: 75%; */
  position: relative;
  overflow: hidden;
  padding: 34px;
  padding-top: 12px;
  padding-bottom: 18px;
}

.bg-picture {
  width: 100%;
  height: 260px;
  z-index: 2;
  border-radius: 10px;
}

/**汉字span */
.word-img {
  display: inline-block;
  box-sizing: border-box;
  padding: 0.1em;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 0.3em;
  /* background: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(241, 210, 240, 0.644)), to(rgba(0, 0, 255, 0))); */
  position: absolute;
  z-index: 4;
}

p {
  margin-top: 0px;
  margin-bottom: 0px;
}

.action-target {
  /* line-height: 1.6; */
  font-size: 20px;
}

/**数字顺序提示 */
.number-tip {
  width: 1.3rem;
  height: 1.3rem;
  background-color: #fff;
  border-radius: 90px;
  opacity: 0.9;
  z-index: 8;
  position: fixed;
}

.word-img,
button,
.number-tip:hover {
  cursor: pointer;
}

.tip-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bolder;
  z-index: 15;
}

.font {
  font: 34px STXingkai;
}

.action-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  padding-bottom: 0px;
  font-size: 18px;
}
:deep .el-button.is-link {
  font-size: 16px;
}
#closeIcon {
  position: absolute;
  right: 10px;
  font-size: 24px;
  top: 5px;
  cursor: pointer;
}
#closeIcon:hover {
  color: #3465fa;
}
</style>
