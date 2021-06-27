import { AzureRequest } from '@nestjs/azure-func-http';
import { Inject, Injectable } from '@nestjs/common';

import { getClient } from 'durable-functions';
import { IHttpResponse } from 'durable-functions/lib/src/ihttpresponse';
import { from } from 'rxjs';
import { map, switchMapTo, tap } from 'rxjs/operators';

import { ENV } from '@dark-rush-photography/shared-types';
import {
  ActivityOrchestratorType,
  AzureStorageContainerType,
  Env,
} from '@dark-rush-photography/serverless/types';
import {
  AzureStorageProvider,
  UploadImageProvider,
} from '@dark-rush-photography/serverless/data';

@Injectable()
export class UploadImageService {
  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly uploadImageProvider: UploadImageProvider,
    private readonly azureStorageProvider: AzureStorageProvider
  ) {}

  async upload(
    request: AzureRequest,
    image: Express.Multer.File
  ): Promise<IHttpResponse> {
    const client = getClient(request.context);
    const activityUpload = this.uploadImageProvider.validateUpload(
      request,
      image
    );

    return this.azureStorageProvider
      .uploadBufferToBlob$(
        this.env.azureStorageConnectionString,
        AzureStorageContainerType.Private,
        activityUpload.file.buffer,
        this.uploadImageProvider.getBlobPath(activityUpload.media)
      )
      .pipe(
        tap(this.uploadImageProvider.logStart),
        switchMapTo(
          from(
            client.startNew(
              ActivityOrchestratorType.UploadImage,
              undefined,
              this.uploadImageProvider.getOrchestratorInput(
                activityUpload.media
              )
            )
          )
        ),
        tap(this.uploadImageProvider.logOrchestrationStart),
        map((instanceId: string) =>
          client.createCheckStatusResponse(
            request.context.bindingData.req,
            instanceId
          )
        )
      )
      .toPromise();
  }
}
