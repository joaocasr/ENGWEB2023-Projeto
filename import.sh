#!/bin/bash

# Build the Docker image
docker build -t charming .

# Run a container from the image
docker run -p 8000:8000 charming