const DEBUG = true;
function writeDebug() { console.log(...arguments); };

async function getMiroFrames() {
    const miroFrames = await miro.board.widgets.get({type: 'frame'});
    return miroFrames;
}

async function getPiTemplate() {
    //var piTemplate = (await miro.board.widgets.get({id: '3074457354627908561'}))[0];
    const piTemplates = await miro.board.widgets.get({type: 'frame', title: 'Program Increment Template'});
    const piTemplate = piTemplates[0];
    return piTemplate;
}

async function getBacklogTemplate() {
    //var backlogItemTemplate = (await miro.board.widgets.get({id: '3074457354628060844'}))[0];
    const backlogItemTemplates = await miro.board.widgets.get({type: 'frame', title: 'Backlog Item Template'});
    const backlogItemTemplate = backlogItemTemplates[0];
    return backlogItemTemplate
}

async function markTemplates() {
    backlogItemTemplate.metadata['isTemplate'] = true;
    backlogItemTemplate.metadata['isBacklogItem'] = true;
    piTemplate.metadata['isTemplate'] = true;
}

async function markBacklogItems() {
    var backlogItems = await miro.board.widgets.get({type: 'frame', title: ''});
    for (var i = 0; i < backlogItems.length; i++) {
        backlogItems[i].metadata['isBacklogItem'] = true;
    }
}

async function getBacklogItems() {
    const backlogItems = await miro.board.widgets.get({type: 'frame', title: ''});
    return backlogItems;

    // const backlogItems = [];
    // for (var i = 0; i < miroFrames.length; i++) {
    //     var miroFrame = miroFrames[i];
    //     if (miroFrame.metadata.isBacklogItem && !miroFrame.metadata.isTemplate) {
    //         backlogItems.push(miroFrame);
    //     }
    // }
    // return backlogItems;
}

async function load() {
    var miroFrames = await getMiroFrames();
    writeDebug('miroFrames', miroFrames);

    var piTemplate = await getPiTemplate();
    writeDebug("piTemplates:", piTemplate);

    var backlogItemTemplate = await getBacklogTemplate();
    writeDebug('backlogItemTemplate:', backlogItemTemplate);

    var backlogItems = await getBacklogItems();
    writeDebug('backlogItems:', backlogItems);
}
var backlogItems = await getBacklogItems();
writeDebug('backlogItems:', backlogItems);

async function getWidgets(backlogItem) {
    let widgets = [];
    for (var i = 0; i < backlogItem.childrenIds.length; i++) {
        widgets.push((await miro.board.widgets.get({id: backlogItem.childrenIds[i]}))[0]);
    }
    return widgets;
};

function getTitle(widgets) {
    return _.first(widgets, w => w.type == "CARD" && w.style.backgroundColor != "#cee741");
}
var title = getTitle(widgets);

var cards = _.filter(widgets, w => w.type == "CARD");

var t2 = await backlogItems.map(async bi => getTitle(await getWidgets(bi)))[2];

var c = (await miro.board.selection.get())[0]
await miro.board.widgets.update({id: c.id, width: title.width});

var subTaskColor = "#cee741";
var descriptionColor = "#0ca789";
var estimationColor = "#12cdd4";
var dependencyColor = "#be88c7";
var acceptanceCriteriaColor = "#d5f692";
var riskColor = "#f16c7f";
var outOfScopeColor = "#6cd8fa";
var niceToHaveColor = "#ffcee0";
var scenarioColor = "#93d275";
var hintColor = "#fff9b1";
var contactPersonColor = "#a6ccf5";

async function getSelectedBacklogItem() {
    var result = {
        title: "",
        context: "",
        description: "",
        estimation: null,
        subTasks: [],
        acceptanceCriterias: [],
        dependecies: [],
        risks: [],
        outOfScope: [],
        niceToHave: [],
        scenarios: [],
        hints: [],
        contactPersons: []
    };

    var frame = (await miro.board.selection.get())[0];
    for (var i = 0; i < frame.childrenIds.length; i++) {
        var widget = (await miro.board.widgets.get({id: frame.childrenIds[i]}))[0];
        if (widget.type == "CARD" && widget.style.backgroundColor != subTaskColor) {
            result.title = widget.title;
            result.context = widget.description;
        } else if (widget.type == "CARD" && widget.style.backgroundColor == subTaskColor) {
            result.subTasks.push(widget.title);
        } else if (widget.type == "SHAPE" && widget.style.backgroundColor == descriptionColor) {
            result.description = widget.plainText;
        } else if (widget.type == "SHAPE" && widget.style.backgroundColor == estimationColor) {
            result.estimation = Number(widget.plainText);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == acceptanceCriteriaColor) {
            result.acceptanceCriterias.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == dependencyColor) {
            result.dependecies.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == riskColor) {
            result.risks.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == outOfScopeColor) {
            result.outOfScope.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == niceToHaveColor) {
            result.niceToHave.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == scenarioColor) {
            result.scenarios.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == hintColor) {
            result.hints.push(widget.text);
        } else if (widget.type == "STICKER" && widget.style.stickerBackgroundColor == contactPersonColor) {
            result.contactPersons.push(widget.text);
        }
    }

    return result;
}
await getSelectedBacklogItem();
