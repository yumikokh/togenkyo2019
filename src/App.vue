<template lang="pug">
  #app
      .container(:data-song="nowPlaying")
        video.video(src="/movie/00_BGM.mp4" type="video/mp4" loop playsinline ref="video" muted)
        ul.images
          li(v-for="(song, i) in songs" :data-show="nowPlaying == i+1")
        ul.tanbarin
          li.fb-item(v-for="(circle, i) in circles" :data-show="tanbarin == circle")
            video.video(:src="`/movie/circle/${circle}.mp4`"  playsinline  muted autoplay :ref="'tanbarin-'+circle" preload)
        ul.drum
          li.fb-item(v-for="(circle, i) in circles" :data-show="drum == circle")
            video.video(:src="`/movie/circle/${circle}.mp4`" playsinline muted autoplay :ref="'drum-'+circle" preload)
          
</template>

<script>
import _ from "lodash";
import audioList from "./const/audioList";
import circleList from "./const/circleList";
import pianoList from "./const/pianoList";
import { tanbarinSound, drumSound } from "./const";

export default {
  name: "app",
  computed: {
    songs: () => new Array(10),
    circles: () => circleList,
    tanbarin: function() {
      if (!this.nowPlaying) return false;
      return audioList[this.nowPlaying].tanbarin;
    },
    drum: function() {
      if (!this.nowPlaying) return false;
      return audioList[this.nowPlaying].drum;
    }
  },
  data: () => ({
    temp: [],
    audios: {},
    nowPlaying: false,
    hasSetup: false
  }),
  methods: {
    startAudio(id = 1) {
      console.log("start audio", id);
      if (id !== "bgm") this.nowPlaying = id;
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
      _.each(document.getElementsByClassName("video"), async video => {
        await video.play();
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
      if (vue.nowPlaying) {
        // 再生中はエジェクトだす
        if (_.includes(tanbarinSound, soundName)) {
          vue.$refs[`tanbarin-${vue.tanbarin}`][0].play();
        }
        if (_.includes(drumSound, soundName)) {
          vue.$refs[`drum-${vue.drum}`][0].play();
        }
        return;
      }
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
@import "reset-css";

#app {
  @include base-font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  position: relative;
  width: 942px;
  @for $i from 1 through 10 {
    &[data-song="#{$i}"] {
      .fb-item::after {
        background-color: nth($themeColor, $i);
      }
    }
  }
}
.video {
  width: 100%;
}

.images {
  @include abs-fill;
  width: 791px;
  height: 397px;
  @for $i from 1 through 10 {
    > li:nth-child(#{$i}) {
      background: url(/images/bg/song-#{$i}.jpg) center no-repeat;
      background-size: cover;
    }
  }
  > li {
    @include abs-fill;
  }
}

.tanbarin {
  position: absolute;
  width: 140px;
  height: 140px;
  right: 6px;
  top: 230px;
  background: #fff;
  > li {
    position: absolute;
    opacity: 0;
    &[data-show] {
      opacity: 1;
    }

    &::after {
      content: "";
      @include abs-fill;
      mix-blend-mode: color;
    }
  }
}

.drum {
  position: absolute;
  width: 280px;
  height: 290px;
  right: 200px;
  top: 470px;
  background: #fff;
  > li {
    position: absolute;
    opacity: 0;
    &[data-show] {
      opacity: 1;
    }
    &::after {
      content: "";
      @include abs-fill;
      mix-blend-mode: color;
    }
  }
}
</style>
