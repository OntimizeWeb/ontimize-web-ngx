import { ORowHeight, OTableDetailMode, OTableEditionMode } from './../../util/codes';

export type OTableGlobalConfig = {
  /**
    * Automatically adjusts the width of table columns based on their content.
    * When enabled (`true`), columns resize dynamically without manual setup.
    */
  autoAdjust: boolean;

  /**
   * Automatically aligns column titles depending on their content type.
   * Example: numeric columns may be right-aligned, text columns left-aligned, etc.
   */
  autoAlignTitles: boolean;

  /**
   * Determines whether column filters should be active by default.
   * When `true`, the filter row appears expanded when the table loads.
   */
  filterColumnActiveByDefault: boolean;

  /**
   * Editing mode of the table rows.
   * Controls how cells or rows behave during inline or external editing operations.
   */
  editionMode: OTableEditionMode;

  /**
   * Detail display mode.
   * Controls how expanded row details are presented (e.g., inline expansion, modal, overlay).
   */
  detailMode: OTableDetailMode;

  /**
   * Standard row height used across all OTable instances
   * to maintain consistent visual presentation.
   */
  rowHeight: ORowHeight;

  /**
   * Enables or disables the option to generate charts on demand.
   */
  showChartsOnDemandOption: boolean;

  /**
   * Enables or disables the option to generate a downloadable report on demand.
   */
  showReportOnDemandOption: boolean;

  /**
   * Configuration related to the table's loading skeleton behavior.
   * Controls when and how the skeleton loader appears.
   */
  loading: {
    /**
   * Minimum time (in milliseconds) that must pass after a loading event
   * begins before the skeleton loader is displayed.
   *
   * This prevents the skeleton from flashing briefly on very fast operations.
   */
    threshold: number,
    /**
  * Minimum duration (in milliseconds) that the skeleton loader must remain visible
  * once it has appeared, even if the operation finishes quickly.
  *
  * Ensures a smooth visual experience and avoids abrupt hiding.
  */
    minVisible: number

  }
  /**
   * Enables or disables row selection when clicking on a row.
   */
  selectionOnRowClick?: boolean;

  /**
    * Enables or disables horizontal scrolling for tables that exceed the viewport width.
    */
  horizontalScroll: boolean;

  /**
   * Enables or disables the display of a tooltip with the column title when hovering over the header.
   */
  showHeaderTooltip: boolean;

}
