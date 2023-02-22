// node_modules/.pnpm/@zougt+vite-plugin-theme-preprocessor@1.4.8/node_modules/@zougt/vite-plugin-theme-preprocessor/dist/toBrowerEnvs.js
var browerPreprocessorOptions = { "outputDir": "", "defaultScopeName": "task-theme-default", "includeStyleWithColors": [], "extract": false, "themeLinkTagId": "theme-link-tag", "themeLinkTagInjectTo": "head", "removeCssScopeName": false, "customThemeCssFileName": null, "arbitraryMode": false, "defaultPrimaryColor": "", "customThemeOutputPath": "/Users/mawenqing/Documents/xfw/pu-ui/node_modules/.pnpm/@zougt+vite-plugin-theme-preprocessor@1.4.8/node_modules/@zougt/vite-plugin-theme-preprocessor/setCustomTheme.js", "styleTagId": "custom-theme-tagid", "InjectDefaultStyleTagToHtml": true, "hueDiffControls": { "low": 0, "high": 0 }, "multipleScopeVars": [{ "scopeName": "task-theme-default", "path": "/Users/mawenqing/Documents/xfw/pu-ui/packages/assets/style/variables.less", "includeStyles": { ".ant-btn-link:hover, .ant-btn-link:focus": { "border-color": "transparent" }, ".ant-btn-link": { "background": "transparent" }, ".ant-btn-primary:hover": { "color": "#ffffff" }, ".ant-checkbox-disabled .ant-checkbox-inner": { "background-color": "#f5f5f5" }, ".ant-checkbox-checked": { "color": "@primary-color" } } }, { "scopeName": "task-theme-integration", "path": "/Users/mawenqing/Documents/xfw/pu-ui/packages/assets/style/variablesInte.less", "includeStyles": { ".ant-btn-link:hover, .ant-btn-link:focus": { "border-color": "transparent" }, ".ant-btn-link": { "background": "transparent" }, ".ant-btn-primary:hover": { "color": "#ffffff" }, ".ant-checkbox-disabled .ant-checkbox-inner": { "background-color": "#f5f5f5" }, ".ant-checkbox-checked": { "color": "@primary-color" } } }, { "scopeName": "task-theme-okr", "path": "/Users/mawenqing/Documents/xfw/pu-ui/packages/assets/style/OKRvariables.less", "includeStyles": { ".ant-btn-link:hover, .ant-btn-link:focus": { "border-color": "transparent" }, ".ant-btn-link": { "background": "transparent" }, ".ant-btn-primary:hover": { "color": "#ffffff" }, ".ant-checkbox-disabled .ant-checkbox-inner": { "background-color": "#f5f5f5" }, ".ant-checkbox-checked": { "color": "@primary-color" } } }] };
var basePath = "/";
var assetsDir = "assets";
var buildCommand = "build";

// node_modules/.pnpm/@zougt+vite-plugin-theme-preprocessor@1.4.8/node_modules/@zougt/vite-plugin-theme-preprocessor/dist/browser-utils.js
function getRegstr(scopeName) {
  return `(^${scopeName}\\s+|\\s+${scopeName}\\s+|\\s+${scopeName}$|^${scopeName}$)`;
}
function addClassNameToHtmlTag({ scopeName, multipleScopeVars }) {
  const $multipleScopeVars = Array.isArray(multipleScopeVars) && multipleScopeVars.length ? multipleScopeVars : browerPreprocessorOptions.multipleScopeVars;
  let currentClassName = document.documentElement.className;
  if (new RegExp(getRegstr(scopeName)).test(currentClassName)) {
    return;
  }
  $multipleScopeVars.forEach((item) => {
    currentClassName = currentClassName.replace(
      new RegExp(getRegstr(item.scopeName), "g"),
      ` ${scopeName} `
    );
  });
  document.documentElement.className = currentClassName.replace(
    /(^\s+|\s+$)/g,
    ""
  );
}
function createThemeLinkTag({ id, href }) {
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = href;
  styleLink.id = id;
  return styleLink;
}
function toggleTheme(opts) {
  const options = {
    // multipleScopeVars: [],
    scopeName: "theme-default",
    customLinkHref: (href2) => href2,
    // themeLinkTagId: "theme-link-tag",
    // "head" || "body"
    // themeLinkTagInjectTo: "head",
    ...opts
  };
  if (buildCommand !== "build" || !browerPreprocessorOptions.extract) {
    addClassNameToHtmlTag(options);
    return;
  }
  const linkId = options.themeLinkTagId || browerPreprocessorOptions.themeLinkTagId;
  let styleLink = document.getElementById(linkId);
  const href = options.customLinkHref(
    `${(basePath || "").replace(/\/$/, "")}${`/${browerPreprocessorOptions.outputDir || assetsDir || ""}/${options.scopeName}.css`.replace(/\/+(?=\/)/g, "")}`
  );
  if (styleLink) {
    styleLink.id = `${linkId}_old`;
    const newLink = createThemeLinkTag({ id: linkId, href });
    if (styleLink.nextSibling) {
      styleLink.parentNode.insertBefore(newLink, styleLink.nextSibling);
    } else {
      styleLink.parentNode.appendChild(newLink);
    }
    newLink.onload = () => {
      setTimeout(() => {
        styleLink.parentNode.removeChild(styleLink);
        styleLink = null;
      }, 60);
      if (!browerPreprocessorOptions.removeCssScopeName) {
        addClassNameToHtmlTag(options);
      }
    };
    return;
  }
  styleLink = createThemeLinkTag({ id: linkId, href });
  if (!browerPreprocessorOptions.removeCssScopeName) {
    addClassNameToHtmlTag(options);
  }
  document[(options.themeLinkTagInjectTo || browerPreprocessorOptions.themeLinkTagInjectTo || "").replace("-prepend", "")].appendChild(styleLink);
}
var browser_utils_default = {
  toggleTheme,
  addClassNameToHtmlTag
};
export {
  addClassNameToHtmlTag,
  browser_utils_default as default,
  toggleTheme
};
//# sourceMappingURL=@zougt_vite-plugin-theme-preprocessor_dist_browser-utils__js.js.map
