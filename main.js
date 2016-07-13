DXRegion_Worker = (function () {
    const dxRegion_worker = new Worker("/Scripts/dxregion-worker.js");
    let resolver = {};
    dxRegion_worker.addEventListener("message", e => {
        let token = e.data.token;
        if (resolver.hasOwnProperty(token)) {
            resolver[token](e.data);
            setTimeout(() => delete resolver[token], 1);
        }
    });
    let props = ["areas", "regions", "subregions", "subsidiaries", "countries", "states", "getCountryObjByName", "getStateObj"];  //bad smell here, :(
    let ret = {}, genCommonFn = fn => function (...d) {
        let token = Date.now();
        dxRegion_worker.postMessage({
            fn: fn,
            params: d,
            token: token
        });
        let pm = new Promise((resolve, reject) => {
            resolver[token] = resolve;
        });
        return pm;
    };
    props.forEach(p => ret[p] = genCommonFn(p));
    return ret;
})();

/// test cases:
var diagnose = d => console.log(d);
DXRegion_Worker.areas().then(diagnose);
DXRegion_Worker.states("United States", "DC").then(diagnose)
