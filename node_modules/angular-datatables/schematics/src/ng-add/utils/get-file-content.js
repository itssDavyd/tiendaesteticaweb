"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileContent = void 0;
// https://github.com/angular/angular-cli/blob/16.1.x/packages/schematics/angular/utility/test/get-file-content.ts
function getFileContent(tree, path) {
    var fileEntry = tree.get(path);
    if (!fileEntry) {
        throw new Error("The file (".concat(path, ") does not exist."));
    }
    return fileEntry.content.toString();
}
exports.getFileContent = getFileContent;
//# sourceMappingURL=get-file-content.js.map