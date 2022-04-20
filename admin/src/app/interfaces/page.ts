/**
 * Page interface for layout builder
 */
export interface Page {
    left: number,
    top: number,
    width: number,
    height: number,
    height_orig: number,
    page_id: number,
    page_index: number,
    title: string,
    type: string,
    can_delete: boolean,
    selected: boolean,
    cursor_hover: boolean,
}
