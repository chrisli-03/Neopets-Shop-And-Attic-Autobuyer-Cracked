// Item class for item configuration and parsing;
class Item {
    constructor(Name, Price, IsPricing, Index, ListIndex, Stock) {
        this.Name = Name;
        this.Price = Price;
        this.IsPricing = IsPricing;
        this.Index = Index;
        this.ListIndex = ListIndex;
        this.Stock = Stock;
    }
}

//######################################################################################################################################
//// Auto Pricer Variable Calling

function setSUBMIT_PRICES_PROCESS(value) {
    chrome.storage.local.set({ SUBMIT_PRICES_PROCESS: value }, function () {});
}

function getSUBMIT_PRICES_PROCESS(callback) {
    chrome.storage.local.get(['SUBMIT_PRICES_PROCESS'], function (result) {
        const value = result.SUBMIT_PRICES_PROCESS;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSHOP_INVENTORY(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {
            resolve();
        });
    });
}

function getSHOP_INVENTORY(callback) {
    chrome.storage.local.get(['SHOP_INVENTORY'], function (result) {
        const value = result.SHOP_INVENTORY;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setINVENTORY_UPDATED(value) {
    chrome.storage.local.set({ INVENTORY_UPDATED: value }, function () {});
}

function getINVENTORY_UPDATED(callback) {
    chrome.storage.local.get(['INVENTORY_UPDATED'], function (result) {
        const value = result.INVENTORY_UPDATED;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSTART_INVENTORY_PROCESS(value) {
    chrome.storage.local.set({ START_INVENTORY_PROCESS: value }, function () {});
}

function getSTART_INVENTORY_PROCESS(callback) {
    chrome.storage.local.get(['START_INVENTORY_PROCESS'], function (result) {
        const value = result.START_INVENTORY_PROCESS;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSTART_AUTOPRICING_PROCESS(value) {
    chrome.storage.local.set({ START_AUTOPRICING_PROCESS: value }, function () {});
}

function getSTART_AUTOPRICING_PROCESS(trueCallback, falseCallback) {
    chrome.storage.local.get(['START_AUTOPRICING_PROCESS'], function (result) {
        const value = result.START_AUTOPRICING_PROCESS;

        if (value === true && typeof trueCallback === 'function') {
            trueCallback();
        } else if (value === false && typeof falseCallback === 'function') {
            falseCallback();
        }
    });
}

function setAUTOPRICER_INVENTORY(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ AUTOPRICER_INVENTORY: value }, function () {
            resolve();
        });
    });
}

function getAUTOPRICER_INVENTORY(callback) {
    chrome.storage.local.get(['AUTOPRICER_INVENTORY'], function (result) {
        const value = result.AUTOPRICER_INVENTORY;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function getSUBMIT_PRICES_PROCESS(callback) {
    chrome.storage.local.get(['SUBMIT_PRICES_PROCESS'], function (result) {
        const value = result.SUBMIT_PRICES_PROCESS;

        if (value === undefined || value === null) {
            setSUBMIT_PRICES_PROCESS(false);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setNAVIGATE_TO_NEXT_PAGE(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ NAVIGATE_TO_NEXT_PAGE: value }, function () {
            resolve();
        });
    });
    
}

function getNAVIGATE_TO_NEXT_PAGE(callback) {
    chrome.storage.local.get(['NAVIGATE_TO_NEXT_PAGE'], function (result) {
        const value = result.NAVIGATE_TO_NEXT_PAGE;

        if (value === undefined || value === null) {
            setNAVIGATE_TO_NEXT_PAGE(true);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setNEXT_PAGE_INDEX(value) {
    chrome.storage.local.set({ NEXT_PAGE_INDEX: value }, function () {});
}

function getNEXT_PAGE_INDEX(callback) {
    chrome.storage.local.get(['NEXT_PAGE_INDEX'], function (result) {
        const value = result.NEXT_PAGE_INDEX;

        if (value === undefined || value === null) {
            setNEXT_PAGE_INDEX(1);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setCURRENT_PRICING_INDEX(value) {
    chrome.storage.local.set({ CURRENT_PRICING_INDEX: value }, function () {});
}

function getCURRENT_PRICING_INDEX(callback) {
    chrome.storage.local.get(['CURRENT_PRICING_INDEX'], function (result) {
        const value = result.CURRENT_PRICING_INDEX;

        if(value === undefined || value === null) value = 0;

        if (typeof callback === 'function') {
            callback(typeof value === 'undefined' ? 0 : value);
        }
    });
}

function setAUTOPRICER_STATUS(value) {
    chrome.storage.local.set({ AUTOPRICER_STATUS: value }, function () {});
}


//######################################################################################################################################
// Page Error Handling;

var isInErrorPage = false;

// Handle page errors by refreshing;
function HandleServerErrors() {
    chrome.storage.local.get({
        MIN_PAGE_LOAD_FAILURES: 10000,
        MAX_PAGE_LOAD_FAILURES: 20000
    }, (function(autobuyerVariables) {
        // Destructing the variables extracted from the extension;
        const {
            MIN_PAGE_LOAD_FAILURES: minPageReloadTime,
            MAX_PAGE_LOAD_FAILURES: maxPageReloadTime
        } = autobuyerVariables;

        const errorMessages = [
        "502 Bad Gateway",
        "504 Gateway Time-out",
        "Loading site please wait...",
        ];
    
        const pageText = document.body.innerText;
        
        // Page errors and captchas;
        if (errorMessages.some(message => pageText.includes(message))) {
            const indexOfMessage = errorMessages.findIndex(message => pageText.includes(message));

            // Captcha;
            if (indexOfMessage === 2) {
                UpdateDocument("Captcha page detected", "Captcha page detected. Pausing.");
            } else { // Refresh on page errors;
                function executeOnceAndPreventReexecution() {
                    if (!errorRefreshed) {
                        errorRefreshed = true;
                        
                        location.reload();
                    }
                }

                setTimeout(executeOnceAndPreventReexecution, Math.random() * (maxPageReloadTime - minPageReloadTime) + minPageReloadTime);
            }
        }
        
        // Browser errors;
        else if(window.location.title == "www.neopets.com"){
            setTimeout(() => { location.reload(); }, Math.random() * (maxPageReloadTime - minPageReloadTime) + minPageReloadTime);
        }
    }));
}

HandleServerErrors();


//######################################################################################################################################

// Email management;
class Email {
    constructor(Entry, ID, Author, Date, Subject, Title, Contents, Read){
        this.Entry = Entry;
        this.ID = ID;
        this.Author = Author;
        this.Date = Date;
        this.Subject = Subject;
        this.Title = Title;
        this.Contents = Contents;
        this.Read = Read;
    }
}

function getEMAIL_LIST(callback) {
    chrome.storage.local.get(['EMAIL_LIST'], function (result) {
        var value = result.EMAIL_LIST;

        if(value == undefined) value = [];

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setEMAIL_LIST(value) {
    chrome.storage.local.set({ EMAIL_LIST: value }, function () {});
}

// Current Mail Skipping;
function getSKIP_CURRENT_MAIL(callback) {
    chrome.storage.local.get(['SKIP_CURRENT_MAIL'], function (result) {
        var value = result.SKIP_CURRENT_MAIL;

        if(value == undefined) value = false;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSKIP_CURRENT_MAIL(value) {
    chrome.storage.local.set({ SKIP_CURRENT_MAIL: value }, function () {});
}

function getCURRENT_MAIL_INDEX(callback) {
    chrome.storage.local.get(['CURRENT_MAIL_INDEX'], function (result) {
        var value = result.CURRENT_MAIL_INDEX;

        if(value == undefined) value = -1;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setCURRENT_MAIL_INDEX(value) {
    chrome.storage.local.set({ CURRENT_MAIL_INDEX: value }, function () {});
}

function getRETRIEVED_NEWEST_EMAIL(callback) {
    chrome.storage.local.get(['RETRIEVED_NEWEST_EMAIL'], function (result) {
        var value = result.RETRIEVED_NEWEST_EMAIL;

        if(value == undefined) value = -1;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}


//######################################################################################################################################


//Toolbar management;
function setRETRIEVED_NEWEST_EMAIL(value) {
    chrome.storage.local.set({ RETRIEVED_NEWEST_EMAIL: value }, function () {});
}

function setUPDATE_DATE(value) {
    chrome.storage.local.set({ UPDATE_DATE: value }, function () {});
}

function getUPDATE_DATE(callback) {
    chrome.storage.local.get(['UPDATE_DATE'], function (result) {
        const value = result.UPDATE_DATE;

        if(value === undefined || value === null){
            setUPDATE_DATE("");
        } 

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setIS_NEW_MAIL_INBOX(value) {
    chrome.storage.local.set({ IS_NEW_MAIL_INBOX: value }, function () {});
}

function getIS_NEW_MAIL_INBOX(callback) {
    chrome.storage.local.get(['IS_NEW_MAIL_INBOX'], function (result) {
        const value = result.IS_NEW_MAIL_INBOX;

        if(value === undefined || value === null){
            setIS_NEW_MAIL_INBOX("");
        } 

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}