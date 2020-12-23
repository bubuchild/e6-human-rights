
/* IMPORT */

const execa = require ( 'execa' ),
      fs = require ( 'fs' ),
      path = require ( 'path' );

/* HELPERS */

function isLinux ( targets ) {
  const re = /AppImage|snap|deb|rpm|freebsd|pacman/i;
  return !!targets.find ( target => re.test ( target.name ) );
}

/* FIX LINUX SANDBOX */

// Disabling the sandbox on Linux
//TODO: Remove this once the upstream bug has been fixed //URL: https://github.com/electron/electron/issues/17972

async function fixLinuxSandbox ( targets, cwd ) {

  if ( !isLinux ( targets ) ) return;

  const scriptPath = path.join ( cwd, 'Notable' ),
        script = '#!/bin/bash\n"${BASH_SOURCE%/*}"/Notable.bin "$@" --no-sandbox';

  await execa ( 'mv', ['Notable', 'Notable.bin'], {cwd} );

  fs.writeFileSync ( scriptPath, script );

  await execa ( 'chmod', ['+x', 'Notable'], {cwd} );

}

/* EXPORT */

module.exports = fixLinuxSandbox;
