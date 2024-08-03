class TileData {
  id = '';
  terrainColor = '';
  element = null;
  command = '';

  constructor(id, t, e, c) {
    this.id = id;
    this.terrainColor = t;
    this.element = e;
    this.command = c;
  }
}
