/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ConfigApi,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { PermissionApi } from './PermissionApi';
import {
  AuthorizeRequest,
  AuthorizeResponse,
  PermissionClient,
} from '@backstage/plugin-permission-common';

/**
 * The default implementation of the PermissionApi, which simply initializes a {@link PermissionClient} and calls its
 * authorize method.
 * @public
 */
export class IdentityPermissionApi implements PermissionApi {
  private readonly permissionClient: PermissionClient;

  constructor(
    discoveryApi: DiscoveryApi,
    private readonly identityApi: IdentityApi,
    configApi: ConfigApi,
  ) {
    this.permissionClient = new PermissionClient({
      discoveryApi,
      configApi,
    });
  }

  async authorize(
    requests: Array<AuthorizeRequest>,
  ): Promise<Array<AuthorizeResponse>> {
    return await this.permissionClient.authorize(requests, {
      token: await this.identityApi.getIdToken(),
    });
  }
}
