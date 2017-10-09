/*
 * Wire
 * Copyright (C) 2017 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import * as fs from 'fs';
import { dialog } from 'electron';
import * as imageType from 'image-type';

export default function(fileName: string, bytes: Uint8Array) {
  return new Promise((resolve, reject) => {
    let options: Electron.SaveDialogOptions = {};
    let type = imageType(bytes);

    if (fileName) {
      options.defaultPath = fileName;
    }

    if (type && type.ext) {
      options.filters = [
        {name: 'Images', extensions: [type.ext]},
      ];
    }

    dialog.showSaveDialog(options, (chosenPath: string) => {
      if (chosenPath === undefined) {
        return reject('No path specified');
      }
      fs.writeFile(chosenPath, new Buffer(bytes.buffer), (error: Error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  });
};
