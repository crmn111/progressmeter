/*!
 *
 * Progress meter - with native html5 || WAI-ARIA support - both optional
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Dependency : jQuery + Mustache template engine (http://mustache.github.com/)
 *
 *
 * Author: dirkjan@degroot.in
 * Location: https://github.com/dirkjan111/progressmeter
 * Version:  0.1
 * Date: 01-10-2012
 */

$.progress_meter = (function($) {

    var text = "done loading";

    // Check to see if the flag for html5 support is set:
    var html5Enable = false;

    // Check to see if the browser supports the HTML5 <progress> tag.
    var supportsHTML5Progress = (typeof (HTMLProgressElement) !== "undefined");

    // Check to see if the flag for WAI-ARIA is set:
    var ariaEnabled = false;

    // classname of element
    var baseref = 'progress-meter';
    var $baseref = '.'+baseref;

    /* depending on html5 support and html5Enabled flag set reference: */
    var html5Enabled = false;
    var $ref = null;

    var ADD = function(opts) {

		var optsdefaults = {
			"method" : 'append', // append || prepend || after || before
 			"selector" : 'body',
            "html5Enable" : true,
            "ariaEnable" : true, // only for non html5 output
			onInit : function() {},
			onError : function() {},
			onReady : function() {}
		};

		opts = $.extend({}, optsdefaults, opts);

		if($.isFunction(opts.onInit)) {
			opts.onInit();
		}

        // Check to see if the flag for html5 support is set:
        html5Enable = opts.html5Enable;

        // Check to see if the flag for WAI-ARIA support is set:
        ariaEnabled = opts.ariaEnable;

        // set html5Enabled flag
        html5Enabled = (supportsHTML5Progress && html5Enable);
        $ref = (!html5Enabled) ? $baseref : 'progress';

        var MODEL = {
            title : 'Progress indication',
            classname : baseref,
            innerhtml : null
        };

        var TEMPLATE_IN = ''+
            '<div class="inner">{{title}}'+
                '<span class="progress"></span>'+
            '</div>';

        var TEMPLATE_NM = ''+
            '<div class="{{classname}}">{{{innerhtml}}}</div>';

        var TEMPLATE_H5 = ''+
            '<progress class="{{classname}}">{{{innerhtml}}}</progress>'

        MODEL.innerhtml = Mustache.render(TEMPLATE_IN, MODEL);

        var VIEW_NM = Mustache.render(TEMPLATE_NM, MODEL);
        var VIEW_H5 = Mustache.render(TEMPLATE_H5, MODEL);

        var html = (!html5Enabled) ? VIEW_NM : VIEW_H5;

        var target = $(opts.selector, document);

		switch(opts.method) {
			case 'append' :
				target.append(html);
			break;
			case 'prepend' :
				target.prepend(html);
			break;
			case 'before' :
				target.before(html);
			break;
			case 'after' :
				target.after(html);
			break;
		}

        if(ariaEnabled) {
            $($ref).attr('role','progressbar').attr('aria-valuemin','0').attr('aria-valuemax','100').attr('aria-valuenow','0').attr('aria-valuetext','0% '+text);
        }

        if(html5Enabled) {
            $($ref).attr('value',0).attr('max',100);
        }

		if($.isFunction(opts.onReady)) {
			opts.onReady();
		}
	};

	var UPDATE = function(opts) {

		var optsdefaults = {
			percentageDone : '', // without percentage sign
			lastIteration : 'false',
			onInit : function() {},
			onError : function() {},
			onSuccess : function() {},
			onReady : function() {}
		};

		opts = $.extend({}, optsdefaults, opts);

		if($.isFunction(opts.onInit)) {
			opts.onInit();
		}

        /* update progress bar & attributes: */
        if(html5Enabled) {
            $($ref).attr('value',opts.percentageDone);
            $($ref).text(opts.percentageDone+'%');
        }

        $($ref,document).find("span.progress").css({"width" : opts.percentageDone+'%'});

        /* update wai-aria value-now + value-text: */
        if(ariaEnabled) {
            $($ref,document).attr("aria-valuenow",opts.percentageDone);
            $($ref,document).attr("aria-valuetext",opts.percentageDone+'% '+text);
        }

        if($.isFunction(opts.onSuccess)) {
			opts.onSuccess();
		}

		if(opts.percentageDone >= '100') {
            var textDone = opts.percentageDone+'% '+text;

            if(!html5Enabled) {
			    $($ref,document).find("span.progress").text(textDone);
            } else {
                $($ref,document).text(textDone);
            }

			if($.isFunction(opts.onReady)) {
				opts.onReady();
			}
		}
	};

    var STOP = function(opts) {

        var optsdefaults = {
            percentageDone : '',
            onInit : function() {},
            onError : function() {},
            onSuccess : function() {}
        };

        opts = $.extend({}, optsdefaults, opts);

        if($.isFunction(opts.onInit)) {
            opts.onInit();
        }

        if(opts.percentageDone != 100) {
            $($ref,document).addClass('stopped');
        }

        if($.isFunction(opts.onSuccess)) {
            opts.onSuccess();
        }
     };

	return {
		ADD: ADD,
		UPDATE: UPDATE,
        STOP: STOP
	}

}(jQuery));