define(['app'], function (app) {
    /***
     GLobal Directives
     ***/

// Route State Load Spinner(used on page or content load)
    app.directive('ngSpinnerBar', ['$rootScope',
        function ($rootScope) {
            return {
                link: function (scope, element, attrs) {
                    // by defult hide the spinner bar
                    element.addClass('hide'); // hide spinner bar by default

                    // display the spinner bar whenever the route changes(the content part started loading)
                    $rootScope.$on('$stateChangeStart', function () {
                        element.removeClass('hide'); // show spinner bar
                    });

                    // hide the spinner bar on rounte change success(after the content loaded)
                    $rootScope.$on('$stateChangeSuccess', function () {
                        element.addClass('hide'); // hide spinner bar
                        $('body').removeClass('page-on-load'); // remove page loading indicator
                        Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                        // auto scorll to page top
                        setTimeout(function () {
                            App.scrollTop(); // scroll to the top on content load
                        }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                    });

                    // handle errors
                    $rootScope.$on('$stateNotFound', function () {
                        element.addClass('hide'); // hide spinner bar
                    });

                    // handle errors
                    $rootScope.$on('$stateChangeError', function () {
                        element.addClass('hide'); // hide spinner bar
                    });
                }
            };
        }
    ])

    // Handle global LINK click
    app.directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
                if (elem.hasClass('fancybox-button')) {
                    if (!jQuery.fancybox) {
                        return;
                    }
                    $(elem).fancybox({
                        groupAttr: 'data-rel',
                        prevEffect: 'none',
                        nextEffect: 'none',
                        closeBtn: true,
                        helpers: {
                            title: {
                                type: 'inside'
                            }
                        }
                    });
                }
            }
        };
    });

    // Handle Dropdown Hover Plugin Integration
    app.directive('dropdownMenuHover', function () {
        return {
            link: function (scope, elem) {
                elem.dropdownHover();
            }
        };
    });

    app.directive('dropdownMenuHover', function () {
        return {
            link: function (scope, elem) {
                elem.dropdownHover();
            }
        };
    });

    // Handle input uniform
    app.directive('input', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs['type'] != 'checkbox' && attrs['type'] != 'radio') {
                    return;
                }
                if (elem.hasClass('.icheck')) {
                    if (!$().iCheck) {
                        return;
                    }
                    $(elem).each(function () {
                        var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
                        var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

                        if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                            $(this).iCheck({
                                checkboxClass: checkboxClass,
                                radioClass: radioClass,
                                insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                            });
                        } else {
                            $(this).iCheck({
                                checkboxClass: checkboxClass,
                                radioClass: radioClass
                            });
                        }
                    });
                } else if(elem.hasClass('make-switch')) {
                    if (!$().bootstrapSwitch) {
                        return;
                    }
                    $(elem).bootstrapSwitch();
                } else {
                    if (!$().uniform) {
                        return;
                    }
                    if ($(elem).not('.toggle, .md-check, .md-radiobtn, .make-switch, .icheck')) {
                        elem.uniform();
                    }
                }
            }
        };
    });


    app.directive('div', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {

                if (elem.hasClass('.scroller')) {  // initSlimScroll
                    if ($(elem).attr("data-initialized")) {
                        return; // exit
                    }

                    var height;
                    if ($(elem).attr("data-height")) {
                        height = $(elem).attr("data-height");
                    } else {
                        height = $(elem).css('height');
                    }

                    $(elem).slimScroll({
                        allowPageScroll: true, // allow page scroll when the element scroll is ended
                        size: '7px',
                        color: ($(elem).attr("data-handle-color") ? $(elem).attr("data-handle-color") : '#bbb'),
                        wrapperClass: ($(elem).attr("data-wrapper-class") ? $(elem).attr("data-wrapper-class") : 'slimScrollDiv'),
                        railColor: ($(elem).attr("data-rail-color") ? $(elem).attr("data-rail-color") : '#eaeaea'),
                        position: isRTL ? 'left' : 'right',
                        height: height,
                        alwaysVisible: ($(elem).attr("data-always-visible") == "1" ? true : false),
                        railVisible: ($(elem).attr("data-rail-visible") == "1" ? true : false),
                        disableFadeOut: true
                    });

                    $(elem).attr("data-initialized", "1");
                } else if (elem.hasClass('tooltips')) { // global tooltips
                    $('.tooltips').tooltip();
                } else if (elem.hasClass('portlet')) { // portlet tooltips
                    $(elem).find('.portlet-title .fullscreen').tooltip({
                        container: 'body',
                        title: 'Fullscreen'
                    });
                    $(elem).find('.portlet-title > .tools > .reload').tooltip({
                        container: 'body',
                        title: 'Reload'
                    });
                    $(elem).find('.portlet-title > .tools > .remove').tooltip({
                        container: 'body',
                        title: 'Remove'
                    });
                    $(elem).find('.portlet-title > .tools > .config').tooltip({
                        container: 'body',
                        title: 'Settings'
                    });
                    $(elem).find('.portlet-title > .tools > .expand').tooltip({
                        container: 'body',
                        title: 'Collapse/Expand'
                    });
                    $(elem).find('.portlet-title > .tools > .collapse').tooltip({
                        container: 'body',
                        title: 'Collapse/Expand'
                    });
                } else if (elem.hasClass('popovers')) {
                    $('.popovers').popover();
                }
            }
        };
    });

    // Handles Bootstrap confirmations
    app.directive('data-toggle', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                if (!$().confirmation) {
                    return;
                }
                if (attrs['data-toggle'] != 'confirmation') {
                    return;
                }
                $(elem).confirmation({ container: 'body', btnOkClass: 'btn btn-sm btn-success', btnCancelClass: 'btn btn-sm btn-danger'});
            }
        };
    });

    // Handle Hower Dropdowns
    app.directive('data-hover', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                if (attrs['data-hover'] != 'dropdown') {
                    return;
                }
                if (elem.hasClass('hover-initialized')) {
                    return;
                }
                $(elem).dropdownHover();
                $(elem).addClass('hover-initialized');
            }
        };
    });


    // Handle Select2 Dropdowns
    app.directive('select2me', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                if ($().select2) {
                    $.fn.select2.defaults.set("theme", "bootstrap");
                    $('.select2me').select2({
                        placeholder: "Select",
                        width: 'auto',
                        allowClear: true
                    });
                }
            }
        };
    });


});