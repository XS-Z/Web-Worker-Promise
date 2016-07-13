/// polyfill
if (!(Array.prototype.distinct && typeof (Array.prototype.distinct) === "function")) {
    Array.prototype.distinct = function () {
        var u = {}, a = [], l = this.length;
        for (var i = 0; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };
}
/// end polyfill
var _dxRegions = null;
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        _dxRegions = JSON.parse(xhr.responseText);  // _dxRegions might has thousand rows
    }
};
xhr.open("get", "Groups/DXRegion", false);
xhr.send();
var _nations = {};// a cache holder for states

const DXRegion = {
    areas: function () {
        if (!(_dxRegions && _dxRegions.length)) return [];
        return _dxRegions.map(function (d) { return d.Area; }).distinct().sort();
    },
    regions: function (area) {
        if (!(area && area.length && _dxRegions && _dxRegions.length)) return [];
        return _dxRegions.filter(function (d) { return area === d.Area; }).map(function (d) { return d.Region; }).distinct().sort();
    },
    subregions: function (region) {
        if (!(region && region.length && _dxRegions && _dxRegions.length)) return [];
        return _dxRegions.filter(function (d) { return region === d.Region; }).map(function (d) { return d.Subregion; }).distinct().sort();
    },
    subsidiaries: function (subregion) {
        if (!(subregion && subregion.length && _dxRegions && _dxRegions.length)) return [];
        return _dxRegions.filter(function (d) { return subregion === d.Subregion; }).map(function (d) { return d.Subsidiary; }).distinct().sort();
    },
    countries: function (subsidiary) {
        if (!(subsidiary && subsidiary.length && _dxRegions && _dxRegions.length)) return [];
        return _dxRegions.filter(function (d) { return subsidiary === d.Subsidiary; }).map(function (d) { return d.Country; }).distinct().sort();
    },
    states: function (country) {
        var states = _nations[country];
        if (!(states && states.length)) {
            var nationID = this.getCountryObjByName(country).NationalityID;//get country id by name
            //if (nationID === 111 || nationID === 19) {   // US or Canada only
            if (nationID === 111) {  // US only
                var formData = new FormData();
                formData.append("nationalityID", nationID);
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        states = _nations[country] = JSON.parse(xhr.responseText);
                    }
                };
                xhr.open("POST", "Groups/State", false);
                xhr.send(formData);
            }
        }
        return (states || []).map(function (d) { return d.StateName; });
    },
    getCountryObjByName: function (country) {
        if (_dxRegions && _dxRegions.length) {
            for (var i = 0; i < _dxRegions.length; i++) {
                if (_dxRegions[i].Country === country)
                    return _dxRegions[i];
            }
        }
        return {};  // should never come here
    },
    getStateObj: function (countryName, stateName) {
        var states = _nations[countryName];
        if (states && states.length) {
            for (var i = 0; i < states.length; i++) {
                if (states[i].StateName === stateName)
                    return states[i];
            }
        }
        return {};
    }
};

self.addEventListener("message", function (e) {
    // e.data example:    {fn:"regions",params:"United States",token:1468386481720}
    if (e.data == null) return;
    let data = typeof (e.data) === "string" ? JSON.parse(e.data) : e.data;
    let fn = data.fn, params = data.params, token = data.token;
    if (!DXRegion.hasOwnProperty(fn)) return;

    let ret = DXRegion[fn](...params);
    self.postMessage({
        data: ret,
        token: token
    });
});
