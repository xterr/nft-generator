import Ajv, { JSONSchemaType } from 'ajv';
import { CollectionMetadataType } from '../types/types';

export default class CollectionMetadataValidator {
  private _ajv: Ajv;

  constructor() {
    this._ajv = new Ajv({ strictTuples: false });
  }

  public validate(metadata: CollectionMetadataType): CollectionMetadataType {
    const schema: JSONSchemaType<CollectionMetadataType> = {
      type: 'object',
      properties: {
        itemName: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        ipfsBaseUrl: { type: 'string' },
        startNumber: { type: 'integer' },
        tags: {
          type: 'array',
          minItems: 0,
          items: { type: 'string' },
        },
        directories: {
          type: 'object',
          properties: {
            layers: { type: 'string' },
            output: { type: 'string' },
          },
        },
        royalty: { type: 'integer' },
        image: {
          type: 'object',
          properties: {
            smoothing: { type: 'boolean', default: true },
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
        },
        layersConfiguration: {
          type: 'array',
          minItems: 1,
          items: [ {
            type: 'object',
            properties: {
              growEditionSizeTo: { type: 'integer' },
              layersOrder: {
                type: 'array',
                minItems: 1,
                items: [ {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    displayName: { type: 'string' },
                    opacity: { type: 'integer', default: 1 },
                  },
                } ],
              },
            },
          } ],
        },
      },
      required: [ 'name', 'itemName', 'description', 'startNumber', 'directories', 'royalty', 'image', 'layersConfiguration' ],
    };

    const validate = this._ajv.compile(schema);

    if (validate(metadata) === false) {
      throw new Error(`Schema is invalid. Errors: ${ this._ajv.errorsText(validate.errors) }`);
    }

    return metadata;
  }
}
