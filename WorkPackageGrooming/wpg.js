
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