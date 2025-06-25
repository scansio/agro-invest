#!/bin/bash

# Check if container exists
if podman container exists mongodb; then
  # Check if it's running
  if [ "$(podman inspect -f '{{.State.Running}}' mongodb)" = "true" ]; then
    echo "Container 'mongodb' is already running. Restarting..."
    podman restart mongodb
  else
    echo "Starting existing container 'mongodb'..."
    podman start mongodb
  fi
else
  echo "No existing container found. Starting with podman-compose..."
  podman-compose up -d
fi
