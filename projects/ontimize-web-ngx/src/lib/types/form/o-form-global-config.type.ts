export type OFormGlobalConfig = {
  headerActions: string;
  /**
   * Shows the text label alongside the icon on the form toolbar's actions
   * (save/cancel/etc). `'yes'`/`'no'` (or a boolean) — mirrors the
   * `show-header-actions-text` input. When `'no'`/`false`, actions render icon-only.
   */
  showHeaderActionsText: string | boolean;
};
