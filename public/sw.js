'use strict';

const CACHE_NAME = 'v4';
const precachedResources = [
  '/umi.js',
  '/layouts__index.chunk.css',
  '/layouts__index.async.js',
];

const ASSET_JSON = {};

function filterFilesByExtensions(filePaths, extensions) {
  return filePaths.filter((filePath) => {
    const extension = filePath.split('.').pop(); // 获取文件后缀名
    return extensions.includes(extension);
  });
}

function isCacheable(request) {
  const url = new URL(request.url);

  const { pathname } = url;

  return request.url.startsWith('http') && !pathname.endsWith('.json');
}

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  console.log('run precache', cache.keys());

  const filePaths = Object.values(ASSET_JSON);
  let canCacheFilePaths = filterFilesByExtensions(filePaths, [
    'js',
    'css',
    'png',
    'jpg',
  ]);
  // 过滤掉
  canCacheFilePaths = canCacheFilePaths.filter(
    (path) => path.indexOf('/sw.js') < 0
  );

  console.log({ canCacheFilePaths });

  return cache.addAll(canCacheFilePaths);
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return Response.error();
  }
}

async function cacheFirstWithRefresh(request) {
  if (!navigator.onLine) {
    console.warn('网络已经断开');
    return await caches.match(request);
  }

  const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      try {
        cache.put(request, networkResponse.clone());
      } catch (err) {
        console.log('[sw cache put error]', err);
      }
    }
    return networkResponse;
  });

  return (await caches.match(request)) || (await fetchResponsePromise);
}

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  event.waitUntil(precache());
});

self.addEventListener('activate', function (event) {
  console.log('activate event', event);
  event.waitUntil(
    caches.keys().then((cacheNameList) => {
      console.log('缓存列表:', cacheNameList);
      // 移除旧的缓存
      return Promise.all(
        cacheNameList.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (isCacheable(request)) {
    event.respondWith(cacheFirstWithRefresh(event.request));
  }

  // if (precachedResources.includes(url.pathname)) {
  //   console.log('命中缓存', url.pathname);
  //   event.respondWith(cacheFirst(event.request));
  // }
});
