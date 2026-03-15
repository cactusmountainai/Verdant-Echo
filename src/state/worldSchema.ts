export enum TileType {
  EMPTY = 'empty',
  CROP = 'crop',
  ROCK = 'rock',
  TREE = 'tree',
}

export enum CropType {
  WHEAT = 'wheat',
  CARROT = 'carrot',
  POTATO = 'potato',
}

export interface FarmTile {
  x: number;
  y: number;
  type: TileType;
  cropType?: CropType;
}

export interface FarmLayout {
  width: number;
  height: number;
  tiles: FarmTile[];
}
