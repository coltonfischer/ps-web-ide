function updateEditorValue(val, visible) {
    try {
        window.ignoreChange = true;
        editor.getSession().setValue(val);
    } finally {
        window.ignoreChange = false;
    }
    if (visible) {
        document.getElementById("editor").style.visibility = "visible";
    } else {
        document.getElementById("editor").style.visibility = "hidden";
    }
}

function sendPostRequest(url, params) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xmlhttp.send(params);
    return xmlhttp;
}

function updateStatus(msg, err) {
    var output = "<span class='fa fa-info-circle'>";
    if (err) {
        output = output + "<font color='red'> " + msg + "</font></span>"
    } else {
        output = output + "<font color='green'> " + msg + "</font></span>"
    }
    w2ui["layout"].content("preview", output);
}

function tabText(text, dirty) {
    if (dirty) {
        return "<i class='fa fa-exclamation' aria-hidden='true'></i> " + text;
    } else {
        return "<i class='fa fa-check' aria-hidden='true'></i> " + text;
    }
}

function saveOpenedProgram() {
    var params = "peoplecode=" + encodeURIComponent(w2ui.layout_main_tabs.get(w2ui.layout_main_tabs.active).pc);
    params = params + "&key=" + encodeURIComponent(w2ui.layout_main_tabs.active);
    w2ui["layout"].lock("main", "", true); //Lock the main conent panel
    var xmlhttp = sendPostRequest(w2ui["sidebar"].get(w2ui.layout_main_tabs.active).saveObject, params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            w2ui["layout"].unlock("main");
            var responseObj = JSON.parse(xmlhttp.responseText);
            if (xmlhttp.status == 200 && xmlhttp.getResponseHeader("Custom-Status") == 200) {
                updateEditorValue(decodeURIComponent(responseObj.peoplecode), true);
                w2ui.layout_main_tabs.get(w2ui.layout_main_tabs.active).text = tabText(w2ui.layout_main_tabs.get(w2ui.layout_main_tabs.active).prettyKey, false);
                w2ui.layout_main_tabs.refresh();
                updateStatus("Saved " + w2ui.sidebar.get(w2ui.layout_main_tabs.active).prettyKey, false);
            } else if (xmlhttp.getResponseHeader("Custom-Status") == 400) {
                editor.setSelectionRangeIndices(responseObj.startPos, responseObj.endPos);
                updateStatus(responseObj.message, true);
            } else {
                alert("Unknown Error Occured");
            }
        }
    };
}

function saveWorkspace() {
    var params = "peoplecode=" + encodeURIComponent(JSON.stringify(window.workspace.value));
    params = params + "&key=" + window.workspace.key;

    w2ui["layout"].lock("main", "", true); //Lock the main conent panel

    var xmlhttp = sendPostRequest(window.workspace.save, params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            w2ui["layout"].unlock("main");
            var responseObj = JSON.parse(xmlhttp.responseText);
            if (xmlhttp.status == 200 && xmlhttp.getResponseHeader("Custom-Status") == 200) {
                updateStatus("Saved Workspace", false);
            } else if (xmlhttp.getResponseHeader("Custom-Status") == 400) {
                updateStatus("Falied to save workspace", true);
            } else {
                alert("Unknown Error Occured");
            }
        }
    };
}

function getWorkspace() {
    var params = "key=" + window.workspace.key;

    w2ui["layout"].lock("main", "", true); //Lock the main conent panel

    var xmlhttp = sendPostRequest(window.workspace.get, params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            w2ui["layout"].unlock("main");
            var responseObj = JSON.parse(xmlhttp.responseText);
            var workspaceJson = JSON.parse(decodeURIComponent(responseObj.peoplecode));
            if (xmlhttp.status == 200 && xmlhttp.getResponseHeader("Custom-Status") == 200) {
                for (var x in workspaceJson) {
                    populateSidebar(workspaceJson[x], true);
                }
            } else {
                window.workspace.value = [];
            }
        }
    };
}

function getProgram(obj) {
    var params = "key=" + encodeURIComponent(obj.id);
    w2ui["layout"].lock("main", "", true); //Lock the main conent panel

    var xmlhttp = sendPostRequest(obj.openObject, params);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            w2ui["layout"].unlock("main");
            var responseObj = JSON.parse(xmlhttp.responseText);
            if (xmlhttp.status == 200 && xmlhttp.getResponseHeader("Custom-Status") == 200) {
                editor.session.setMode(obj.aceMode);
                updateEditorValue(decodeURIComponent(responseObj.peoplecode), true);
                w2ui.layout_main_tabs.add({
                    id: obj.id,
                    prettyKey: obj.prettyKey,
                    closable: true,
                    pc: decodeURIComponent(responseObj.peoplecode)
                });
                w2ui.layout_main_tabs.get(obj.id).text = tabText(obj.prettyKey, false);
                w2ui.layout_main_tabs.select(obj.id);
                updateStatus("", false);
            } else if (xmlhttp.getResponseHeader("Custom-Status") == 400) {
                alert(responseObj.message);
            } else {
                alert("Unknown Error Occured");
            }
        }
    };
}

function populateSidebar(data, init) {
    for (var key in data.progkeys) {
        var p = w2ui["sidebar"].find({
            key: data.objectType
        })[0];
        var prettyKey = p.prettyKey;
        for (var row in data.progkeys[key]) {
            // if the node exists, then skip it
            if (w2ui.sidebar.get(data.progkeys[key][row].val)) {
                p = data.progkeys[key][row].val;
                prettyKey = prettyKey + "." + w2ui.sidebar.get(data.progkeys[key][row].val).text;
                continue;
            }

            var index = (isNaN(data.progkeys[key][row].val.split(":")[data.progkeys[key][row].val.split(":").length - 1]) ? 1 : 3);
            prettyKey = prettyKey + "." + data.progkeys[key][row].val.split(":")[data.progkeys[key][row].val.split(":").length - index];
            // Insert the node
            w2ui.sidebar.insert(p, null, [{
                id: data.progkeys[key][row].val,
                text: data.progkeys[key][row].val.split(":")[data.progkeys[key][row].val.split(":").length - index],
                img: ob[data.objectType].sidebarNode.img,
                key: data.objectType,
                prettyKey: prettyKey,
            }]);
            p = data.progkeys[key][row].val;
        }

        //set the last node as page
        var lastnode = w2ui["sidebar"].get(p);
        lastnode.img = ob[data.objectType].sidebarNode.childInfo.icon;
        lastnode.openObject = ob[data.objectType].sidebarNode.childInfo.openObject;
        lastnode.saveObject = ob[data.objectType].sidebarNode.childInfo.saveObject;
        lastnode.aceMode = ob[data.objectType].sidebarNode.childInfo.aceMode;
        w2ui["sidebar"].refresh(p);

    }
    if (!init) {
        updateStatus("Added " + ob[data.objectType].toolbarItem.text + " to Workspace", false);
    }
    window.workspace.value.push(data);
}

function removeSidebarItem(removeVal) {
    var newData = {};
    newData.progkeys = [];
    newData.objectType = {};
    var newProgkeys = [];
    var newWorkspace = [];
    //data = window.workspace;
    data = window.workspace.value;
    for (var x in data) { //for each unique objectvalue
        newData = {};
        newData.progkeys = [];
        addVal = false;
        for (var key in data[x].progkeys) { //for each program defined for the objectvalue
            keepRow = true;


            for (var row in data[x].progkeys[key]) { // for each sidebar item key for the program
                if (data[x].progkeys[key][row].val == removeVal) {
                    // we dont eant to push data[x].progkeys[key]
                    keepRow = false;
                }
            }
            if (keepRow) {
                newData.status = data[x].status;
                newData.message = data[x].message;
                newData.objectType = data[x].objectType;
                newData.progkeys.push(data[x].progkeys[key]);

                addVal = true;
            }

        }
        if (addVal) {
            newWorkspace.push(newData);
        }

    }
    window.workspace.value = newWorkspace;
}


function openPopup(objtype) {
    if (!w2ui.foo) {
        $("#foo").w2form({
            name: "foo",
            recid: "PanelGroup",
            header: "Select " + objtype.text,
            url: objtype.submit,
            width: 500,
            height: 100,
            showMax: true,
            fields: [{
                field: "Name",
                type: "combo",
                required: true,
                html: {
                    attr: "style='width: 200px'"
                },
                options: {
                    url: objtype.prompt
                }
            }],
            actions: {
                "Add to Workspace": function() {
                    this.validate();
                    this.save(function(data) {
                        populateSidebar(data, false);
                    });
                    w2popup.close();
                }
            }
        });
    }
    // update field object
    w2ui["foo"].header = "Select " + objtype.text;
    w2ui["foo"].url = objtype.submit;
    w2ui["foo"].set("Name", {
        options: {
            url: objtype.prompt
        }
    });
    w2ui["foo"].clear();
    w2ui["foo"].refresh();
    $().w2popup("open", {
        body: "<div id='form' style='width: 100%; height: 100%;'></div>",
        style: "padding: 15px 0px 0px 0px",
        width: 450,
        height: 200,
        onToggle: function(event) {
            $(w2ui.foo.box).hide();
            event.onComplete = function() {
                $(w2ui.foo.box).show();
                w2ui.foo.resize();
            }
        },
        onOpen: function(event) {
            event.onComplete = function() {
                $("#w2ui-popup #form").w2render("foo");
            }
        }
    });
}

/*--------------------------------------------------------------- Begin Creating W2UI Layout ----------------------------------------------------------*/
/* Create the four panel layout */
var pstyle = "border: 1px solid #dfdfdf; padding: 5px;";
$("#layout").w2layout({
    name: "layout",
    panels: [{
            type: "top",
            size: 40,
            style: pstyle,
            content: "top"
        },
        {
            type: "left",
            size: 300,
            resizable: true,
            style: pstyle
        },
        {
            type: "preview",
            size: "35",
            resizable: true,
            style: pstyle,
            content: ""
        },
        {
            type: "main",
            style: pstyle,
            content: "",
            tabs: {
                tabs: [],
                onClick: function(event) {
                    this.select(event.target);
                    editor.session.setMode(w2ui["sidebar"].get(event.target).aceMode);
                    updateEditorValue(w2ui.layout_main_tabs.get(event.target).pc, true);
                },
                onClose: function(event) {
                    if (event.target != this.active) {
                        return;
                    }
                    if (w2ui.layout_main_tabs.tabs.length - 1 == 0) {
                        updateEditorValue("", false);
                        return;
                    }
                    if (w2ui.layout_main_tabs.tabs[w2ui.layout_main_tabs.tabs.length - 1].id != event.target) {
                        this.click(w2ui.layout_main_tabs.tabs[w2ui.layout_main_tabs.tabs.length - 1].id);
                        return;
                    }
                    this.click(w2ui.layout_main_tabs.tabs[0].id);
                }
            }

        }
    ]
});

var sidebarNodes = [];
for (var x in ob) {
    sidebarNodes.push(ob[x].sidebarNode);
}

// Define the left panel side bar
w2ui["layout"].content("left", $().w2sidebar({
    name: "sidebar",
    img: null,
    menu: [{
        id: "remove",
        text: "Remove"
    }],
    nodes: sidebarNodes,

    onMenuClick: function(event) {
        w2ui["sidebar"].remove(event.target);
        removeSidebarItem(event.target);
    },
    onDblClick: function(event) {
        if (!event.object.openObject) {
            return;
        }
        if (w2ui.layout_main_tabs.get(event.target)) {
            // PeopleCode is already loaded, use local copy of code
            w2ui.layout_main_tabs.click(event.target);
            return;
        }
        //no local peoplecode, get peoplecode from server
        getProgram(event.object);
    }
}));

var toolbarItems = [];
for (var x in ob) {
    toolbarItems.push(ob[x].toolbarItem);
}
// Define the top ToolBar
w2ui["layout"].content("top", $("#toolbar").w2toolbar({
    name: "toolbar",
    items: [{
            type: "menu",
            id: "file",
            text: "File",
            items: [{
                text: "Save Program",
                id: "save",
                icon: "icon-page"
            },{
                text: "Save Workspace",
                id: "saveWk",
                icon: "icon-page"
            }]
        },
        {
            type: "break"
        },
        {
            type: "menu",
            id: "openobj",
            text: "Add to Workspace",
            items: toolbarItems
        }
    ],
    onClick: function(event) {
        if (event.subItem != null) {
            if (event.subItem.id === "save") {
                saveOpenedProgram();
            }
            if (event.subItem.id === "saveWk") {
                saveWorkspace();
            }
            if (event.item.id === "openobj") {
                openPopup(event.subItem);
            }
        }

    }

}));

/*--------------------------------------------------------------- End Creating W2UI Layout ----------------------------------------------------------*/

/* Populate Main Content Panel */
w2ui["layout"].content("main", "<div id='editor' style='visibility: hidden;'></div>");
/* Populate Preview (Bottom) Content Panel */
updateStatus("Welcome", false);
/* Populate Left (Sidebar) Content Panel */
getWorkspace();

window.addEventListener("keydown", function(e) {
    if (e.keyCode == 83 && event.ctrlKey) {
        e.preventDefault();
        w2ui["toolbar"].click("file:save");
    }
    if (e.keyCode == 83 && event.altKey) {
        e.preventDefault();
        saveWorkspace();
    }
});

/* BEGIN JS to initialize the editor and to display the PeopleCode in it */
var editor = ace.edit(document.getElementById("editor"));
//editor.session.setOption("useWorker", false);
editor.$blockScrolling = Infinity;
editor.setShowPrintMargin(false);
editor.getSession().setTabSize(3);
editor.setOptions({
    maxLines: Infinity
});

/* Begin Editor Helper functions for syntax error highlighting */
editor.getLastColumnIndex = function(row) {
    return editor.session.getDocumentLastRowColumnPosition(row, 0).column;
};

editor.getLastColumnIndices = function() {
    var rows = editor.session.getLength();
    var lastColumnIndices = [];
    var lastColIndex = 0;
    for (var i = 0; i < rows; i++) {
        lastColIndex += editor.getLastColumnIndex(i);
        if (i > 0) {
            lastColIndex += 1;
        }
        lastColumnIndices[i] = lastColIndex;
    }
    return lastColumnIndices;
};

editor.getRowColumnIndices = function(characterIndex) {
    var lastColumnIndices = editor.getLastColumnIndices();
    if (characterIndex <= lastColumnIndices[0]) {
        return {
            row: 0,
            column: characterIndex
        };
    }
    var row = 1;
    for (var i = 1; i < lastColumnIndices.length; i++) {
        if (characterIndex > lastColumnIndices[i]) {
            row = i + 1;
        }
    }
    var column = characterIndex - lastColumnIndices[row - 1] - 1;
    return {
        row: row,
        column: column
    };
};

editor.setSelectionRangeIndices = function(start, end, reverse) {
    var startRowColumn = editor.getRowColumnIndices(start);
    var endRowColumn = editor.getRowColumnIndices(end);
    editor.getSession().selection.setSelectionRange({
        start: {
            row: startRowColumn.row,
            column: startRowColumn.column
        },
        end: {
            row: endRowColumn.row,
            column: endRowColumn.column
        }
    }, reverse);
};
/* End Editor Helper functions for syntax error highlighting */

editor.getSession().on("change", function() {
    if (window.ignoreChange) {
        return;
    }
    w2ui.layout_main_tabs.get(w2ui.layout_main_tabs.active).pc = editor.getSession().getValue();
    w2ui.layout_main_tabs.get(w2ui.layout_main_tabs.active).text = tabText(w2ui.layout_main_tabs.get(w2ui.layout_main_tabs.active).prettyKey, true);
    w2ui.layout_main_tabs.refresh();
    updateStatus("", false);
});
