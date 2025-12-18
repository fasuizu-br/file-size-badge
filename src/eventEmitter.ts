import * as vscode from "vscode";

type Uri = vscode.Uri | vscode.Uri[] | undefined;

export const eventEmitter = new vscode.EventEmitter<Uri>();

export const onDidChangeFileDecorations = eventEmitter.event;

export const updateDecorations = (uri?: Uri) => eventEmitter.fire(uri);
