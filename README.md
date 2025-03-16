# FoldamTree

**FoldamTree** is a Visual Studio Code extension that lets you quickly generate a simple, human-readable folder-file structure of your project. With just a right-click on any folder in the Explorer, you can produce an ASCII tree representation of your folder and file hierarchy!

---

## Features

- **Easy Folder Tree Generation:**  
  Right-click any folder in VS Code, select **FoldamTree: Extract Folder Tree**, and instantly view the structure of that folder in an unsaved text document.
  
- **Clear Visual Representation:**  
  The output displays folder icons and tree connectors so you can easily understand the organization of your project.

- **Sequential Output Files:**  
  Each time you run the command, a new unsaved text file (e.g., `FoldTree-Output1.txt`, `FoldTree-Output2.txt`) is created to keep previous outputs intact.

- **Asynchronous Processing:**  
  The extension uses asynchronous file system calls to ensure responsiveness, even on moderately sized directories.

---

## Installation & Usage

1. **Installation:**
   - **From the Marketplace:**  
     Search for **FoldamTree** in the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) and install it.
   - **For Developers:**  
     Clone the repository, make any desired modifications, and run the extension in Debug mode using VS Code.

2. **Generating a Folder Tree:**
   - Open your project in VS Code.
   - In the Explorer sidebar, right-click the folder you want to analyze.
   - Select **FoldamTree: Extract Folder Tree** from the context menu.
   - A new unsaved text file (named sequentially like `FoldTree-Output1.txt`) will open displaying the tree structure.

3. **Saving the Output:**
   - The generated text file is unsaved by default.
   - If you want to keep the file, press `Ctrl+S` (or `Cmd+S` on macOS) and choose your desired location and file type (plain text is recommended).

---

## Requirements

- **Visual Studio Code:**  
  Version 1.98.0 or higher is required.
- **Node.js:**  
  Needed if you plan to build or extend the project yourself.

---

## Extension Settings

Currently, **FoldamTree** does not provide custom settings through VS Code's settings UI. If you wish to change aspects like recursion depth or formatting, you can do so by modifying the source code.

---

## Known Issues

- Processing very large directories (for example, `node_modules`) may result in slower performance.
- If you experience issues with output or performance, consider reporting them through the project's issue tracker.

---

## Release Notes

### 1.0.0
- Initial release with folder tree generation.
- Added right-click command integration in the Explorer sidebar.
- Implemented sequential naming for output documents.

---

## Contributing

Contributions are welcome!  
If you have suggestions, spot a bug, or want to add new features, please open an issue or create a pull request on the repository.

---

## Contact

For support, feedback, or questions, please contact [arpitmohankar](mailto:arpitmohankar28@gmail.com) or open an issue in the repository.

---

*Happy coding, and enjoy using FoldamTree!*