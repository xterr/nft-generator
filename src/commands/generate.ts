import { Command, flags } from '@oclif/command';
import { IConfig } from '@oclif/config';
import * as debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { CollectionMetadataValidator, ImageGenerator, MetadataGenerator, NftCollectionGenerator } from '../components';
import {
  ImageGeneratorInterface,
  MetadataGeneratorInterface,
  NftCollectionGeneratorInterface,
} from '../interfaces/components';
import { Network } from '../types/types';

const log = debug('app:generate');

export default class Generate extends Command {
  static description = 'Generate NFTs';

  static examples = [
    `$ nft-generator generate <collection_dir>`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f', default: false }),
    network: flags.enum<Network>({ char: 'n', options: Object.values(Network), default: Network.EGLD }),
    verbose: flags.boolean({ char: 'v' }),
  };

  static args = [
    { name: 'collectionDir', required: true, description: 'Directory where the collection metadata is stored' },
  ];

  private _collectionMetadataValidator: CollectionMetadataValidator;
  private _imageGenerator: ImageGeneratorInterface;
  private _nftCollectionGenerator: NftCollectionGeneratorInterface;
  private _metadataGenerator: MetadataGeneratorInterface;

  public constructor(argv: string[], config: IConfig) {
    super(argv, config);

    this._collectionMetadataValidator = new CollectionMetadataValidator();
    this._imageGenerator = new ImageGenerator();
    this._nftCollectionGenerator = new NftCollectionGenerator();
    this._metadataGenerator = new MetadataGenerator();
  }

  public async run() {
    const { args, flags } = this.parse(Generate);

    const collectionDir = path.resolve(args.collectionDir);
    const metadataPath = path.join(collectionDir, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      throw new Error(`No compatible metadata.json found in "${ args.collectionDir }"`);
    }

    const layersDir = path.join(collectionDir, 'layers');
    const buildDir = path.join(collectionDir, 'build');

    this._prepareDirectories(layersDir, buildDir, flags.force);

    const metadata = this._collectionMetadataValidator.validate(require(metadataPath));
    const oNftCollection = this._nftCollectionGenerator.generate(collectionDir, metadata);

    await this._metadataGenerator.generate(oNftCollection, {
      network: flags.network,
      outputPath: path.join(buildDir, 'json'),
    });

    await this._imageGenerator.generate(oNftCollection, {
      width: metadata.image.width,
      height: metadata.image.height,
      smoothing: metadata.image.smoothing || true,
      outputPath: path.join(buildDir, 'images'),
    });
  }

  private _prepareDirectories(layersDir: string, buildDir: string, force = false): void {
    log('Preparing directories');

    if (!fs.existsSync(layersDir)) {
      throw new Error(`Layers directory doesn't exist. (Path: ${ layersDir })`);
    }

    if (fs.existsSync(buildDir)) {
      if (!force) {
        throw new Error('Build directory already exists. Use --force option to clean it');
      }

      log('Emptying output directory');
      fs.rmSync(buildDir, { recursive: true });
    }

    log('Creating needed directories');
    fs.mkdirSync(path.join(buildDir, 'json'), { recursive: true });
    fs.mkdirSync(path.join(buildDir, 'images'), { recursive: true });
  }
}
