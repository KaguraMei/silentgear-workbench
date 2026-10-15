export type Grade = 'NONE' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'MAX';
export interface PartSelection { material: string | null; grade: Grade; star: number }
export interface Build { version: 1; gear: string; wear: number; parts: Record<string, PartSelection> }
export interface Gear { id: string; name: string; part: string; category: string }
export interface Material { id: string; name: string; english: string; color: string; stats: Record<string, Record<string, unknown>>; traits?: Record<string, unknown[]>; availability?: { tier?: number; visible?: boolean; gear_blacklist?: string[] }; harvest_tier?: string; [key: string]: unknown }
export interface TraitResult { id: string; level: number; originalLevel: number; sources: string[]; valid: boolean; reason: string }
export interface PartDetail { slot: string; material: string; synergy: number }
export interface Calculation { build: Build; stats: Record<string, number>; traits: TraitResult[]; inactive: TraitResult[]; parts: PartDetail[]; tier: string; excludedStats: string[]; relevantStats: string[] }
export interface Modifier { op: string; v: number }
declare const engine: {
  gears: Gear[];
  names: Record<string, string>;
  slotNames: Record<string, string>;
  grades: Record<Grade, number>;
  slots(gear: string): string[];
  required(gear: string, slot: string): boolean;
  compatible(material: string | null, gear: string, slot: string): boolean;
  materials(gear: string, slot: string): Material[];
  defaultBuild(gear?: string): Build;
  validate(value: unknown): Build;
  calculate(value: Build): Calculation;
  chain(gear: string): string[];
  is(gear: string, ancestor: string): boolean;
  category(gear: string): string;
  lookup(map: Record<string, unknown> | undefined, stat: string, gear: string): unknown;
  mods(value: unknown): Modifier[];
  compute(modifiers: Modifier[], base?: number): number;
  average(values: number[]): number;
  excludedStats(gear: string): string[];
  relevantStats(gear: string): string[];
  materialCount(gear: string, slot: string): number;
};
export default engine;
