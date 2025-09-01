import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PinInterestOAuth2Api implements ICredentialType {
  name = 'pinInterestOAuth2Api';
  displayName = 'Pin-Interest OAuth2 API';
  documentationUrl = 'https://developers.pinterest.com/docs/api/v5/';
  properties: INodeProperties[] = [
    {
      displayName: 'OAuth2',
      name: 'oauth2',
      type: 'oauth2',
      default: {
        authorizeUrl: 'https://www.pinterest.com/oauth/',
        tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
        authUrlParameters: 'response_type=code',
        scope: 'pins:read pins:write boards:read boards:write user_accounts:read',
      },
      required: true,
      description: 'Pinterest OAuth2 app credentials',
    },
  ];
}
