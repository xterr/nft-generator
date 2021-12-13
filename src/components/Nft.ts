import { createHash } from 'crypto';
import { NftAttributeType, NftRarityType, NftType } from '../types/types';
import { LayerElement } from './index';

export default class Nft {
  private _name!: string;
  private _description!: string;
  private _edition!: number;
  private _createdAt!: Date;
  private _elements: LayerElement[] = [];
  private _attributes: Array<{ trait_type: string, value: string }> | null = null;
  private _rarity!: NftRarityType;

  public getName(): string {
    return this._name;
  }

  public setName(name: string): this {
    this._name = name;

    return this;
  }

  public getDna(): string {
    const parts = [];

    for (const element of this.getElements()) {
      parts.push(`${ element.getId() }:${ element.getFilename() }`);
    }

    return createHash('sha1').update(parts.join('-')).digest('hex');
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public setCreatedAt(createdAt: Date): this {
    this._createdAt = createdAt;

    return this;
  }

  public getDescription(): string {
    return this._description;
  }

  public setDescription(description: string): this {
    this._description = description;

    return this;
  }

  public getEdition(): number {
    return this._edition;
  }

  public setEdition(edition: number): this {
    this._edition = edition;

    return this;
  }

  public getElements(): LayerElement[] {
    return this._elements;
  }

  public setElements(elements: LayerElement[]): this {
    this._elements = elements;

    return this;
  }

  public getAttributes(): Array<NftAttributeType> {
    if (this._attributes !== null) {
      return this._attributes;
    }

    this._attributes = [];

    for (const element of this.getElements()) {
      this._attributes.push({
        trait_type: element.getLayer().getName(),
        value: element.getName(),
      });
    }

    return this._attributes;
  }

  public getRarity(): NftRarityType {
    return this._rarity;
  }

  public setRarity(rarity: NftRarityType): this {
    this._rarity = rarity;

    return this;
  }

  public toJson(): NftType {
    return {
      // name: this.getName(),
      description: this.getDescription(),
      dna: this.getDna(),
      attributes: this.getAttributes(),
      createdAt: this.getCreatedAt(),
      compiler: 'Trust Staking',
      rarity: this.getRarity(),
      edition: this.getEdition(),
    };
  }
}
