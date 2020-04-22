import * as core from '@actions/core';
import path from 'path';
import ftp from 'basic-ftp';
import { paths } from './utils';

// most @actions toolkit packages have async methods
async function run() {
    try {
        const SERVER = 'ftp.marketplace.envato.com';
        const ENVATO_USERNAME = core.getInput('ENVATO_USERNAME');
        const ENVATO_PERSONAL_TOKEN = core.getInput('ENVATO_PERSONAL_TOKEN');
        const ZIP_FILES = core.getInput('ZIP_FILES');

        console.log(ZIP_FILES);
        core.setOutput( 'ZIP_FILES', ZIP_FILES );


        // Upload ZIPs.
        if ( ZIP_FILES ) {
            const files = paths( ZIP_FILES );

            if ( files.length ) {
                try {
                    await core.group( 'Uploading Files', async () => {
                        const client = new ftp.Client();

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
                    console.error("⚠️ Failed to upload files");
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
