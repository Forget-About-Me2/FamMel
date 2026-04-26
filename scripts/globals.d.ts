/**
 * Global type declarations for window-exposed singletons and functions.
 *
 * All mutable state variables now use proper ES module imports.
 * Only window-level singletons and functions exposed via app.ts remain.
 */

// ============================================================================
// Window-exposed singletons (from app.ts)
// ============================================================================
interface LegacyBridgeGameState {
	isInitialized: boolean;
	IsImagesEnabled: boolean;
	IsStatsVisible: boolean;
	IsMultipleMovesEnabled: boolean;
	IsMovesAutoReset: boolean;
	setAttraction(value: number): void;
	setShyness(value: number): void;
	setIsImagesEnabled(value: number | boolean): void;
	setIsStatsVisible(value: number | boolean): void;
	setIsMultipleMovesEnabled(value: number | boolean): void;
	setIsMovesAutoReset(value: number | boolean): void;
	setDrankChamp(value: number): void;
	setSexActions(value: any): void;
	[key: string]: any;
}

declare var gameState: LegacyBridgeGameState;
declare var runtimeContext: any;
declare var gameScreen: any;

// ============================================================================
// Window-only functions (not exported from any module)
// cellphone — local function in yourHome.ts, exposed on window
// GetRequiredElementById — Document prototype extension, exposed on window by app.ts
// ============================================================================
declare function cellphone(): void;
declare function GetRequiredElementById<T extends HTMLElement>(id: string): T;
declare function setAttraction(value: number): void;
declare function setShyness(value: number): void;

