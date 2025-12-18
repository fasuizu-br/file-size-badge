import * as vscode from "vscode";
import { formatFileSize, getFileSize } from "./utils";

export const statusBar = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);

const getUri = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor?.document.uri.scheme === "file") {
    return activeEditor.document.uri;
  }
  const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
  if (activeTab?.input instanceof vscode.TabInputText) {
    return activeTab.input.uri;
  }
  if (activeTab?.input instanceof vscode.TabInputTextDiff) {
    return activeTab.input.modified;
  }
  if (activeTab?.input instanceof vscode.TabInputNotebook) {
    return activeTab.input.uri;
  }
  if (activeTab?.input) {
    const input = activeTab.input as { uri?: vscode.Uri };
    if (input.uri instanceof vscode.Uri) {
      return input.uri;
    }
  }
};

export const updateStatusBar = () => {
  const uri = getUri();
  if (!uri || uri.scheme !== "file") {
    statusBar.hide();
    return;
  }
  const fileSize = getFileSize(uri.fsPath);
  if (fileSize === null) {
    statusBar.hide();
    return;
  }
  const formattedFileSize = formatFileSize(fileSize);
  statusBar.text = `$(file) ${formattedFileSize}`;
  statusBar.tooltip = `File size: ${formattedFileSize}`;
  statusBar.show();
};

export const updateStatusBarOnChangeActiveTextEditor =
  vscode.window.onDidChangeActiveTextEditor(updateStatusBar);

export const updateStatusBarOnChangeTabs =
  vscode.window.tabGroups.onDidChangeTabs(() => updateStatusBar());

export const updateStatusBarOnSaveTextDocument =
  vscode.workspace.onDidSaveTextDocument(() => updateStatusBar());
