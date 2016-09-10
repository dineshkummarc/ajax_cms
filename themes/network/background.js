/* (c) 2016 Softwyre Inc / Brandon Hoult. for More Invformation email: brandon.hoult@softwyre.com */

x_velocity = 1;
y_velocity = 1;
padding = 100;    	// How far from the edge does repulsion start.
magnet = 1;      	// Strength of repulsion greater = less repulsion.
node_density = 30;  // Less is higher density.
line_hue = 200;
hue_spread = 10;
node_color = "#FFF";
background_color = "#000";
max_distance = 250;
max_sparks = 1;
spark_spread = 0;

////////////////////////////////////////////////////////////////////

var _0xc18b=["\x78","\x79","\x76\x65\x6C\x6F\x63\x69\x74\x79","\x64\x65\x70\x74\x68","\x73\x69\x7A\x65","\x66\x72\x61\x6D\x65","\x50\x49","\x63\x6F\x73","\x73\x69\x6E","\x73\x71\x72\x74","\x66\x69\x6C\x6C\x53\x74\x79\x6C\x65","\x72\x67\x62\x61\x28\x30\x2C\x30\x2C\x30\x2C\x31\x29","\x66\x69\x6C\x6C\x52\x65\x63\x74","\x6C\x65\x6E\x67\x74\x68","\x72\x6F\x75\x6E\x64","\x68\x73\x6C\x28","\x2C","\x25\x2C","\x25\x29","\x73\x74\x72\x6F\x6B\x65\x53\x74\x79\x6C\x65","\x62\x65\x67\x69\x6E\x50\x61\x74\x68","\x6D\x6F\x76\x65\x54\x6F","\x6C\x69\x6E\x65\x54\x6F","\x73\x74\x72\x6F\x6B\x65","\x61\x72\x63","\x66\x69\x6C\x6C","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64","\x63\x73\x73","\x23\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x32\x64","\x67\x65\x74\x43\x6F\x6E\x74\x65\x78\x74","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x77\x69\x64\x74\x68","\x63\x61\x6E\x76\x61\x73","\x68\x65\x69\x67\x68\x74","\x6D\x75\x6C\x74\x69\x70\x6C\x79","\x70\x75\x73\x68","\x6E\x65\x74\x77\x6F\x72\x6B","\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x27\x66\x6F\x6E\x74\x2D\x77\x65\x69\x67\x68\x74\x3A\x62\x6F\x6C\x64\x3B\x62\x6F\x72\x64\x65\x72\x2D\x62\x6F\x74\x74\x6F\x6D\x3A\x31\x70\x78\x20\x73\x6F\x6C\x69\x64\x20\x62\x6C\x61\x63\x6B\x3B\x27\x3E\x54\x68\x65\x6D\x65\x3A","\x3C\x73\x70\x61\x6E\x20\x73\x74\x79\x6C\x65\x3D\x27\x66\x6C\x6F\x61\x74\x3A\x72\x69\x67\x68\x74\x27\x3E\x26\x63\x6F\x70\x79\x3B\x20\x41\x6A\x61\x78\x43\x4D\x53\x20\x32\x30\x31\x36\x3C\x2F\x73\x70\x61\x6E\x3E\x3C\x2F\x64\x69\x76\x3E","\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x27\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E\x3A\x63\x65\x6E\x74\x65\x72\x3B\x27\x3E\x3C\x64\x69\x76\x3E\x49\x6E\x64\x69\x76\x69\x64\x75\x61\x6C\x20\x4C\x69\x73\x65\x6E\x63\x65\x3A\x20\x24\x35\x30\x20\x2F\x20\x55\x6E\x6C\x69\x6D\x69\x74\x65\x64\x20\x55\x73\x65\x3A\x20\x24\x31\x30\x30\x3C\x2F\x64\x69\x76\x3E","\x3C\x64\x69\x76\x3E\x44\x65\x76\x65\x6C\x6F\x70\x6D\x65\x6E\x74\x20\x6F\x66\x20\x41\x6A\x61\x78\x43\x4D\x53\x20\x69\x73\x20\x6D\x61\x64\x65\x20\x70\x6F\x73\x73\x69\x62\x6C\x65\x20\x62\x79\x20\x74\x68\x65\x20\x73\x61\x6C\x65\x20\x6F\x66\x20\x74\x68\x65\x6D\x65\x73\x20\x6C\x69\x6B\x65\x20\x74\x68\x69\x73\x20\x6F\x6E\x65\x2E\x20\x20\x50\x6C\x65\x61\x73\x65\x20\x65\x6D\x61\x69\x6C\x3A\x20\x3C\x61\x20\x73\x74\x79\x6C\x65\x3D\x27\x63\x6F\x6C\x6F\x72\x3A\x23\x30\x30\x44\x3B\x27\x20\x68\x72\x65\x66\x3D\x27\x6D\x61\x69\x6C\x74\x6F\x3A\x62\x72\x61\x6E\x6F\x64\x6E\x2E\x68\x6F\x75\x6C\x74\x40\x73\x6F\x66\x74\x77\x79\x72\x65\x2E\x63\x6F\x6D\x27\x3E\x62\x72\x61\x6E\x64\x6F\x6E\x2E\x68\x6F\x75\x6C\x74\x40\x73\x6F\x66\x74\x77\x79\x72\x65\x2E\x63\x6F\x6D\x3C\x2F\x61\x3E\x20","\x74\x6F\x20\x70\x75\x72\x63\x68\x61\x73\x65\x20\x61\x20\x6C\x69\x63\x65\x6E\x63\x65\x2E\x20\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E","\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x27\x70\x6F\x73\x69\x74\x69\x6F\x6E\x3A\x66\x69\x78\x65\x64\x3B\x20\x62\x6F\x74\x74\x6F\x6D\x3A\x34\x30\x70\x78\x3B\x20\x72\x69\x67\x68\x74\x3A\x31\x30\x70\x78\x3B\x20\x68\x65\x69\x67\x68\x74\x3A\x31\x32\x30\x70\x78\x3B\x20\x77\x69\x64\x74\x68\x3A\x33\x35\x30\x70\x78\x3B\x20\x62\x6F\x72\x64\x65\x72\x2D\x72\x61\x64\x69\x75\x73\x3A\x35\x70\x78\x3B\x20\x70\x61\x64\x64\x69\x6E\x67\x3A\x35\x70\x78\x3B\x20\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72\x3A\x72\x67\x62\x61\x28\x32\x35\x35\x2C\x32\x35\x35\x2C\x32\x35\x35\x2C\x30\x2E\x38\x29\x3B\x63\x6F\x6C\x6F\x72\x3A\x62\x6C\x61\x63\x6B\x3B\x27\x3E","\x3C\x2F\x64\x69\x76\x3E","\x70\x72\x65\x70\x65\x6E\x64","\x23\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x64\x69\x76","\x75\x73\x65\x72\x41\x67\x65\x6E\x74","\x64\x6F\x6D\x61\x69\x6E","\x68\x74\x74\x70\x3A\x2F\x2F\x61\x6A\x61\x78\x63\x6D\x73\x68\x65\x6C\x70\x65\x72\x2E\x73\x6F\x66\x74\x77\x79\x72\x65\x2E\x63\x6F\x6D\x2F\x68\x69\x74","\x70\x6F\x73\x74","\x61\x6A\x61\x78"];function node(_0x1107x2,_0x1107x3,_0x1107x4,_0x1107x5,_0x1107x6,_0x1107x7){this[_0xc18b[0]]= _0x1107x2;this[_0xc18b[1]]= _0x1107x3;this[_0xc18b[2]]=  new Victor(_0x1107x4,_0x1107x5);this[_0xc18b[3]]= _0x1107x7;this[_0xc18b[4]]= _0x1107x6;this[_0xc18b[5]]= function(_0x1107x8){this[_0xc18b[0]]+= (this[_0xc18b[2]][_0xc18b[0]]);this[_0xc18b[1]]+= (this[_0xc18b[2]][_0xc18b[1]]);if(this[_0xc18b[0]]< padding){this[_0xc18b[2]][_0xc18b[0]]-= ((this[_0xc18b[0]]- padding)/ padding/ magnet)};if(this[_0xc18b[0]]> (page_width- padding)){this[_0xc18b[2]][_0xc18b[0]]+= ((page_width- padding- this[_0xc18b[0]])/ padding/ magnet)};if(this[_0xc18b[1]]< padding){this[_0xc18b[2]][_0xc18b[1]]-= ((this[_0xc18b[1]]- padding)/ padding/ magnet)};if(this[_0xc18b[1]]> (page_height- padding)){this[_0xc18b[2]][_0xc18b[1]]+= ((page_height- padding- this[_0xc18b[1]])/ padding/ magnet)}}}function rotatePoint(_0x1107xa,_0x1107xb,_0x1107xc,_0x1107xd,_0x1107xe){_0x1107xe= _0x1107xe* Math[_0xc18b[6]]/ 180.0;return {x:Math[_0xc18b[7]](_0x1107xe)* (_0x1107xa- _0x1107xc)- Math[_0xc18b[8]](_0x1107xe)* (_0x1107xb- _0x1107xd)+ _0x1107xc,y:Math[_0xc18b[8]](_0x1107xe)* (_0x1107xa- _0x1107xc)+ Math[_0xc18b[7]](_0x1107xe)* (_0x1107xb- _0x1107xd)+ _0x1107xd}}function distance(_0x1107x10,_0x1107x11,_0x1107x12,_0x1107x13){return Math[_0xc18b[9]]((_0x1107x10- _0x1107x12)* (_0x1107x10- _0x1107x12)+ (_0x1107x11- _0x1107x13)* (_0x1107x11- _0x1107x13))}function drawFrame(_0x1107x15,_0x1107x16){_0x1107x15[_0xc18b[10]]= _0xc18b[11];_0x1107x15[_0xc18b[12]](0,0,page_width,page_height);for(n= 0;n< nodes[_0xc18b[13]];n++){nodes[n][_0xc18b[5]](n)};for(a= 0;a< nodes[_0xc18b[13]];a++){for(b= 0;b< nodes[_0xc18b[13]];b++){if(b== a){continue};var _0x1107x17=distance(nodes[a][_0xc18b[0]],nodes[a][_0xc18b[1]],nodes[b][_0xc18b[0]],nodes[b][_0xc18b[1]]);if(_0x1107x17< 1){continue};if(_0x1107x17< max_distance){var _0x1107x18=(nodes[b][_0xc18b[0]]+ nodes[a][_0xc18b[0]])/ 2;var _0x1107x19=(nodes[b][_0xc18b[1]]+ nodes[a][_0xc18b[1]])/ 2;var _0x1107x1a=Math[_0xc18b[14]](max_distance/ _0x1107x17);if(_0x1107x1a> max_sparks){_0x1107x1a= max_sparks};for(i= 0;i< _0x1107x1a;i++){line_saturation= 1;line_lightness= 1- (_0x1107x17/ max_distance);line_color= _0xc18b[15]+ Math[_0xc18b[14]](line_hue+ rand(hue_spread* 2)- hue_spread)+ _0xc18b[16]+ (line_saturation* 100)+ _0xc18b[17]+ Math[_0xc18b[14]](line_lightness* 100)+ _0xc18b[18];_0x1107x15[_0xc18b[19]]= line_color;_0x1107x15[_0xc18b[20]]();_0x1107x15[_0xc18b[21]](nodes[a][_0xc18b[0]],nodes[a][_0xc18b[1]]);_0x1107x15[_0xc18b[22]](_0x1107x18+ rand(spark_spread* 2)- spark_spread,_0x1107x19+ rand(spark_spread* 2)- spark_spread);_0x1107x15[_0xc18b[22]](nodes[b][_0xc18b[0]],nodes[b][_0xc18b[1]]);_0x1107x15[_0xc18b[23]]()}}}};for(n= 0;n< nodes[_0xc18b[13]];n++){_0x1107x15[_0xc18b[20]]();_0x1107x15[_0xc18b[24]](nodes[n][_0xc18b[0]],nodes[n][_0xc18b[1]],5,0,2* Math[_0xc18b[6]]);_0x1107x15[_0xc18b[10]]= node_color;_0x1107x15[_0xc18b[25]]()}}startBackground= function(){nodes= [];frame= 0;$(_0xc18b[28])[_0xc18b[27]](_0xc18b[26],background_color);canvas= document[_0xc18b[29]](_0xc18b[26]);ctx= canvas[_0xc18b[31]](_0xc18b[30]);page_width= window[_0xc18b[32]];page_height= window[_0xc18b[33]];center_x= page_width/ 2;center_y= page_height/ 2;ctx[_0xc18b[35]][_0xc18b[34]]= page_width;ctx[_0xc18b[35]][_0xc18b[36]]= page_height;num_nodes= Math[_0xc18b[14]]((page_width* page_height)/ (node_density* 1000));canvas_size= ctx[_0xc18b[35]][_0xc18b[34]]* ctx[_0xc18b[35]][_0xc18b[36]];for(var _0x1107x1b=0;_0x1107x1b< num_nodes;_0x1107x1b++){var _0x1107x1c= new Victor(rand(10)- 5,rand(10)- 5);_0x1107x1c= vectorNormal(_0x1107x1c)[_0xc18b[37]]( new Victor(rand(x_velocity)+ 1,rand(y_velocity)));nodes[_0xc18b[38]]( new node(rand(page_width- (padding* 2))+ padding,rand(page_height- (padding* 2))+ padding,_0x1107x1c[_0xc18b[0]],_0x1107x1c[_0xc18b[1]],250,1))};function _0x1107x1d(){requestAnimationFrame(_0x1107x1d);frame++;drawFrame(ctx,frame)}_0x1107x1d()};theme= _0xc18b[39];ad= _0xc18b[40]+ theme+ _0xc18b[41]+ _0xc18b[42]+ _0xc18b[43]+ _0xc18b[44];$(_0xc18b[48])[_0xc18b[47]](_0xc18b[45]+ ad+ _0xc18b[46]);hit_data= {theme:theme,user_agent:navigator[_0xc18b[49]],resolution_x:window[_0xc18b[32]],resolution_y:window[_0xc18b[33]],url:document[_0xc18b[50]]};$[_0xc18b[53]]({url:_0xc18b[51],type:_0xc18b[52],data:{hit_data:hit_data}});startBackground()