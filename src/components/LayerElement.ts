import * as _path from 'path';
import { Layer } from './index';

export default class LayerElement {
  private _id!: number;
  private _name!: string;
  private _filename!: string;
  private _path!: string;
  private _layer!: Layer;
  private _weight: number = 1;
  private _weightDelimiter = '#';

  public getId(): number {
    return this._id;
  }

  public setId(id: number): this {
    this._id = id;
    return this;
  }

  public getLayer(): Layer {
    return this._layer;
  }

  public setLayer(layer: Layer): this {
    this._layer = layer;

    return this;
  }

  public getName(): string {
    return this._name;
  }

  public setName(name: string): this {
    this._name = name;

    return this;
  }

  public getFilename(): string {
    return this._filename;
  }

  public getPath(): string {
    return this._path;
  }

  public setPath(path: string): this {
    this._path = path;
    this._filename = _path.basename(path);

    const nameWithoutExtension = _path.basename(path, _path.extname(path));

    const nameParts = nameWithoutExtension.split('#');

    if (nameParts.length === 2) {
      this._name = nameParts[ 0 ];
      this._weight = parseInt(nameParts[ 1 ], 10);
    } else {
      this._name = nameParts.join('');
    }

    return this;
  }

  public getWeight(): number {
    return this._weight;
  }

  public setWeight(weight: number): this {
    this._weight = weight;

    return this;
  }

  public setWeightDelimiter(weightDelimiter: string): this {
    this._weightDelimiter = weightDelimiter;

    return this;
  }
}
