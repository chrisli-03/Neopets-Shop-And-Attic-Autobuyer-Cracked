function setWARNING_ACK(t) { chrome.storage.local.set({ WARNING_ACK: t }, function () {}) }

const button = document.getElementById("ack");

button.addEventListener("click", function () { 
    setWARNING_ACK(!0);
    window.alert("Thank you for acknowledging. Happy autobuying!");
    window.location.href = "../options/Autobuyer/autobuyer.html" ;
    window.open('../options/Tools/faq.html', '_blank');
});