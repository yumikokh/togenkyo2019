import _ from "lodash";
import cookie from "js-cookie";
import { encRaw } from "@/utils/encrypt";

const NAME = {
  VISITED: encRaw("visited"),
  HAS_TO_STORY_MODAL: encRaw("hasToStoryModal"),
  UUID: encRaw("uuid"),
  VOTED: encRaw("voted")
};

// 来訪したか
export const getVisited = () => cookie.get(NAME.VISITED) || false;

export const setVisited = () => {
  cookie.set(NAME.VISITED, true, { expires: 365 });
};

// TOP STORYモーダル表示したか
export const getToStoryModal = () =>
  cookie.get(NAME.HAS_TO_STORY_MODAL) || false;

export const setToStoryModal = () => {
  cookie.set(NAME.HAS_TO_STORY_MODAL, true, { expires: 365 });
};

// uuid
export const getUuid = () => cookie.get(NAME.UUID) || "";

export const setUuid = uuid => {
  cookie.set(NAME.UUID, uuid, { expires: 1 });
};

export const removeUuid = () => {
  cookie.remove(NAME.UUID);
};

// 1日1回投票できる
export const getVoted = () => cookie.getJSON(NAME.VOTED) || [];

export const setVoted = uid => {
  cookie.set(NAME.VOTED, _.uniq([...getVoted(), uid]), {
    expires: 1
  });
};
