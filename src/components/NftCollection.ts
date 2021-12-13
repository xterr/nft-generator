import { NftCollectionTraitAttributes } from '../types/types';
import { Nft } from './index';

export default class NftCollection {
  private readonly _collection: Map<string, Nft>;
  private _metadata!: Record<string, Record<string, NftCollectionTraitAttributes>>;

  constructor() {
    this._collection = new Map<string, Nft>();
  }

  public addNft(nft: Nft): void {
    this._collection.set(nft.getName(), nft);
  }

  public getNfts(): Map<string, Nft> {
    return this._collection;
  }

  public getMetadata(): Record<string, Record<string, NftCollectionTraitAttributes>> {
    return this._metadata;
  }

  public setMetadata(metadata: Record<string, Record<string, NftCollectionTraitAttributes>>): this {
    this._metadata = metadata;

    return this;
  }

  public toJson() {
    if (!this._metadata) {
      throw new Error('Metadata is not generated');
    }

    return this._metadata;
  }
}
