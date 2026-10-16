import type {Build, Calculation} from './engine.js';
export interface Snapshot {id: string; title: string; build: Build}
export const STORAGE_KEY: string;
export const MAX_SNAPSHOTS: number;
export function buildKey(build: Build): string;
export function materialCandidate(build: Build, slot: string, material: string): Build;
export function blueprintCandidate(build: Build, gear: string): {build: Build; replacedSlots: string[]};
export function mergeSnapshots(existing: Snapshot[], incoming: Snapshot[]): {snapshots: Snapshot[]; added: number; duplicates: number; overflow: number};
export function restoreSnapshots(raw: string | null): {snapshots: Snapshot[]; discarded: number};
export function applicableStats(build: Build): string[];
export function statDelta(currentBuild: Build, currentResult: Calculation, baselineBuild: Build, baselineResult: Calculation, key: string): number | null;
