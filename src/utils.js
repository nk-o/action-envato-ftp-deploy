import * as glob from 'glob';
import { lstatSync } from 'fs';

export const paths = ( patterns ) => {
    return patterns.reduce( ( acc, pattern ) => {
        return acc.concat(
            glob.sync( pattern ).filter( path => lstatSync( path ).isFile() )
        );
    }, []);
};
