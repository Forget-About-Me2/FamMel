/**
 * Global type declarations for window-exposed singletons and functions.
 *
 * All mutable state variables now use proper ES module imports.
 * Only window-level singletons and functions exposed via app.ts remain.
 */

// ============================================================================
// Window-exposed singletons (from app.ts)
// ============================================================================
declare var gameState: any;
declare var gameScreen: any;

// ============================================================================
// Window-only functions (not exported from any module)
// cellphone — local function in yourHome.ts, exposed on window
// GetRequiredElementById — Document prototype extension, exposed on window by app.ts
// ============================================================================
declare function cellphone(): void;
declare function GetRequiredElementById<T extends HTMLElement>(id: string): T;
