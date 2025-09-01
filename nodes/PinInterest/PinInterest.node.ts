// File: nodes/PinInterest/PinInterest.node.ts
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';


export class PinInterest implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Pin-Interest',
    name: 'pinInterest',
    icon: 'file:PinInterest.svg',
    group: ['input'],
    version: 1,
    description: 'Work with Pinterest API v5 (boards & pins)',
    defaults: { name: 'Pin-Interest' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'pinInterestOAuth2Api',
        required: true,
        // you can omit displayOptions here; keeping it is harmless
        displayOptions: { show: { authentication: ['oAuth2'] } },
      },
    ],
    properties: [
      // Authentication selector (future-proofing)
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [{ name: 'OAuth2', value: 'oAuth2' }],
        default: 'oAuth2',
      },

      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Board', value: 'board' },
          { name: 'Pin', value: 'pin' },
        ],
        default: 'pin',
      },

      // ----------------------------------
      // Board operations
      // ----------------------------------
      {
        displayName: 'Operation',
        name: 'operation',
        displayOptions: { show: { resource: ['board'] } },
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new board',
            action: 'Create a board',
          },
          {
            name: 'Get Many',
            value: 'getAll',
            description: 'List boards',
            action: 'List boards',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a single board',
            action: 'Get a board',
          },
        ],
        default: 'getAll',
      },

      // Board:create fields
      {
        displayName: 'Name',
        name: 'boardName',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['board'], operation: ['create'] } },
        default: '',
      },
      {
        displayName: 'Description',
        name: 'boardDescription',
        type: 'string',
        displayOptions: { show: { resource: ['board'], operation: ['create'] } },
        default: '',
      },

      // Board:get
      {
        displayName: 'Board ID',
        name: 'boardId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['board'], operation: ['get'] } },
        default: '',
      },

      // Board:getAll
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        description: 'Whether to return all results or only up to a given limit',
        default: false,
        displayOptions: { show: { resource: ['board'], operation: ['getAll'] } },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        description: 'Max number of results to return',
        typeOptions: { minValue: 1},
        default: 50,
        displayOptions: {
          show: { resource: ['board'], operation: ['getAll'], returnAll: [false] },
        },
      },

      // ----------------------------------
      // Pin operations
      // ----------------------------------
      {
        displayName: 'Operation',
        name: 'pinOperation',
        displayOptions: { show: { resource: ['pin'] } },
        type: 'options',
        options: [
          { name: 'Create', value: 'create', description: 'Create a pin' },
          { name: 'Delete', value: 'delete', description: 'Delete a pin' },
          { name: 'Get', value: 'get', description: 'Get a pin' },
          { name: 'Get Many (by Board)', value: 'getMany', description: 'List pins from a board' },
        ],
        default: 'create',
      },

      // Pin:create fields
      {
        displayName: 'Board ID',
        name: 'pinBoardId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['pin'], pinOperation: ['create', 'getMany'] } },
        default: '',
      },
      {
        displayName: 'Title',
        name: 'pinTitle',
        type: 'string',
        displayOptions: { show: { resource: ['pin'], pinOperation: ['create'] } },
        default: '',
      },
      {
        displayName: 'Description',
        name: 'pinDescription',
        type: 'string',
        displayOptions: { show: { resource: ['pin'], pinOperation: ['create'] } },
        default: '',
      },
      {
        displayName: 'Link (Destination URL)',
        name: 'pinLink',
        type: 'string',
        displayOptions: { show: { resource: ['pin'], pinOperation: ['create'] } },
        default: '',
      },
      {
        displayName: 'Media Source',
        name: 'mediaSource',
        type: 'options',
        options: [
          { name: 'Image URL', value: 'imageUrl' },
          { name: 'Binary Property (Image)', value: 'binary' },
          { name: 'Base64 String', value: 'base64' },
        ],
        default: 'imageUrl',
        displayOptions: { show: { resource: ['pin'], pinOperation: ['create'] } },
      },
      {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        required: true,
        displayOptions: {
          show: { resource: ['pin'], pinOperation: ['create'], mediaSource: ['imageUrl'] },
        },
        default: '',
      },
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        placeholder: 'data',
        description: 'Name of the binary property that contains the image',
        required: true,
        displayOptions: {
          show: { resource: ['pin'], pinOperation: ['create'], mediaSource: ['binary'] },
        },
        default: 'data',
      },
      {
        displayName: 'Base64 Image',
        name: 'base64Image',
        type: 'string',
        typeOptions: { rows: 4 },
        required: true,
        displayOptions: {
          show: { resource: ['pin'], pinOperation: ['create'], mediaSource: ['base64'] },
        },
        default: '',
      },

      // Pin:get / delete
      {
        displayName: 'Pin ID',
        name: 'pinId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['pin'], pinOperation: ['get', 'delete'] } },
        default: '',
      },

      // Pin:getMany
      {
        displayName: 'Return All',
        name: 'pinReturnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['pin'], pinOperation: ['getMany'] } },
      },
      {
        displayName: 'Limit',
        name: 'pinLimit',
        type: 'number',
        typeOptions: { minValue: 1},
        default: 50,
        displayOptions: {
          show: { resource: ['pin'], pinOperation: ['getMany'], pinReturnAll: [false] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;

      const request = async (options: any) => {
        const response = await this.helpers.requestOAuth2!.call(
          this,
          'pinInterestOAuth2Api',
          options,
        );
        return response;
      };

      if (resource === 'board') {
        const operation = this.getNodeParameter('operation', i) as string;

        if (operation === 'create') {
          const name = this.getNodeParameter('boardName', i) as string;
          const description = this.getNodeParameter('boardDescription', i, '') as string;

          const body: any = { name };
          if (description) body.description = description;

          const res = await request({
            method: 'POST',
            uri: 'https://api.pinterest.com/v5/boards',
            json: true,
            body,
          });
          returnData.push({ json: res });
        }

        if (operation === 'get') {
          const boardId = this.getNodeParameter('boardId', i) as string;
          const res = await request({
            method: 'GET',
            uri: `https://api.pinterest.com/v5/boards/${boardId}`,
            json: true,
          });
          returnData.push({ json: res });
        }

        if (operation === 'getAll') {
          const returnAll = this.getNodeParameter('returnAll', i) as boolean;
          let url: string | undefined = 'https://api.pinterest.com/v5/boards';
          let collected: any[] = [];
          const limit = this.getNodeParameter('limit', i, 50) as number;
          while (url) {
            const res: any = await request({ method: 'GET', uri: url, json: true });
            collected = collected.concat(res.items ?? res.data ?? []);
            const bookmark = res.bookmark || res.next || undefined;
            url = bookmark
              ? `https://api.pinterest.com/v5/boards?bookmark=${encodeURIComponent(bookmark)}`
              : undefined;
            if (!returnAll && collected.length >= limit) break;
          }
          if (!returnAll) collected = collected.slice(0, limit);
          returnData.push(...collected.map((j) => ({ json: j })));
        }
      }

      if (resource === 'pin') {
        const operation = this.getNodeParameter('pinOperation', i) as string;

        if (operation === 'create') {
          const boardId = this.getNodeParameter('pinBoardId', i) as string;
          const title = this.getNodeParameter('pinTitle', i, '') as string;
          const description = this.getNodeParameter('pinDescription', i, '') as string;
          const link = this.getNodeParameter('pinLink', i, '') as string;
          const mediaSourceMode = this.getNodeParameter('mediaSource', i) as string;

          let media_source: any;
          if (mediaSourceMode === 'imageUrl') {
            const imageUrl = this.getNodeParameter('imageUrl', i) as string;
            media_source = { source_type: 'image_url', url: imageUrl };
          } else if (mediaSourceMode === 'base64') {
            const base64Image = this.getNodeParameter('base64Image', i) as string;
            media_source = {
              source_type: 'image_base64',
              content_type: 'image/jpeg',
              data: base64Image.replace(/^data:[^;]+;base64,/, ''),
            };
          } else {
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
            const binary = items[i].binary?.[binaryPropertyName];
            if (!binary?.data) {
							throw new NodeOperationError(
								this.getNode(),
								`Binary property "${binaryPropertyName}" is missing`,
								{ itemIndex: i },
							);
						}
            media_source = {
              source_type: 'image_base64',
              content_type: binary.mimeType || 'image/jpeg',
              data: binary.data,
            };
          }

          const body: any = { board_id: boardId, media_source };
          if (title) body.title = title;
          if (description) body.description = description;
          if (link) body.link = link;

          const res = await request({
            method: 'POST',
            uri: 'https://api.pinterest.com/v5/pins',
            json: true,
            body,
          });
          returnData.push({ json: res });
        }

        if (operation === 'get') {
          const pinId = this.getNodeParameter('pinId', i) as string;
          const res = await request({
            method: 'GET',
            uri: `https://api.pinterest.com/v5/pins/${pinId}`,
            json: true,
          });
          returnData.push({ json: res });
        }

        if (operation === 'delete') {
          const pinId = this.getNodeParameter('pinId', i) as string;
          await request({ method: 'DELETE', uri: `https://api.pinterest.com/v5/pins/${pinId}`, json: true });
          returnData.push({ json: { success: true, id: pinId } });
        }

        if (operation === 'getMany') {
          const boardId = this.getNodeParameter('pinBoardId', i) as string;
          const returnAll = this.getNodeParameter('pinReturnAll', i) as boolean;
          let collected: any[] = [];
          let url: string | undefined = `https://api.pinterest.com/v5/boards/${boardId}/pins`;
          const limit = this.getNodeParameter('pinLimit', i, 50) as number;
          while (url) {
            const res: any = await request({ method: 'GET', uri: url, json: true });
            collected = collected.concat(res.items ?? res.data ?? []);
            const bookmark = res.bookmark || res.next || undefined;
            url = bookmark
              ? `https://api.pinterest.com/v5/boards/${boardId}/pins?bookmark=${encodeURIComponent(
                  bookmark,
                )}`
              : undefined;
            if (!returnAll && collected.length >= limit) break;
          }
          if (!returnAll) collected = collected.slice(0, limit);
          returnData.push(...collected.map((j) => ({ json: j })));
        }
      }
    }

    return [returnData];
  }
}
