const lunaApiParams = new URLSearchParams(window.location.search);

window.LUNA_API_CONFIG = {
  baseUrl: (
    lunaApiParams.get("apiBase") ||
    window.localStorage.getItem("luna_api_base_url") ||
    ""
  ).replace(/\/$/u, "")
};
