(function MobilePages(window) {
    'use strict';
    var pageChanging = false,
        currentPage = '',
        pages = {};
    window.addEventListener('hashchange', changeByHash);
    document.addEventListener('mp.pageloaded', function() {
        pageChanging = false;
    });

    var MobilePage = {
        unregister: function unregister() {
            unregisterPage(this);
        },
        addProperty: function addProperty(propertyName, property) {
            addPropertyToPage(this, propertyName, property);
            return this;
        },
        go: function go() {
            if(location.hash === '#' + this.name) {
                changeByHash();
            } else {
                location.hash = this.name;
            }
            return this;
        }
    };

    function changeByHash() {
        if(!pageChanging) {
            triggerEvent('mp.beforeload');
            pageChanging = true;
            var pageSelector = location.hash.slice(1, location.hash.length);
            if(pageSelector) {
                currentPage = pageSelector;
                getPage(pageSelector, changePage);
            } else {
                location.hash = currentPage;
                pageChanging = false;
            }
        }

        function changePage(pageData) {
            var pageNode = findOne('#pages');
            pageNode.innerHTML = '';
            pageNode.innerHTML = pageData;
            loadPage(pageSelector);
        }

        function getPage(pageToGet, callback) {
            if (getPageByName(pageToGet) && getPageByName(pageToGet).template) {
                callback(getPageByName(pageToGet).template);
            } else {
                ajax({
                    type: 'GET',
                    url: 'pages/' + pageToGet + '.html',
                    success: function(pageData) {
                        if(getPageByName(pageToGet)) {
                            getPageByName(pageToGet).template = pageData;
                        } else {
                            newPage(pageToGet).template = pageData;
                        }
                        callback(pageData);
                    }
                });
            }
        }
    }

    function unregisterPage(which) {
        if(which && which.name) {
            delete getPageByName(which.name);
        }
    }

    function unregisterAll() {
        pages = {};
    }

    function getPageByName(name) {
        return pages[name];
    }

    function loadPage(name) {
        var pageObject = getPageByName(name);
        if(pageObject && pageObject.init) {
            requestAnimationFrame(function() {
                pageObject.init();
                triggerEvent('mp.pageloaded');
            }, 0);
        } else {
            triggerEvent('mp.pageloaded');
        }

        return pageObject;
    }

    function addPropertyToPage(object, propertyName, property) {
        object[propertyName] = property;
    }

    function isPageNameRegistered(name) {
        return (!!getPageByName(name));
    }

    function newPage(name) {
        var page;
        if (!name || ''.prototype !== name.prototype) {
            page = getPageByName(currentPage);
        } else if(getPageByName(name)) {
            page = getPageByName(name);
        } else {
            var newPageObject = Object.create(MobilePage);
            newPageObject.name = name;
            page = register(newPageObject);
        }

        function register(pageObject) {
            if(pageObject && pageObject.name) {
                pages[pageObject.name] = pageObject;
                return pages[pageObject.name];
            } else {
                return null;
            }
        }

        return page;
    }
    window.MobilePages = {
        isPage: isPageNameRegistered,
        page: newPage,
        unregister: unregisterPage,
        unregisterAll: unregisterAll,
        init: changeByHash
    };

    function triggerEvent(eventName) {
        // CustomEvent polyfill from:
        // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
        if(!window.CustomEvent) {
            var CustomEvent;

            CustomEvent = function(event, params) {
                var evt;
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };

            CustomEvent.prototype = window.Event.prototype;

            window.CustomEvent = CustomEvent;
        }
        var customEvent = new window.CustomEvent(eventName);
        document.dispatchEvent(customEvent);
    }

    function ajax(options) {
        var request = new XMLHttpRequest();
        request.open(options.type, options.url);
        request.send();

        request.onreadystatechange = function() {
            try {
                switch (request.readyState) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        options.success(request.responseText);
                        break;
                    default:
                        break;
                    }
                }
            catch (e) {
                console.error(e);
            }
        };
    }

    function findOne(selector) {
        return document.querySelector(selector);
    }

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if(!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if(!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    })();
})(window);
