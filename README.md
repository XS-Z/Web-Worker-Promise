# Web-Worker-Promise
Work together with [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise). 

This repo comes from one of my demo project and only contains some key snippets. Hope it can help you smart guys more or less.

use case: 

1. using dxregion-worker.js for querying & storing big response data.
2. main.js is the script which initialize web worker and use it.

Notes: Since the repo is written by ES6, it can only run OK in some modern browsers(like [Firefox](https://www.mozilla.org/en-US/firefox/new/) or [Chrome](http://chrome.google.com/)). Or you can add some polyfills first.
