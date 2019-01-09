import qs from "querystring";

const params = qs.parse(window.location.search.slice(1));

export default params;
