import * as debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { MetadataGeneratorInterface } from '../interfaces/components';
import { Network } from '../types/types';
import { NftCollection } from './index';
import RarityResolver from './RarityResolver';

const log = debug('MetadataGenerator');

export type MetadataGeneratorGenerateOptions = {
  network: Network,
  outputPath: string,
};

export default class MetadataGenerator implements MetadataGeneratorInterface {
  private _rarityResolver: RarityResolver;

  constructor() {
    this._rarityResolver = new RarityResolver();
  }

  public async generate(nftCollection: NftCollection, options: MetadataGeneratorGenerateOptions): Promise<void> {
    this._rarityResolver.resolve(nftCollection);

    for (const nft of nftCollection.getNfts().values()) {
      log(`Generating json for #${ nft.getEdition() }`);
      fs.writeFileSync(
        path.join(options.outputPath, `${ nft.getEdition() }.json`),
        JSON.stringify(nft.toJson(), null, 2),
      );
    }

    fs.writeFileSync(
      path.join(options.outputPath, 'collection.json'),
      JSON.stringify(nftCollection.toJson(), null, 2),
    );
  }
}
