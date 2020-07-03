//Strings
const CFG_SECTION = "googleSearch";
const CFG_QUERY = "QueryTemplate";
const CMD_ID = "extension.googleSearch";

const vscode = require("vscode");

//Activating Function
function activate(context) {
  const disposable = vscode.commands.registerTextEditorCommand(
    CMD_ID,
    webSearch
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

//Empty Deactivate Function
function deactivate() {}
exports.deactivate = deactivate;

//Function to launch the Search URL in default browser
function webSearch() {
  const selectedText = getSelectedText();
  if (!selectedText) {
    return;
  }
  const uriText = encodeURI(selectedText);
  const googleSearchCfg = vscode.workspace.getConfiguration(CFG_SECTION);
  const queryTemplate = googleSearchCfg.get(CFG_QUERY);
  const query = queryTemplate.replace("%SELECTION%", uriText);
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
}

//getSelectedText creates a URL for search based on the selection
function getSelectedText() {
  const documentText = vscode.window.activeTextEditor.document.getText();
  if (!documentText) {
    return "";
  }
  const activeSelection = vscode.window.activeTextEditor.selection;
  if (activeSelection.isEmpty) {
    return "";
  }
  const selStartoffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.start
  );
  const selEndOffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.end
  );

  let selectedText = documentText.slice(selStartoffset, selEndOffset).trim();
  return selectedText.replace(/\s\s+/g, " ");
}
