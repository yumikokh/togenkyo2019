<template lang="pug">
  #app
    .list {{ temp }}
</template>

<script>
import _ from "lodash";
import audioList from "./audioList";
// import pianoList from "./const/pianoList";

export default {
  name: "app",
  data: () => ({
    temp: [],
    audios: {},
    nowPlaying: false
  }),
  methods: {
    startAudio(id = 1) {
      if (id !== "bgm") this.nowPlaying = true;
      const audio = this.audios[id];
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
    window.addEventListener("click", () => {
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

    function inputEvent(e) {
      if (vue.nowPlaying) return;
      const d = device.outputs;
      const numArray = [];
      // 2桁の16進数にして表示する
      event.data.forEach(function(val) {
        numArray.push(("00" + val.toString(16)).substr(-2));
      });
      const message = numArray.join(" ");

      // InputしたDeviceに結果を送信する
      d.send(e.data);

      // 離すときはカウントしない
      if (message.slice(0, 2) === "80") return;
      // 2桁の16進数を表示
      console.log(message);
      vue.temp.push(message);
    }

    navigator.requestMIDIAccess().then(requestSuccess, requestError);
  },
  watch: {
    temp: function(temp) {
      console.log(temp, "temp");
      if (temp.length > 3) {
        this.temp = temp.slice(-1);
        return;
      }
      _.each(audioList, audio => {
        if (_.isEqual(temp, audio.commands)) {
          this.startAudio(audio.id);
          return;
        }
      });
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
#app {
  @include base-font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
