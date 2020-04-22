import * as core from '@actions/core';
import path from 'path';
import { Client } from 'basic-ftp';
import { paths } from './utils';

// most @actions toolkit packages have async methods
async function run() {
    try {
        const SERVER = 'ftp.marketplace.envato.com';
        const ENVATO_USERNAME = core.getInput('ENVATO_USERNAME');
        const ENVATO_PERSONAL_TOKEN = core.getInput('ENVATO_PERSONAL_TOKEN');
        const ZIP_FILES = core.getInput('ZIP_FILES');
        let skip = false;

        if ( ! ENVATO_USERNAME ) {
            core.setFailed('⚠️ ENVATO_USERNAME variable is required');
            skip = true;
        }
        if ( ! ENVATO_PERSONAL_TOKEN ) {
            core.setFailed('⚠️ ENVATO_PERSONAL_TOKEN variable is required');
            skip = true;
        }
        if ( ! ZIP_FILES ) {
            core.setFailed('⚠️ ZIP_FILES variable is required');
            skip = true;
        }

        if ( skip ) {
            return;
        }

        const ZIP_FILES_ARRAY = ZIP_FILES.split( '\n' );

        // Upload ZIPs.
        if ( ZIP_FILES_ARRAY && ZIP_FILES_ARRAY.length ) {
            const files = paths( ZIP_FILES_ARRAY );

            if ( files.length ) {
                try {
                    await core.group( 'Uploading Files', async () => {
                        const client = new Client();

                        client.ftp.verbose = true;

                        await client.access( {
                            host: SERVER,
                            user: ENVATO_USERNAME,
                            password: ENVATO_PERSONAL_TOKEN,
                            secure: true,
                        } );

                        files.forEach( async ( file ) => {
                            await client.uploadFrom( file, path.parse( file ).base );
                        } );
                    } );
                }
                catch (error) {
                    console.error('⚠️ Failed to upload files');
                    core.setFailed(error.message);
                    throw error;
                }
            } else {
                console.warn(`🤔 valid files not found.`);
            }
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
