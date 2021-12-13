import { NodeCanvasRenderingContext2D } from 'canvas';
import { LayerElement } from './index';

export default class Layer {
  private _name!: string;
  private _displayName!: string;
  private _opacity: number = 1;
  private _blend: NodeCanvasRenderingContext2D['globalCompositeOperation'] = 'source-over';
  private readonly _elements: Set<LayerElement>;

  public constructor() {
    this._elements = new Set();
  }

  public getName(): string {
    return this._name;
  }

  public setName(name: string): this {
    this._name = name;

    return this;
  }

  public getDisplayName(): string {
    return this._displayName;
  }

  public setDisplayName(displayName: string): this {
    this._displayName = displayName;

    return this;
  }

  public getOpacity(): number {
    return this._opacity;
  }

  public setOpacity(opacity: number): this {
    this._opacity = opacity;

    return this;
  }

  public getBlend(): NodeCanvasRenderingContext2D['globalCompositeOperation'] {
    return this._blend;
  }

  public setBlend(blend: NodeCanvasRenderingContext2D['globalCompositeOperation']): this {
    this._blend = blend;

    return this;
  }

  public addElement(element: LayerElement): this {
    if (element.getLayer() === this) {
      return this;
    }

    this._elements.add(element);
    element.setLayer(this);
    return this;
  }

  public getElements(): Set<LayerElement> {
    return this._elements;
  }
}
