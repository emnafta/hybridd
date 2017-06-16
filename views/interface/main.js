// generates json login package
//
// (c)2016 metasync r&d / internet of coins
 
viewname = 'interface';
viewtarget = '#hy_frame > .main';

fs = require('fs');
lzma = require('../../lib/crypto/lz-string');

function addscript(file) {
  output = '<script>';
  output += fs.readFileSync(file);
  output += '</script>';
  return output;
}

function addsvg(file,index) {
  return 'svg["'+index+'"]=\''+String(fs.readFileSync(file)).replace(/\n/g," ")+'\';';
}

hy_content = ''; // variable to hold package content

// CSS
hy_content += '<style>';
hy_content += fs.readFileSync('./css/spinner.css');		// Spinner for loading screens in CSS
// DEPRECATED: already included in login -> hy_content += fs.readFileSync('./css/purecss.css');		// PureCSS
hy_content += fs.readFileSync('./css/modal.css');		// CSS based modal boxes
hy_content += fs.readFileSync('./css/style.css');		// custom styling for Internet of Coins
hy_content += '</style>';

// JS
//hy_content += addscript('../../lib/underscore.js');	// underscore library
hy_content += addscript('../../lib/crypto/urlbase64.js');	// URL safe base 64 encoding
hy_content += addscript('../../lib/crypto/decimal-light.js');	// arbitrary length decimals
hy_content += addscript('../../lib/crypto/hex2dec.js');	// arbitrary length decimals

hy_content += '<script>';
hy_content += 'pass_args = {};';
hy_content += 'init.interface = function(args) {';
hy_content += 'pass_args = args;';							        // pass args along DOM to toplevel buttons
hy_content += "fetchview('interface.dashboard',args);";	// default: fetch dashboard view (pass session variables)
hy_content += fs.readFileSync('./js/globalobjects.js');	// global objects/functions
hy_content += fs.readFileSync('./js/topmenu.js');			  // responsive top menu
hy_content += fs.readFileSync('./js/hybriddcall.js');		// autonomous calls to hybridd
hy_content += '}'+"\n";
hy_content += fs.readFileSync('./js/topmenuset.js');	// resets state of top menu
hy_content += '</script>';

hy_content += addscript('./js/modal.js');           // pretty modal boxes
hy_content += addscript('./js/clipboard.js');       // copy-to-clipboard functionality
// SVG
hy_content += '<script>';
hy_content += 'svg={};';
hy_content += addsvg('./svg/cogs.svg','cogs');
hy_content += '</script>';

// load in the page elements *after* Javascript insertion
hy_content += fs.readFileSync('./'+viewname+'.html');

// encode hy_content using LZMA (file testing shows URL-safe coding uses 10% less kB)
lzma_result = lzma.compressToEncodedURIComponent(hy_content);

// sign LZMA string using server pubkey (or central package signing key?)


// put it all in json key-values
hy_json = { 'info' : 'compressed view', 'target':viewtarget, 'pack' : lzma_result };

// create login.json, use LastModified flag of server for caching???)
fs.writeFileSync('../'+viewname+'.json',JSON.stringify(hy_json));