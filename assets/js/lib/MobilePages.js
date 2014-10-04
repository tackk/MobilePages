(function MobilePages(window) {
    'use strict';
    var pageChanging = false;
    var currentPage = '';
    window.addEventListener('hashchange', changeByHash);

    var MobilePage = {
        unregister : function unregister() {
            unregisterPage(this);
        },
        addProperty : function addProperty(propertyName, property) {
            addPropertyToPage(this, propertyName, property);
            return this;
        },
        go : function go() {
            if(location.hash === '#'+this.name) {
                changeByHash()
            } else {
                location.hash = this.name;
            }
            return this;
        }
    };

    function changeByHash(e) {
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
            findOne('#pages').innerHTML = pageData;
            loadPage(pageSelector);
            pageChanging = false;
        }

        function getPage(pageToGet, callback) {
            if (getPageByName(pageToGet) && getPageByName(pageToGet).template) {
                callback(getPageByName(pageToGet).template)
            } else {
                ajax({
                    type:'GET',
                    url:'pages/'+pageToGet+'.html',
                    success:function(pageData) {
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

    var pages = {};

    function getPageByName(name) {
        return pages[name];
    }

    function loadPage(name) {
        var pageObject = getPageByName(name);
        if(pageObject && pageObject.init) {
            pageObject.init();
        }
        triggerEvent('mp.pageloaded');
        return pageObject;
    }

    function addPropertyToPage(object, propertyName, property) {
        object[propertyName] = property;
    }

    function newPage(name) {
        var page;
        if (!name || ''.prototype !== name.prototype) {
            page = getPageByName(currentPage);
        } else if(getPageByName(name)) {
            page = getPageByName(name);
        } else {
            var newPage = Object.create(MobilePage);
            newPage.name = name;
            page = register(newPage);
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
        page : newPage,
        unregister : unregisterPage,
        unregisterAll : unregisterAll,
        init : changeByHash
    };

    function triggerEvent(eventName) {
        var customEvent = new CustomEvent(eventName);
        document.dispatchEvent(customEvent);
    }

    function ajax(options) {
        var request = new XMLHttpRequest();
        request.open(options.type, options.url);
        request.send();

        request.onreadystatechange = function(event) {
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
})(window);
