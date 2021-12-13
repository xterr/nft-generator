import { NftCollection } from '../../components';
import { ImageGeneratorGenerateOptions } from '../../components/ImageGenerator';

export default interface ImageGeneratorInterface {
  generate(nftCollection: NftCollection, options: ImageGeneratorGenerateOptions): Promise<void>;
}
