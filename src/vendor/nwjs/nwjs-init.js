/**
 * Created by Jake on 1/5 0005.
 */

if (is_nwjs()) {

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

    document.body.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        menu.popup(Math.round(ev.x * 1.2), Math.round(ev.y * 1.2));
        console.log(x);
        return false;
    });
}