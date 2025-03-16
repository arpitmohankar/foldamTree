import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // Register the command which is invoked when right-clicking a folder in Explorer.
    let disposable = vscode.commands.registerCommand('foldamTree.helloWorld', (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No folder selected!');
            return;
        }
        
        const folderPath = uri.fsPath;
        // Generate the folder tree representation.
        const tree = generateFolderTree(folderPath);
        
        // Open a new text document and show the folder tree.
        vscode.workspace.openTextDocument({ content: tree, language: 'plaintext' })
            .then(doc => vscode.window.showTextDocument(doc));
    });

    context.subscriptions.push(disposable);
}

/**
 * Recursively generates an ASCII tree of the folder structure.
 * @param folderPath The full path of the folder.
 * @param indent The current indentation used for nested folders.
 * @returns A string representing the folder tree.
 */
function generateFolderTree(folderPath: string, indent: string = ''): string {
    let tree = '';
    try {
        const items = fs.readdirSync(folderPath);
        // Sort items alphabetically for consistent output.
        items.sort();
        items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const pointer = isLast ? '└── ' : '├── ';
            const fullPath = path.join(folderPath, item);
            tree += `${indent}${pointer}${item}\n`;
            
            // If the item is a folder, recursively generate its tree.
            if (fs.statSync(fullPath).isDirectory()) {
                const newIndent = indent + (isLast ? '    ' : '│   ');
                tree += generateFolderTree(fullPath, newIndent);
            }
        });
    } catch (error) {
        tree += `${indent}[Error reading directory]\n`;
    }
    return tree;
}

export function deactivate() {}