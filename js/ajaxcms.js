/////////////////////////////////  CONFIGURATION   ///////////////////////////////
		
var load_transition = "slide";

$.ajaxSetup({ cache: false });

//////////////////////////////////////////////////////////////////////////////////


// Polyfill for String.prototype.trim() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

//////////////////////////////////////////////////////////////////////////////////

var menus = [];
var pages = [];
var layouts = [];
var blogs = [];
var images = [];
var themes = [];

var menu_count = 0; // Keep track of recursive asyncronous directory list.
var pages_count = 0;
var images_count = 0;
var in_transition = false;

var base_url = window.location.href.replace(/\?.*/,'');

var current_page;
var just_pages;
var menu_pages;
var data;


// Resize <main> to fit children;
function scaleMain(selector) {
    var objHeight = $(selector).height();
    $('#main').height(objHeight);
}

// return url parameter value
function param(key) {
	var params = window.location.href.replace(/.*\?/,'').split('&');
	
	for (i=0; i<params.length; i++) {
		x = params[i].split("=");
		if (x[0] == key) {return x[1]}
	}
	console.log(params);
}

// Pages return just the html files (not directories)
function findPages() {
	return $.grep(pages, function(n,i){
		if (/\/layout\.html$/.test(n)) {layouts.push(n)}
		
		return /[\.html|\.md]$/.test(n) && !/\/layout\.html$/.test(n);
	});
}

function findMenus(){
	return $.grep(pages, function(n,i){
		return /\/menus\/.+/.test(n) && !/\/layout\.html$/.test(n);
	});
}

// Return Index of specified menu
function menuIndex(m) {
	return menus.indexOf(m);
}
function mpIndex(m) {
	return menu_pages.indexOf(m);
}


// Parse apache directory listing data... add to pages
function load_pages(url) {
	url = url.replace(/\/$/,''); // Remove trailing slash from starting point url
	pages_count++;
	$.get( url+"/", function( data ) {
		var f;
		var rows = $(data).find('tr');
		for (i = 3; i < rows.length - 1; i++) {
			f = url + '/' + $(rows[i]).find('td a')[0].innerHTML;
			pages.push(f);
			
			// Call directory recursively.
			if (/\/$/.test(f)) { // if file list ends in / then it is a dir
				load_pages(f);
			}
		}
	}).then(function(){
		pages_count--;
		if (pages_count === 0) {
			
			// Stuff to run after menu list is loaded.
			menus = findMenus().sort();
			makemenu();
			just_pages = findPages().sort();
			menu_pages = $.grep(just_pages, function(n,i){return /\/menus\/.+/.test(n)});

			// if there is a splash page then display
			if (pages.indexOf("./pages/splash.html") && !param('page')) {
				$.get("./pages/splash.html",function(data){
					$(".container").before("<div id='splash' style='width:100%; position:absolute;'>"+data+"</div>");
				});
				
				setTimeout(function(){
					$('#splash').fadeOut(2000);
					$('.container').fadeIn(1000);
				},ajaxcms_splash_time);	
				
			} else {
				$('.container').fadeIn(1000)
			}
			
			// Load the page in the params if specified, first menu page otherwise.
			p = param('page');
			console.log("p=" + p);
			if (p) {
				loadPage('./'+p, true);
				current_page = p;
			} else {
				current_page = menu_pages[0];
				// Store the URL of the current page in the history *** for some reason firefox needs this or it will break the splash animation.
				var new_url = base_url+'?page='+current_page.replace(/^\.\//,'');
				window.history.pushState({page: new_url},'test',new_url);
				loadPage(current_page, true); // Load the first page (home page) on init.
			}
		}
	});
}


// Parse apache directory listing data... add to images
function load_images(url) {
	url = url.replace(/\/$/,''); // Remove trailing slash from starting point url
	images_count++;
	$.get( url+"/", function( data ) {
		var f;
		var rows = $(data).find('tr');
		for (i = 3; i < rows.length - 1; i++) {
			f = $(rows[i]).find('td a')[0].innerHTML;
			if (f == 'icon/') { continue; }
			if (f == 'thumb/') { continue; }
			if (f == 'small/') { continue; }
			if (f == 'medium/') { continue; }
			if (f == 'large/') { continue; }
			images.push(url+'/'+f);
			// Call directory recursively.
			if (/\/$/.test(f)) { // if file list ends in / then it is a dir
				load_images(url+'/'+f);
			}
		}
	}).then(function(){
		images_count--;
		if (images_count === 0) {
			// Stuff to run after page list is loaded.	
		}
	});
}

// Parse apache directory listing data... add to themes
function load_themes(url) {
	url = url.replace(/\/$/,''); // Remove trailing slash from starting point url
	images_count++;
	$.get( url, function( data ) {
		var f;
		var rows = $(data).find('tr');
		for (i = 3; i < rows.length - 1; i++) {
			f = $(rows[i]).find('td a')[0].innerHTML;
			// Save only the first level of directories.
			if (/\/$/.test(f)) { // if file list ends in / then it is a dir
				themes.push(f.replace(/\/$/,''));
			}
		}
	}).then(function(){
		var menutext = 
		
			"<ul class=\"nav navbar-nav navbar-right\">" +
				"<li class=\"dropdown\">" + 
					"<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">Themes" +
	        		"<span class=\"caret\"></span></a>" + 
					"<ul class=\"dropdown-menu\">"
	    
	    for (var ii=0; ii<themes.length; ii++) {
	    	if(themes[ii] == "default") {continue}
	    	menutext += "<li><a href=\"?theme="+themes[ii]+"&page=blank.html\">"+themes[ii]+"</a></li>"
	    }    		
	    
	    menutext += "</ul></li></ul>"
    		
    	$('#menu').after(menutext);
	});
}

// Return the url of the first partial-match image.
function imageMatch(s) {
	for (i=0; i<images.length; i++) {
		var re = new RegExp(s,"gi");
		if (re.test(images[i])){return images[i]} 
	}
}

// Return the url of the first partial-match page.
function pageMatch(s) {
	var best_match = "";
	var return_url = "";
	for (i=0; i<just_pages.length; i++) {
		
		var re = new RegExp(s,"gi");
		
		// Best match is shortest filename without directories stripped of headers and footers. 
		if (re.test(just_pages[i])){
			var page_name = just_pages[i].split('/').slice(-1)[0].replace(/^\d+\-/,'').replace(/\..*?$/,'');
			if ((page_name.length < best_match.length) || (best_match.length == 0)) {
				best_match = page_name;
				return_url = just_pages[i]
			}
		} 
	}
	return return_url;
}

// Remove Scripts from strings of html
function removeScripts(text) {
	return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");
}
        

// Do shortcut replacement in page html content.  (links and stuff)
function process_page(sdata) {
	var d; 
	var size;
	
	// If a string is passed in then process the string.  Otherwise process global data variable.
	if (sdata === undefined) {
		d = data;
	} else {
		d = sdata;
	}
	
	// Convert stuff in {{ }} (helpers)
	d = d.replace(/{{.*}}/gi, function myFunction(x){
		var pieces = x.replace(/{{/g,'').replace(/}}/g,'').replace(/&gt;/g,'>').split('|');
		var parts = [];
		var attributes = [];
		var attribute_string = ""
		
		// separate parts and attributes
		for (var i=0; i<pieces.length; i++) {
			if (/=>/.test(pieces[i])){
				attributes.push(pieces[i]);
			} else {
				parts.push(pieces[i]);
			}
		}
		
		// Convert attributes to string attr => value becomes attr='value'
		for (var i=0; i<attributes.length; i++){
			var apieces = attributes[i].split('=>');
			attributes[i] = apieces[0].trim()+"=\""+apieces[1].trim()+"\"";
		}
		attributes_string = attributes.join(" ");

        // Blank - Skip any helpers that contain five sequential spaces.  This is so we can document the helpers format without it being replaced.  HTML merges the spaces.
        if (/\s\s\s\s\s/.test(x)) {
        	return x.replace(/\s+/,' ')
        }
        
        // Remove Blanks
        for (i=0; i < parts.length; i++) {parts[i] = parts[i].trim().toLowerCase()}
        
		// Anchors
		if (parts[0]=='a' && parts.length == 2) {
			return "<a "+attributes_string+" onclick=\"loadPage(\'" + pageMatch(parts[1]) + "\')\">"+parts[1]+"</a>";
		}
		if (parts[0]=='a' && parts.length == 3) {
			return "<a "+attributes_string+" onclick=\"loadPage(\'" + pageMatch(parts[1]) + "\')\">"+parts[2]+"</a>";
		}
		if (parts[0]=='a' && parts.length == 4) {
			return "<a "+attributes_string+" onclick=\"loadPage(\'" + pageMatch(parts[1]) + "\')\" alt=\"" + parts[3] + "\">"+parts[2]+"</a>";
		}
		
		// Images
		if (parts[0]=='i' && parts.length == 2) {
			return "<img "+attributes_string+" src=\"" + imageMatch(parts[1]) + "\" alt=\"" + parts[1] + "\">";
		}
		if (parts[0]=='i' && parts.length == 3) {
			return "<img "+attributes_string+" src=\"" + imageMatch(parts[1]) + "\" alt=\"" + parts[2] + "\">";
		}
		
		// Carousel {{ carousel:speed | image1:alt1:caption1 | image2:alt2:caption2 | image3:alt3:caption3 }}
		if (parts[0].includes('carousel') && parts.length > 2) {
			var idn = Math.floor(rand(9999999999));
			var carousel_images = parts.slice(1);
			var carousel_speed = 5000;
			if (parts[0].split(':').length == 2) {carousel_speed = parseInt(parts[0].split(':')[1])}
			
			// Build the repeating parts of the carousel
			var carousel_indicators = "";
			var slides = "";
			for (ii=0; ii < carousel_images.length; ii++) {
				carousel_indicators += "<li data-target=\"#carousel_"+idn+"\" data-slide-to=\""+ii+"\" class=\""+ (ii==0 ? 'active' : '') +"\"></li>";
				
				var image_parts = carousel_images[ii].split(':');
				var slide_image;
				var slide_caption;
				var slide_alt;
				(image_parts.length > 0) ? slide_image = image_parts[0] : slide_image = "";
				(image_parts.length > 1) ? slide_alt = image_parts[1] : slide_alt = "";
				(image_parts.length > 2) ? slide_caption = image_parts[2] : slide_caption = "";
				slides += 	"<div class=\"item "+ (ii==0 ? 'active' : '') +"\">" +
							"<img src=\""+ imageMatch(slide_image) +"\" alt=\""+ slide_alt  +"\" style='height:100%; width:100%'>" +
							"<div class=\"carousel-caption\">"+slide_caption+"</div></div>";
			}
			
			// Wait a second then start the carousel.
			setTimeout(function(){
				$("#carousel_"+idn).carousel({interval: carousel_speed});	
			},1000);
			
			// Return the Carousel
			return 	"<div "+attributes_string+" id=\"carousel_"+idn+"\" class=\"carousel slide auto\" data-ride=\"carousel\">" +
					"<ol class=\"carousel-indicators\">"+carousel_indicators+"</ol>" +
					"<div class=\"carousel-inner\" role=\"listbox\">" + slides + "</div>" +
					"<a class=\"left carousel-control\" href=\"#carousel_"+idn+"\" role=\"button\" data-slide=\"prev\">" +
					"<span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span><span class=\"sr-only\">Previous</span></a>" +
					"<a class=\"right carousel-control\" href=\"#carousel_"+idn+"\" role=\"button\" data-slide=\"next\">" +
					"<span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span><span class=\"sr-only\">Next</span></a>" +
					"</div>"
		}
		
		// {{filelist | directory}}
		if (parts[0] == 'filelist' && parts.length == 2) {
			var level = 0;
			var rstring = "";
			var list =  $.grep(pages, function(n,i){return (n.indexOf(parts[1]) > -1) && (!/\/layout\.html$/.test(n))}).sort();
			list.shift(); // Don't show the first directory.
			
			// Convert the list to a hash with the name and the url
			for (var i = 0; i < list.length; i++) {
				var fname = list[i].replace(/\/$/,'')
				fname = fname.split("/")[fname.split("/").length-1];
				fname = fname.replace(/\.md$|\.html$/,'').replace(/^\//,'').replace(/\/$/,'');
				fname = fname.replace(/\d+-/,'');
				fname = fname.replace(/_/g,' ')
				list[i] = {name: fname,url: list[i].replace(/\/$/,'')}
			}
			
			// Remove any empty strings that are left in the list
			list = $.grep(list, function(n,i){return n.name != ""});
			
			var rootList = $("<ul>")
		    var elements = {};
		    $.each(list, function() {
		        var parent = elements[this.url.substr(0, this.url.lastIndexOf("/"))];
		        var list = parent ? parent.children("ul") : rootList;
		        if (!list.length) {
		            list = $("<ul>").appendTo(parent);
		        }
		        var item = $("<li>").appendTo(list);
		        if (!/\.html|\.md/.test(this.url)) {
		        	$("<a>").attr("href", "#").attr('class','folder').text(this.name).appendTo(item);	
		        } else {
		        	$("<a>").attr("onclick", "loadPage(\""+this.url+"\")").attr('class','file').text(this.name).appendTo(item);
		        }
		        elements[this.url] = item;
		    });
		    
			return "<ul "+attributes_string+" class=\"filelist\">" + rootList.html() + "</ul>";
		}
		
		// {{bloglist | directory | start | stop }}
		if (parts[0] == 'bloglist' && parts.length > 1) {
			// Get all the blog pages
			var blog_list = $.grep(just_pages, function(n,i){return n.toLowerCase().indexOf(parts[1].toLowerCase()) > -1 && /\.html$|\.md$/i.test(n) }).sort().reverse();
			
			// If start and stop are specified then limit blog pages
			var start;
			var stop;
			if (parts[2] != undefined) {start = parseInt(parts[2])}
			if (parts[3] != undefined) {stop = parseInt(parts[3])} else {stop = blog_list.length}
			if (parts.length > 2) {blog_list = blog_list.slice(start,stop);}
			
			// Convert the blog list to a hash with name and date.
			for (var i=0; i< blog_list.length; i++) {
				var blog_name = blog_list[i].split("/").slice(-1)[0].replace(/\.html$|\.md$/gi,'').replace(/_/g," ");
				var blog_date_parts = /(\d+)-(\d+)-(\d+)(-(\d+)-)?/g.exec(blog_name);
				var blog_date;
				if (blog_date_parts != null) { 
					blog_date = new Date(blog_date_parts.slice(1,4).join('/')) 
					blog_name = blog_name.split('-').slice(-1)[0];
				}
				blog_list[i] = {name: blog_name, date: blog_date, url: blog_list[i]}
			}
			
			// Make a li for each blog entry
			var output = "";
			for (var i=0; i < blog_list.length; i++){
				output += "<li class=\"blog_entry\"><a href=\"#\" onclick=\"loadPage('"+blog_list[i].url+"')\">" + blog_list[i].name + "</a></li>"
			}
			
			// Output all the blog entries wrapped in a div and then use javascript to load the contgents of each.
			return "<ul "+attributes_string+" class=\"blog_list\">"+output+"</ul>"
		}
		
		// If all else fails return the original tag.
		return "{{"+pieces.join("|")+"}}"
	});
	
	return d
}

// Do shortcut replacement of helpers that themselves produce other helpers.
function pre_process_page(sdata) {
	var d; 
	var size;
	
	// If a string is passed in then process the string.  Otherwise process global data variable.
	if (sdata === undefined) {
		d = data;
	} else {
		d = sdata;
	}
	
	// Convert stuff in {{ }} (helpers)
	d = d.replace(/{{.*}}/gi, function myFunction(x){
		var original = x;
		var pieces = x.replace(/{{/g,'').replace(/}}/g,'').split('|');
		var parts = [];
		var attributes = [];
		var attribute_string = ""
		
		// separate parts and attributes
		for (var i=0; i<pieces.length; i++) {
			if (/=&gt;/.test(pieces[i])){
				attributes.push(pieces[i]);
			} else {
				parts.push(pieces[i]);
			}
		}
		
		// Convert attributes to string attr => value becomes attr='value'
		for (var i=0; i<attributes.length; i++){
			var apieces = attributes[i].split('=&gt;');
			attributes[i] = apieces[0].trim()+"=\""+apieces[1].trim()+"\"";
		}
		attributes_string = attributes.join(" ");

        // Blank - Skip any helpers that contain five sequential spaces.  This is so we can document the helpers format without it being replaced.  HTML merges the spaces.
        if (/\s\s\s\s\s/.test(x)) {
        	return original;
        }
        
        // Remove Blanks
        for (i=0; i < parts.length; i++) {parts[i] = parts[i].trim().toLowerCase()}
        
		// {{blog | directory | start | stop }}
		if (parts[0] == 'blog' && parts.length > 1) {
			// Get all the blog pages
			var blog_list = $.grep(just_pages, function(n,i){return n.toLowerCase().indexOf(parts[1].toLowerCase()) > -1 && /\.html$|\.md$/i.test(n) }).sort().reverse();
			
			// If start and stop are specified then limit blog pages
			var start;
			var stop;
			if (parts[2] != undefined) {start = parseInt(parts[2])}
			if (parts[3] != undefined) {stop = parseInt(parts[3])} else {stop = blog_list.length}
			if (parts.length > 2) {blog_list = blog_list.slice(start,stop);}
			
			// Convert the blog list to a hash with name and date.
			for (var i=0; i< blog_list.length; i++) {
				var blog_name = blog_list[i].split("/").slice(-1)[0].replace(/\.html$|\.md$/gi,'').replace(/_/g," ");
				var blog_date_parts = /(\d+)-(\d+)-(\d+)(-(\d+)-)?/g.exec(blog_name);
				var blog_date;
				if (blog_date_parts != null) { 
					blog_date = new Date(blog_date_parts.slice(1,4).join('/')) 
					blog_name = blog_name.split('-').slice(-1)[0];
				}
				blog_list[i] = {name: blog_name, date: blog_date, url: blog_list[i]}
			}
			
			// Make a div for each blog entry
			var output = "";
			for (var i=0; i < blog_list.length; i++){
				output += "<div class='blog_entry' data-url='"+blog_list[i].url+"' onclick=\"loadPage('"+blog_list[i].url+"')\">"
				output += "<h1>"+blog_list[i].name+"</h1><time>"+blog_list[i].date.toLocaleDateString()+"</time><div class='blog_content'>\n{{insert | "+blog_list[i].url+" | false}}\n</div></div>"
			}
			
			return "<div "+attributes_string+" class='blog'>\n"+output+"</div>"
		}
		
		// If all else fails return the original tag.
		return original
		
	});
	
	return d
}

function lastLayout(filename) {
	var pieces = filename.split("/")
	for (i=1; i < pieces.length; i++) {
		var name = pieces.slice(0,pieces.length-i).concat(["layout.html"]).join("/")
		if ($.inArray(name, layouts) > -1) { return name }
	}
	
	return pieces.slice(0,-1).concat(["layout.html"]).join("/")
}

function loadInsert(fname,insert_location,allow_scripts,callback) {
	
	console.log(fname);
	$.get(fname,function(insert_contents){
		var layout_url = lastLayout(fname);
		$.get( layout_url )
			.always(function( layout ) {
				
				// Run through markdown if the file ends in .md
				if (/\.md$/.test(fname)){ insert_contents = marked(insert_contents);	}
				
				// If there is a layout then insert the data into the layout
				if (typeof(layout) != "object") {
					insert_contents = layout.replace(/{{content}}/gi, function myFunction(x){
						return insert_contents;
					});
				}
				
				// Strip the scripts if specified
				if (!allow_scripts) {insert_contents = removeScripts(insert_contents);}

				// Insert the contents of each file into data -- invalidate insertion patterns in content of replacement file until async is done.
				// data = data.replace(insert_location,insert_contents.replace(/{{/,'@@@@@').replace(/}}/,'#####'))
				data = data.replace(insert_location,insert_contents) // the above broke blogs... cant't remember why it was there.
								
				// Run Callback if it exists
				if (callback && typeof(callback) === "function") {callback();}	
			});
	});
};

function processInserts(callback) {
	
	var insert_list = data.match(/{{\s{0,4}insert.*?}}/gi); // skip if more than 5 spaces at the beginning for documentation purposes.
	
	// If there are no callbacks then done.
	if (insert_list == null) {callback(); return}
	var rcount = insert_list.length;

	// Load all the files in the insert list
	for (var i=0; i < insert_list.length; i++) {
		var fname =  pageMatch(insert_list[i].replace(/[{}\s]/g,'').split("|")[1]);
		
		var scripts = insert_list[i].replace(/[{}\s]/g,'').split("|")[2];
		if (scripts === undefined || scripts.trim() == 'true') {var allow_scripts = true}
		
		loadInsert(fname, insert_list[i], allow_scripts, function(){
			rcount--;
			
			// Run Callback if it exists
			if (rcount == 0 && callback && typeof(callback) === "function") {
				data = data.replace(/@@@@@/,'{{').replace(/#####/,'}}');
				
				// If there are more inserts in the new version then recurse.
				var more_inserts = data.match(/{{\s*insert.*?}}/gi);
				if (more_inserts) {
					processInserts(function(){
						callback();
					})
				} else {
					callback();
				}
			}
		});
	}
}

// Define functions for load transitions.
function loadPageBasic(data,url) {
	$("main").html( data );
}

function loadPageFade(data,url) {
	$("#b").html( data )
	if (url != "./pages/menus/00-Home.html") {
		$("#undermenu").html("")
	}
	in_transition = true;
	$("#a").hide("fade", { }, 500);
	$("#b").show("fade", { complete: function(){
			$("#b").html( data )
			in_transition = false;
			current_page = url;
			$("#a").html($('#b').html());
			$("#a").show();
			$("#b").hide();
	}}, 500);
}

function loadPageSlide(data,url) {
	
	in_transition = true;
	
	if (menuIndex(url) > menuIndex(current_page)) {
		$("#b").html( data )
		$("#a").hide("slide", { direction: "left"}, 500);
		$("#b").show("slide", { direction: "right", complete: function(){
			in_transition = false;
			current_page = url;
			$("#a").html($('#b').html());
			$("#a").show();
			$("#b").hide();
		}}, 500);
	} else if (menuIndex(url) < menuIndex(current_page) && menuIndex(url) != -1) {
		$("#b").html( data )
		$("#a").hide("slide", { direction: "right"}, 500);
		$("#b").show("slide", { direction: "left", complete: function(){
			in_transition = false;
			current_page = url;
			$("#a").html($('#b').html());
			$("#a").show();
			$("#b").hide();
		}}, 500);
	} else {
		$("#a").hide("fade", { }, 500);
		$("#b").show("fade", { complete: function(){
			  $("#b").html( data )
			  in_transition = false;
			  current_page = url;
			  $("#a").html($('#b').html());
			  $("#a").show();
			  $("#b").hide();
		}}, 500);
	}
		  
}


// Set load_transition variable at top to set transition type for page loads.
function loadPage(url,save) {
	highlightMenu(url);
	
	$.get( url, function(d) {
		var layout_url = lastLayout(url);
		$.get( layout_url )
			.always(function( layout ) {
				
				// If there is a layout then insert the data into the layout
				if (typeof(layout) != "object") {
					data = layout.replace(/{{content}}/gi, function myFunction(x){
						if (/\.md/.test(url)){ d = marked(d); }
						return d;
					});
				} else {
					data = d;
				}
				
				// Process any helpers that themselves produce other helpers (like the blog)
				data = pre_process_page();
				// Filter content through markdown if the file extension is .md
				if (/\.md$/.test(url)){ data = marked(data);}
				// Process any inserts recursively.
				processInserts( function(){
					// --- We are now back from the insert processing. ---
					data = process_page();

					// Render the appropriate page transition effect.
					switch(load_transition) {
						case 'basic':
							loadPageBasic(data,url)
							break;
						case 'slide':
							loadPageSlide(data,url);
							break;
							case 'fade':
								loadPageFade(data,url);
								break;
						default:
							loadPageBasic(data,url);
					}
					
					// Store the URL of the current page in the history 
					if (save == undefined || save == true) {
						var old_url = window.location.href
						var new_url = base_url+'?page='+url.replace(/^\.\//,'');
						window.history.pushState({page: new_url},'test',new_url);
					}
					
					// Update the body id with the name of the page (for css)
					ajaxcms_page_id = url.replace(/[\s\/\.]/g,'_')
					$('body').attr("id", ajaxcms_page_id);
					
					//Google Analytics
					this_parts = url.split('/')
					this_page = this_parts[this_parts.length-1].replace(/\..*$/g,'').replace(/^\d+-/g,'')
					$('title').html(this_page)

					//ga('send', 'pageview', location.href)
					
				});			
			});
	});
};

function fileToClass(n){
	return n.replace(/\/$/,'').replace(/[\.|\\|\/|\s]/g,'-');
}

function highlightMenu(fn) {
	var c = fn;
	if (fn.split('/').length > 4){ c = fn.split('/').slice(0,4).join('/');}
	
    c = fileToClass(c);
	$('#menu li').removeClass('active');
	$('.'+c).addClass('active');
}

// Put the pages in the menu (can only be two levels deep)
function makemenu() {
    $.each(menus, function(index,file){
    	if (file.split("/").length < 6) { // Only go two levels deep in the menu structure.
    	
	    	var filename = file;
	    	filename = filename.replace(/\.\/pages\/menus\//,'');   // Remove ./pages from beginning
	    	filename = filename.replace(/\d+\-/,'');       			// Remove any digits followed by a dash at the beginning (use for sort)
	    	filename = filename.replace(/\.html$/,'');     			// Remove .html from end.
	    	filename = filename.replace(/\.md$/,''); 				// Remove .md from end.
			var idname = filename;
			filename = filename.replace(/_/g,' ');					// Replace underscores with spaces.
	    	
	    	classname = fileToClass(file);
	
	    	if (/\/$/.test(filename)) { 
	    		// It is a directory
	    		$('#menu').append(
	    			'<li class="dropdown '+classname+'"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'
	    			+ filename.replace(/\/$/,'')
	    			+ '<span class="caret"></span></a><ul class="dropdown-menu" id="'+idname+'"></ul></li>'
	    		);
	    	} else {
	    		// It is a file
	    		var parts = idname.split('/');
	    		if (parts.length > 1) {
	    			$('#'+parts[0]+'\\\/').append('<li class="file '+classname+'"><a onclick="loadPage(\''+file.replace(/\//g,'\\\/')+'\');">'+parts[1].replace(/\d+\-/,'').replace(/_/g,' ')+'</a></li>');
	    		} else {
					$('#menu').append('<li class="file '+classname+'"><a onclick="loadPage(\''+file.replace(/\//g,'\\\/')+'\');">'+filename+'</a></li>');
	    		}
	    	}
    	}
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// When the page is loaded.
$( document ).ready(function() {
	
	// Get the directory listings.
	load_images('./images');
	load_pages('./pages');
	
	if (ajaxcms_themes_menu) {load_themes('./themes');}
	
    // Home on Brand Click
    $('.navbar-brand').click(function(){
    	current_page = menu_pages[0];
		loadPage(current_page, true);
    });
    
    // Setup Swipe Events
	$("#a").on("swiperight",function(event){
		if (mpIndex(current_page) > 0  && !in_transition){
			loadPage(menu_pages[mpIndex(current_page)-1],true);
		}
	});
	$("#a").on("swipeleft",function(event){
		if (mpIndex(current_page) < menu_pages.length && !in_transition){
			loadPage(menu_pages[mpIndex(current_page)+1],true);
		}
	});
	
	// Back button clicked
	$(window).on("popstate", function(e) {
		page = e.originalEvent.state.page
	    loadPage('./' + /(.*)\?page\=(.*)/.exec(page)[2],false); // the part after the ?page=
	});
	
	// Detect keypress
	$(function(){
    	$('html').keydown(function(e){
        
	        // left key
	        if (e.keyCode == 39 && !in_transition) {
	        	if (mpIndex(current_page) < menu_pages.length){
					loadPage(menu_pages[mpIndex(current_page)+1],true);
	        	}
			}
	        
	        // right key
	        if (e.keyCode == 37 && !in_transition) {
	        	if (mpIndex(current_page) > 0){
					loadPage(menu_pages[mpIndex(current_page)-1],true);
	        	}
			}
	    });
    
	});
	
	// Fix background glitch on mobile devices when address bar hides / unhides.
	$('#background').height(jQuery(window).height() + 120);
	window.onresize = function(){$('#background').height(jQuery(window).height() + 120)}; // not sure uf this works on iphone may need to use orientationchange event.
});