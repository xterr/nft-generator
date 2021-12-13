import { createCanvas, Image, loadImage } from 'canvas';
import * as debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';

import { Nft, NftCollection } from './index';

const log = debug('ImageGenerator');

export type ImageGeneratorGenerateOptions = {
  width: number,
  height: number,
  smoothing: boolean,
  outputPath: string,
};

export default class ImageGenerator {
  public async generate(nftCollection: NftCollection, options: ImageGeneratorGenerateOptions): Promise<void> {
    for (const nft of nftCollection.getNfts().values()) {
      await this._generateNftImage(nft, options);
    }
  }

  private async _generateNftImage(nft: Nft, options: ImageGeneratorGenerateOptions): Promise<void> {
    log(`Generating image for #${ nft.getEdition() }`);

    const canvas = createCanvas(options.width, options.height);
    const canvasContext = canvas.getContext('2d');
    canvasContext.imageSmoothingEnabled = options.smoothing;

    const aImages = await this._loadImages(nft);

    for (const [ index, element ] of nft.getElements().entries()) {
      canvasContext.globalAlpha = element.getLayer().getOpacity();
      canvasContext.globalCompositeOperation = element.getLayer().getBlend();

      canvasContext.drawImage(
        aImages[ index ],
        0,
        0,
        options.width,
        options.height,
      );
    }

    fs.writeFileSync(path.join(options.outputPath, `${ nft.getEdition() }.png`), canvas.toBuffer('image/png'));
    canvasContext.clearRect(0, 0, options.width, options.height);
  }

  private async _loadImages(nft: Nft): Promise<Image[]> {
    const aPromises = [];

    for (const element of nft.getElements()) {
      const sPath = element.getPath();

      aPromises.push(loadImage(sPath));
    }

    return Promise.all(aPromises);
  }
}
