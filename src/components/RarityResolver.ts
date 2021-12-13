import { BigNumber } from 'bignumber.js';
import { NftCollectionTraitAttributes, NftRarityType } from '../types/types';
import { NftCollection } from './index';

export default class RarityResolver {
  public resolve(nftCollection: NftCollection) {
    const collectionSize = nftCollection.getNfts().size;
    const categoryCount: Record<string, number> = {};
    const traitsPerCategoryCount: Record<string, Record<string, number>> = {};

    for (const nft of nftCollection.getNfts().values()) {
      for (const attribute of nft.getAttributes()) {
        if (typeof categoryCount[ attribute.trait_type ] === 'undefined') {
          categoryCount[ attribute.trait_type ] = 0;
        }

        categoryCount[ attribute.trait_type ] += 1;

        if (typeof traitsPerCategoryCount[ attribute.trait_type ] === 'undefined') {
          traitsPerCategoryCount[ attribute.trait_type ] = { [ attribute.value ]: 0 };
        }

        if (typeof traitsPerCategoryCount[ attribute.trait_type ][ attribute.value ] === 'undefined') {
          traitsPerCategoryCount[ attribute.trait_type ][ attribute.value ] = 0;
        }

        traitsPerCategoryCount[ attribute.trait_type ][ attribute.value ] += 1;
      }
    }

    let sumTraitsPerCat = 0;

    Object.keys(traitsPerCategoryCount).forEach((category) => {
      sumTraitsPerCat += Object.keys(traitsPerCategoryCount[ category ]).length;
    });

    const get_avg_trait_per_cat = sumTraitsPerCat / Object.keys(traitsPerCategoryCount).length;

    let traitMap: Record<string, Record<string, NftCollectionTraitAttributes>> = {};

    for (const traitType of Object.keys(categoryCount)) {
      let valueMap = {};

      for (const attribute of Object.keys(traitsPerCategoryCount[ traitType ])) {
        let attributeOccurrence = traitsPerCategoryCount[ traitType ][ attribute ];
        let attributeFrequency = attributeOccurrence / collectionSize;
        let attributeRarity = 1 / attributeFrequency;
        let traitOccurancePercentage = (categoryCount[ traitType ] / collectionSize) * 100;
        let traitFrequency = categoryCount[ traitType ] / collectionSize;
        valueMap = {
          ...valueMap, [ attribute ]: {
            attributeOccurrence,
            attributeFrequency,
            attributeRarity,
            traitOccurance: categoryCount[ traitType ],
            traitFrequency,
            traitOccurancePercentage: parseFloat(traitOccurancePercentage.toString()),
          },
        };
      }
      traitMap = { ...traitMap, [ traitType ]: { ...valueMap } };
    }

    for (const nft of nftCollection.getNfts().values()) {
      let statRarity = new BigNumber(1);
      let avgRarity = 0;
      let rarityScore = 0;
      let rarityScoreNormed = 0;

      const attributes = nft.getAttributes();

      for (const attribute of attributes) {
        traitMap[ attribute.trait_type ][ attribute.value ].attributeRarityNormed = traitMap[ attribute.trait_type ][ attribute.value ].attributeRarity * (get_avg_trait_per_cat / attributes.length);
        avgRarity += traitMap[ attribute.trait_type ][ attribute.value ].attributeFrequency;
        statRarity = statRarity.multipliedBy(traitMap[ attribute.trait_type ][ attribute.value ].attributeFrequency);
        rarityScore += traitMap[ attribute.trait_type ][ attribute.value ].attributeRarity;
        rarityScoreNormed += traitMap[ attribute.trait_type ][ attribute.value ].attributeRarityNormed;
      }

      const rarity: NftRarityType = nft.getRarity() || {};

      rarity.avgRarity = parseFloat((avgRarity / attributes.length).toFixed(6));
      rarity.statRarity = new BigNumber(statRarity.toPrecision(10)).toNumber();
      rarity.rarityScore = parseFloat((rarityScore).toFixed(6));
      rarity.rarityScoreNormed = parseFloat(rarityScoreNormed.toFixed(6));
      rarity.usedTraitsCount = attributes.length;

      nft.setRarity(rarity);
    }

    nftCollection.setMetadata(traitMap);
  }
}
