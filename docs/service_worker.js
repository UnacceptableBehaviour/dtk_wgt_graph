
console.log('service_worker.js LOADING');

// https://developers.google.com/web/fundamentals/primers/service-workers
// One subtlety with the register() method is the location of the service worker file. You'll notice in this
// case that the service worker file is at the root of the domain. This means that the service worker's scope
// will be the entire origin. In other words, this service worker will receive fetch events for everything on
// this domain. If we register the service worker file at /example/sw.js, then the service worker would only
// see fetch events for pages whose URL starts with /example/ (i.e. /example/page1/, /example/page2/).
// for flask thats /application/static 
//
// for github.io?
// https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e
// depends if you are using /docs/  or /master/
// /dtk_wgt_graph/

let verion_numner_passed_in = '00.01';

const CACHE_NAME = `dtk-gitio-cache_${verion_numner_passed_in}`;  // Version number for ServWrkr updates

// run
// build_cache_file_list.py from /dtk_wgt_graph/docs
// to create updated list

// dont cache SW - changes to SW force and update of SW and consequently caches - update version above
//'/dtk_wgt_graph/service_worker.js',  // https://stackoverflow.com/questions/55027512/should-i-cache-the-serviceworker-file-in-a-pwa
const FILES_TO_CACHE = [
  '/dtk_wgt_graph/static/offline.html',
  '/dtk_wgt_graph/static/favicon.ico',
  '/dtk_wgt_graph/static/manifest.json',
  '/dtk_wgt_graph/static/css/bootstrap.min.css',
  '/dtk_wgt_graph/static/css/recipe_dtk_multi.css',
  '/dtk_wgt_graph/static/css/styles.css',
  '/dtk_wgt_graph/static/css/blank_mod.css',
  '/dtk_wgt_graph/static/css/weigh_in.css',
  '/dtk_wgt_graph/static/images/share-pwa-qr-code.png',
  '/dtk_wgt_graph/static/images/svg/cog.svg',
  '/dtk_wgt_graph/static/images/svg/home.svg',
  '/dtk_wgt_graph/static/images/svg/weigh_in.svg',
  '/dtk_wgt_graph/static/images/svg/pencil.svg',
  '/dtk_wgt_graph/static/images/svg/snap.svg',
  '/dtk_wgt_graph/static/images/svg/graph.svg',
  '/dtk_wgt_graph/static/images/svg/check1.svg',
  '/dtk_wgt_graph/static/images/svg/heart.svg',
  '/dtk_wgt_graph/static/images/png/home.png',
  '/dtk_wgt_graph/static/images/png/cog.png',
  '/dtk_wgt_graph/static/images/png/search.png',
  '/dtk_wgt_graph/static/images/png/heart.png',
  '/dtk_wgt_graph/static/images/png/check1.png',
  '/dtk_wgt_graph/static/images/png/snap.png',
  '/dtk_wgt_graph/static/images/png/pencil.png',
  '/dtk_wgt_graph/static/images/png/edit.png',
  '/dtk_wgt_graph/static/images/png/weigh_in.png',
  '/dtk_wgt_graph/static/images/icons/icon-32x32.png',
  '/dtk_wgt_graph/static/images/icons/W.svg',
  '/dtk_wgt_graph/static/images/icons/icon-512x512.png',
  '/dtk_wgt_graph/static/html/home.html',
  '/dtk_wgt_graph/static/html/recipe_dtk_multi.html',
  '/dtk_wgt_graph/static/html/weigh_in.html',
  '/dtk_wgt_graph/static/html/shareQR.html',
  '/dtk_wgt_graph/static/html/blankMod.html',
  '/dtk_wgt_graph/static/html/cert.html',
  '/dtk_wgt_graph/static/html/recipe.html',
  '/dtk_wgt_graph/static/html/dtk_chart.html',
  '/dtk_wgt_graph/static/html/tracker.html',
  '/dtk_wgt_graph/static/html/snap.html',
  '/dtk_wgt_graph/static/html/mathPaint.html',
  '/dtk_wgt_graph/static/js_modules/module_page_dtk_chart.js',
  '/dtk_wgt_graph/static/js_modules/module_page_snap.js',
  '/dtk_wgt_graph/static/js_modules/module_page_blankMod.js',
  '/dtk_wgt_graph/static/js_modules/module_page_diffusion.js',
  '/dtk_wgt_graph/static/js_modules/weigh_in.js',
  '/dtk_wgt_graph/static/js_modules/navbarMod.js',
  '/dtk_wgt_graph/static/js_modules/module_page_shareQR.js',
  '/dtk_wgt_graph/static/js_modules/module_page_home.js',
  '/dtk_wgt_graph/static/js_modules/module_page_tracker.js',
  '/dtk_wgt_graph/static/js_modules/module_page_flock.js',
  '/dtk_wgt_graph/static/js_modules/module_page_mathPaintCanvas.js',
  '/dtk_wgt_graph/static/js_modules/dtk_storage.js',
  '/dtk_wgt_graph/static/js_modules/module_page_recipe.js',
  '/dtk_wgt_graph/static/js_modules/module_page_randomTarget.js',
  '/dtk_wgt_graph/static/js_modules/app.js',
  '/dtk_wgt_graph/static/js_modules/content/recipe_dtk_multi.js',
  '/dtk_wgt_graph/static/js_modules/content/dtk_data.js',
  '/dtk_wgt_graph/static/js_modules/content/require_random.js',
  '/dtk_wgt_graph/static/js_modules/content/dtk_chart.js',
  '/dtk_wgt_graph/static/js_modules/content/u10_fp_math_functions.js',
  '/dtk_wgt_graph/static/js_modules/content/dtk_data_process.js',
  '/dtk_wgt_graph/static/js_modules/content/u7_fp_diffusion_port.js',
  '/dtk_wgt_graph/static/js_modules/content/u8_fp_flock_port.js',
  '/dtk_wgt_graph/static/js_modules/content/blankMod.js',
  '/dtk_wgt_graph/static/js_modules/content/u9_fp_random_target_port.js',
  '/dtk_wgt_graph/static/js_modules/content/lib/algos_sftest.js',
  '/dtk_wgt_graph/static/js_modules/content/lib/algos_sftest/index.js',
  '/dtk_wgt_graph/static/js_modules/content/lib/algos_sftest/package.json',
  '/dtk_wgt_graph/static/data/dtk_data.json',
  '/dtk_wgt_graph/static/data/dtk_data.js',
];


self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      console.log(`[ServiceWorker] No of FILES_TO_CACHE:${FILES_TO_CACHE.length}`);
      
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {               // DELETE all caches EXCEPT the one just created!
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});


// fetch event - service network requests 
//self.addEventListener('fetch', function(event) {
//  event.respondWith(fetch(event.request));          // pass request to network
//});

// fetch event - network only w/ OFFLINE page
//self.addEventListener('fetch', (evt) => {
//  if (evt.request.mode !== 'navigate') {
//    return;
//  }
//  evt.respondWith(fetch(evt.request).catch(() => {
//      return caches.open(CACHE_NAME).then((cache) => {
//        return cache.match('static/offline.html');
//      });
//    })
//  );
//});

// fetch event - Cache falling back to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
