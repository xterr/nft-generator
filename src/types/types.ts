export enum Network {
  EGLD = 'egld',
}

export type LayerType = {
  name: string,
  displayName?: string,
  opacity?: number,
}

export type LayerConfigurationType = {
  growEditionSizeTo: number,
  layersOrder: Array<LayerType>,
};

export type CollectionMetadataType = {
  itemName: string,
  name: string,
  description: string,
  ipfsBaseUrl: string,
  startNumber: number,
  tags: Array<string>,
  directories: {
    layers: string,
    output: string,
  },
  royalty: number,
  image: {
    smoothing?: boolean,
    width: number,
    height: number,
  },
  layersConfiguration: Array<LayerConfigurationType>
}

export type NftCollectionTraitAttributes = {
  attributeOccurrence: number,
  attributeFrequency: number,
  attributeRarity: number,
  traitOccurance: number,
  traitFrequency: number,
  traitOccurancePercentage: number,
  attributeRarityNormed: number
}

export type NftRarityType = {
  avgRarity: number,
  statRarity: number,
  rarityScore: number,
  rarityScoreNormed: number,
  usedTraitsCount: number,
}

export type NftAttributeType = {
  trait_type: string,
  value: string,
}

export type NftType = {
  // name: string,
  description: string,
  dna: string,
  createdAt: Date,
  attributes: Array<NftAttributeType>,
  compiler: string,
  edition: number,
  rarity: NftRarityType,
}
