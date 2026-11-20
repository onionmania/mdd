/* MDD 서비스 워커: 화면(HTML)은 항상 인터넷에서 먼저 받고, 안 될 때만 저장본을 보여줘요.
   그래서 GitHub에 새 index.html을 올리면 다음 실행 때 바로 바뀌어요. 데이터 요청(API)은 건드리지 않아요. */
var CACHE = "mdd-shell-v1";
self.addEventListener("install", function(e){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function(e){
  var req = e.request, url = new URL(req.url);
  if(req.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(req, copy); });
      return res;
    }).catch(function(){ return caches.match(req).then(function(m){ return m || caches.match("./"); }); })
  );
});
