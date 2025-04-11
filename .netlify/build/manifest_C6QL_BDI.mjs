import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_CrtxHmP4.mjs';
import 'cookie';
import 'es-module-lexer';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || undefined,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : undefined,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/yuriko/my-portfolio-project/","cacheDir":"file:///Users/yuriko/my-portfolio-project/node_modules/.astro/","outDir":"file:///Users/yuriko/my-portfolio-project/dist/","srcDir":"file:///Users/yuriko/my-portfolio-project/src/","publicDir":"file:///Users/yuriko/my-portfolio-project/public/","buildClientDir":"file:///Users/yuriko/my-portfolio-project/dist/","buildServerDir":"file:///Users/yuriko/my-portfolio-project/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/yuriko/my-portfolio-project/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_C6QL_BDI.mjs","/Users/yuriko/my-portfolio-project/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_D5j1yR6V.mjs","/Users/yuriko/my-portfolio-project/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.jQ03I6X0.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/yuriko/my-portfolio-project/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","const a=document.querySelector(\"#btn-open\"),y=document.querySelector(\"#panel\");a.addEventListener(\"click\",()=>{a.innerHTML===\"INFORMATION\"?(a.innerHTML=\"CLOSE\",y.classList.remove(\"u-hide\")):(a.innerHTML=\"INFORMATION\",y.classList.add(\"u-hide\"))});const g=document.querySelector(\"#currentTime\");let l,o,s,c;const L=()=>{l=new Date,o=l.getHours(),s=l.getMinutes(),c=l.getSeconds(),o<10&&(o=\"0\"+o),s<10&&(s=\"0\"+s),c<10&&(c=\"0\"+c)};window.addEventListener(\"load\",()=>{L(),g.innerHTML=`${o}:${s}:${c}`,setInterval(function(){L(),g.innerHTML=`${o}:${s}:${c}`},1e3)});const f=document.querySelector(\"#updatedDate\");let u,v,r,i;const h=()=>{u=new Date(document.lastModified),v=u.getFullYear(),r=u.getMonth()+1,i=u.getDate(),r<10&&(r=\"0\"+r),i<10&&(i=\"0\"+i)};window.addEventListener(\"load\",()=>{h(),f.innerHTML=`Updated: ${v}.${r}.${i}`});const p=document.querySelector(\"#cursor\");document.addEventListener(\"mousemove\",e=>{const t=e.clientX,n=e.clientY;p.style.translate=`${t}px ${n}px`});const S=document.querySelectorAll(\".cursor-large\");S.forEach(e=>{e.addEventListener(\"mouseover\",()=>{p.classList.add(\"clicked\")}),e.addEventListener(\"mouseout\",()=>{p.classList.remove(\"clicked\")})});const E=[{img:\"../assets/miraini-pharmacy_mockup.jpg\"},{img:\"../assets/portfolio_mockup.jpg\"},{img:\"../assets/hamburger_mockup.jpg\"}],T=document.querySelectorAll(\".work__item\"),d=document.querySelector(\"#hovering\"),q=document.querySelectorAll(\".work\"),m=()=>{d.src=\"\",d.style.display=\"none\"};T.forEach((e,t)=>{const n=q[t];e.addEventListener(\"mouseover\",()=>{n.open||(d.style.display=\"block\",d.src=E[t].img,d.animate({opacity:[0,1]},500))}),e.addEventListener(\"mouseout\",()=>{n.open||m()}),n.addEventListener(\"toggle\",()=>{n.open,m()})});const k=document.querySelector(\"#btn-copy\");k.addEventListener(\"click\",()=>{const e=document.querySelector(\"#email\").textContent,t=document.querySelector(\"#success\");navigator.clipboard.writeText(e).then(()=>{t&&(t.style.display=\"block\",setTimeout(()=>{t.style.display=\"none\"},2500))}).catch(()=>{alert(\"コピーができませんでした\")})});"]],"assets":["/_astro/logo.CzV1hB3t.png","/_astro/index.BNez_g-G.css","/assets/hamburger.png","/assets/hamburger_mockup.jpg","/assets/hamburger_sp.png","/assets/miraini-pharmacy.png","/assets/miraini-pharmacy_mockup.jpg","/assets/miraini-pharmacy_sp.png","/assets/portfolio.png","/assets/portfolio_mockup.jpg","/assets/portfolio_sp.png","/fonts/OverusedGrotesk-Bold.ttf","/fonts/OverusedGrotesk-Roman.ttf","/icons/favicon.ico","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"OW4ljnwe9klZCxhSrNUt9dcISNzW0S50U0lVrPH7oB8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
