/**
 * Created by Jake on 1/3 0003.
 */

function is_nwjs(){
    try{
        return (typeof require('nw.gui') !== "undefined");
    } catch (e){
        return false;
    }
}

if (is_nwjs()) {
    var requireNode = window.requireNode = window.require;
    var require = window.require = undefined;

    var zoomPercent = 120;
    var win = requireNode("nw.gui").Window.get();
    win.zoomLevel = Math.log(zoomPercent/100) / Math.log(1.2);
}
