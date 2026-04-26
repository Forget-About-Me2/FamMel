import { gameSettings } from "../settings/gameSettings";
import { ImageType } from "../settings/imageType";
import { BladderLevel } from "../gameState/bladderLevel";
import { runtimeContext } from "../gameState/runtimeContext";
import { randomInt } from "../shims";
import { imageManager } from "./imageManager";
import { nowpeeing, bladder } from "../bladder";

/**
 * Centralized animation controller that updates the picture area based on game state.
 * Uses ImageManager to render either ASCII frames or configured images.
 */
class AnimationManager {
    // ASCII sprite frames
    private readonly asciiFrames: string[] = [
        "<br>    )))  <br>    . .  <br>     -   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
        "<br>    )))  <br>    . ,  <br>     -   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
        "<br>    )))  <br>    . .  <br>     =   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
        "<br>    )))  <br>    . .  <br>     -   <br>   / | \\ <br>   |   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d b  <br>",
        "<br>    )))  <br>    . .  <br>     -   <br>   / | \\ <br>   \\   / <br>     |   <br>    / \\  <br>    | |  <br>    | |  <br>    d d  <br>",
        "<br>    )))  <br>    . .  <br>     p   <br>   / | \\ <br>   |   / <br>     |   <br>    / \\  <br>    | <  <br>    |  d <br>d    <br>",
        "<br>    )))  <br>    o o  <br>     -   <br>   / | \\ <br>   \\   | <br>     |   <br>    / \\  <br>    > |  <br>   b  |  <br>      d  <br>",
        "<br>    )))  <br>    , ,  <br>     o   <br>   / | | <br>   \\  /  <br>     m   <br>    / \\  <br>    | |  <br>    | |  <br>   d  b  <br>",
        "<br>    )))  <br>    > <  <br>     o   <br>   | | \\ <br>   \\   / <br>     m   <br>    / \\  <br>    | |  <br>    | |  <br>   d  b  <br>",
        "<br>    )))  <br>    - -  <br>     o   <br>   \\ | / <br>    \\ /  <br>     X   <br>    / \\  <br>    \\ /  <br>    / \\  <br>   d   b <br>",
        "<br><br>    )))  <br>    n n  <br>     o   <br>   | | \\ <br>    \\   / <br>     m   <br>    / \\  <br>   <> <> <br>   d   b <br>",
        "<br><br>    )))  <br>    - -  <br>     o   <br>   \\ | / <br>    \\ /  <br>     X   <br>    / \\  <br>   <> <> <br>   d   b <br>",
        "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    /.\\  <br>   <>|<> <br>   d . b <br>",
        "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    / \\  <br>   <>.<> <br>   d | b <br>",
        "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    /|\\  <br>   <> <> <br>   d . b <br>",
        "<br><br>    )))  <br>    - -  <br>     o   <br>   | | | <br>   \\   / <br>     X   <br>    /|\\  <br>   <>|<> <br>   d o b <br>"
    ];

    // Loops that decide which ASCII frame to show for each state over 32 ticks
    private readonly asciiLoops = [
        "AAABAAACAAADAAAEAAABAAADAAACAAAE", // Empty (below first urge)
        "AFABAAACAAADAGAEAAABAGADAAACAFAE", // Urge
        "AFGBAIACAAADFGAEAHABAGFDAAACAFGE", // Need
        "AFGBJIACAKADFGAEAHABJGFDAKACLFGE", // Emergency
        "ALJKFGAJKJKLHIFGHIHIKJLJAKJLJGIL"  // Lose or worse
    ];

    private readonly peeingLoop = "MNOPMNOPMNOPMNOPMNOPMNOPMNOPMNOP";
    private readonly alphaDecode = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private readonly maxArtIndex = 31; // 0..31 inclusive (32 steps)

    private artIndex: number = 0;
    private timerId: number | null = null;

    start(): void {
        this.stop();
        this.tick();
    }

    stop(): void {
        if (this.timerId !== null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
    }

    private tick(): void {
        const subject = runtimeContext.Companion;
        const type = gameSettings.ImageSettings.ImageType;
        const isPeeing = subject?.NowPeeing ?? !!nowpeeing;
        const bladderState = subject?.bladderState ?? this.getLegacyBladderState();

        // Compute current ascii frame index
        this.artIndex = (this.artIndex + 1) % (this.maxArtIndex + 1);

        // Render based on the configured image type
        switch (type) {
            case ImageType.Ascii:
                const frameIndex = this.computeFrameIndex(bladderState, isPeeing);
                imageManager.renderAscii(this.asciiFrames[frameIndex]);
                break;
            case ImageType.Image:
                imageManager.renderImageFor(bladderState);
                break;
            case ImageType.None:
            default:
                imageManager.renderNone();
                break;
        }

        // Schedule next tick (faster when peeing)
        const delay = isPeeing ? 250 : randomInt(750) + 250;
        this.timerId = window.setTimeout(() => this.tick(), delay);
    }

    private computeFrameIndex(bladderState: BladderLevel, isPeeing: boolean): number {
        if (isPeeing) {
            const ch = this.peeingLoop.charAt(this.artIndex);
            return this.alphaDecodeIndex(ch);
        }

        const loopIndex = this.mapBladderStateToLoopIndex(bladderState);
        const ch = this.asciiLoops[loopIndex].charAt(this.artIndex);
        return this.alphaDecodeIndex(ch);
    }

    private getLegacyBladderState(): BladderLevel {
        const legacyBladder = Number(bladder);
        const companion = runtimeContext.Companion;

        if (!Number.isFinite(legacyBladder) || !companion) {
            return BladderLevel.Empty;
        }
        if (legacyBladder < companion.bladderUrge) {
            return BladderLevel.Empty;
        }
        if (legacyBladder < companion.bladderNeed) {
            return BladderLevel.Urge;
        }
        if (legacyBladder < companion.bladderEmer) {
            return BladderLevel.Need;
        }
        if (legacyBladder < companion.bladderLose) {
            return BladderLevel.Emergency;
        }
        return BladderLevel.Lose;
    }

    private mapBladderStateToLoopIndex(state: BladderLevel): number {
        // 0: Empty, 1: Urge, 2: Need, 3: Emergency, 4: Lose/CumLose/SexLose
        switch (state) {
            case BladderLevel.Empty:
                return 0;
            case BladderLevel.Urge:
                return 1;
            case BladderLevel.Need:
                return 2;
            case BladderLevel.Emergency:
                return 3;
            case BladderLevel.Lose:
            case BladderLevel.CumLose:
            case BladderLevel.SexLose:
            default:
                return 4;
        }
    }

    private alphaDecodeIndex(ch: string): number {
        return this.alphaDecode.indexOf(ch);
    }
}

export const animationManager = new AnimationManager();