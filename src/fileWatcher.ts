import * as vscode from "vscode";
import { updateDecorations } from "./eventEmitter";

export const fileWatcher = vscode.workspace.createFileSystemWatcher("**/*");

fileWatcher.onDidCreate(updateDecorations);
fileWatcher.onDidDelete(updateDecorations);
fileWatcher.onDidChange(updateDecorations);
