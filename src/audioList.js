import _ from "lodash";
import pianoList from "./const/pianoList";

export default {
  bgm: {
    id: "bgm",
    filename: "10_aogeba"
  },
  1: {
    id: 1,
    filename: "01_kouka",
    commands: _.map(["do", "re", "mi"], sound => pianoList[sound])
  },
  2: {
    id: 2,
    filename: "02_greengreen",
    commands: _.map(["fa", "so", "ra"], sound => pianoList[sound])
  }
};
