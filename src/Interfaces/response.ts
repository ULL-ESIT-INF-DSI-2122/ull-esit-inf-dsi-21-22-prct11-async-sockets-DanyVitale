import {Note} from "../Notes/note";
/**
 * Response interface
 */
export type ResponseType = {
    type: 'add' |'update' | 'delete' | 'read' | 'list' ;
    success: boolean;
    notes?: Note[];
};