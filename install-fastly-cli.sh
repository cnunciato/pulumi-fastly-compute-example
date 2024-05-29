#!/bin/bash

FASTLY_VERSION="${1:-v10.10.0}"
FASTLY_FILENAME="fastly_${FASTLY_VERSION}_linux-amd64.tar.gz"
DESTINATION="/usr/local/bin/"

wget "https://github.com/fastly/cli/releases/download/${FASTLY_VERSION}/${FASTLY_FILENAME}"
tar -xzvf "$FASTLY_FILENAME"
mv fastly "${DESTINATION}"
