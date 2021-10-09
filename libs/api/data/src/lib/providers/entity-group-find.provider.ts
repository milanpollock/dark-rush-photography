import { Injectable } from '@nestjs/common';

import { concatMap, from, Observable, of, pluck, toArray } from 'rxjs';
import { drive_v3 } from 'googleapis';

import {
  findGoogleDriveFolderByName$,
  findGoogleDriveFolders$,
} from '@dark-rush-photography/api/util';

@Injectable()
export class EntityGroupFindProvider {
  findGroupsFromGoogleDriveFolderName$(
    googleDrive: drive_v3.Drive,
    entityFolderName: string,
    googleDriveWebsitesFolderId: string
  ): Observable<string[]> {
    return findGoogleDriveFolderByName$(
      googleDrive,
      entityFolderName,
      googleDriveWebsitesFolderId
    ).pipe(
      concatMap((entityFolder) => {
        if (!entityFolder) return of([]);

        return findGoogleDriveFolders$(googleDrive, entityFolder.id).pipe(
          concatMap((groupFolders) => {
            if (groupFolders.length === 0) return of([]);

            return from(groupFolders).pipe(pluck('name'), toArray<string>());
          })
        );
      })
    );
  }
}
