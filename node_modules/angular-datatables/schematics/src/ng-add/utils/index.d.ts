/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tree } from '@angular-devkit/schematics';
/**
 * This function has been borrowed from:
 * https://github.com/valor-software/ngx-bootstrap/tree/development/schematics/src/utils/index.ts
 *
 * Note: This function accepts an additional parameter `isDevDependency` so we
 * can place a given dependency in the correct dependencies array inside package.json
 */
export declare function addPackageToPackageJson(host: Tree, pkg: string, version: string, isDevDependency?: boolean): boolean;
export declare function addAssetToAngularJson(host: Tree, assetType: string, assetPath: string): boolean;
