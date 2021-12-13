import { NftCollection } from '../../components';
import { MetadataGeneratorGenerateOptions } from '../../components/MetadataGenerator';

export default interface MetadataGeneratorInterface {
  generate(nftCollection: NftCollection, options: MetadataGeneratorGenerateOptions): Promise<void>;
}
