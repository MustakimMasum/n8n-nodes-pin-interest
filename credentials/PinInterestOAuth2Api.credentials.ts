// credentials/PinInterestOAuth2Api.credentials.ts
import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PinInterestOAuth2Api implements ICredentialType {
  name = 'pinInterestOAuth2Api';
  displayName = 'Pin-Interest OAuth2 API';
  documentationUrl = 'https://developers.pinterest.com/docs/api/v5/';
  extends = ['oAuth2Api']; // <- use built-in OAuth2 flow

  properties: INodeProperties[] = [
    // OAuth2 config for the generic oAuth2Api
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://www.pinterest.com/oauth/',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://api.pinterest.com/v5/oauth/token',
    },
    {
      displayName: 'Auth Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: 'response_type=code',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default: 'pins:read pins:write boards:read boards:write user_accounts:read',
      description: 'Space-separated scopes',
    },
  ];
}
