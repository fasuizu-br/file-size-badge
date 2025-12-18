import * as vscode from "vscode";
import { eventEmitter, updateDecorations } from "./eventEmitter";
import { fileWatcher } from "./fileWatcher";
import { provider } from "./provider";
import {
  statusBar,
  updateStatusBar,
  updateStatusBarOnChangeActiveTextEditor,
  updateStatusBarOnChangeTabs,
  updateStatusBarOnSaveTextDocument
} from "./statusBar";

vscode.workspace.onDidChangeWorkspaceFolders(() => updateDecorations());
vscode.workspace.onDidCreateFiles(({ files }) => updateDecorations([...files]));
vscode.workspace.onDidDeleteFiles(({ files }) => updateDecorations([...files]));
vscode.workspace.onDidRenameFiles(({ files }) =>
  updateDecorations([
    ...files.map(({ oldUri }) => oldUri),
    ...files.map(({ newUri }) => newUri)
  ])
);
vscode.workspace.onDidSaveTextDocument(({ uri }) => updateDecorations(uri));
vscode.workspace.onDidOpenTextDocument(({ uri }) => updateDecorations(uri));

export function activate({ subscriptions }: vscode.ExtensionContext) {
  subscriptions.push(
    provider,
    eventEmitter,
    fileWatcher,
    statusBar,
    updateStatusBarOnChangeActiveTextEditor,
    updateStatusBarOnChangeTabs,
    updateStatusBarOnSaveTextDocument
  );
  updateStatusBar();
}

export function deactivate() {}
