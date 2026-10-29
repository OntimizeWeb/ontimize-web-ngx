import { Provider } from '@angular/core';

import {
  O_ACTION_STYLES_CONFIG,
  OActionStyle,
  OActionStylesConfig,
  OResolvedActionStyle
} from '../types/o-action-style.type';

/**
 * Global baseline applied when nothing else sets a field. Every action renders
 * as `outline + default` unless a higher-precedence source overrides it.
 * `label` has no framework-wide baseline — it stays `undefined` here, since
 * showing the right text requires knowing which action this is; each component
 * supplies its own historic label per `attr` via `autoRules` instead.
 */
export const O_ACTION_STYLE_DEFAULT: OResolvedActionStyle = {
  variant: 'outline',
  importance: 'default',
  label: undefined
};

/**
 * Resolves the final style of an action following the precedence (highest first):
 *   1. explicit `actionStyles[attr]` configured on the component instance
 *   2. app-wide per-attr config (`globalConfig.actions[attr]`)
 *   3. component auto-rules (e.g. the create action is `primary`, and — for
 *      `label` — the component's own historic default text for this `attr`)
 *   4. app-wide default (`globalConfig.default`)
 *   5. framework default (`outline + default`; no `label`)
 *
 * Resolution is per-field: a source that only sets `importance` keeps the
 * `variant`/`label` from the next source that defines it, and vice versa.
 * Callers that render a `label` should make sure `autoRules` supplies one for
 * every `attr` they use — nothing here invents a piece of text on its own.
 *
 * @param attr action identifier (its `attr`)
 * @param actionStyles instance configuration keyed by `attr`
 * @param autoRules component-provided automatic rules keyed by `attr`
 * @param globalConfig app-wide configuration from `O_ACTION_STYLES_CONFIG`
 * @param frameworkDefault lowest-precedence baseline (defaults to `outline + default`)
 */
export function resolveActionStyle(
  attr: string,
  actionStyles?: Record<string, OActionStyle>,
  autoRules?: Record<string, OActionStyle>,
  globalConfig?: OActionStylesConfig,
  frameworkDefault: OResolvedActionStyle = O_ACTION_STYLE_DEFAULT
): OResolvedActionStyle {
  const instance: OActionStyle = (attr && actionStyles) ? actionStyles[attr] : undefined;
  const globalAttr: OActionStyle = (attr && globalConfig?.actions) ? globalConfig.actions[attr] : undefined;
  const auto: OActionStyle = (attr && autoRules) ? autoRules[attr] : undefined;
  const globalDef: OActionStyle = globalConfig?.default;
  return {
    variant: instance?.variant ?? globalAttr?.variant ?? auto?.variant ?? globalDef?.variant ?? frameworkDefault.variant,
    importance: instance?.importance ?? globalAttr?.importance ?? auto?.importance ?? globalDef?.importance ?? frameworkDefault.importance,
    label: instance?.label ?? globalAttr?.label ?? auto?.label ?? globalDef?.label ?? frameworkDefault.label
  };
}

/**
 * Convenience provider for the app-wide action-style configuration. Add it to
 * the application's `providers` (e.g. in `bootstrapApplication` alongside
 * `provideOntimizeWeb`, or in an `AppModule`):
 *
 * ```ts
 * provideOActionStyles({
 *   default: { variant: 'flat' },
 *   actions: { delete: { importance: 'warn', label: 'REMOVE' } }
 * })
 * ```
 */
export function provideOActionStyles(config: OActionStylesConfig): Provider {
  return { provide: O_ACTION_STYLES_CONFIG, useValue: config };
}
