import * as vscode from "vscode";
import * as utilsModule from "../utils";

jest.mock("../utils");

let mockStatusBarItem: {
  text: string;
  tooltip: string;
  show: jest.Mock;
  hide: jest.Mock;
};
let statusBarModule: typeof import("../statusBar");

beforeAll(async () => {
  mockStatusBarItem = {
    text: "",
    tooltip: "",
    show: jest.fn(),
    hide: jest.fn()
  };
  (vscode.window.createStatusBarItem as jest.Mock).mockReturnValue(
    mockStatusBarItem
  );
  statusBarModule = await import("../statusBar");
});

describe("statusBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (
      vscode.window as { activeTextEditor?: { document: { uri: vscode.Uri } } }
    ).activeTextEditor = undefined;
    (
      vscode.window.tabGroups.activeTabGroup as { activeTab?: unknown }
    ).activeTab = undefined;
    mockStatusBarItem.text = "";
    mockStatusBarItem.tooltip = "";
  });

  it("should update status bar with file size when active editor has file URI", () => {
    const mockUri = vscode.Uri.file("/path/to/file.txt");
    (
      vscode.window as { activeTextEditor?: { document: { uri: vscode.Uri } } }
    ).activeTextEditor = {
      document: { uri: mockUri }
    };
    (utilsModule.getFileSize as jest.Mock).mockReturnValue(1024);
    (utilsModule.formatFileSize as jest.Mock).mockReturnValue("1.0K");

    statusBarModule.updateStatusBar();

    expect(utilsModule.getFileSize).toHaveBeenCalledWith("/path/to/file.txt");
    expect(mockStatusBarItem.text).toBe("$(file) 1.0K");
    expect(mockStatusBarItem.tooltip).toBe("File size: 1.0K");
    expect(mockStatusBarItem.show).toHaveBeenCalled();
  });

  it("should hide status bar when no active editor", () => {
    statusBarModule.updateStatusBar();
    expect(mockStatusBarItem.hide).toHaveBeenCalled();
  });
});
