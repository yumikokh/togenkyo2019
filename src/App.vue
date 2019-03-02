<template lang="pug">
  #app
    video.video(src="/movie/00_BGM.mp4" type="video/mp4" loop playsinline ref="video" muted)
</template>

<script>
import _ from "lodash";
import audioList from "./audioList";
import pianoList from "./const/pianoList";

export default {
  name: "app",
  data: () => ({
    temp: [],
    audios: {},
    nowPlaying: false,
    hasSetup: false
  }),
  methods: {
    startAudio(id = 1) {
      console.log("start audio", id);
      if (id !== "bgm") this.nowPlaying = true;
      const audio = this.audios[id];
      console.log(audio, "audio");
      audio.currentTime = 0;
      audio.play().catch(er => {
        console.log(er, "error");
      });
      audio.addEventListener("ended", () => {
        console.log("ended");
        if (id === "bgm") {
          audio.currentTime = 0;
          audio.play();
        } else {
          this.nowPlaying = false;
        }
      });
    }
  },
  mounted() {
    // ユーザーアクション対策：初回すべての音をだしておく
    window.addEventListener("click", () => {
      if (this.hasSetup) return;
      this.hasSetup = true;
      this.$refs.video.play();
      _.each(audioList, audio => {
        this.audios[audio.id] = new Audio();
        this.audios[audio.id].src = `/audio/${audio.filename}.wav`;
        this.audios[audio.id].play();
        setTimeout(() => {
          this.audios[audio.id].pause();
          this.startAudio("bgm");
        }, 500);
      });
    });

    // MIDI
    const device = {};
    const vue = this;
    function requestSuccess(data) {
      console.log("success!!!", data);

      const inputIt = data.inputs.values();
      for (let input = inputIt.next(); !input.done; input = inputIt.next()) {
        const value = input.value;
        device.input = value;
        value.addEventListener("midimessage", inputEvent, false);
      }

      const outputIt = data.outputs.values();
      for (
        let output = outputIt.next();
        !output.done;
        output = outputIt.next()
      ) {
        const value = output.value;
        device.outputs = value;
      }
    }

    // 失敗したときの処理
    function requestError(error) {
      console.error("error!!!", error);
    }

    // midi入力時
    let timer;
    const RESET_LIFE = 2000;
    function inputEvent(e) {
      if (vue.nowPlaying) return;
      const d = device.outputs;
      const numArray = [];
      // 2桁の16進数にして表示する
      event.data.forEach(function(val) {
        numArray.push(("00" + val.toString(16)).substr(-2));
      });
      const message = numArray;
      // InputしたDeviceに結果を送信する
      d.send(e.data);
      // 離すときはカウントしない
      if (message[0] === "80") return;
      const soundName = _.findKey(
        pianoList,
        piano => String(piano) === message[1]
      );
      vue.temp.push(soundName);
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        vue.temp = []; // reset
      }, RESET_LIFE);
    } // MIDI初期化
    navigator.requestMIDIAccess().then(requestSuccess, requestError);
  },
  watch: {
    temp: function(temp) {
      const tempAry = [...temp];
      if (tempAry.length > 4) {
        const id = _.random(1, 10, false);
        console.log(id, "id");
        this.startAudio(id);
      }
      // _.each(audioList, audio => {
      //   if (_.includes(tempAry.join(""), audio.commands.join(""))) {
      //     this.startAudio(audio.id);
      //     return;
      //   }
      // });
    },
    nowPlaying: function(nowPlaying) {
      if (nowPlaying) {
        this.audios.bgm.pause();
      } else {
        this.startAudio("bgm");
      }
    }
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  @include base-font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.video {
  width: 942px;
}
</style>
