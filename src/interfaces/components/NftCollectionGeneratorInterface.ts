import { NftCollection } from '../../components';
import { CollectionMetadataType } from '../../types/types';

export default interface NftCollectionGeneratorInterface {
  generate(inputDir: string, metadata: CollectionMetadataType): NftCollection;
}
