// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { join } from 'path';
import { readFileSync } from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let subprocess: ChildProcessWithoutNullStreams;
	try {
		subprocess = startPythonEditor(context.extension.extensionPath);
	} catch(error) {
		vscode.window.showInformationMessage(`Failed to start rope's python subprocess ${error}`);
		throw error;
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('rope-python.inline_symbol', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor_data = getCursorData(editor);
			const data = { command: 'create_inline', cursor_data }
			subprocess.stdin.write(JSON.stringify(data) + "\n");
		} else {
			vscode.window.showInformationMessage('No active editor');
		}
	});

	context.subscriptions.push(disposable);
}

function getCursorData(editor: vscode.TextEditor) {
	const document = editor.document;
	const selection = editor.selection;
	const file_path = vscode.workspace.asRelativePath(document.uri.fsPath);

	const startPosition = selection.start;
	const endPosition = selection.end;
	const start_offset = document.offsetAt(startPosition);
	const end_offset = document.offsetAt(endPosition);

	return {
		file_path,
		start_offset,
		end_offset,
	};
}

// This method is called when your extension is deactivated
export function deactivate() { }



function startPythonEditor(extensionPath: string) {
    const pythonDir = join(extensionPath, "python");
	const pythonFilePath = join(pythonDir, 'rope_runner.py');
    const pythonProcess = spawn('poetry', ["run", "python", pythonFilePath], { cwd: pythonDir });

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: "${data}"`);
        vscode.window.showInformationMessage(data);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: "${data}"`);
		vscode.window.showErrorMessage(data);
    });

	const workspace_folder = getCurrentWorkspaceFolder();
	console.log('workspace folder', workspace_folder);
	pythonProcess.stdin.write(JSON.stringify({ command: 'init', workspace_folder }) + "\n");

	return pythonProcess
}


function getCurrentWorkspaceFolder(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }
    return undefined;
}