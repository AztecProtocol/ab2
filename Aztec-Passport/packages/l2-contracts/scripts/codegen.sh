#!/bin/bash
codegen() {
    file=$1
    echo "Generating Types $project"
    
    # Run the compile command
    aztec codegen ./target/${file}.json -o generated
}

# Loop over every child file in target folder with .json extension
for file in ./target/*.json; do
    project=$(basename "${file%.*}")
    codegen "$project"
done