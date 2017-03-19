/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function makeDialog(panel, height, width) {
    var d = panel.dialog({
        autoOpen: false,
        height: height,
        width: width,
        modal: true,
        show: { effect: "clip", duration: 500 },
        hide: { effect: "clip", duration: 500 }
    })
    
    return d;
}