importScripts("../../js/ExtPay.js");
var extpay = ExtPay("restock-highligher-autobuyer");

function setATTIC_SHOULD_REFRESH(e) { chrome.storage.local.set({ ATTIC_SHOULD_REFRESH: e }, function () {}) }

function getRandomToken() { var e = new Uint8Array(32);
    crypto.getRandomValues(e); for (var t = "", o = 0; o < e.length; ++o) t += e[o].toString(16); return t } extpay.startBackground(), extpay.getUser().then(e => { e.paid ? chrome.storage.local.set({ EXT_P_S: !0 }, function () {}) : (chrome.storage.local.set({ EXT_P_S: !1 }, function () {}), chrome.tabs.create({ url: "../../src/payment/why_paid.html" })) }).catch(e => { console.error(e), chrome.tabs.create({ url: "../../src/payment/why_paid.html" }) }), setTimeout(function () { setInterval(function () { extpay.getUser().then(e => { e.paid ? chrome.storage.local.set({ EXT_P_S: !0 }, function () {}) : chrome.storage.local.set({ EXT_P_S: !1 }, function () {}) }).catch(e => { console.error(e) }) }, 864e5) }, 1e3), setTimeout(function () { chrome.storage.local.get({ WARNING_ACK: !1, EXT_P_S: !1 }, function (e) {!e.WARNING_ACK && e.EXT_P_S && (setATTIC_SHOULD_REFRESH(!1), chrome.tabs.create({ url: "../../src/notes/warning.html" })) }) }, 3e3), chrome.action.onClicked.addListener(e => { chrome.tabs.create({ url: "../../src/options/index.html" }) }), chrome.runtime.onInstalled.addListener(function (e) { "install" == e.reason || e.reason });