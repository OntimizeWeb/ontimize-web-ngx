import { InjectionToken } from '@angular/core';

/**
 * Visual hierarchy model for component actions, decoupled from Angular Material
 * button types. Used by `o-button` and by the built-in actions of `o-form`,
 * `o-table`, `o-grid`, `o-list` and `o-tree`.
 */

/** Semantic relevance of an action. */
export type OActionImportance = 'primary' | 'warn' | 'default';

/**
 * Visual variant of an action, mapped internally to a Material button directive.
 * The fill variants (`outline`, `flat`, `basic`, `raised`) describe the visual
 * weight; the form-factor variants (`icon`, `fab`, `mini-fab`) describe special
 * button shapes. On the filled shapes (`flat`, `raised`, `fab`, `mini-fab`) the
 * `importance` colour is skipped and the default Material background is kept;
 * `icon` (transparent) still honours `importance` on its icon.
 */
export type OActionVariant = 'outline' | 'flat' | 'basic' | 'raised' | 'icon' | 'fab' | 'mini-fab';

/**
 * Per-action style configuration (all fields optional; unset fields fall back).
 * `label` is a translation key or literal string (unresolved keys pass through
 * `oTranslate` unchanged, so a literal string works with no extra setup) shown
 * on the action's button. Unlike `variant`/`importance`, there is no single
 * framework-wide default for `label` — each component supplies its own
 * historic text as the lowest-precedence auto-rule for the actions it renders.
 */
export type OActionStyle = {
  variant?: OActionVariant;
  importance?: OActionImportance;
  label?: string;
};

/**
 * Fully-resolved action style. `variant`/`importance` are always guaranteed
 * (the framework default covers them); `label` is only guaranteed when the
 * caller's `autoRules` supplied one for this `attr` — see {@link resolveActionStyle}.
 */
export type OResolvedActionStyle = {
  variant: OActionVariant;
  importance: OActionImportance;
  label?: string;
};

/**
 * Application-wide action-style configuration. Lets an app set the default
 * appearance and/or label of actions once, instead of repeating `action-styles`
 * on every `o-form` / `o-table` / `o-grid` / `o-list` / `o-tree`. Provided via
 * the `O_ACTION_STYLES_CONFIG` injection token.
 */
export interface OActionStylesConfig {
  /**
   * Baseline applied when no instance config, per-attr config or component
   * auto-rule sets a field. Replaces the framework default (`outline + default`).
   * e.g. `{ variant: 'flat' }` makes every action flat app-wide.
   */
  default?: OActionStyle;
  /**
   * App-wide per-action overrides, keyed by the action `attr`. These win over
   * the component auto-rules (so an app can, e.g., disable the automatic
   * primary highlight of the create action globally).
   */
  actions?: Record<string, OActionStyle>;
}

/**
 * Injection token for the app-wide {@link OActionStylesConfig}. Provide it at
 * the application root so the built-in actions of the Ontimize components and
 * `o-button` pick up the configured default variants/importances without
 * setting `action-styles` on each instance. Use {@link provideOActionStyles}
 * for a convenient provider.
 */
export const O_ACTION_STYLES_CONFIG = new InjectionToken<OActionStylesConfig>('O_ACTION_STYLES_CONFIG');

/**
 * DI token exposed by the data components (`o-table`, `o-grid`, `o-list`,
 * `o-tree`) and `o-form`, so that an action placed inside them — including a
 * projected `o-button` — can resolve its style from the host's `action-styles`
 * by its `attr`. A custom button therefore defaults to `outline` + `default`
 * and automatically honours any `action-styles` keyed by its `attr`, without the
 * developer wiring anything. Provided via `useExisting` against the host.
 */
export abstract class OActionStyleProvider {
  abstract getResolvedActionStyle(attr: string): OResolvedActionStyle;
}
