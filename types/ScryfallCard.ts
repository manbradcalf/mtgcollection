export interface ScryfallCard {
  object: string;
  _id: string;
  oracleId: string;
  multiverseIds: number[];
  mtgoId: number;
  tcgplayerId: number;
  cardmarketId: number;
  name: string;
  lang: string;
  releasedAt: Date;
  uri: string;
  scryfallUri: string;
  layout: string;
  highresImage: boolean;
  imageStatus: string;
  imageUris: ImageUris;
  manaCost: string;
  cmc: number;
  typeLine: string;
  oracleText: string;
  colors: any[];
  colorIdentity: any[];
  keywords: string[];
  legalities: Legalities;
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set: string;
  setName: string;
  setType: string;
  setUri: string;
  setSearchUri: string;
  scryfallSetUri: string;
  rulingsUri: string;
  printsSearchUri: string;
  collectorNumber: string;
  digital: boolean;
  rarity: string;
  flavorText: string;
  cardBackId: string;
  artist: string;
  artistIds: string[];
  illustrationId: string;
  borderColor: string;
  frame: string;
  fullArt: boolean;
  textless: boolean;
  booster: boolean;
  storySpotlight: boolean;
  edhrecRank: number;
  prices: PricesResponse;
  relatedUris: RelatedUris;
  purchaseUris: PurchaseUris;
  historicalPrices: HistoricalPrices[];
}

export interface MongoCard {
  object: string;
  _id: string;
  oracleId: string;
  multiverseIds: number[];
  mtgoId: number;
  tcgplayerId: number;
  cardmarketId: number;
  name: string;
  lang: string;
  releasedAt: Date;
  uri: string;
  scryfallUri: string;
  layout: string;
  highresImage: boolean;
  imageStatus: string;
  imageUris: ImageUris;
  manaCost: string;
  cmc: number;
  typeLine: string;
  oracleText: string;
  colors: any[];
  colorIdentity: any[];
  keywords: string[];
  legalities: Legalities;
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set: string;
  setName: string;
  setType: string;
  setUri: string;
  setSearchUri: string;
  scryfallSetUri: string;
  rulingsUri: string;
  printsSearchUri: string;
  collectorNumber: string;
  digital: boolean;
  rarity: string;
  flavorText: string;
  cardBackId: string;
  artist: string;
  artistIds: string[];
  illustrationId: string;
  borderColor: string;
  frame: string;
  fullArt: boolean;
  textless: boolean;
  booster: boolean;
  storySpotlight: boolean;
  edhrecRank: number;
  prices: Prices;// so far the only difference between scryfall and mongo cards
  relatedUris: RelatedUris;
  purchaseUris: PurchaseUris;
  historicalPrices: HistoricalPrices[];
}
export interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  artCrop: string;
  borderCrop: string;
}

export interface Legalities {
  standard: string;
  future: string;
  historic: string;
  gladiator: string;
  pioneer: string;
  modern: string;
  legacy: string;
  pauper: string;
  vintage: string;
  penny: string;
  commander: string;
  brawl: string;
  duel: string;
  oldschool: string;
  premodern: string;
}

export interface PricesResponse {
  usd: string;
  usdFoil: string;
  eur: string;
  eurFoil: string;
  tix: string;
}

export interface Prices {
  usd: number;
  usdFoil: number;
  eur: number;
  eurFoil: number;
  tix: number;
}

export class HistoricalPrices {
  constructor(public date: Date, public price: Prices) {}
}

export interface PurchaseUris {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
}

export interface RelatedUris {
  gatherer: string;
  tcgplayerInfiniteArticles: string;
  tcgplayerInfiniteDecks: string;
  edhrec: string;
  mtgtop8: string;
}
