import meta from "@/const/meta.yaml";

export const PRODUCTION = process.env.NODE_ENV === "production";

// シェア文言
export const SHARE_TEXT = {
  all: {
    text: "",
    hashtags: "",
    url: meta.url
  },
  user: {
    text: "",
    hashtags: ""
  }
};
