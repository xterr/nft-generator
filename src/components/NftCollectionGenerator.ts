import { Chance } from 'chance';
import * as debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { NftCollectionGeneratorInterface } from '../interfaces/components';

import { CollectionMetadataType, LayerConfigurationType } from '../types/types';
import { Layer, LayerElement, Nft, NftCollection } from './index';

const log = debug('NftCollectionGenerator');

export default class NftCollectionGenerator implements NftCollectionGeneratorInterface {
  public generate(inputDir: string, metadata: CollectionMetadataType): NftCollection {
    let currentIndex = metadata.startNumber;
    const oNftCollection = new NftCollection();

    for (const layerConfiguration of metadata.layersConfiguration) {
      const aLayers = this._generateLayers(layerConfiguration, path.join(inputDir, metadata.directories.layers));

      while (currentIndex <= layerConfiguration.growEditionSizeTo) {
        const aElements = this._pickElements(aLayers);

        log(`Generating NFT #${ currentIndex }`);

        const oNft = new Nft()
          .setName(metadata.itemName.replace('{itemIndex}', currentIndex.toString()))
          .setEdition(currentIndex)
          .setDescription(metadata.description)
          .setElements(aElements)
          .setCreatedAt(new Date())
        ;

        oNftCollection.addNft(oNft);

        currentIndex++;
      }
    }

    return oNftCollection;

    // log(`Generating image for nft #${ currentIndex }`);
    //
    // await this._imageGenerator.generate(
    //   oNft,
    //   path.join(this._outputDir, 'images', `${ currentIndex }.png`),
    // );
    //
    // log(`Generating metadata for nft #${ currentIndex }`);
    // await this._metadataGenerator.generate(
    //   oNft,
    //   path.join(this._outputDir, 'json', `${ currentIndex }.json`),
    // );

    // this._generateCollectionMetadata(oNftCollection);
  }

  private _pickElements(layers: Layer[]): LayerElement[] {
    const aElements = [];
    const chance = new Chance();

    for (const layer of layers) {
      const elementsArray = Array.from(layer.getElements());
      aElements.push(chance.weighted<LayerElement>(
        elementsArray,
        elementsArray.map(element => element.getWeight()),
      ));
    }

    return aElements;
  }

  private _generateLayers(layerConfiguration: LayerConfigurationType, layersDir: string): Layer[] {
    const aLayers = [];

    for (const layer of layerConfiguration.layersOrder) {
      log(`Generating Layer ${ layer.name }`);

      const oLayer =
        new Layer()
          .setName(layer.name)
          .setDisplayName(layer.displayName || '')
          .setOpacity(layer.opacity || 1)
      ;

      const layerName = oLayer.getName();
      if (layerName === null) {
        throw new Error('Layer name is not configured');
      }

      const layerPath = path.join(layersDir, layerName);

      fs
        .readdirSync(layerPath)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .forEach((item, index) => {
          const oLayerElement = new LayerElement();
          oLayerElement.setId(index);
          oLayerElement.setPath(path.join(layerPath, item));

          oLayer.addElement(oLayerElement);
        })
      ;

      aLayers.push(oLayer);
    }

    return aLayers;
  }
}
