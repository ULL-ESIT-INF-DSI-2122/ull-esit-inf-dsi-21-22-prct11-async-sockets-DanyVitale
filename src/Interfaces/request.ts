/**
 * Request interface
 */
export type RequestType = {
    type: 'add' |'update' | 'delete' | 'read' | 'list';
    user?: string;
    title?: string;
    body?: string;
    color?: string;
};