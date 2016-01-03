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

// Load native UI library
    var gui = requireNode('nw.gui');

// Create an empty menu
    var menu = new gui.Menu();

// Add some items
    menu.append(new gui.MenuItem({ label: 'Item A' }));
    menu.append(new gui.MenuItem({ label: 'Item B' }));
    menu.append(new gui.MenuItem({ type: 'separator' }));
    menu.append(new gui.MenuItem({ label: 'Item C' }));

// Remove one item
    menu.removeAt(1);

// Iterate menu's items
    for (var i = 0; i < menu.items.length; ++i) {
        console.log(menu.items[i]);
    }
}
