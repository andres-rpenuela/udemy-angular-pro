/** Funcion que realiza le petcion con fetch, http, ..., al back para obtner los lables */
// https://api.github.com/repos/angular/angular/labels
export interface GitHubLabel {
    id:          number;
    node_id:     string;
    url:         string;
    name:        string;
    color:       string;
    default:     boolean;
    description?: string | null;
}
