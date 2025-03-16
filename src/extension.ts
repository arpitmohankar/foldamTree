import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

let fileCounter = 0;
        const BUILD_DIRS = new Set([
            'dist',
            'build',
            'out',
            'output',
            'release',
            'debug',
            'bin',
            'obj',
            'target',
            'public/build',
            '.next',
            '.nuxt'
        ]);
        
        const DEPENDENCY_DIRS = new Set([
            'node_modules',
            'bower_components',
            'jspm_packages',
            'packages',
            'vendor',
            '.pnpm-store',
            '.yarn',
            'venv',
            'virtualenv',
            '__pycache__',
            '.pytest_cache'
        ]);
        
        const VCS_DIRS = new Set([
            '.git',
            '.svn',
            '.hg',
            '.bzr',
            'CVS',
            '.github'
        ]);
        
        const IDE_DIRS = new Set([
            '.idea',
            '.vscode',
            '.vs',
            '.settings',
            '.project',
            '.classpath',
            '.metadata',
            '*.sublime-workspace',
            '.eclipse',
            '.nb-gradle',
            '.DS_Store',
            'Thumbs.db'
        ]);
        
        const CACHE_DIRS = new Set([
            '.cache',
            'tmp',
            'temp',
            '.temp',
            'logs',
            'log',
            '.log',
            'coverage',
            '.nyc_output',
            '.eslintcache',
            '.sass-cache',
            '.gradle',
            '.maven',
            'gradle-app.setting'
        ]);
        
        const FRAMEWORK_DIRS = new Set([
            // React/Next.js
            '.next',
            
            // Angular
            '.angular',
            '.angular-cli.cache',
            
            // Vue
            '.nuxt',
            '.vuepress/dist',
            
            // Ruby/Rails
            'tmp/cache',
            'log/*.log',
            
            // Python
            '__pycache__',
            '*.pyc',
            '*.pyo',
            '*.pyd',
            '.Python',
            
            // Java
            'target/',
            'build/',
            '.gradle/',
            
            // .NET
            'bin/',
            'obj/',
            'Debug/',
            'Release/',
            'packages/'
        ]);


const EXCLUDED_DIRS = new Set([
        ...BUILD_DIRS,
        ...DEPENDENCY_DIRS,
        ...VCS_DIRS,
        ...IDE_DIRS,
        ...CACHE_DIRS,
        ...FRAMEWORK_DIRS
    ]);

const CONFIG = {
    MAX_DEPTH: 10,                    // max folder depth to traverse/scan
    BATCH_SIZE: 1000,                 // no. of files to process in a batch
    EXCLUDED_DIRS: EXCLUDED_DIRS,     //excluded directories/files
    MAX_FILES_PER_DIR: 5000          //per directory file limit
};

export function activate(context: vscode.ExtensionContext) {
let disposable = vscode.commands.registerCommand('foldamTree.helloWorld', async (uri: vscode.Uri) => {
    if (!uri) {
        vscode.window.showErrorMessage('No folder selected!');
        return;
    }

    try {
            //progree bar showing
        await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating folder tree...",
                cancellable: true
            }, async (progress, token) => {
                const folderPath = uri.fsPath;
                const folderName = path.basename(folderPath);
                
                //progress initialization
                progress.report({ increment: 0 });

                // Generate tree with progress tracking
                const treeBody = await generateFolderTreeAsync(
                    folderPath, 
                    '    ', 
                    0,
                    progress,
                    token
                );

                if (token.isCancellationRequested) {
                    return;
                }

                const header = `└── ${folderName}\n`;
                const tree = header + treeBody;

                //showing the output in a new file
                fileCounter++;
                const docName = `FoldTree-Output${fileCounter}.txt`;
                const outputUri = vscode.Uri.parse(`untitled:${docName}`);

                const doc = await vscode.workspace.openTextDocument(outputUri);
                const editor = await vscode.window.showTextDocument(doc, { preview: false });
                
                await editor.edit(editBuilder => {
                    const startPos = new vscode.Position(0, 0);
                    const endPos = new vscode.Position(doc.lineCount, 0);
                    editBuilder.replace(new vscode.Range(startPos, endPos), tree);
                });
            });
        }
    catch (error) {
            vscode.window.showErrorMessage(`Error generating folder tree: ${error}`);
        }
    });
context.subscriptions.push(disposable);
}

async function generateFolderTreeAsync(
    folderPath: string, 
    indent: string = '',
    depth: number = 0,
    progress?: vscode.Progress<{ increment: number }>,
    token?: vscode.CancellationToken
): Promise<string> {
    if (depth > CONFIG.MAX_DEPTH) {
        return `${indent}... (max depth reached)\n`;
    }

    let tree = '';
    try {
        const items = await fs.readdir(folderPath);
        
        //excluded directories/files skipping(change accordingly -arpit)
        const baseName = path.basename(folderPath);
        if (CONFIG.EXCLUDED_DIRS.has(baseName)) {
            return `${indent}... (skipped)\n`;
        }

        // Sort and limit items if necessary(change accordingly -arpit)
        const sortedItems = items.sort();
        const limitedItems = sortedItems.slice(0, CONFIG.MAX_FILES_PER_DIR);

        // Process items in batches
        for (let i = 0; i < limitedItems.length; i++) {
            if (token?.isCancellationRequested) {
                return tree;
            }

            const item = limitedItems[i];
            const isLast = (i === limitedItems.length - 1);
            const pointer = isLast ? '└── ' : '├── ';
            const fullPath = path.join(folderPath, item);

            // Update progress
            if (progress && i % 100 === 0) {
                progress.report({ increment: 1 });
            }

            tree += `${indent}${pointer}${item}\n`;

            try {
                const stat = await fs.stat(fullPath);
                if (stat.isDirectory()) {
                    const newIndent = indent + (isLast ? '    ' : '│   ');
                    tree += await generateFolderTreeAsync(
                        fullPath, 
                        newIndent, 
                        depth + 1,
                        progress,
                        token
                    );
                }
            } catch (err) {
                tree += `${indent} [Error accessing ${item}]\n`;
            }
        }

        //showing indication if items are more than limited set value(change accordingly -arpit)
        if (sortedItems.length > CONFIG.MAX_FILES_PER_DIR) {
            tree += `${indent}... (${sortedItems.length - CONFIG.MAX_FILES_PER_DIR} more items)\n`;
        }
    } catch (error) {
        tree += `${indent}[Error reading directory]\n`;
    }
    return tree;
}

export function deactivate() {}